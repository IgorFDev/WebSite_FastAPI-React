from fastapi import APIRouter
from db.session import SessionDep
from schemas.tournament_team import TournamentTeamResponse
from services.tournament_team import get_tournament_team_by_id, get_tournament_teams

router = APIRouter(prefix="/api/v1/tournament-team")

@router.get("/", response_model=list[TournamentTeamResponse])
async def get_tournament_teams_endpoint(
    db: SessionDep
):
    """
    Получение всех команд турнира
    """
    return await get_tournament_teams(db)


@router.get("/{id}", response_model=TournamentTeamResponse)
async def get_tournament_team_by_id_endpoint(
    db: SessionDep,
    id: int
):
    """
    Получение клуба по id
    """
    return await get_tournament_team_by_id(db, id)
