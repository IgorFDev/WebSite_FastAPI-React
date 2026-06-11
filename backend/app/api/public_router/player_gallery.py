from fastapi import APIRouter
from db.session import SessionDep
from schemas.player_gallery import PlayerGalleryResponse
from services.players_gallery import get_players_galleries, get_player_gallery_by_player_id

router = APIRouter(prefix="/api/v1/player-gallery")

@router.get("/", response_model=list[PlayerGalleryResponse])
async def get_players_endpoint(
    db: SessionDep
):
    """
    Получение всех галерей игроков
    """
    return await get_players_galleries(db)

@router.get("/{player_id}", response_model=list[PlayerGalleryResponse])
async def get_player_gallery_endpoint(
    db: SessionDep,
    player_id: int
):
    """
    Получение галереи игрока по slug
    """
    player_gallery = await get_player_gallery_by_player_id(db, player_id)
    
    return player_gallery

