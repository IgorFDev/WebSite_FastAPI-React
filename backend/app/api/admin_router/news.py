from fastapi import APIRouter, Depends
from db.session import SessionDep
from schemas.news import NewsCreate, NewsResponse, NewsUpdate, NewsSingleResponse
from core.permissions import AdminDep
from services.news import create_news, get_news, get_news_by_id, update_news, delete_news, publish_news, get_all_news

router = APIRouter(prefix="/api/v1/news")

@router.post("/", response_model=NewsResponse)
async def create_news_endpoint(
    db: SessionDep,
    admin: AdminDep,
    news_data: NewsCreate
):
    new_news = await create_news(db=db, news=news_data)
    return new_news

@router.get("/", response_model=list[NewsResponse])
async def get_news_endpoint(
    db: SessionDep
):
    news = await get_news(db=db)
    return news

@router.get("/all", response_model=list[NewsResponse])
async def get_all_news_endpoint(
    db: SessionDep,
    admin: AdminDep
):
    news = await get_all_news(db=db)
    return news

@router.get("/{news_id}", response_model=NewsSingleResponse)
async def get_news_by_id_endpoint(
    news_id: int,
    db: SessionDep
):
    news = await get_news_by_id(db=db, news_id=news_id)
    return news

@router.patch("/{news_id}", response_model=NewsResponse)
async def update_news_endpoint(
    news_id: int,
    db: SessionDep,
    admin: AdminDep,
    news_data: NewsUpdate
):
    updated_news = await update_news(db=db, news_id=news_id, news_data=news_data)
    return updated_news


@router.put("/{news_id}/publish", response_model=NewsResponse)
async def publish_news_endpoint(
    news_id: int,
    db: SessionDep,
    admin: AdminDep
):
    published_news = await publish_news(db=db, news_id=news_id)
    return published_news


@router.delete("/{news_id}", response_model=NewsResponse)
async def delete_news_endpoint(
    news_id: int,
    db: SessionDep,
    admin: AdminDep
):
    await delete_news(db=db, news_id=news_id)
    return {"detail": "Новость удалена"}
