"""
Submission database model
"""
from sqlalchemy import Column, Integer, String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Submission(Base):
    """Submission model for storing form submissions"""
    
    __tablename__ = "submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    
    # Submission data (JSON with field_id: value pairs)
    submission_data = Column(JSON, nullable=False)
    
    # Statistics
    ai_usage_count = Column(Integer, default=0)  # How many fields used AI
    time_taken = Column(Integer, nullable=True)  # Seconds
    status = Column(String(50), default="submitted")  # "submitted", "draft", "failed"
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    form = relationship("Form", back_populates="submissions")
    user = relationship("User", back_populates="submissions")
    
    def __repr__(self):
        return f"<Submission(id={self.id}, form_id={self.form_id}, status={self.status})>"
