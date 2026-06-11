from fastapi import APIRouter
from db.session import SessionDep
from schemas.player_statistic import PlayerStatisticResponse 
from services.player_statistic import get_player_statistics_by_player_id


router = APIRouter(prefix="/api/v1/player-statistic")


@router.get("/{player_id}", response_model=list[PlayerStatisticResponse])
async def get_player_statistics_by_player_id_endpoint(
    db: SessionDep,
    player_id: int
):
    """
    Получение статистики игрока по slug
    """
    player_statistics = await get_player_statistics_by_player_id(db, player_id)
    
    return player_statistics