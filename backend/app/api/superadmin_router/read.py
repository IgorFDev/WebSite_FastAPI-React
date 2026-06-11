from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
from models import Admin
from schemas.admin import AdminResponse
from core.permissions import require_role
from models.models import AdminRole

router = APIRouter(prefix="/api/v1/admins")

@router.get("/", response_model=list[AdminResponse])
async def read_admins(
    db: AsyncSession = Depends(get_db),
    superadmin: Admin = Depends(require_role(AdminRole.SUPERADMIN))
):
    """
    Получение списка админов
    """
    admins = await db.execute(select(Admin))
    admins = admins.scalars().all()
    return admins

@router.get("/{admin_id}", response_model=AdminResponse)
async def read_admin_by_id(
    admin_id: int,
    db: AsyncSession = Depends(get_db),
    superadmin: Admin = Depends(require_role(AdminRole.SUPERADMIN))
):
    """
    Получение админа по ID
    """
    admin = await db.execute(select(Admin).where(Admin.id == admin_id))
    admin = admin.scalar()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Админ не найден"
        )
    return admin