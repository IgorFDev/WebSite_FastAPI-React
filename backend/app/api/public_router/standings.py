from fastapi import APIRouter
from db.session import SessionDep
from schemas.standings import StandingsResponse
from services.standings import get_standings_by_id, get_standings

router = APIRouter(prefix="/api/v1/standings")

@router.get("/", response_model=list[StandingsResponse])
async def get_standings_endpoint(
    db: SessionDep
):
    """
    Получение всех данных таблицы standings
    """
    return await get_standings(db)


@router.get("/{id}", response_model=StandingsResponse)
async def get_standings_by_id_endpoint(
    db: SessionDep,
    id: int
):
    """
    Получение данных таблицы standings по id
    """
    return await get_standings_by_id(db, id)
