from pydantic import BaseModel
from .season import SeasonResponse
from .media import MediaResponse


class TournamentTableData(BaseModel):
    standings_id: int | None = None
    matches_played: int | None = None
    points: int | None = None
    wins: int | None = None
    losses: int | None = None
    sets_won: int | None = None
    sets_lost: int | None = None


class TournamentTeamCreate(TournamentTableData):
    name: str
    season_id: int
    avatar_media_id: int


class TournamentTeamUpdate(TournamentTableData):
    name: str | None = None
    season_id: int | None = None
    avatar_media_id: int | None = None


class TournamentTeamShortResponse(TournamentTeamUpdate):
    id: int | None = None
    name: str | None = None
    avatar: MediaResponse | None = None
    standings_id: int | None = None


class TournamentTeamResponse(TournamentTeamShortResponse):
    season: SeasonResponse | None = None
