import datetime
from schemas.season import SeasonCreate, SeasonResponse, SeasonUpdate
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
        start_year=season.start_year,
        end_year=season.start_year + 1
    )
    
    db.add(new_season)
    await db.commit()
    await db.refresh(new_season)
    
    return new_season


#TODO: Сделать функцию для вывода сезонов до настоящего года, пример:
# Сейчас 2026 год, выводим все сезоны до 2026(2024/2025, 2025/2026)
# и 1 августа выводим 1 новый сезон(2026/2027), если несколько выводим 
# последний созданный


async def get_seasons(db: SessionDep) -> list[SeasonResponse]:
    result = await db.execute(select(Season).order_by(Season.start_year.desc()))
    seasons = result.scalars().all()
    return seasons


async def get_seasons_until_this_year(db: SessionDep) -> list[SeasonResponse]:
    now = datetime.date.today()
    current_year = now.year + 1

    result = await db.execute(select(Season).where(Season.end_year <= current_year).order_by(Season.start_year.desc()))
    seasons = result.scalars().all()
    return seasons



async def get_current_season(db: SessionDep) -> SeasonResponse | None:
    result = await db.execute(select(Season).where(Season.is_current.is_(True)))
    season = result.scalar()
    return season


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
    season_data: SeasonUpdate
) -> SeasonResponse:
    
    result = await db.execute(select(Season).where(Season.id == season_id))
    season = result.scalar()
    
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Сезон не найден"
        )
    
    update_data = season_data.model_dump(exclude_unset=True)

    if update_data.get('start_year') is not None:

        new_end_year = season.start_year + 1

        season.end_year = new_end_year

    for field, value in update_data.items():
        if value is not None:
            setattr(season, field, value)

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

