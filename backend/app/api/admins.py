from fastapi import APIRouter, Depends
from schemas.admin import AdminResponse
from core.dependencies import get_current_admin
from models import Admin

router = APIRouter(prefix="/api/v1/admins")

@router.get("/me", response_model=AdminResponse)
def get_current_admin_info(
    current_admin: Admin = Depends(get_current_admin)
):
    """
    Получение информации о текущем пользователе.
    Эндпоинт защищён: требуется валидный access токен.
    """
    return current_admin
