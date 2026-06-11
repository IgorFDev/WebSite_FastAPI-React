from fastapi import APIRouter, Depends
from db.session import SessionDep
from schemas.player_gallery import PlayerGalleryCreate, PlayerGalleryUpdate
from services.players_gallery import add_player_photo, delete_player_photo, update_player_photo
from core.permissions import AdminDep

router = APIRouter(prefix="/api/v1/player-gallery")

@router.post("/", response_model=PlayerGalleryCreate)
async def create_player_gallery_endpoint(
    db: SessionDep,
    admin: AdminDep,
    player_gallery: PlayerGalleryCreate
):
    """
    Создание новой галереи игрока
    """
    return await add_player_photo(db, player_gallery)

@router.patch("/{player_gallery_id}", response_model=PlayerGalleryUpdate)
async def update_player_gallery_endpoint(
    db: SessionDep,
    admin: AdminDep,
    player_gallery_id: int,
    player_gallery: PlayerGalleryUpdate = Depends()
):
    """
    Обновление галереи игрока
    """
    return await update_player_photo(db, player_gallery_id, player_gallery)

@router.delete("/{player_gallery_id}")
async def delete_player_gallery_endpoint(
    db: SessionDep,
    admin: AdminDep,
    player_gallery_id: int
):
    """
    Удаление галереи игрока
    """
    return await delete_player_photo(db, player_gallery_id)