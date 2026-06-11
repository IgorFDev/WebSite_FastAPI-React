from fastapi import APIRouter
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from db.session import SessionDep

router = APIRouter()


@router.get("/")
async def health_check(
    db: SessionDep,
):
    await db.execute(select(1))
    return {
        "status": "ok",
        "database": "connected",
    }