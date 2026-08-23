"""
AI-powered form suggestion routes
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import Optional, List

from app.database import get_db
from app.models.form import Form, FormField
from app.models.user import User
from app.utils.ai_service import ai_service
from app.middleware.auth_middleware import verify_token

router = APIRouter(prefix="/forms", tags=["AI Suggestions"])


@router.post("/{form_id}/fields/{field_id}/suggest")
async def get_field_suggestion(
    form_id: int,
    field_id: int,
    tone: str = "professional",
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Get AI suggestion for a form field
    """
    # Get form
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    # Check access
    if form.user_id != token["user_id"] and not form.is_public:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get field
    field = db.query(FormField).filter(
        FormField.id == field_id,
        FormField.form_id == form_id
    ).first()
    
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    
    # Get user profile
    user = db.query(User).filter(User.id == form.user_id).first()
    
    user_profile = {
        "full_name": user.full_name,
        "bio": user.bio,
        **(user.profile_data or {})
    }
    
    # Generate suggestion
    suggestion = ai_service.generate_suggestion(
        field_label=field.label,
        field_context=field.help_text,
        user_profile=user_profile,
        tone=tone,
        character_limit=field.character_limit
    )
    
    if not suggestion:
        suggestion = "Unable to generate suggestion. Please try again."
    
    return {
        "field_id": field_id,
        "field_label": field.label,
        "suggestion": suggestion,
        "tone": tone,
        "character_limit": field.character_limit
    }


@router.post("/{form_id}/fields/{field_id}/regenerate")
async def regenerate_suggestions(
    form_id: int,
    field_id: int,
    count: int = 3,
    tone: str = "professional",
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Generate multiple alternative suggestions
    """
    # Get form
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    # Check access
    if form.user_id != token["user_id"] and not form.is_public:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get field
    field = db.query(FormField).filter(
        FormField.id == field_id,
        FormField.form_id == form_id
    ).first()
    
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    
    # Get user profile
    user = db.query(User).filter(User.id == form.user_id).first()
    
    user_profile = {
        "full_name": user.full_name,
        "bio": user.bio,
        **(user.profile_data or {})
    }
    
    # Generate multiple suggestions
    suggestions = []
    for _ in range(min(count, 3)):  # Max 3 suggestions
        suggestion = ai_service.generate_suggestion(
            field_label=field.label,
            field_context=field.help_text,
            user_profile=user_profile,
            tone=tone,
            character_limit=field.character_limit
        )
        if suggestion:
            suggestions.append(suggestion)
    
    return {
        "field_id": field_id,
        "field_label": field.label,
        "suggestions": suggestions,
        "tone": tone,
        "count": len(suggestions)
    }


@router.post("/{form_id}/auto-fill")
async def auto_fill_form(
    form_id: int,
    tone: str = "professional",
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Generate suggestions for all form fields
    """
    # Get form
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    # Check access
    if form.user_id != token["user_id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get user profile
    user = db.query(User).filter(User.id == form.user_id).first()
    
    user_profile = {
        "full_name": user.full_name,
        "bio": user.bio,
        **(user.profile_data or {})
    }
    
    # Generate suggestions for all fields
    field_suggestions = {}
    
    for field in sorted(form.fields, key=lambda f: f.position):
        suggestion = ai_service.generate_suggestion(
            field_label=field.label,
            field_context=field.help_text,
            user_profile=user_profile,
            tone=tone,
            character_limit=field.character_limit
        )
        
        field_suggestions[field.id] = {
            "label": field.label,
            "suggestion": suggestion,
            "character_limit": field.character_limit
        }
    
    return {
        "form_id": form_id,
        "tone": tone,
        "field_suggestions": field_suggestions,
        "total_fields": len(form.fields)
    }
