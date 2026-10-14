from fastapi import APIRouter
from db.session import SessionDep
from schemas.player_achievements import PlayerAchievementsResponse 
from services.player_achievements import get_player_achievements_by_player_id


router = APIRouter(prefix="/api/v1/player-achievements")


@router.get("/{player_id}", response_model=list[PlayerAchievementsResponse])
async def get_player_achievements_by_player_id_endpoint(
    db: SessionDep,
    player_id: int
):
    """
    Получение статистики игрока по id
    """
    player_statistics = await get_player_achievements_by_player_id(db, player_id)
    
    return player_statistics