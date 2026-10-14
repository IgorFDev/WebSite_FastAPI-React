from fastapi import APIRouter, Depends
from db.session import SessionDep
from schemas.player_achievements import PlayerAchievementsCreate, PlayerAchievementsUpdate
from services.player_achievements import create_player_achievements, update_player_achievements, delete_achievements_from_player
from core.permissions import AdminDep

router = APIRouter(prefix="/api/v1/player-achievements")

@router.post("/", response_model=PlayerAchievementsCreate)
async def create_player_achievements_endpoint(
    db: SessionDep,
    admin: AdminDep,
    player_achievements: PlayerAchievementsCreate
    ):
    """
    Создание нового достижения игрока
    """
    return await create_player_achievements(db, player_achievements)


@router.patch("/{player_achievements_id}", response_model=PlayerAchievementsUpdate)
async def update_player_achievements_endpoint(
        db: SessionDep,
        admin: AdminDep,
        player_achievements_id: int,
        player_achievements: PlayerAchievementsUpdate
    ):
        """
        Обновление достижения игрока
        """
        return await update_player_achievements(db, player_achievements_id, player_achievements)


@router.delete("/{Achievements_id}")
async def delete_player_achievements_endpoint(
    db: SessionDep,
    admin: AdminDep,
    achievements_id: int
):
    """
    Удаление достижения игрока
    """
    return await delete_achievements_from_player(db, achievements_id)