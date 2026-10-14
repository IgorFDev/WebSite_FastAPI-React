from services.redis_service import redis_service
from typing import Optional
import time

class RateLimiterService:
    """Сервис для ограничения частоты запросов (Rate Limiting)"""
    
    @staticmethod
    def is_allowed(
        identifier: str, 
        max_requests: int = 10, 
        window_seconds: int = 60
    ) -> tuple[bool, Optional[int]]:
        """
        Проверка, разрешен ли запрос
        
        Args:
            identifier: Уникальный идентификатор (IP, visitor_id и т.д.)
            max_requests: Максимальное количество запросов
            window_seconds: Временное окно в секундах
            
        Returns:
            (is_allowed, retry_after) - разрешен ли запрос и через сколько секунд можно повторить
        """
        if not redis_service.is_available():
            return True, None  # Если Redis недоступен, разрешаем все
        
        current_time = int(time.time())
        window_start = current_time - window_seconds
        
        # Ключ для хранения запросов
        key = f"rate_limit:{identifier}"
        
        # Получаем текущие запросы
        requests = redis_service.get(key) or []
        
        # Фильтруем старые запросы
        requests = [req_time for req_time in requests if req_time > window_start]
        
        # Проверяем лимит
        if len(requests) >= max_requests:
            # Вычисляем, когда можно будет сделать следующий запрос
            oldest_request = min(requests)
            retry_after = oldest_request + window_seconds - current_time
            return False, max(0, retry_after)
        
        # Добавляем текущий запрос
        requests.append(current_time)
        
        # Сохраняем с TTL = window_seconds + небольшая буферная зона
        redis_service.set(key, requests, window_seconds + 10)
        
        return True, None
    
    @staticmethod
    def check_news_view_rate_limit(ip_hash: str, visitor_id: str) -> tuple[bool, Optional[int]]:
        """
        Специфический rate limiter для просмотров новостей
        Разрешает не более 30 просмотров в минуту на IP
        """
        # Комбинируем IP и visitor_id для более точного ограничения
        identifier = f"{ip_hash}:{visitor_id}"
        return RateLimiterService.is_allowed(
            identifier=identifier,
            max_requests=30,
            window_seconds=60
        )

# Глобальный экземпляр сервиса
rate_limiter_service = RateLimiterService()
