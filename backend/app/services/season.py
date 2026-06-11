from schemas.season import SeasonCreate, SeasonResponse
from models.models import Season
from sqlalchemy import select
from db.session import SessionDep
from fastapi import HTTPException, status

async def create_season(db: SessionDep, season: SeasonCreate) -> SeasonResponse:
    """
    Создание нового сезона
    """
    # TODO: Добавить логику для проверки уникальности названия сезона

    # Проверяем, что не существует активного сезона
    if season.is_current == True:
        active_season = await db.execute(select(Season).where(Season.is_current.is_(True)))
        active_season = active_season.scalar()
        if active_season:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Уже есть активный сезон"
            )
    
    new_season = Season(
        name=season.name,
        is_current=season.is_current,
    )
    
    db.add(new_season)
    await db.commit()
    await db.refresh(new_season)
    
    return new_season


async def get_seasons(db: SessionDep) -> list[SeasonResponse]:
    result = await db.execute(select(Season))
    seasons = result.scalars().all()
    return seasons


async def get_season(
    db: SessionDep,
    season_id: int
) -> SeasonResponse:
    result = await db.execute(select(Season).where(Season.id == season_id))
    season = result.scalar()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Сезон не найден"
        )
    return season


async def update_season(
    db: SessionDep,
    season_id: int,
    season_data: SeasonCreate
) -> SeasonResponse:
    result = await db.execute(select(Season).where(Season.id == season_id))
    season = result.scalar()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Сезон не найден"
        )
    season.name = season_data.name
    season.is_current = season_data.is_current
    await db.commit()
    await db.refresh(season)
    return season


async def delete_season(
    db: SessionDep,
    season_id: int
) -> None:
    result = await db.execute(select(Season).where(Season.id == season_id))
    season = result.scalar()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Сезон не найден"
        )
    await db.delete(season)
    await db.commit()

