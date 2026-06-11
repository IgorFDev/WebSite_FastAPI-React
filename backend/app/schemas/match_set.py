from pydantic import BaseModel

class MatchSetCreate(BaseModel):
    match_id: int
    set_number: int
    our_score: int
    opponent_score: int


class MatchSetResponse(BaseModel):
    id: int
    match_id: int
    set_number: int
    our_score: int
    opponent_score: int


class MatchSetUpdate(BaseModel):
    match_id: int | None = None
    set_number: int | None = None
    our_score: int | None = None
    opponent_score: int | None = None