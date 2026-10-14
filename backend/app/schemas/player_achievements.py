from pydantic import BaseModel

class PlayerAchievementsCreate(BaseModel):
    player_id: int
    text: str


class PlayerAchievementsResponse(BaseModel):
    id: int
    player_id: int
    text: str
    

class PlayerAchievementsUpdate(BaseModel):
    player_id: int | None = None
    text: str | None = None