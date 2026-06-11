from pydantic import BaseModel
from .media import MediaResponse

class PlayerGalleryCreate(BaseModel):
    player_id: int
    media_asset_id: int
    sort_order: int


class PlayerGalleryResponse(BaseModel):
    id: int
    media_asset: MediaResponse
    

class PlayerGalleryUpdate(BaseModel):
    player_id: int | None = None
    sort_order: int | None = None
    media_asset_id: int | None = None