from pydantic import BaseModel
from .media import MediaResponse
from .categories import CategoriesResponse
from datetime import datetime

class NewsCreate(BaseModel):
    title: str 
    content: str
    cover: int
    is_pinned: bool = False
    categories: list[int] = []


class AddCategoriesFromNews(BaseModel):
    categories: list[int] = []

class NewsUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    cover: int | None = None
    categories: list[int] | None = [] 


class NewsResponse(BaseModel):
    id: int
    title: str
    slug: str
    cover: MediaResponse
    is_pinned: bool
    views_count: int
    content: str
    categories: list[CategoriesResponse]
    published_at: datetime | None = None

    class Config:
        from_attributes = True

class NewsSingleResponse(NewsResponse):

    class Config:
        from_attributes = True
