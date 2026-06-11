from schemas.player_gallery import PlayerGalleryCreate, PlayerGalleryUpdate, PlayerGalleryResponse
from models.models import PlayerGallery, MediaAsset
from sqlalchemy import select
from db.session import SessionDep
from fastapi import HTTPException, status

async def add_player_photo(db: SessionDep, player_gallery: PlayerGalleryCreate) -> PlayerGallery:
    """
    Добавление фото в галерею игрока
    """
    media = await db.execute(
        select(MediaAsset).where(
            MediaAsset.id == player_gallery.media_asset_id
        )
    )
    media = media.scalar()
    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Медиа не найдено"
        )
    # Получаем максимальный sort_order для данного игрока
    max_sort_order_result = await db.execute(
        select(PlayerGallery.sort_order).where(PlayerGallery.player_id == player_gallery.player_id).order_by(PlayerGallery.sort_order.desc()).limit(1)
    )
    max_sort_order = max_sort_order_result.scalar() or 0
    
    player_gallery = PlayerGallery(
        player_id=player_gallery.player_id,
        media_asset_id=player_gallery.media_asset_id,
        sort_order=max_sort_order + 1,
    )
    
    db.add(player_gallery)
    await db.commit()
    await db.refresh(player_gallery)
    
    return player_gallery


async def get_players_galleries(db: SessionDep) -> list[PlayerGalleryResponse]:
    """
    Получение списка всех галерей игроков
    """
    player_galleries = await db.execute(select(PlayerGallery).order_by(PlayerGallery.player_id.desc()))
    player_galleries = player_galleries.scalars().all()
    
    return player_galleries


async def get_player_gallery_by_player_id(db: SessionDep, player_id: int) -> list[PlayerGalleryResponse]:

    player_gallery = await db.execute(select(PlayerGallery).where(PlayerGallery.player_id == player_id))
    player_gallery = player_gallery.scalars().all()

    if not player_gallery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Галерея игрока не найдена"
        )
    
    return player_gallery


async def update_player_photo(db: SessionDep, player_photo_id: int, player_photo_data: PlayerGalleryUpdate) -> PlayerGalleryResponse:
    """
    Обновление фото игрока
    """
    player_photo = await db.execute(select(PlayerGallery).where(PlayerGallery.id == player_photo_id))
    player_photo = player_photo.scalar()

    if not player_photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Фото игрока не найдено"
        )

    for field, value in player_photo_data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(player_photo, field, value)
        
    
    await db.commit()
    await db.refresh(player_photo)
    
    return player_photo

async def delete_player_photo(db: SessionDep, player_photo_id: int) -> dict:

    player_photo = await db.execute(select(PlayerGallery).where(PlayerGallery.id == player_photo_id))
    player_photo = player_photo.scalar()

    if not player_photo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Фото игрока не найдено"
        )
    
    await db.delete(player_photo)
    await db.commit()

    return {"detail": "Фото игрока удалено"}
