from fastapi import APIRouter
from db.session import SessionDep
from schemas.tournament_team import TournamentTeamCreate, TournamentTeamUpdate
from services.tournament_team import create_tournament_team, update_tournament_team, delete_tournament_team
from core.permissions import AdminDep

router = APIRouter(prefix="/api/v1/tournament-team")

@router.post("/", response_model=TournamentTeamCreate)
async def create_tournament_team_endpoint(
    db: SessionDep,
    admin: AdminDep,
    tournament_team: TournamentTeamCreate
    
):
    """
    Создание новой турнирной команды
    """
    return await create_tournament_team(db, tournament_team)

@router.patch("/", response_model=TournamentTeamUpdate)
async def update_tournament_team_endpoint(
    db: SessionDep,
    admin: AdminDep,
    tournament_team_id: int,
    tournament_team: TournamentTeamUpdate
):
    """
    Обновление турнирной команды
    """
    return await update_tournament_team(db, tournament_team_id, tournament_team)

@router.delete("/{tournament_team_id}")
async def delete_tournament_team_endpoint(
    db: SessionDep,
    admin: AdminDep,
    tournament_team_id: int
):
    """
    Удаление турнирной команды
    """
    return await delete_tournament_team(db, tournament_team_id)

