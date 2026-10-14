from fastapi import APIRouter, Depends, Request, Response, HTTPException, status
from db.session import SessionDep
from sqlalchemy import select
from models.models import News
from services.news import get_news_by_slug
from services.redis_service import redis_service
from services.bot_detection import bot_detection_service
from services.rate_limiter import rate_limiter_service
from utils.visitor import visitor_service
from fastapi.responses import JSONResponse

router = APIRouter(prefix="/api/v1/news")

@router.get("/{news_slug}")
async def get_news_by_slug_endpoint(
    news_slug: str,
    db: SessionDep
):
    """Получение новости по slug"""
    news = await get_news_by_slug(db=db, news_slug=news_slug)
    return news

@router.post("/{news_id}/view")
async def increment_news_view(
    news_id: int,
    request: Request,
    response: Response,
    db: SessionDep
):
    """
    Эндпоинт для увеличения счетчика просмотров новости
    
    Процесс:
    1. Rate limiting (30 просмотров в минуту)
    2. Проверка на ботов по User-Agent
    3. Получение/генерация visitor_id
    4. Проверка повторного просмотра через Redis
    5. Увеличение счетчика в PostgreSQL
    """
    
    # 1. Rate limiting
    client_ip = visitor_service.get_client_ip(request)
    ip_hash = bot_detection_service.hash_ip(client_ip)
    visitor_id = visitor_service.get_visitor_id(request)
    
    is_allowed, retry_after = rate_limiter_service.check_news_view_rate_limit(ip_hash, visitor_id)
    if not is_allowed:
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"detail": "Too many requests", "retry_after": retry_after}
        )
    
    # 2. Проверка на ботов
    user_agent = request.headers.get("user-agent", "")
    
    if bot_detection_service.is_bot(user_agent):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"detail": "Bot traffic not allowed"}
        )
    
    if bot_detection_service.is_suspicious(user_agent):
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content={"detail": "Suspicious activity detected"}
        )
    
    # 3. Проверка существования новости
    result = await db.execute(select(News).where(News.id == news_id))
    news = result.scalar()
    
    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="News not found"
        )
    
    # 4. Проверка повторного просмотра через Redis
    is_new_view = redis_service.check_and_record_view(
        news_id=news_id,
        visitor_id=visitor_id,
        user_agent=user_agent,
        ip_hash=ip_hash,
        ttl=86400  # 24 часа
    )
    
    # 5. Увеличение счетчика только если это новый просмотр
    if is_new_view:
        news.views_count += 1
        await db.commit()
        await db.refresh(news)
    
    # 6. Устанавливаем visitor_id cookie если его не было
    if not request.cookies.get(visitor_service.COOKIE_NAME):
        visitor_service.set_visitor_cookie(response, visitor_id)
    
    return {
        "success": True,
        "is_new_view": is_new_view,
        "views_count": news.views_count
    }
