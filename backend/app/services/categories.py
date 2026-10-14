from schemas.categories import CategoriesCreate, CategoriesResponse, CategoriesUpdate
from models.models import CategoriesNews
from sqlalchemy import select
from db.session import SessionDep
from fastapi import HTTPException, status
from slugify import slugify
from datetime import datetime, UTC

async def create_categories(db: SessionDep, categories: CategoriesCreate) -> CategoriesResponse:
    """
    Создание новой категории
    """
    slug = slugify(categories.name)
    
    slug_verify = await db.execute(select(CategoriesNews).where(CategoriesNews.slug == slug))
    slug_verify = slug_verify.scalar()
    if slug_verify:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Новость с таким заголовком уже существует"
        )
    
    new_categories = CategoriesNews(
        name=categories.name,
        slug=slug
    )
    
    db.add(new_categories)
    await db.commit()
    await db.refresh(new_categories)
    
    return new_categories


async def get_categories(db: SessionDep) -> list[CategoriesResponse]:
    """
    Получение списка категорий
    """
    result = await db.execute(select(CategoriesNews).order_by(CategoriesNews.created_at.desc()))
    categories = result.scalars().all()

    return categories


async def get_categories_by_slug(db: SessionDep, categories_slug: str) -> CategoriesResponse:
    """
    Получение категории по slug
    """
    result = await db.execute(select(CategoriesNews).where(CategoriesNews.slug == categories_slug))
    categories = result.scalar()
    if not categories:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Новость не найдена"
        )
    return categories


async def update_categories(db: SessionDep, categories_slug: str, categories_data: CategoriesUpdate) -> CategoriesResponse:
    """
    Обновление категории
    """
    result = await db.execute(select(CategoriesNews).where(CategoriesNews.slug == categories_slug))
    categories = result.scalar()
    if not categories:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Новость не найдена"
        )
        
    if categories_data.name is not None:
        slug = slugify(categories_data.name)

        slug_verify = await db.execute(select(CategoriesNews).where(CategoriesNews.slug == slug))
        slug_verify = slug_verify.scalar()
        if slug_verify:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Такая категория уже существует"
            )    
        categories.name = categories_data.name
        categories.slug = slug
    
    await db.commit()
    await db.refresh(categories)
    
    return categories


async def delete_categories(db: SessionDep, categories_slug: str) -> None:
    """
    Удаление категории
    """
    result = await db.execute(select(CategoriesNews).where(CategoriesNews.slug == categories_slug))
    categories = result.scalar()
    if not categories:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Новость не найдена"
        )
    
    await db.delete(categories)
    await db.commit()