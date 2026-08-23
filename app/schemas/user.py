"""
User schemas
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any


class UserProfileUpdate(BaseModel):
    """Update user profile"""
    full_name: Optional[str] = Field(None, min_length=2, max_length=255)
    bio: Optional[str] = Field(None, max_length=1000)
    profile_data: Optional[Dict[str, Any]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "full_name": "John Doe",
                "bio": "Full-stack developer",
                "profile_data": {
                    "skills": ["Python", "React", "PostgreSQL"],
                    "projects": ["Smart Form AI"],
                    "achievements": ["Hackathon Winner"]
                }
            }
        }


class UserPreferences(BaseModel):
    """User preferences"""
    tone: Optional[str] = Field(None, pattern="^(professional|casual)$")
    language: Optional[str] = None
    answer_length: Optional[str] = Field(None, pattern="^(short|medium|long)$")
    email_notifications: Optional[bool] = None
    theme: Optional[str] = Field(None, pattern="^(light|dark)$")
    
    class Config:
        json_schema_extra = {
            "example": {
                "tone": "professional",
                "language": "en",
                "answer_length": "medium",
                "email_notifications": True,
                "theme": "light"
            }
        }


class ContentLibraryItem(BaseModel):
    """Content library item"""
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(..., min_length=1)
    category: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "My Bio",
                "content": "I am a full-stack developer with 2 years of experience...",
                "category": "bio"
            }
        }


class ContentLibraryResponse(ContentLibraryItem):
    """Content library response"""
    id: int
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True
