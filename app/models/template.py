"""
Template database model
"""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Template(Base):
    """Form template model"""
    
    __tablename__ = "templates"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=False)  # "college", "job", "survey", etc.
    
    # Form structure as JSON
    form_structure = Column(JSON, nullable=False)
    
    # Creator info (nullable for official templates)
    creator_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Status
    is_official = Column(Boolean, default=False)  # System templates
    usage_count = Column(Integer, default=0)
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    def __repr__(self):
        return f"<Template(id={self.id}, title={self.title}, category={self.category})>"
