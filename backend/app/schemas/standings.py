from pydantic import BaseModel
from .tournament_team import TournamentTeamResponse

class StandingsCreate(BaseModel):
    sets_won: int
    sets_lost: int
    season_id: int
    league_name: str
    group_name: str
    team_id: int
    position: int
    matches_played: int
    points: int
    wins: int
    losses: int
    

class StandingsUpdate(BaseModel):
    sets_won: int | None = None
    sets_lost: int | None = None
    season_id: int | None = None
    league_name: str | None = None
    group_name: str | None = None
    team_id: int | None = None
    position: int | None = None
    matches_played: int | None = None
    points: int | None = None
    wins: int | None = None
    losses: int | None = None


class StandingsResponse(BaseModel):
    id: int
    sets_won: int
    sets_lost: int
    season_id: int
    league_name: str
    group_name: str
    team: TournamentTeamResponse
    position: int
    matches_played: int
    points: int
    wins: int
    losses: int
    
    class Config:
        from_attributes = True
