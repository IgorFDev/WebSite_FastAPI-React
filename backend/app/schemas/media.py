from datetime import datetime
from pydantic import BaseModel


class MediaName(BaseModel):
    name: str


class MediaResponse(BaseModel):
    id: int
    storage_key: str
    url: str
    mime_type: str
    width: int | None = None
    height: int | None = None
    created_at: datetime | None = None

    class Config:
        from_attributes = True