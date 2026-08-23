"""
Form schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum


class FieldType(str, Enum):
    """Field types enum"""
    TEXT = "text"
    TEXTAREA = "textarea"
    EMAIL = "email"
    NUMBER = "number"
    DROPDOWN = "dropdown"
    CHECKBOX = "checkbox"
    RADIO = "radio"
    FILE = "file"
    DATE = "date"
    DATETIME = "datetime"


class FormFieldCreate(BaseModel):
    """Create form field"""
    field_type: FieldType
    label: str = Field(..., min_length=1, max_length=255)
    placeholder: Optional[str] = None
    is_required: bool = False
    character_limit: Optional[int] = None
    position: int
    help_text: Optional[str] = None
    options: Optional[List[str]] = None  # For dropdowns
    
    class Config:
        json_schema_extra = {
            "example": {
                "field_type": "textarea",
                "label": "Tell us about yourself",
                "placeholder": "Write your response here...",
                "is_required": True,
                "character_limit": 500,
                "position": 1,
                "help_text": "Maximum 500 characters"
            }
        }


class FormFieldResponse(FormFieldCreate):
    """Form field response"""
    id: int
    form_id: int
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True


class FormCreate(BaseModel):
    """Create form"""
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "title": "College Application Form",
                "description": "Fill out your college application",
                "category": "education"
            }
        }


class FormUpdate(BaseModel):
    """Update form"""
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    is_public: Optional[bool] = None


class FormResponse(BaseModel):
    """Form response"""
    id: int
    user_id: int
    title: str
    description: Optional[str]
    category: Optional[str]
    status: str
    is_public: bool
    share_token: Optional[str]
    fields: List[FormFieldResponse] = []
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True


class FormListResponse(BaseModel):
    """Form list item"""
    id: int
    title: str
    status: str
    category: Optional[str]
    fields_count: int
    is_public: bool
    created_at: str
    updated_at: str
