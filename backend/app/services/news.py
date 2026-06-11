from schemas.news import NewsCreate, NewsResponse, NewsUpdate, NewsSingleResponse
from models.models import News, MediaAsset
from sqlalchemy import select
from db.session import SessionDep
from fastapi import HTTPException, status
from slugify import slugify
from datetime import datetime, UTC

async def create_news(db: SessionDep, news: NewsCreate) -> NewsResponse:
    """
    Создание новой новости
    """
    slug = slugify(news.title)
    
    slug_verify = await db.execute(select(News).where(News.slug == slug))
    slug_verify = slug_verify.scalar()
    if slug_verify:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Новость с таким заголовком уже существует"
        )

    media = await db.execute(
        select(MediaAsset).where(
            MediaAsset.id == news.cover
        )
    )
    media = media.scalar()
    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Медиа не найдено"
        )
    
    new_news = News(
        title=news.title,
        content=news.content,
        cover_media_id=news.cover,
        slug=slug
    )
    
    db.add(new_news)
    await db.commit()
    await db.refresh(new_news)
    
    return new_news


async def get_news(db: SessionDep) -> list[NewsResponse]:
    """
    Получение списка новостей
    """
    result = await db.execute(select(News).where(News.published_at.is_not(None)).order_by(News.published_at.desc()))
    news = result.scalars().all()

    return news

async def get_all_news(db: SessionDep) -> list[NewsResponse]:
    """
    Получение списка всех новостей
    """
    result = await db.execute(select(News).order_by(News.created_at.desc()))
    news = result.scalars().all()

    return news

async def get_news_by_id(db: SessionDep, news_id: int) -> NewsSingleResponse:
    """
    Получение новости по ID
    """
    result = await db.execute(select(News).where(News.id == news_id))
    news = result.scalar()
    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Новость не найдена"
        )
    return news


async def update_news(db: SessionDep, news_id: int, news_data: NewsUpdate) -> NewsResponse:
    """
    Обновление новости
    """
    result = await db.execute(select(News).where(News.id == news_id))
    news = result.scalar()
    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Новость не найдена"
        )
    
    if news_data.cover is not None:
        media = await db.execute(
            select(MediaAsset).where(
                MediaAsset.id == news_data.cover
            )
        )
        media = media.scalar()
        if not media:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Медиа не найдено"
            )
        news.cover_media_id = news_data.cover
        
    if news_data.title is not None:
        slug = slugify(news_data.title)

        slug_verify = await db.execute(select(News).where(News.slug == slug))
        slug_verify = slug_verify.scalar()
        if slug_verify:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Новость с таким заголовком уже существует"
            )    
        news.title = news_data.title
        news.slug = slug
    
    if news_data.content is not None:
        news.content = news_data.content
    
    await db.commit()
    await db.refresh(news)
    
    return news


async def delete_news(db: SessionDep, news_id: int) -> None:
    """
    Удаление новости
    """
    result = await db.execute(select(News).where(News.id == news_id))
    news = result.scalar()
    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Новость не найдена"
        )
    
    await db.delete(news)
    await db.commit()
    

async def publish_news(db: SessionDep, news_id: int) -> NewsResponse:
    """
    Публикация новости
    """
    result = await db.execute(select(News).where(News.id == news_id))
    news = result.scalar()
    if not news:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Новость не найдена"
        )
    
    news.published_at = datetime.now(UTC)
    
    await db.commit()
    await db.refresh(news)
    
    return news