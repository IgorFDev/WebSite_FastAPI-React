from pydantic import BaseModel
from datetime import datetime

class SeasonCreate(BaseModel):
    name: str
    start_year: int
    is_current: bool = False


class SeasonUpdate(BaseModel):
    name: str | None = None
    start_year: int | None = None
    is_current: bool = False
    created_at: datetime | None = None
    updated_at: datetime | None = None

class SeasonMiniResponse(BaseModel):
    id: int
    name: str
    start_year: int
    end_year: int


class SeasonResponse(SeasonMiniResponse):
    is_current: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True