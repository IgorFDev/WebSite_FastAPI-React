from typing import Annotated
from fastapi import APIRouter, Depends
from db.session import SessionDep
from schemas.season import SeasonCreate, SeasonResponse, SeasonUpdate
from core.permissions import AdminDep
from services.season import create_season, get_seasons, get_seasons_until_this_year, get_current_season, get_season, update_season, delete_season


router = APIRouter(prefix="/api/v1/seasons")


@router.post("/", response_model=SeasonResponse)
async def create_season_endpoint(
    season_data: SeasonCreate,
    db: SessionDep,
    admin: AdminDep
):
    
    new_season = await create_season(db=db, season=season_data)
    
    return new_season


@router.get("/seasons-until-year", response_model=list[SeasonResponse])
async def get_seasons_until_this_year_endpoint(
    db: SessionDep
):
    """
    Получение списка всех сезонов до текущего года
    """
    seasons = await get_seasons_until_this_year(db=db)
    return seasons


@router.get("/", response_model=list[SeasonResponse])
async def get_seasons_endpoint(
    db: SessionDep
):
    """
    Получение списка всех сезонов
    """
    seasons = await get_seasons(db=db)
    return seasons

@router.get("/current-season", response_model=SeasonResponse)
async def get_current_season_endpoint(
    db: SessionDep
):
    """
    Получение текущего сезона
    """
    season = await get_current_season(db=db)
    if not season:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Текущий сезон не найден"
        )
    return season


@router.get("/{season_id}", response_model=SeasonResponse)
async def get_season_endpoint(
    season_id: int,
    db: SessionDep,
    admin: AdminDep
):
    """
    Получение информации о сезоне по ID
    """
    season = await get_season(db=db, season_id=season_id)
    return season


@router.patch("/{season_id}", response_model=SeasonResponse)
async def update_season_endpoint(
    season_id: int,
    season_data: SeasonUpdate,
    db: SessionDep,
    admin: AdminDep
):
    """
    Обновление информации о сезоне
    """
    season = await update_season(db=db, season_id=season_id, season_data=season_data)
    
    return season


@router.delete("/{season_id}")
async def delete_season_endpoint(
    season_id: int,
    db: SessionDep,
    admin: AdminDep
):
    """
    Удаление сезона
    """
    await delete_season(db=db, season_id=season_id)
    
    return {"detail": "Сезон удален"}

