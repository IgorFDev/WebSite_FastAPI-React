from pydantic import BaseModel

class CategoriesCreate(BaseModel):
    name: str


class CategoriesUpdate(BaseModel):
    name: str | None = None


class CategoriesResponse(BaseModel):
    id: int
    name: str
    slug: str

    class Config:
        from_attributes = True
