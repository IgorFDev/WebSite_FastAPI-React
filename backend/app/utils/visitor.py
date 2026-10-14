import uuid
from fastapi import Request, Response
from typing import Optional
import secrets

class VisitorService:
    """Сервис для управления visitor_id через cookies"""
    
    COOKIE_NAME = "visitor_id"
    COOKIE_MAX_AGE = 365 * 24 * 60 * 60  # 1 год в секундах
    
    @staticmethod
    def generate_visitor_id() -> str:
        """Генерация уникального visitor_id"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def get_visitor_id(request: Request) -> str:
        """Получение visitor_id из cookies или генерация нового"""
        visitor_id = request.cookies.get(VisitorService.COOKIE_NAME)
        
        if not visitor_id:
            # Генерируем новый visitor_id
            visitor_id = VisitorService.generate_visitor_id()
        
        return visitor_id
    
    @staticmethod
    def set_visitor_cookie(response: Response, visitor_id: str):
        """Установка visitor_id в cookie"""
        response.set_cookie(
            key=VisitorService.COOKIE_NAME,
            value=visitor_id,
            max_age=VisitorService.COOKIE_MAX_AGE,
            httponly=True,  # Защита от XSS
            secure=False,   # Для HTTP (для HTTPS поставить True)
            samesite='lax'  # Защита от CSRF
        )
    
    @staticmethod
    def get_client_ip(request: Request) -> str:
        """Получение IP-адреса клиента с учетом прокси"""
        # Проверяем заголовки от прокси
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            # X-Forwarded-For может содержать несколько IP, берем первый
            return forwarded.split(",")[0].strip()
        
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
        
        # Если нет прокси заголовков, берем прямой IP
        return request.client.host if request.client else "unknown"

# Глобальный экземпляр сервиса
visitor_service = VisitorService()
