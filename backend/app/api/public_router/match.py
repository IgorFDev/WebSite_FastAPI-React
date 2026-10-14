from fastapi import APIRouter
from db.session import SessionDep
from schemas.match import MatchResponse
from services.match import get_matches, get_match_by_slug, get_matches_by_team

router = APIRouter(prefix="/api/v1/match")

@router.get("/", response_model=list[MatchResponse])
async def get_matches_endpoint(
    db: SessionDep
):
    matches = await get_matches(db=db)
    return matches

@router.get("/{match_slug}", response_model=MatchResponse)
async def get_match_by_slug_endpoint(
    match_slug: str,
    db: SessionDep
):
    match = await get_match_by_slug(db=db, match_slug=match_slug)
    return match

@router.get("/team/{team_slug}", response_model=list[MatchResponse])
async def get_matches_by_team_endpoint(
    team_slug: str,
    db: SessionDep
):
    matches = await get_matches_by_team(db=db, team_slug=team_slug)
    return matches

