import select
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from db.session import get_db
from models import Admin
from schemas.token import Token
from core.security import (
    verify_password, 
    create_access_token
)

from core.config import JwtSettings

jwt_settings = JwtSettings()

router = APIRouter(prefix="/api/v1/admins/auth")


@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    """
    Аутентификация пользователя.
    Возвращает access токен.
    """

    admin = await db.execute(select(Admin).where(Admin.email == form_data.username))
    admin = admin.scalar()
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Админ с таким email не существует"
        )
    
    if not verify_password(form_data.password, admin.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Неверный пароль"
        )
    
    access_token = create_access_token(data={"sub": str(admin.id)})
    
    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

