from re import A
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from .config import JwtSettings
from db.session import SessionDep, get_db
from models import Admin
from schemas.token import TokenData
from .security import decode_token


jwt_settings = JwtSettings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/admins/auth/login")

async def get_current_admin(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> Admin:
    """
    Зависимость, которая извлекает текущего админа из токена.
    Используется для защиты эндпоинтов.
    """
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = decode_token(token)        
        user_id: str = payload.get("sub")
    except JWTError:
        raise credentials_exception
    
    token_data = TokenData(user_id=int(user_id))

    admin = await db.execute(select(Admin).where(Admin.id == token_data.user_id))
    admin = admin.scalar_one_or_none()
    if admin is None:
        raise credentials_exception
    
    return admin
    