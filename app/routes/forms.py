"""
Form CRUD and field management routes
"""
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List
import secrets

from app.database import get_db
from app.models.form import Form, FormField
from app.models.user import User
from app.schemas.form import (
    FormCreate,
    FormUpdate,
    FormResponse,
    FormFieldCreate,
    FormFieldResponse,
    FormListResponse
)
from app.middleware.auth_middleware import verify_token

router = APIRouter(prefix="/forms", tags=["Forms"])


@router.post("", response_model=FormResponse, status_code=status.HTTP_201_CREATED)
async def create_form(
    request: FormCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Create new form"""
    form = Form(
        user_id=token["user_id"],
        title=request.title,
        description=request.description,
        category=request.category,
        status="draft"
    )
    
    db.add(form)
    db.commit()
    db.refresh(form)
    
    return FormResponse.from_orm(form)


@router.get("", response_model=List[FormListResponse])
async def list_forms(
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db),
    status_filter: str = None,
    limit: int = 10,
    offset: int = 0
):
    """List user's forms"""
    query = db.query(Form).filter(Form.user_id == token["user_id"])
    
    if status_filter:
        query = query.filter(Form.status == status_filter)
    
    forms = query.order_by(Form.updated_at.desc()).limit(limit).offset(offset).all()
    
    return [
        FormListResponse(
            id=f.id,
            title=f.title,
            status=f.status,
            category=f.category,
            fields_count=len(f.fields),
            is_public=f.is_public,
            created_at=f.created_at.isoformat(),
            updated_at=f.updated_at.isoformat()
        )
        for f in forms
    ]


@router.get("/{form_id}", response_model=FormResponse)
async def get_form(
    form_id: int,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get specific form"""
    form = db.query(Form).filter(Form.id == form_id).first()
    
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    # Check access
    if form.user_id != token["user_id"] and not form.is_public:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return FormResponse.from_orm(form)


@router.put("/{form_id}", response_model=FormResponse)
async def update_form(
    form_id: int,
    request: FormUpdate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update form"""
    form = db.query(Form).filter(
        Form.id == form_id,
        Form.user_id == token["user_id"]
    ).first()
    
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    if request.title:
        form.title = request.title
    if request.description:
        form.description = request.description
    if request.category:
        form.category = request.category
    if request.is_public is not None:
        form.is_public = request.is_public
    
    db.commit()
    db.refresh(form)
    
    return FormResponse.from_orm(form)


@router.delete("/{form_id}")
async def delete_form(
    form_id: int,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Delete form"""
    form = db.query(Form).filter(
        Form.id == form_id,
        Form.user_id == token["user_id"]
    ).first()
    
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    db.delete(form)
    db.commit()
    
    return {"message": "Form deleted successfully"}


@router.post("/{form_id}/duplicate")
async def duplicate_form(
    form_id: int,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Duplicate form"""
    original_form = db.query(Form).filter(
        Form.id == form_id,
        Form.user_id == token["user_id"]
    ).first()
    
    if not original_form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    # Create new form
    new_form = Form(
        user_id=token["user_id"],
        title=f"{original_form.title} (Copy)",
        description=original_form.description,
        category=original_form.category,
        status="draft"
    )
    
    db.add(new_form)
    db.flush()
    
    # Copy fields
    for field in original_form.fields:
        new_field = FormField(
            form_id=new_form.id,
            field_type=field.field_type,
            label=field.label,
            placeholder=field.placeholder,
            is_required=field.is_required,
            character_limit=field.character_limit,
            position=field.position,
            help_text=field.help_text,
            options=field.options
        )
        db.add(new_field)
    
    db.commit()
    db.refresh(new_form)
    
    return FormResponse.from_orm(new_form)


@router.post("/{form_id}/archive")
async def archive_form(
    form_id: int,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Archive form"""
    form = db.query(Form).filter(
        Form.id == form_id,
        Form.user_id == token["user_id"]
    ).first()
    
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    form.status = "archived"
    db.commit()
    
    return {"message": "Form archived successfully"}


@router.post("/{form_id}/publish")
async def publish_form(
    form_id: int,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Publish form (make active)"""
    form = db.query(Form).filter(
        Form.id == form_id,
        Form.user_id == token["user_id"]
    ).first()
    
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    form.status = "active"
    form.share_token = secrets.token_urlsafe(32)
    db.commit()
    
    return {
        "message": "Form published successfully",
        "share_link": f"https://smartformapp.com/forms/{form.share_token}"
    }


# Form Fields Routes

@router.post("/{form_id}/fields", response_model=FormFieldResponse, status_code=status.HTTP_201_CREATED)
async def add_form_field(
    form_id: int,
    request: FormFieldCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Add field to form"""
    form = db.query(Form).filter(
        Form.id == form_id,
        Form.user_id == token["user_id"]
    ).first()
    
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    field = FormField(
        form_id=form_id,
        field_type=request.field_type,
        label=request.label,
        placeholder=request.placeholder,
        is_required=request.is_required,
        character_limit=request.character_limit,
        position=request.position,
        help_text=request.help_text,
        options=request.options
    )
    
    db.add(field)
    db.commit()
    db.refresh(field)
    
    return FormFieldResponse.from_orm(field)


@router.get("/{form_id}/fields", response_model=List[FormFieldResponse])
async def get_form_fields(
    form_id: int,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Get all fields for a form"""
    form = db.query(Form).filter(Form.id == form_id).first()
    
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    # Check access
    if form.user_id != token["user_id"] and not form.is_public:
        raise HTTPException(status_code=403, detail="Access denied")
    
    fields = db.query(FormField).filter(
        FormField.form_id == form_id
    ).order_by(FormField.position).all()
    
    return [FormFieldResponse.from_orm(f) for f in fields]


@router.put("/{form_id}/fields/{field_id}", response_model=FormFieldResponse)
async def update_form_field(
    form_id: int,
    field_id: int,
    request: FormFieldCreate,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Update form field"""
    form = db.query(Form).filter(
        Form.id == form_id,
        Form.user_id == token["user_id"]
    ).first()
    
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    field = db.query(FormField).filter(
        FormField.id == field_id,
        FormField.form_id == form_id
    ).first()
    
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    
    field.label = request.label
    field.placeholder = request.placeholder
    field.is_required = request.is_required
    field.character_limit = request.character_limit
    field.help_text = request.help_text
    field.options = request.options
    
    db.commit()
    db.refresh(field)
    
    return FormFieldResponse.from_orm(field)


@router.delete("/{form_id}/fields/{field_id}")
async def delete_form_field(
    form_id: int,
    field_id: int,
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Delete form field"""
    form = db.query(Form).filter(
        Form.id == form_id,
        Form.user_id == token["user_id"]
    ).first()
    
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    field = db.query(FormField).filter(
        FormField.id == field_id,
        FormField.form_id == form_id
    ).first()
    
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    
    db.delete(field)
    db.commit()
    
    return {"message": "Field deleted successfully"}


@router.post("/{form_id}/fields/reorder")
async def reorder_form_fields(
    form_id: int,
    field_orders: dict,  # {field_id: position}
    token: dict = Depends(verify_token),
    db: Session = Depends(get_db)
):
    """Reorder form fields"""
    form = db.query(Form).filter(
        Form.id == form_id,
        Form.user_id == token["user_id"]
    ).first()
    
    if not form:
        raise HTTPException(status_code=404, detail="Form not found")
    
    for field_id, position in field_orders.items():
        field = db.query(FormField).filter(
            FormField.id == field_id,
            FormField.form_id == form_id
        ).first()
        
        if field:
            field.position = position
    
    db.commit()
    
    return {"message": "Fields reordered successfully"}
