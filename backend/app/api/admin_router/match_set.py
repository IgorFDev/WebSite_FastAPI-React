from fastapi import APIRouter
from db.session import SessionDep
from schemas.match_set import MatchSetCreate, MatchSetUpdate
from services.match_set import create_match_set, update_match_set, delete_match_set, delete_match_sets
from core.permissions import AdminDep

router = APIRouter(prefix="/api/v1/match-set")

@router.post("/", response_model=MatchSetCreate)
async def create_match_set_endpoint(
    db: SessionDep,
    admin: AdminDep,
    match_set: MatchSetCreate
    
):
    """
    Создание нового сета матча
    """
    return await create_match_set(db, match_set)

@router.patch("/{match_set_id}", response_model=MatchSetUpdate)
async def update_match_set_endpoint(
    db: SessionDep,
    admin: AdminDep,
    match_set_id: int,
    match_set: MatchSetUpdate
):
    """
    Обновление сета матча
    """
    return await update_match_set(db, match_set_id, match_set)

@router.delete("/{match_set_id}")
async def delete_match_set_endpoint(
    db: SessionDep,
    admin: AdminDep,
    match_set_id: int
):
    """
    Удаление сета матча
    """
    return await delete_match_set(db, match_set_id)


@router.delete("/match/{match_id}")
async def delete_match_sets_endpoint(
    db: SessionDep,
    admin: AdminDep,
    match_id: int
):
    """
    Удаление всех сетов матча
    """
    return await delete_match_sets(db, match_id)

