from fastapi import APIRouter, Depends
from db.session import SessionDep
from schemas.player_statistic import PlayerStatisticCreate, PlayerStatisticUpdate, PlayerStatisticAdding
from services.player_statistic import add_player_statistic, update_player_statistic, adding_statistic_to_player, delete_statistic_from_player
from core.permissions import AdminDep

router = APIRouter(prefix="/api/v1/player-statistic")

@router.post("/", response_model=PlayerStatisticCreate)
async def create_player_statistic_endpoint(
    db: SessionDep,
    admin: AdminDep,
    player_statistic: PlayerStatisticCreate
):
    """
    Создание новой статистики игрока
    """
    return await add_player_statistic(db, player_statistic)

@router.patch("/{player_statistic_id}", response_model=PlayerStatisticUpdate)
async def update_player_statistic_endpoint(
    db: SessionDep,
    admin: AdminDep,
    player_statistic_id: int,
    player_statistic: PlayerStatisticUpdate
):
    """
    Обновление статистики игрока
    """
    return await update_player_statistic(db, player_statistic_id, player_statistic)

@router.post("/add/{statistic_id}", response_model=PlayerStatisticAdding)
async def add_statistic_to_player_endpoint(
    db: SessionDep,
    admin: AdminDep,
    statistic_id: int,
    value: PlayerStatisticAdding
):
    """
    Добавление статистики игроку
    """
    return await adding_statistic_to_player(db, statistic_id, value)

@router.delete("/{statistic_id}")
async def delete_player_statistic_endpoint(
    db: SessionDep,
    admin: AdminDep,
    statistic_id: int
):
    """
    Удаление статистики игрока
    """
    return await delete_statistic_from_player(db, statistic_id)