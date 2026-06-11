from schemas.match_set import MatchSetCreate, MatchSetUpdate
from models.models import Match, MatchSet
from sqlalchemy import select
from db.session import SessionDep
from fastapi import HTTPException, status

async def create_match_set(db: SessionDep, match_set: MatchSetCreate):
    """
    Создание нового сета матча
    """
    match_id = await db.execute(select(Match.id).where(Match.id == match_set.match_id))
    match_id = match_id.scalar()

    if not match_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Матч не найден"
        )
    #TODO: 
    # - Проверить что сетов не больше 5
    # - Проверить что сет с таким номером уже не существует
    # - Проверить что счет правильный

    match_set = MatchSet(
        match_id=match_set.match_id,
        set_number=match_set.set_number,
        our_score=match_set.our_score,
        opponent_score=match_set.opponent_score
    )
    
    db.add(match_set)
    await db.commit()
    await db.refresh(match_set)
    
    return match_set

async def get_match_sets(db: SessionDep, match_id: int):
    """
    Получение всех сетов матча по ID
    """
    match_sets = await db.execute(select(MatchSet).where(MatchSet.match_id == match_id))
    match_sets = match_sets.scalars().all()
    
    if not match_sets:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Сеты не найдены"
        )
    
    return match_sets

async def update_match_set(db: SessionDep, match_set_id: int, match_set: MatchSetUpdate):
    """
    Обновление сета матча
    """
    match_set = await db.execute(select(MatchSet).where(MatchSet.id == match_set_id))
    match_set = match_set.scalar()
    
    if not match_set:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Сет не найден"
        )
    
    match_set.set_number = match_set.set_number
    match_set.our_score = match_set.our_score
    match_set.opponent_score = match_set.opponent_score
    
    await db.commit()
    await db.refresh(match_set)
    
    return match_set

async def delete_match_set(db: SessionDep, match_set_id: int):
    """
    Удаление сета матча
    """
    match_set = await db.execute(select(MatchSet).where(MatchSet.id == match_set_id))
    match_set = match_set.scalar()
    
    if not match_set:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Сет не найден"
        )
    
    await db.delete(match_set)
    await db.commit()
    
    return {"message": "Сет успешно удален"}

async def delete_match_sets(db: SessionDep, match_id: int):
    """
    Удаление всех сетов матча
    """
    match_sets = await db.execute(select(MatchSet).where(MatchSet.match_id == match_id))
    match_sets = match_sets.scalars().all()
    
    if not match_sets:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Сеты не найдены"
        )
    
    for match_set in match_sets:
        await db.delete(match_set)
    
    await db.commit()
    
    return {"message": f"Сеты матча {match_id} успешно удалены"}