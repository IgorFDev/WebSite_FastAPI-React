from pydantic import BaseModel
from .media import MediaResponse
from datetime import datetime

class NewsCreate(BaseModel):
    title: str 
    content: str
    cover: int


class NewsUpdate(BaseModel):
    title: str | None = None
    content: str | None = None
    cover: int | None = None


class NewsResponse(BaseModel):
    id: int
    title: str
    slug: str
    cover: MediaResponse
    published_at: datetime | None = None

    class Config:
        from_attributes = True

class NewsSingleResponse(BaseModel):
    title: str
    slug: str
    cover: MediaResponse
    published_at: datetime | None = None
    content: str

    class Config:
        from_attributes = True
