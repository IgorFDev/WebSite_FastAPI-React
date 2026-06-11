from fastapi import APIRouter
from db.session import SessionDep
from schemas.club_team import ClubTeamResponse
from services.club_team import get_club_teams, get_club_team_by_slug

router = APIRouter(prefix="/api/v1/club-team")

@router.get("/", response_model=list[ClubTeamResponse])
async def get_club_teams_endpoint(
    db: SessionDep
):
    """
    Получение всех клубов
    """
    return await get_club_teams(db)

@router.get("/{slug}", response_model=ClubTeamResponse)
async def get_club_team_by_slug_endpoint(
    db: SessionDep,
    slug: str
):
    """
    Получение клуба по slug
    """
    return await get_club_team_by_slug(db, slug)
