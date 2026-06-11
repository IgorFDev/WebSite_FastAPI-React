from fastapi import APIRouter, File, UploadFile, HTTPException, Form
from typing import Annotated
from db.session import SessionDep
from schemas.media import MediaResponse, MediaName
from core.permissions import AdminDep
from models.models import MediaAsset
import uuid
import shutil
from sqlalchemy import select
from pathlib import Path

router = APIRouter(prefix="/api/v1/media")

@router.post("/upload", response_model=MediaResponse)
async def upload_media(
    db: SessionDep,
    admin: AdminDep,
    name: str = Form(...),
    file: UploadFile = File(...),
):
    """
    Загрузка медиафайла
    """
    if not file:
        raise HTTPException(status_code=400, detail="Файл обязателен!")

    filename = f"{uuid.uuid4()}-{name}.{file.filename.split('.')[-1]}"
    filepath = Path("media/news") / filename

    filepath.parent.mkdir(parents=True, exist_ok=True)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    media = MediaAsset(
        storage_key=str(filepath),
        url=f"/media/news/{filename}",
        mime_type=file.content_type,
    )

    db.add(media)
    
    await db.commit()
    await db.refresh(media)
    
    return media


@router.get("/list", response_model=list[MediaResponse])
async def list_media(
    db: SessionDep,
    admin: AdminDep
):
    """
    Список медиафайлов
    """
    media = await db.execute(select(MediaAsset))
    return media.scalars().all()


@router.get("/get/{media_id}", response_model=MediaResponse)
async def get_media(
    db: SessionDep,
    admin: AdminDep,
    media_id: int
):
    """
    Получение медиафайла
    """
    media = await db.execute(select(MediaAsset).where(MediaAsset.id == media_id))
    return media.scalar()


@router.delete("/delete/{media_id}")
async def delete_media(
    db: SessionDep,
    admin: AdminDep,
    media_id: int
):
    """
    Удаление медиафайла
    """
    media = await db.execute(select(MediaAsset).where(MediaAsset.id == media_id))
    media = media.scalar()
    if media:
        await db.delete(media)
        await db.commit()
    return {"message": "Медиа удалено"}