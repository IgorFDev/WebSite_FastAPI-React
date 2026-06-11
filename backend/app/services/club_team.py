from schemas.club_team import ClubTeamCreate, ClubTeamResponse, ClubTeamUpdate
from models.models import ClubTeam
from sqlalchemy import select
from db.session import SessionDep
from fastapi import HTTPException, status
from slugify import slugify

async def create_club_team(db: SessionDep, club_team: ClubTeamCreate) -> ClubTeam:
    """
    Создание нового клуба
    """
    slug = slugify(club_team.name)
    
    slug_verify = await db.execute(select(ClubTeam).where(ClubTeam.slug == slug))
    slug_verify = slug_verify.scalar()
    if slug_verify:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Клуб с таким названием уже существует"
        )
    
    club_team = ClubTeam(
        name=club_team.name,
        slug=slug,
        league_name=club_team.league_name,
        group_name=club_team.group_name,
        results_url=club_team.results_url
    )
    
    db.add(club_team)
    await db.commit()
    await db.refresh(club_team)
    
    return club_team


async def get_club_teams(db: SessionDep) -> list[ClubTeamResponse]:
    """
    Получение списка всех игроков
    """
    club_teams = await db.execute(select(ClubTeam).order_by(ClubTeam.created_at.desc()))
    club_teams = club_teams.scalars().all()
    
    return club_teams


async def get_club_team_by_slug(db: SessionDep, slug: str) -> ClubTeamResponse:

    club_team = await db.execute(select(ClubTeam).where(ClubTeam.slug == slug))
    club_team = club_team.scalar()

    if not club_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Клуб не найден"
        )
    
    return club_team


async def update_club_team(db: SessionDep, club_team_id: int, club_team_data: ClubTeamUpdate) -> ClubTeamResponse:
    """
    Обновление клуба
    """
    club_team = await db.execute(select(ClubTeam).where(ClubTeam.id == club_team_id))
    club_team = club_team.scalar()

    if not club_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Клуб не найден"
        )
    
    update_data = club_team_data.model_dump(exclude_unset=True)

    # Проверяем изменение name
    if update_data.get("name") is not None:

        new_slug = slugify(update_data["name"])

        slug_verify = await db.execute(
            select(ClubTeam).where(
                ClubTeam.slug == new_slug,
                ClubTeam.id != club_team_id
            )
        )

        slug_verify = slug_verify.scalar()

        if slug_verify:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Клуб с таким названием уже существует"
            )

        club_team.slug = new_slug

    for field, value in club_team_data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(club_team, field, value)
        
    
    await db.commit()
    await db.refresh(club_team)
    
    return club_team

async def delete_club_team(db: SessionDep, club_team_id: int) -> dict:

    club_team = await db.execute(select(ClubTeam).where(ClubTeam.id == club_team_id))
    club_team = club_team.scalar()

    if not club_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Клуб не найден"
        )
    
    await db.delete(club_team)
    await db.commit()

    return {"detail": "Команда клуба удалена"}
