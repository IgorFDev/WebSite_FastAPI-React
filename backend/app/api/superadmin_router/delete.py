from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import get_db
from models import Admin
from schemas.admin import AdminResponse
from core.permissions import require_role
from models.models import AdminRole

router = APIRouter(prefix="/api/v1/admins")

@router.delete("/{admin_id}", response_model=AdminResponse)
async def delete_admin(
    admin_id: int,
    db: AsyncSession = Depends(get_db),
    superadmin: Admin = Depends(require_role(AdminRole.SUPERADMIN))
):
    """
    Удаление админа
    """
    admin = await db.execute(select(Admin).where(Admin.id == admin_id))
    admin = admin.scalar()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Админ не найден"
        )
    
    # Проверяем что не удаляем самого себя
    if admin.id == superadmin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Нельзя удалить себя"
        )
    
    await db.delete(admin)
    await db.commit()
    
    return admin