from fastapi import APIRouter
from db.session import SessionDep
from core.permissions import AdminDep
from schemas.categories import CategoriesCreate, CategoriesResponse, CategoriesUpdate
from services.categories import create_categories, update_categories, delete_categories

router = APIRouter(prefix="/api/v1/categories")

@router.post("/", response_model=CategoriesResponse)
async def create_categories_endpoint(
    db: SessionDep,
    admin: AdminDep,
    categories_data: CategoriesCreate
):
    new_categories = await create_categories(db=db, categories=categories_data)
    return new_categories


@router.patch("/{categories_slug}", response_model=CategoriesResponse)
async def update_categories_endpoint(
    categories_slug: str,
    db: SessionDep,
    admin: AdminDep,
    categories_data: CategoriesUpdate
):
    updated_categories = await update_categories(db=db, categories_slug=categories_slug, categories_data=categories_data)
    return updated_categories


@router.delete("/{categories_slug}", response_model=CategoriesResponse)
async def delete_categories_endpoint(
    categories_slug: str,
    db: SessionDep,
    admin: AdminDep
):
    await delete_categories(db=db, categories_slug=categories_slug)
    return {"detail": "Категория удалена"}