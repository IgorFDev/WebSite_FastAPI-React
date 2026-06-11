from pydantic import BaseModel
from datetime import datetime

class SeasonCreate(BaseModel):
    name: str
    is_current: bool = False


class SeasonMiniResponse(BaseModel):
    id: int
    name: str


class SeasonResponse(SeasonMiniResponse):
    is_current: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True