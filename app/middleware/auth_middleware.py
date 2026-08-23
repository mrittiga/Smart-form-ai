"""
Authentication middleware for JWT verification
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from app.utils.auth import decode_token

security = HTTPBearer()


async def verify_token(credentials: HTTPAuthCredentials = Depends(security)):
    """
    Verify JWT token
    
    Usage: In route, add: token: str = Depends(verify_token)
    """
    token = credentials.credentials
    
    payload = decode_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return payload
