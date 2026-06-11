from pydantic import BaseModel
from datetime import datetime
from .season import SeasonResponse
from .club_team import ClubTeamShortResponse
from .tournament_team import TournamentTeamShortResponse

class MatchCreate(BaseModel):
    season_id: int
    club_team_id: int
    opponent_team_id: int
    match_datetime: datetime
    our_score: int | None = None
    opponent_score: int | None = None
    is_home: bool
    address: str | None = None
    status: str
    parsed_from_url: str | None = None

class MatchResponse(BaseModel):
    id: int
    season: SeasonResponse
    club_team: ClubTeamShortResponse
    opponent_team: TournamentTeamShortResponse
    slug: str
    match_datetime: datetime
    our_score: int | None = None
    opponent_score: int | None = None
    is_home: bool
    address: str | None = None
    status: str
    parsed_from_url: str | None = None

class MatchUpdate(BaseModel):
    season_id: int | None = None
    club_team_id: int | None = None
    opponent_team_id: int | None = None
    slug: str | None = None
    match_datetime: datetime | None = None
    our_score: int | None = None
    opponent_score: int | None = None
    is_home: bool | None = None
    address: str | None = None
    status: str | None = None
    parsed_from_url: str | None = None
    