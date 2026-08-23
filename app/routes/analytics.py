"""
Analytics and reporting routes
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta

from app.database import get_db
from app.models.form import Form
from app.models.submission import Submission
from app.middleware.auth_middleware import verify_token

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/dashboard")
async def get_dashboard_stats(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Get dashboard statistics
    """
    user_id = token["user_id"]
    
    # Count forms
    forms_created = db.query(func.count(Form.id)).filter(
        Form.user_id == user_id
    ).scalar() or 0
    
    # Count submissions
    submissions = db.query(Submission).filter(
        Submission.user_id == user_id
    ).all()
    
    submissions_count = len(submissions)
    
    # Calculate time saved (estimate: 5 minutes per submission)
    time_saved_minutes = submissions_count * 5
    
    # Count AI suggestions used
    ai_suggestions_used = sum(sub.ai_usage_count for sub in submissions)
    
    return {
        "forms_created": forms_created,
        "submissions_sent": submissions_count,
        "time_saved_minutes": time_saved_minutes,
        "ai_suggestions_used": ai_suggestions_used,
        "active_forms": db.query(func.count(Form.id)).filter(
            Form.user_id == user_id,
            Form.status == "active"
        ).scalar() or 0
    }


@router.get("/forms-completed")
async def get_forms_completed(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db),
    days: int = 30
):
    """
    Get forms completed over time (for chart)
    """
    user_id = token["user_id"]
    start_date = datetime.utcnow() - timedelta(days=days)
    
    submissions = db.query(Submission).filter(
        Submission.user_id == user_id,
        Submission.created_at >= start_date
    ).all()
    
    # Group by date
    data_by_date = {}
    for sub in submissions:
        date = sub.created_at.date().isoformat()
        data_by_date[date] = data_by_date.get(date, 0) + 1
    
    # Create time series
    result = []
    current_date = start_date.date()
    while current_date <= datetime.utcnow().date():
        date_str = current_date.isoformat()
        result.append({
            "date": date_str,
            "count": data_by_date.get(date_str, 0)
        })
        current_date += timedelta(days=1)
    
    return result


@router.get("/time-saved")
async def get_time_saved(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db),
    days: int = 30
):
    """
    Get time saved over time
    """
    user_id = token["user_id"]
    start_date = datetime.utcnow() - timedelta(days=days)
    
    submissions = db.query(Submission).filter(
        Submission.user_id == user_id,
        Submission.created_at >= start_date
    ).all()
    
    # Group by date
    data_by_date = {}
    for sub in submissions:
        date = sub.created_at.date().isoformat()
        # Estimate 5 minutes per submission
        minutes = 5
        data_by_date[date] = data_by_date.get(date, 0) + minutes
    
    # Create time series
    result = []
    current_date = start_date.date()
    while current_date <= datetime.utcnow().date():
        date_str = current_date.isoformat()
        result.append({
            "date": date_str,
            "minutes": data_by_date.get(date_str, 0)
        })
        current_date += timedelta(days=1)
    
    return result


@router.get("/usage")
async def get_usage_stats(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """
    Get usage statistics
    """
    user_id = token["user_id"]
    
    forms = db.query(Form).filter(Form.user_id == user_id).all()
    submissions = db.query(Submission).filter(
        Submission.user_id == user_id
    ).all()
    
    total_forms = len(forms)
    total_submissions = len(submissions)
    
    # Calculate average time per form
    if submissions:
        avg_time = sum(s.time_taken or 0 for s in submissions) / len(submissions)
    else:
        avg_time = 0
    
    # Calculate AI assist rate
    if submissions:
        ai_assist_rate = (sum(s.ai_usage_count for s in submissions) / 
                         (total_submissions * 10) * 100)  # Assuming 10 fields avg
        ai_assist_rate = min(100, ai_assist_rate)
    else:
        ai_assist_rate = 0
    
    return {
        "total_forms": total_forms,
        "total_submissions": total_submissions,
        "avg_time_per_form": round(avg_time, 2),
        "ai_assist_rate": round(ai_assist_rate, 2)
    }


@router.get("/top-templates")
async def get_top_templates(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db),
    limit: int = 5
):
    """
    Get most used form templates
    """
    user_id = token["user_id"]
    
    # Get forms with submission counts
    forms = db.query(
        Form.id,
        Form.title,
        func.count(Submission.id).label("usage_count")
    ).outerjoin(Submission).filter(
        Form.user_id == user_id
    ).group_by(Form.id, Form.title).order_by(
        func.count(Submission.id).desc()
    ).limit(limit).all()
    
    return [
        {
            "form_id": f[0],
            "title": f[1],
            "usage_count": f[2]
        }
        for f in forms
    ]
