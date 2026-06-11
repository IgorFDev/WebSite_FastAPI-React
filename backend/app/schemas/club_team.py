from datetime import datetime
from pydantic import BaseModel

class ClubTeamCreate(BaseModel):
    name: str
    league_name: str
    group_name: str
    results_url: str


class ClubTeamShortResponse(BaseModel):
    id: int
    name: str


class ClubTeamResponse(ClubTeamShortResponse):
    slug: str
    results_url: str
    league_name: str
    group_name: str
    created_at: datetime

    class Config:
        from_attributes = True



class ClubTeamUpdate(BaseModel):
    name: str | None = None
    league_name: str | None = None
    group_name: str | None = None
    results_url: str | None = None