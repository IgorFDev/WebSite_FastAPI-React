from datetime import datetime, timedelta, UTC
from jose import JWTError, jwt
from passlib.context import CryptContext
from .config import jwt_settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Проверка пароля"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Хеширование пароля"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Создание access токена"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=jwt_settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, jwt_settings.JWT_SECRET, algorithm=jwt_settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> dict | None:
    """Декодирование токена"""
    try:
        payload = jwt.decode(token, jwt_settings.JWT_SECRET, algorithms=[jwt_settings.ALGORITHM])
        return payload
    except JWTError:
        return None

