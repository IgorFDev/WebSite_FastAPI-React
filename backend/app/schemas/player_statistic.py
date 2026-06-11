from pydantic import BaseModel, field_validator
from .season import SeasonMiniResponse

class PlayerStatisticCreate(BaseModel):
    player_id: int
    season_id: int
    matches_played: int
    sets_played: int
    total_points: int
    blocks: int
    attacks: int
    aces: int
    errors: int

class PlayerStatisticResponse(BaseModel):
    id: int
    player_id: int
    matches_played: int
    sets_played: int
    total_points: int
    blocks: int
    attacks: int
    aces: int
    errors: int

    season: SeasonMiniResponse

    class Config:
        from_attributes = True

class PlayerStatisticUpdate(BaseModel):
    season_id: int | None = None
    matches_played: int | None = None
    sets_played: int | None = None
    total_points: int | None = None
    blocks: int | None = None
    attacks: int | None = None
    aces: int | None = None
    errors: int | None = None


class PlayerStatisticAdding(BaseModel):
    matches_played: int | None = 0
    sets_played: int | None = 0
    total_points: int | None = 0
    blocks: int | None = 0
    attacks: int | None = 0
    aces: int | None = 0
    errors: int | None = 0

    @field_validator('matches_played', 'sets_played', 'total_points', 'blocks', 'attacks', 'aces', 'errors')
    @classmethod
    def none_to_zero(cls, v):
        if v is None:
            return 0
        return v
