from models.models import PlayerAchievements, Player
from schemas.player_achievements import PlayerAchievementsCreate, PlayerAchievementsUpdate, PlayerAchievementsResponse
from db.session import SessionDep
from fastapi import HTTPException, status
from sqlalchemy import select

async def create_player_achievements(db: SessionDep, player_achievements: PlayerAchievementsCreate) -> PlayerAchievements:
    
    """
    Добавление достижения игроку
    """
    
    player = await db.execute(
        select(Player).where(
            Player.id == player_achievements.player_id
        )
    )
    player = player.scalar()
    if not player:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Игрок не найден"
        )

    
    player_achievements = PlayerAchievements(
        player_id=player_achievements.player_id,
        text=player_achievements.text,
    )
    
    db.add(player_achievements)
    await db.commit()
    await db.refresh(player_achievements)
    
    return player_achievements


async def get_player_achievements_by_player_id(db: SessionDep, player_id: int) -> list[PlayerAchievementsResponse]:
    """
    Получение достижений игрока по id
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
    
    player_achievementss = await db.execute(select(PlayerAchievements).where(PlayerAchievements.player_id == player_id).order_by(PlayerAchievements.created_at.asc()))
    player_achievementss = player_achievementss.scalars().all()
    
    return player_achievementss


async def update_player_achievements(db: SessionDep, player_achievements_id: int, player_achievements_data: PlayerAchievementsUpdate) -> PlayerAchievementsResponse:
    """
    Обновление достижений игрока
    """
    
    player_achievements = await db.execute(select(PlayerAchievements).where(PlayerAchievements.id == player_achievements_id))
    player_achievements = player_achievements.scalar_one_or_none()
    if not player_achievements:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Достижения игрока не найдена")
    
    for key, value in player_achievements_data.model_dump(exclude_unset=True).items():
        setattr(player_achievements, key, value)
    
    await db.commit()
    await db.refresh(player_achievements)
    
    return player_achievements


async def delete_achievements_from_player(db: SessionDep, achievements_id: int) -> dict:
    """
    Удаление достижения у игрока
    """
    
    player_achievements = await db.execute(select(PlayerAchievements).where(PlayerAchievements.id == achievements_id))
    player_achievements = player_achievements.scalar()
    if not player_achievements:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Достижение игрока не найдено")
    
    await db.delete(player_achievements)
    await db.commit()
    
    return {"message": "Достижение игрока успешно удалено"}

