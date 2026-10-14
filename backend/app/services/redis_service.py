import redis
import json
from typing import Optional, Any
from datetime import timedelta
import hashlib
import os

class RedisService:
    def __init__(self):
        self.redis_client: Optional[redis.Redis] = None
        self._connect()
    
    def _connect(self):
        """Подключение к Redis"""
        try:
            self.redis_client = redis.Redis(
                host=os.getenv("REDIS_HOST", "localhost"),
                port=int(os.getenv("REDIS_PORT", 6379)),
                db=int(os.getenv("REDIS_DB", 0)),
                decode_responses=True,
                socket_connect_timeout=5,
                socket_timeout=5
            )
            # Проверяем подключение
            self.redis_client.ping()
            print("✅ Redis подключен успешно")
        except Exception as e:
            print(f"❌ Ошибка подключения к Redis: {e}")
            print("⚠️ Redis недоступен, функции просмотра будут работать без кеширования")
            self.redis_client = None
    
    def is_available(self) -> bool:
        """Проверка доступности Redis"""
        if not self.redis_client:
            return False
        try:
            self.redis_client.ping()
            return True
        except:
            return False
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None):
        """Запись значения с опциональным TTL"""
        if not self.is_available():
            return False
        
        try:
            if isinstance(value, (dict, list)):
                value = json.dumps(value)
            
            if ttl:
                return self.redis_client.setex(key, ttl, value)
            else:
                return self.redis_client.set(key, value)
        except Exception as e:
            print(f"❌ Ошибка записи в Redis: {e}")
            return False
    
    def get(self, key: str) -> Optional[Any]:
        """Получение значения"""
        if not self.is_available():
            return None
        
        try:
            value = self.redis_client.get(key)
            if value:
                try:
                    return json.loads(value)
                except json.JSONDecodeError:
                    return value
            return None
        except Exception as e:
            print(f"❌ Ошибка чтения из Redis: {e}")
            return None
    
    def delete(self, key: str):
        """Удаление ключа"""
        if not self.is_available():
            return False
        
        try:
            return self.redis_client.delete(key)
        except Exception as e:
            print(f"❌ Ошибка удаления из Redis: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """Проверка существования ключа"""
        if not self.is_available():
            return False
        
        try:
            return bool(self.redis_client.exists(key))
        except Exception as e:
            print(f"❌ Ошибка проверки существования в Redis: {e}")
            return False
    
    def increment(self, key: str) -> Optional[int]:
        """Инкремент значения"""
        if not self.is_available():
            return None
        
        try:
            return self.redis_client.incr(key)
        except Exception as e:
            print(f"❌ Ошибка инкремента в Redis: {e}")
            return None
    
    def expire(self, key: str, ttl: int):
        """Установка TTL для ключа"""
        if not self.is_available():
            return False
        
        try:
            return self.redis_client.expire(key, ttl)
        except Exception as e:
            print(f"❌ Ошибка установки TTL в Redis: {e}")
            return False
    
    def generate_view_key(self, news_id: int, visitor_id: str, user_agent: str, ip_hash: str) -> str:
        """Генерация уникального ключа для просмотра"""
        # Создаем уникальный хеш на основе всех параметров
        unique_string = f"{news_id}:{visitor_id}:{user_agent}:{ip_hash}"
        hash_value = hashlib.md5(unique_string.encode()).hexdigest()
        return f"view:{news_id}:{hash_value}"
    
    def check_and_record_view(self, news_id: int, visitor_id: str, user_agent: str, ip_hash: str, ttl: int = 86400) -> bool:
        """
        Проверка и запись просмотра новости
        Возвращает True если это новый просмотр, False если уже был
        """
        if not self.is_available():
            return True  # Если Redis недоступен, всегда считаем новый просмотр
        
        view_key = self.generate_view_key(news_id, visitor_id, user_agent, ip_hash)
        
        # Проверяем, был ли уже просмотр
        if self.exists(view_key):
            return False  # Уже смотрел
        
        # Записываем новый просмотр с TTL (24 часа по умолчанию)
        self.set(view_key, "1", ttl)
        
        # Увеличиваем счетчик просмотров для этой новости
        counter_key = f"news_views:{news_id}"
        self.increment(counter_key)
        self.expire(counter_key, ttl * 2)  # Счетчик храним дольше
        
        return True  # Новый просмотр
    
    def get_news_views(self, news_id: int) -> int:
        """Получение количества просмотров из Redis"""
        if not self.is_available():
            return 0
        
        views = self.get(f"news_views:{news_id}")
        return int(views) if views else 0

# Глобальный экземпляр сервиса
redis_service = RedisService()
