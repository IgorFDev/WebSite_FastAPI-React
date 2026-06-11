from pydantic import BaseModel
from .season import SeasonResponse

class TournamentTeamCreate(BaseModel):
    name: str
    season_id: int
    league_name: str
    group_name: str


class TournamentTeamUpdate(BaseModel):
    name: str | None = None
    season_id: int | None = None
    league_name: str | None = None
    group_name: str | None = None


class TournamentTeamShortResponse(BaseModel):
    id: int
    name: str


class TournamentTeamResponse(TournamentTeamShortResponse):
    league_name: str
    group_name: str

    season: SeasonResponse
