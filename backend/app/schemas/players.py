from pydantic import BaseModel
from .media import MediaResponse
from datetime import date
from .player_gallery import PlayerGalleryResponse
from .player_statistic import PlayerStatisticResponse, ShortPlayerStatisticResponse
from .player_achievements import PlayerAchievementsResponse

class ClubTeamShortResponse(BaseModel):
    id: int
    name: str
    league_name: str

class PlayersResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    number: int
    slug: str
    position: str
    
    statistics: list[ShortPlayerStatisticResponse]
    avatar: MediaResponse
    achievements: list[PlayerAchievementsResponse]

    class Config:
        from_attributes = True

class PlayerCreate(BaseModel):
    club_team_id: int
    first_name: str
    last_name: str
    number: int
    position: str
    birth_date: date
    height: int
    weight: int
    sport_rank: str | None = None
    avatar_media_id: int
    background_media_id: int
    is_current: bool = True
    

class PlayerUpdate(BaseModel):
    first_name: str | None = None
    last_name: str | None = None
    number: int | None = None
    position: str | None = None
    birth_date: date | None = None
    height: int | None = None
    weight: int | None = None
    sport_rank: str | None = None
    avatar_media_id: int | None = None
    background_media_id: int | None = None
    is_current: bool | None = None
    

class PlayerResponse(PlayersResponse):
    height: int
    weight: int
    birth_date: date
    sport_rank: str | None = None
    age: int
    is_current: bool

    club_team: ClubTeamShortResponse
    background: MediaResponse
    statistics: list[PlayerStatisticResponse]
    gallery_items: list[PlayerGalleryResponse]

    class Config:
        from_attributes = True
