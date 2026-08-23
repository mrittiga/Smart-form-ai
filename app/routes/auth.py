"""
Authentication routes - signup, login, password reset
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from datetime import timedelta

from app.database import get_db
from app.models.user import User
from app.schemas.auth import (
    SignupRequest,
    LoginRequest,
    TokenResponse,
    UserResponse,
    PasswordResetRequest,
    ResetPasswordRequest
)
from app.utils.auth import (
    hash_password,
    verify_password,
    create_access_token
)
from app.utils.validators import (
    validate_password,
    validate_email,
    validate_full_name
)
from app.utils.email import email_service
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(request: SignupRequest, db: Session = Depends(get_db)):
    """
    User signup endpoint
    
    Creates new user account and returns JWT token
    """
    # Validate email
    is_valid, error = validate_email(request.email)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error)
    
    # Validate full name
    is_valid, error = validate_full_name(request.full_name)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error)
    
    # Validate password
    is_valid, error = validate_password(request.password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error)
    
    # Check password match
    if request.password != request.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == request.email).first()
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = hash_password(request.password)
    new_user = User(
        email=request.email,
        full_name=request.full_name,
        password_hash=hashed_password,
        verified_email=False,
        is_active=True
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create JWT token
    access_token = create_access_token(
        data={"user_id": new_user.id, "email": new_user.email}
    )
    
    user_response = UserResponse.from_orm(new_user)
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


@router.post("/login", response_model=TokenResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    User login endpoint
    
    Authenticates user and returns JWT token
    """
    # Find user by email
    user = db.query(User).filter(User.email == request.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(request.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Create JWT token
    access_token = create_access_token(
        data={"user_id": user.id, "email": user.email}
    )
    
    user_response = UserResponse.from_orm(user)
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )


@router.post("/logout")
async def logout():
    """
    User logout endpoint
    
    Note: JWT tokens are stateless, so this is mainly for client-side cleanup.
    In production, implement token blacklist for true logout.
    """
    return {"message": "Logout successful"}


@router.post("/password-reset")
async def request_password_reset(
    request: PasswordResetRequest,
    db: Session = Depends(get_db)
):
    """
    Request password reset
    
    Sends password reset email to user
    """
    user = db.query(User).filter(User.email == request.email).first()
    
    # Don't reveal if email exists or not (security)
    if not user:
        return {"message": "If email exists, password reset link has been sent"}
    
    # Generate reset token
    reset_token = create_access_token(
        data={"user_id": user.id, "email": user.email, "type": "reset"},
        expires_delta=timedelta(hours=1)
    )
    
    # Send email
    reset_link = f"https://smartformapp.com/reset-password?token={reset_token}"
    email_service.send_password_reset_email(user.email, reset_link)
    
    return {"message": "If email exists, password reset link has been sent"}


@router.post("/reset-password")
async def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    """
    Reset password with token
    """
    # Validate new password
    is_valid, error = validate_password(request.new_password)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error)
    
    # Check password match
    if request.new_password != request.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match"
        )
    
    # Verify reset token
    from app.utils.auth import decode_token
    payload = decode_token(request.reset_token)
    
    if not payload or payload.get("type") != "reset":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired reset token"
        )
    
    # Update password
    user = db.query(User).filter(User.id == payload["user_id"]).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.password_hash = hash_password(request.new_password)
    db.commit()
    
    return {"message": "Password reset successful"}
