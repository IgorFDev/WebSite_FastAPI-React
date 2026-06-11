from models.models import PlayerStatistic, Player, Season
from schemas.player_statistic import PlayerStatisticCreate, PlayerStatisticUpdate, PlayerStatisticResponse, PlayerStatisticAdding
from db.session import SessionDep
from fastapi import HTTPException, status
from sqlalchemy import select

async def add_player_statistic(db: SessionDep, player_statistic: PlayerStatisticCreate) -> PlayerStatistic:
    """
    Добавление статистики игрока
    """
    player = await db.execute(
        select(Player).where(
            Player.id == player_statistic.player_id
        )
    )
    player = player.scalar()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Игрок не найден"
        )

    season = await db.execute(
        select(Season).where(
            Season.id == player_statistic.season_id
        )
    )
    season = season.scalar()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Сезон не найден"
        )
    
    # Проверяем, что статистика для этого игрока и сезона еще не существует
    existing_statistic = await db.execute(
        select(PlayerStatistic).where(
            PlayerStatistic.player_id == player_statistic.player_id,
            PlayerStatistic.season_id == player_statistic.season_id
        )
    )
    existing_statistic = existing_statistic.scalar()
    if existing_statistic:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Статистика для этого игрока в этом сезоне уже существует"
        )
    
    player_statistic = PlayerStatistic(
        player_id=player_statistic.player_id,
        season_id=player_statistic.season_id,
        matches_played=player_statistic.matches_played,
        sets_played=player_statistic.sets_played,
        total_points=player_statistic.total_points,
        blocks=player_statistic.blocks,
        attacks=player_statistic.attacks,
        aces=player_statistic.aces,
        errors=player_statistic.errors,
    )
    
    db.add(player_statistic)
    await db.commit()
    await db.refresh(player_statistic)
    
    return player_statistic


async def get_player_statistics_by_player_id(db: SessionDep, player_id: int) -> list[PlayerStatisticResponse]:
    """
    Получение статистики игрока по id
    """
    player = await db.execute(
        select(Player).where(
            Player.id == player_id
        )
    )
    player = player.scalar()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Игрок не найден"
        )
    
    player_statistics = await db.execute(select(PlayerStatistic).where(PlayerStatistic.player_id == player_id).order_by(PlayerStatistic.season_id.desc()).limit(2))
    player_statistics = player_statistics.scalars().all()
    
    return player_statistics


async def update_player_statistic(db: SessionDep, player_statistic_id: int, player_statistic_data: PlayerStatisticUpdate) -> PlayerStatisticResponse:
    """
    Обновление статистики игрока
    """
    
    player_statistic = await db.execute(select(PlayerStatistic).where(PlayerStatistic.id == player_statistic_id))
    player_statistic = player_statistic.scalar_one_or_none()
    if not player_statistic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статистика игрока не найдена")
    
    for key, value in player_statistic_data.model_dump(exclude_unset=True).items():
        setattr(player_statistic, key, value)
    
    await db.commit()
    await db.refresh(player_statistic)
    
    return player_statistic


async def adding_statistic_to_player(db: SessionDep, statistic_id: int, statistic_data: PlayerStatisticAdding) -> PlayerStatisticResponse:
    """
    Добавление статистики игроку
    """
    
    player_statistic = await db.execute(select(PlayerStatistic).where(PlayerStatistic.id == statistic_id))
    player_statistic = player_statistic.scalar()
    if not player_statistic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статистика игрока не найдена")
    
    update_data = statistic_data.model_dump()

    for field, value in update_data.items():
        setattr(
            player_statistic,
            field,
            getattr(player_statistic, field) + value
        )
    
    await db.commit()
    await db.refresh(player_statistic)
    
    return player_statistic


async def delete_statistic_from_player(db: SessionDep, statistic_id: int) -> dict:
    """
    Удаление статистики у игрока
    """
    
    player_statistic = await db.execute(select(PlayerStatistic).where(PlayerStatistic.id == statistic_id))
    player_statistic = player_statistic.scalar()
    if not player_statistic:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Статистика игрока не найдена")
    
    await db.delete(player_statistic)
    await db.commit()
    
    return {"message": "Статистика игрока успешно удалена"}

