"""
User profile and settings routes
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, ContentLibrary
from app.schemas.user import (
    UserProfileUpdate,
    UserPreferences,
    ContentLibraryItem,
    ContentLibraryResponse
)
from app.middleware.auth_middleware import verify_token

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me")
async def get_current_user(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get current user profile"""
    user = db.query(User).filter(User.id == token["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "bio": user.bio,
        "profile_data": user.profile_data,
        "preferences": user.preferences,
        "role": user.role,
        "verified_email": user.verified_email,
        "is_active": user.is_active,
        "created_at": user.created_at.isoformat(),
        "updated_at": user.updated_at.isoformat()
    }


@router.put("/me")
async def update_user_profile(
    request: UserProfileUpdate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update user profile"""
    user = db.query(User).filter(User.id == token["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update fields
    if request.full_name:
        user.full_name = request.full_name
    if request.bio:
        user.bio = request.bio
    if request.profile_data:
        user.profile_data = request.profile_data
    
    db.commit()
    db.refresh(user)
    
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "bio": user.bio,
        "profile_data": user.profile_data,
        "message": "Profile updated successfully"
    }


@router.get("/settings")
async def get_user_settings(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get user preferences/settings"""
    user = db.query(User).filter(User.id == token["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user.preferences


@router.put("/settings")
async def update_user_settings(
    request: UserPreferences,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update user preferences/settings"""
    user = db.query(User).filter(User.id == token["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update preferences
    if request.tone:
        user.preferences["tone"] = request.tone
    if request.language:
        user.preferences["language"] = request.language
    if request.answer_length:
        user.preferences["answer_length"] = request.answer_length
    if request.email_notifications is not None:
        user.preferences["email_notifications"] = request.email_notifications
    if request.theme:
        user.preferences["theme"] = request.theme
    
    db.commit()
    db.refresh(user)
    
    return {
        "preferences": user.preferences,
        "message": "Settings updated successfully"
    }


@router.post("/content-library")
async def create_content_library_item(
    request: ContentLibraryItem,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Create content library item"""
    item = ContentLibrary(
        user_id=token["user_id"],
        title=request.title,
        content=request.content,
        category=request.category
    )
    
    db.add(item)
    db.commit()
    db.refresh(item)
    
    return ContentLibraryResponse.from_orm(item)


@router.get("/content-library")
async def list_content_library(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db),
    category: str = None
):
    """List user's content library items"""
    query = db.query(ContentLibrary).filter(
        ContentLibrary.user_id == token["user_id"]
    )
    
    if category:
        query = query.filter(ContentLibrary.category == category)
    
    items = query.order_by(ContentLibrary.created_at.desc()).all()
    
    return [ContentLibraryResponse.from_orm(item) for item in items]


@router.get("/content-library/{item_id}")
async def get_content_library_item(
    item_id: int,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get specific content library item"""
    item = db.query(ContentLibrary).filter(
        ContentLibrary.id == item_id,
        ContentLibrary.user_id == token["user_id"]
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    
    return ContentLibraryResponse.from_orm(item)


@router.put("/content-library/{item_id}")
async def update_content_library_item(
    item_id: int,
    request: ContentLibraryItem,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update content library item"""
    item = db.query(ContentLibrary).filter(
        ContentLibrary.id == item_id,
        ContentLibrary.user_id == token["user_id"]
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    
    item.title = request.title
    item.content = request.content
    item.category = request.category
    
    db.commit()
    db.refresh(item)
    
    return ContentLibraryResponse.from_orm(item)


@router.delete("/content-library/{item_id}")
async def delete_content_library_item(
    item_id: int,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Delete content library item"""
    item = db.query(ContentLibrary).filter(
        ContentLibrary.id == item_id,
        ContentLibrary.user_id == token["user_id"]
    ).first()
    
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    
    db.delete(item)
    db.commit()
    
    return {"message": "Content item deleted successfully"}
