from pydantic import BaseModel, Field
from .tournament_team import TournamentTeamResponse
from .club_team import ClubTeamSuperShortResponse
from .season import SeasonMiniResponse


class StandingsCreate(BaseModel):
    season_id: int
    club_team_id: int
    

class StandingsUpdate(BaseModel):
    season_id: int | None = None
    club_team_id: int | None = None


class StandingsResponse(BaseModel):
    id: int
    club_team_id: int
    season: SeasonMiniResponse
    teams: list[TournamentTeamResponse] = Field(default_factory=list)
    club_team: ClubTeamSuperShortResponse
    
    class Config:
        from_attributes = True
