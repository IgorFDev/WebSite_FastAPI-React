from fastapi import APIRouter
from db.session import SessionDep
from schemas.players import PlayerResponse, PlayersResponse
from services.players import get_players, get_player_by_slug
from datetime import date

router = APIRouter(prefix="/api/v1/players")

@router.get("/", response_model=list[PlayersResponse])
async def get_players_endpoint(
    db: SessionDep
):
    """
    Получение всех игроков
    """
    return await get_players(db)

@router.get("/{slug}", response_model=PlayerResponse)
async def get_player_by_slug_endpoint(
    db: SessionDep,
    slug: str
):
    """
    Получение игрока по slug
    """
    player = await get_player_by_slug(db, slug)
    
    today = date.today()
    birth_date = player.birth_date

    age = (
        today.year - birth_date.year
        - ((today.month, today.day) < (birth_date.month, birth_date.day))
    )
    
    player.age = age
    return player
