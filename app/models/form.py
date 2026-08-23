"""
Form and FormField database models
"""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Form(Base):
    """Form model"""
    
    __tablename__ = "forms"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    status = Column(String(50), default="draft")  # "draft", "active", "archived"
    is_public = Column(Boolean, default=False)
    share_token = Column(String(255), unique=True, nullable=True)
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="forms")
    fields = relationship("FormField", back_populates="form", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="form", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Form(id={self.id}, title={self.title}, status={self.status})>"


class FormField(Base):
    """Form field model"""
    
    __tablename__ = "form_fields"
    
    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("forms.id"), nullable=False, index=True)
    field_type = Column(String(50), nullable=False)  # "text", "textarea", "dropdown", etc.
    label = Column(String(255), nullable=False)
    placeholder = Column(String(255), nullable=True)
    is_required = Column(Boolean, default=False)
    character_limit = Column(Integer, nullable=True)
    position = Column(Integer, nullable=False)  # Order in form
    help_text = Column(Text, nullable=True)
    
    # For dropdowns/checkboxes
    options = Column(JSON, nullable=True)  # ["Option 1", "Option 2"]
    
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    form = relationship("Form", back_populates="fields")
    
    def __repr__(self):
        return f"<FormField(id={self.id}, label={self.label}, type={self.field_type})>"
