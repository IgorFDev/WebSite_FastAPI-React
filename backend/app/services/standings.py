from schemas.standings import StandingsCreate, StandingsUpdate, StandingsResponse
from models.models import Standings
from sqlalchemy import select
from db.session import SessionDep
from fastapi import HTTPException, status

async def create_standings(db: SessionDep, standings: StandingsCreate) -> Standings:
    """
    Создание новой турнирной таблицы
    """
    standings = Standings(
        sets_won=standings.sets_won,
        sets_lost=standings.sets_lost,
        season_id=standings.season_id,
        league_name=standings.league_name,
        group_name=standings.group_name,
        team_id=standings.team_id,
        position=standings.position,
        matches_played=standings.matches_played,
        points=standings.points,
        wins=standings.wins,
        losses=standings.losses,
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
