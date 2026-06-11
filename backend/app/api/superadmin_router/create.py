from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db, SessionDep
from models import Admin
from schemas.admin import AdminCreate, AdminResponse
from core.security import (
    get_password_hash
)
from core.permissions import require_role, SuperAdminDep
from models.models import AdminRole

router = APIRouter(prefix="/api/v1")

@router.post("/", response_model=AdminResponse)
async def create_admin(
    user_data: AdminCreate,
    db: SessionDep,
    superadmin: SuperAdminDep
):
    """
    Создание нового админа
    """
    existing_admin = await db.execute(select(Admin).where(Admin.email == user_data.email))
    existing_admin = existing_admin.scalar()
    if existing_admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Админ с таким email уже существует"
        )
    
    hashed_password = get_password_hash(user_data.password)
    
    new_admin = Admin(
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
    )
    
    db.add(new_admin)
    await db.commit()
    await db.refresh(new_admin)
    
    return new_admin