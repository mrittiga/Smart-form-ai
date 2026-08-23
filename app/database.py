"""
Database connection and session management
"""
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from app.config import settings

# Create database engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args=settings.SQLALCHEMY_CONNECT_ARGS,
    echo=settings.SQLALCHEMY_ECHO,
    pool_pre_ping=settings.SQLALCHEMY_POOL_PRE_PING,
    pool_recycle=settings.SQLALCHEMY_POOL_RECYCLE,
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for models
Base = declarative_base()


def get_db() -> Session:
    """
    Dependency function to get database session
    Usage: In route parameters, add db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)


def drop_tables():
    """Drop all database tables (WARNING: Data loss!)"""
    Base.metadata.drop_all(bind=engine)
