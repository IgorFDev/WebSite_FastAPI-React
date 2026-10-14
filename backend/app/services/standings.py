from schemas.standings import StandingsCreate, StandingsUpdate, StandingsResponse
from models.models import Standings, Season, ClubTeam
from sqlalchemy import select
from db.session import SessionDep
from fastapi import HTTPException, status

async def create_standings(db: SessionDep, standings: StandingsCreate) -> Standings:
    """
    Создание новой турнирной таблицы
    """

    season = await db.execute(
        select(Season).where(
            Season.id == standings.season_id
        )
    )
    
    season = season.scalar()
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Такого сезона нет - выберите уже из существующих или добавьте новый"
        )

    club_team = await db.execute(
        select(ClubTeam).where(
            ClubTeam.id == standings.club_team_id
        )
    )
    
    club_team = club_team.scalar()
    if not club_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Такой команды нет - выберите из уже существующих или добавьте новую"
        )

    existing_standings = await db.execute(
        select(Standings).where(
            Standings.season_id == standings.season_id,
            Standings.club_team_id == standings.club_team_id
        )
    )
    
    if existing_standings.scalar():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Таблица для этого сезона для этой команды уже существует"
        )

    standings = Standings(
        season_id=standings.season_id,
        club_team_id=standings.club_team_id,
    )
    
    db.add(standings)
    await db.commit()
    await db.refresh(standings)
    
    return standings


async def get_standings(db: SessionDep) -> list[StandingsResponse]:
    """
    Получение турнирной таблицы
    """
    standings = await db.execute(select(Standings).order_by(Standings.created_at.desc()))
    standings = standings.scalars().all()
    
    return standings


async def get_standings_current_season(db: SessionDep) -> list[StandingsResponse]:
    """
    Получение турнирных таблиц действующего сезона
    """
    standings = await db.execute(
        select(Standings)
        .join(Season)
        .where(Season.is_current == True)
        .order_by(Standings.created_at.desc())
    )

    standings = standings.scalars().all()
    
    return standings


async def get_standings_by_id(db: SessionDep, standings_id: int) -> StandingsResponse:

    standings = await db.execute(select(Standings).where(Standings.id == standings_id))
    standings = standings.scalar()

    if not standings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Данные таблицы standings не найдены"
        )
    
    return standings


async def update_standings(db: SessionDep, standings_id: int, standings_data: StandingsUpdate) -> StandingsResponse:
    """
    Обновление данных турнирной таблицы
    """
    standings = await db.execute(select(Standings).where(Standings.id == standings_id))
    standings = standings.scalar()

    if not standings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Данные таблицы standings не найдены"
        )

    for field, value in standings_data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(standings, field, value)
        
    
    await db.commit()
    await db.refresh(standings)
    
    return standings

async def delete_standings(db: SessionDep, standings_id: int) -> dict:

    standings = await db.execute(select(Standings).where(Standings.id == standings_id))
    standings = standings.scalar()

    if not standings:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Данные таблицы standings не найдены"
        )
    
    await db.delete(standings)
    await db.commit()

    return {"detail": "Данные турнирной таблицы удалены"}
