"""
Submission schemas
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class SubmissionCreate(BaseModel):
    """Create submission"""
    submission_data: Dict[int, Any] = Field(..., description="Field ID to value mapping")
    time_taken: Optional[int] = None  # Seconds
    
    class Config:
        json_schema_extra = {
            "example": {
                "submission_data": {
                    1: "This is my answer to field 1",
                    2: "Answer to field 2",
                    3: "Another answer"
                },
                "time_taken": 120
            }
        }


class SubmissionResponse(BaseModel):
    """Submission response"""
    id: int
    form_id: int
    user_id: int
    submission_data: Dict[int, Any]
    ai_usage_count: int
    time_taken: Optional[int]
    status: str
    created_at: str
    updated_at: str
    
    class Config:
        from_attributes = True


class SubmissionListResponse(BaseModel):
    """Submission list item"""
    id: int
    form_id: int
    form_title: str
    status: str
    time_taken: Optional[int]
    created_at: str
    updated_at: str
