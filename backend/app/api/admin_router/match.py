from fastapi import APIRouter
from db.session import SessionDep
from schemas.match import MatchCreate, MatchResponse, MatchUpdate
from core.permissions import AdminDep
from services.match import create_match, update_match, delete_match

router = APIRouter(prefix="/api/v1/match")

@router.post("/", response_model=MatchResponse)
async def create_match_endpoint(
    db: SessionDep,
    admin: AdminDep,
    match_data: MatchCreate
):
    new_match = await create_match(db=db, match=match_data)
    return new_match

@router.patch("/{match_slug}", response_model=MatchResponse)
async def update_match_endpoint(
    match_slug: str,
    db: SessionDep,
    admin: AdminDep,
    match_data: MatchUpdate
):
    updated_match = await update_match(db=db, match_slug=match_slug, match_data=match_data)
    return updated_match

@router.delete("/{match_slug}", response_model=dict)
async def delete_match_endpoint(
    match_slug: str,
    db: SessionDep,
    admin: AdminDep
):
    result = await delete_match(db=db, match_slug=match_slug)
    return result
