from schemas.match import MatchCreate, MatchResponse, MatchUpdate
from models.models import Match, ClubTeam, TournamentTeam
from sqlalchemy import select
from db.session import SessionDep
from fastapi import HTTPException, status
from slugify import slugify

async def create_match(db: SessionDep, match: MatchCreate):
    """
    Создание нового матча
    """
    get_club_team_name = await db.execute(select(ClubTeam.name).where(ClubTeam.id == match.club_team_id))
    club_name = get_club_team_name.scalar()

    if not club_name:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Клуб не найден"
        )
    
    get_opponent_team_name = await db.execute(select(TournamentTeam.name).where(TournamentTeam.id == match.opponent_team_id))
    opponent_name = get_opponent_team_name.scalar()
    
    if not opponent_name:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Оппонент не найден"
        )

    match_date = match.match_datetime.date().strftime("%d-%m-%Y")
    slug = slugify(f"{match_date}-{club_name}-{opponent_name}")
    
    slug_verify = await db.execute(select(Match).where(Match.slug == slug))
    slug_verify = slug_verify.scalar()
    if slug_verify:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Такой матч уже добавлен"
        )
    
    match = Match(
        season_id=match.season_id,
        club_team_id=match.club_team_id,
        opponent_team_id=match.opponent_team_id,
        slug=slug,
        match_datetime=match.match_datetime,
        our_score=match.our_score,
        opponent_score=match.opponent_score,
        is_home=match.is_home,
        address=match.address,
        status=match.status,
        parsed_from_url=match.parsed_from_url
    )
    
    db.add(match)
    await db.commit()
    await db.refresh(match)
    
    return match


async def get_matches(db: SessionDep) -> list[MatchResponse]:
    """
    Получение списка всех матчей
    """
    matches = await db.execute(select(Match).order_by(Match.created_at.desc()))
    matches = matches.scalars().all()
    
    return matches


async def get_match_by_slug(db: SessionDep, match_slug: str) -> MatchResponse:

    match = await db.execute(select(Match).where(Match.slug == match_slug))
    match = match.scalar()

    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Матч не найден"
        )
    
    return match


async def update_match(db: SessionDep, match_slug: str, match_data: MatchUpdate) -> MatchResponse:
    """
    Обновление матча
    """
    match = await db.execute(select(Match).where(Match.slug == match_slug))
    match = match.scalar()

    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Матч не найден"
        )
    
    update_data = match_data.model_dump(exclude_unset=True)
    
    slug_components = ["match_datetime", "club_team_id", "opponent_team_id"]
    # Проверяем изменение name
    if update_data.get("match_datetime") is not None:
        slug_components.append(update_data["match_datetime"])

        new_slug = slugify("-".join(slug_components))

        slug_verify = await db.execute(
            select(Match).where(
                Match.slug == new_slug,
                Match.id != match_id
            )
        )

        slug_verify = slug_verify.scalar()

        if slug_verify:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Клуб с таким названием уже существует"
            )

        match.slug = new_slug

    for field, value in match_data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(match, field, value)
        
    
    await db.commit()
    await db.refresh(match)
    
    return match

async def delete_match(db: SessionDep, match_slug: str) -> dict:

    match = await db.execute(select(Match).where(Match.slug == match_slug))
    match = match.scalar()

    if not match:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Матч не найден"
        )
    
    await db.delete(match)
    await db.commit()

    return {"detail": "Матч удален"}
