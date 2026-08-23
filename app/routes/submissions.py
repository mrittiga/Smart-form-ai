"""
Form submission routes
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.form import Form
from app.models.submission import Submission
from app.schemas.submission import (
    SubmissionCreate,
    SubmissionResponse,
    SubmissionListResponse
)
from app.middleware.auth_middleware import verify_token

router = APIRouter(prefix="/submissions", tags=["Submissions"])


@router.post("", response_model=SubmissionResponse, status_code=status.HTTP_201_CREATED)
async def create_submission(
    form_id: int,
    request: SubmissionCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Submit a form
    """
    # Get form
    form = db.query(Form).filter(Form.id == form_id).first()
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    # Create submission
    submission = Submission(
        form_id=form_id,
        user_id=token["user_id"],
        submission_data=request.submission_data,
        time_taken=request.time_taken,
        status="submitted",
        ai_usage_count=0  # Count fields that used AI (if tracked)
    )
    
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    return SubmissionResponse.from_orm(submission)


@router.get("", response_model=List[SubmissionListResponse])
async def list_submissions(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db),
    limit: int = 10,
    offset: int = 0
):
    """
    List user's submissions
    """
    submissions = db.query(Submission).filter(
        Submission.user_id == token["user_id"]
    ).order_by(Submission.created_at.desc()).limit(limit).offset(offset).all()
    
    result = []
    for sub in submissions:
        form = db.query(Form).filter(Form.id == sub.form_id).first()
        result.append(SubmissionListResponse(
            id=sub.id,
            form_id=sub.form_id,
            form_title=form.title if form else "Unknown",
            status=sub.status,
            time_taken=sub.time_taken,
            created_at=sub.created_at.isoformat(),
            updated_at=sub.updated_at.isoformat()
        ))
    
    return result


@router.get("/{submission_id}", response_model=SubmissionResponse)
async def get_submission(
    submission_id: int,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Get specific submission
    """
    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.user_id == token["user_id"]
    ).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return SubmissionResponse.from_orm(submission)


@router.delete("/{submission_id}")
async def delete_submission(
    submission_id: int,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Delete submission
    """
    submission = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.user_id == token["user_id"]
    ).first()
    
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    db.delete(submission)
    db.commit()
    
    return {"message": "Submission deleted successfully"}


@router.post("/{submission_id}/resubmit", response_model=SubmissionResponse)
async def resubmit_form(
    submission_id: int,
    request: SubmissionCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Resubmit form with updated data
    """
    # Get original submission
    original = db.query(Submission).filter(
        Submission.id == submission_id,
        Submission.user_id == token["user_id"]
    ).first()
    
    if not original:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    # Create new submission
    new_submission = Submission(
        form_id=original.form_id,
        user_id=token["user_id"],
        submission_data=request.submission_data,
        time_taken=request.time_taken,
        status="submitted",
        ai_usage_count=0
    )
    
    db.add(new_submission)
    db.commit()
    db.refresh(new_submission)
    
    return SubmissionResponse.from_orm(new_submission)
