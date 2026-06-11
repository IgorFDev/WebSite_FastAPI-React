from fastapi import APIRouter
from db.session import SessionDep
from schemas.match_set import MatchSetResponse
from services.match_set import get_match_sets

router = APIRouter(prefix="/api/v1/match-set")

@router.get("/{match_id}", response_model=list[MatchSetResponse])
async def get_match_sets_endpoint(
    db: SessionDep,
    match_id: int
):
    """
    Получение всех сетов матча
    """
    return await get_match_sets(db, match_id)
