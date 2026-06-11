from fastapi import APIRouter, Depends
from db.session import SessionDep
from schemas.club_team import ClubTeamCreate, ClubTeamUpdate
from services.club_team import create_club_team, update_club_team, delete_club_team
from core.permissions import AdminDep

router = APIRouter(prefix="/api/v1/club-team")

@router.post("/", response_model=ClubTeamCreate)
async def create_club_team_endpoint(
    db: SessionDep,
    admin: AdminDep,
    club_team: ClubTeamCreate
    
):
    """
    Создание нового клуба
    """
    return await create_club_team(db, club_team)

@router.patch("/{club_id}", response_model=ClubTeamUpdate)
async def update_club_team_endpoint(
    db: SessionDep,
    admin: AdminDep,
    club_id: int,
    club_team: ClubTeamUpdate
):
    """
    Обновление клуба
    """
    return await update_club_team(db, club_id, club_team)

@router.delete("/{club_id}")
async def delete_club_team_endpoint(
    db: SessionDep,
    admin: AdminDep,
    club_id: int
):
    """
    Удаление клуба
    """
    return await delete_club_team(db, club_id)

