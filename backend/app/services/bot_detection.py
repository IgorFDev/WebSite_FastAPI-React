from user_agents import parse
from typing import Optional
import hashlib

class BotDetectionService:
    """Сервис для определения ботов и подозрительной активности"""
    
    # Список подозрительных User-Agent паттернов
    SUSPICIOUS_PATTERNS = [
        'bot', 'crawler', 'spider', 'scraper', 'curl', 'wget', 
        'python', 'java', 'go-http', 'http.rb', 'libwww-perl',
        'lwp-trivial', 'libcurl', 'zzcurl', 'curl', 'wget'
    ]
    
    @staticmethod
    def parse_user_agent(user_agent_string: str):
        """Парсинг User-Agent строки"""
        return parse(user_agent_string)
    
    @staticmethod
    def is_bot(user_agent_string: str) -> bool:
        """Проверка, является ли User-Agent ботом"""
        try:
            user_agent = parse(user_agent_string)
            
            # Проверка через библиотеку user-agents
            if user_agent.is_bot:
                return True
            
            # Дополнительная проверка по паттернам
            user_agent_lower = user_agent_string.lower()
            for pattern in BotDetectionService.SUSPICIOUS_PATTERNS:
                if pattern in user_agent_lower:
                    return True
            
            return False
        except Exception as e:
            print(f"❌ Ошибка при парсинге User-Agent: {e}")
            return True  # В случае ошибки считаем подозрительным
    
    @staticmethod
    def is_suspicious(user_agent_string: str) -> bool:
        """Проверка на подозрительную активность"""
        try:
            user_agent = parse(user_agent_string)
            
            # Проверка на отсутствие User-Agent
            if not user_agent_string or user_agent_string.strip() == "":
                return True
            
            # Проверка на слишком короткий User-Agent
            if len(user_agent_string) < 10:
                return True
            
            # Проверка на отсутствие браузера и ОС
            if not user_agent.browser.family and not user_agent.os.family:
                return True
            
            return False
        except Exception as e:
            print(f"❌ Ошибка при проверке подозрительности: {e}")
            return True
    
    @staticmethod
    def get_user_agent_info(user_agent_string: str) -> dict:
        """Получение информации о User-Agent"""
        try:
            user_agent = parse(user_agent_string)
            return {
                'browser': user_agent.browser.family,
                'browser_version': str(user_agent.browser.version),
                'os': user_agent.os.family,
                'os_version': str(user_agent.os.version),
                'device': user_agent.device.family,
                'is_bot': user_agent.is_bot,
                'is_mobile': user_agent.is_mobile,
                'is_tablet': user_agent.is_tablet,
                'is_pc': user_agent.is_pc
            }
        except Exception as e:
            print(f"❌ Ошибка при получении информации User-Agent: {e}")
            return {}
    
    @staticmethod
    def hash_ip(ip_address: str) -> str:
        """Хеширование IP-адреса для конфиденциальности"""
        return hashlib.sha256(ip_address.encode()).hexdigest()[:16]

# Глобальный экземпляр сервиса
bot_detection_service = BotDetectionService()
