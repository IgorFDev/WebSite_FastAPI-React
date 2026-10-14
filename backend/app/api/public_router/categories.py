from fastapi import APIRouter, Depends
from db.session import SessionDep
from schemas.categories import CategoriesCreate, CategoriesResponse, CategoriesUpdate
from services.categories import get_categories, get_categories_by_slug

router = APIRouter(prefix="/api/v1/categories")

@router.get("/", response_model=list[CategoriesResponse])
async def get_categories_endpoint(
    db: SessionDep
):
    categories = await get_categories(db=db)
    return categories


@router.get("/{categories_slug}", response_model=CategoriesResponse)
async def get_news_by_id_endpoint(
    categories_slug: str,
    db: SessionDep
):
    categories = await get_categories_by_slug(db=db, categories_slug=categories_slug)
    return categories
