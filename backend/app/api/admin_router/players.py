from fastapi import APIRouter, Depends
from db.session import SessionDep
from schemas.players import PlayerCreate, PlayerUpdate
from services.players import create_player, delete_player, update_player
from core.permissions import AdminDep


router = APIRouter(prefix="/api/v1/players")

@router.post("/", response_model=PlayerCreate)
async def create_player_endpoint(
    db: SessionDep,
    admin: AdminDep,
    player: PlayerCreate
):
    """
    Создание нового игрока
    """
    return await create_player(db, player)

@router.patch("/{player_id}", response_model=PlayerUpdate)
async def update_player_endpoint(
    db: SessionDep,
    admin: AdminDep,
    player_id: int,
    player: PlayerUpdate
):
    """
    Обновление игрока
    """
    return await update_player(db, player_id, player)

@router.delete("/{player_id}")
async def delete_player_endpoint(
    db: SessionDep,
    admin: AdminDep,
    player_id: int
):
    """
    Удаление игрока
    """
    return await delete_player(db, player_id)


