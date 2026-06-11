from schemas.players import PlayerResponse, PlayersResponse, PlayerCreate, PlayerUpdate
from models.models import Player, MediaAsset
from sqlalchemy import select
from db.session import SessionDep
from fastapi import HTTPException, status
from slugify import slugify
from datetime import datetime


async def create_player(db: SessionDep, player: PlayerCreate) -> PlayersResponse:
    """
    Создание нового игрока
    """
    name = f"{player.first_name} {player.last_name}"
    slug = slugify(name)
    
    slug_verify = await db.execute(select(Player).where(Player.slug == slug))
    slug_verify = slug_verify.scalar()
    if slug_verify:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Игрок с таким именем уже существует"
        )
    
    media = await db.execute(
        select(MediaAsset).where(
            MediaAsset.id == player.avatar_media_id
        )
    )
    
    media = media.scalar()
    if not media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Медиа не найдено"
        )
    
    background_media = await db.execute(
        select(MediaAsset).where(
            MediaAsset.id == player.background_media_id
        )
    )
    
    background_media = background_media.scalar()
    if not background_media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Фоновое изображение не найдено"
        )

    player = Player(
        club_team_id=player.club_team_id,
        first_name=player.first_name,
        last_name=player.last_name,
        slug=slug,
        number=player.number,
        position=player.position,
        birth_date=player.birth_date,
        height=player.height,
        weight=player.weight,
        sport_rank=player.sport_rank,
        avatar_media_id=player.avatar_media_id,
        background_media_id=player.background_media_id,
        is_current=player.is_current
    )
    
    db.add(player)
    await db.commit()
    await db.refresh(player)
    
    return player


async def get_players(db: SessionDep) -> list[PlayersResponse]:
    """
    Получение списка всех игроков
    """
    players = await db.execute(select(Player).order_by(Player.created_at.desc()))
    players = players.scalars().all()
    
    return players

async def get_player_by_slug(db: SessionDep, slug: str) -> PlayerResponse:
    """
    Получение игрока по slug
    """
    player = await db.execute(select(Player).where(Player.slug == slug))
    player = player.scalar()

    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Игрок не найден"
        )
    
    return player

async def update_player(db: SessionDep, player_id: int, player_data: PlayerUpdate) -> PlayerResponse:
    """
    Обновление игрока
    """
    player = await db.execute(select(Player).where(Player.id == player_id))
    player = player.scalar()
    
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Игрок не найден"
        )

    update_data = player_data.model_dump(exclude_unset=True)
    
    # Проверяем изменение name
    if update_data.get("last_name") is not None or update_data.get("first_name") is not None:

        name = f'{update_data.get("first_name", player.first_name)} {update_data.get("last_name", player.last_name)}'

        new_slug = slugify(name)

        slug_verify = await db.execute(
            select(Player).where(
                Player.slug == new_slug,
                Player.id != player_id
            )
        )

        slug_verify = slug_verify.scalar()

        if slug_verify:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Игрок с таким именем уже существует"
            )

        player.slug = new_slug

    for field, value in update_data.items():
        if value is not None:
            setattr(player, field, value)
    
    await db.commit()
    await db.refresh(player)
    
    return player

async def delete_player(db: SessionDep, player_id: int) -> dict:
    """
    Удаление игрока
    """
    player = await db.execute(select(Player).where(Player.id == player_id))
    player = player.scalar()
    
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Игрок не найден"
        )
    
    await db.delete(player)
    await db.commit()
    
    return {"detail": "Игрок удален"}