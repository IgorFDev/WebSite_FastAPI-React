from datetime import datetime
from pydantic import BaseModel
from .media import MediaResponse
from .players import PlayersResponse

class ClubTeamCreate(BaseModel):
    name: str
    league_name: str
    group_name: str
    results_url: str
    emblem_media_id: int | None = None
    preview_media_id: int | None = None


class ClubTeamSuperShortResponse(BaseModel):
    id: int
    name: str


class ClubTeamShortResponse(ClubTeamSuperShortResponse):
    league_name: str
    group_name: str
    emblem: MediaResponse


class ClubTeamResponse(ClubTeamShortResponse):
    slug: str
    results_url: str
    created_at: datetime
    preview: MediaResponse

    players: list[PlayersResponse]

    class Config:
        from_attributes = True



class ClubTeamUpdate(BaseModel):
    name: str | None = None
    league_name: str | None = None
    group_name: str | None = None
    results_url: str | None = None
    preview_media_id: int | None = None
    emblem_media_id: int | None = None
