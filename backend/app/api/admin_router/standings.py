from fastapi import APIRouter
from db.session import SessionDep
from schemas.standings import StandingsCreate, StandingsUpdate
from services.standings import create_standings, update_standings, delete_standings
from core.permissions import AdminDep

router = APIRouter(prefix="/api/v1/standings")

@router.post("/", response_model=StandingsCreate)
async def create_standing_endpoint(
    db: SessionDep,
    admin: AdminDep,
    standing: StandingsCreate
    
):
    """
    Создание новой турнирной таблицы
    """
    return await create_standings(db, standing)

@router.patch("/", response_model=StandingsUpdate)
async def update_standing_endpoint(
    db: SessionDep,
    admin: AdminDep,
    standing_id: int,
    standing: StandingsUpdate
):
    """
    Обновление турнирной таблицы
    """
    return await update_standings(db, standing_id, standing)

@router.delete("/{standing_id}")
async def delete_standing_endpoint(
    db: SessionDep,
    admin: AdminDep,
    standing_id: int
):
    """
    Удаление турнирной таблицы
    """
    return await delete_standings(db, standing_id)

