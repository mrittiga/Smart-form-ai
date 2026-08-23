"""
User database model
"""
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime


class User(Base):
    """User model for database"""
    
    __tablename__ = "users"
    
    # Primary key
    id = Column(Integer, primary_key=True, index=True)
    
    # User credentials
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    
    # Profile information
    bio = Column(Text, nullable=True)
    profile_picture_url = Column(String(500), nullable=True)
    
    # JSON data fields
    profile_data = Column(
        JSON,
        default={
            "skills": [],
            "projects": [],
            "achievements": [],
            "expertise_areas": [],
            "location": "",
            "portfolio_url": ""
        },
        nullable=True
    )
    
    preferences = Column(
        JSON,
        default={
            "tone": "professional",
            "language": "en",
            "answer_length": "medium",
            "email_notifications": True,
            "theme": "light"
        },
        nullable=True
    )
    
    # Account status
    role = Column(String(50), default="user")  # "user" or "admin"
    verified_email = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    forms = relationship("Form", back_populates="user", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="user", cascade="all, delete-orphan")
    content_library = relationship("ContentLibrary", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, full_name={self.full_name})>"


class ContentLibrary(Base):
    """Content library for storing reusable text snippets"""
    
    __tablename__ = "content_library"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(100), nullable=True)  # "bio", "project", "skill", etc.
    usage_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
    
    user = relationship("User", back_populates="content_library")
    
    def __repr__(self):
        return f"<ContentLibrary(id={self.id}, title={self.title}, category={self.category})>"


# Add missing import at top
from sqlalchemy import ForeignKey
