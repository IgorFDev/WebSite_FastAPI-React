from schemas.tournament_team import TournamentTeamCreate, TournamentTeamUpdate, TournamentTeamResponse
from models.models import TournamentTeam
from sqlalchemy import select
from db.session import SessionDep
from fastapi import HTTPException, status

async def create_tournament_team(db: SessionDep, tournament_team: TournamentTeamCreate) -> TournamentTeam:
    """
    Создание новой турнирной команды
    """
    
    tournament_team = TournamentTeam(
        name=tournament_team.name,
        season_id=tournament_team.season_id,
        league_name=tournament_team.league_name,
        group_name=tournament_team.group_name,
    )
    
    db.add(tournament_team)
    await db.commit()
    await db.refresh(tournament_team)
    
    return tournament_team


async def get_tournament_teams(db: SessionDep) -> list[TournamentTeamResponse]:
    """
    Получение списка всех турнирных команд
    """
    tournament_teams = await db.execute(select(TournamentTeam).order_by(TournamentTeam.created_at.desc()))
    tournament_teams = tournament_teams.scalars().all()
    
    return tournament_teams


async def get_tournament_team_by_id(db: SessionDep, tournament_team_id: int) -> TournamentTeamResponse:

    tournament_team = await db.execute(select(TournamentTeam).where(TournamentTeam.id == tournament_team_id))
    tournament_team = tournament_team.scalar()

    if not tournament_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Клуб не найден"
        )
    
    return tournament_team


async def update_tournament_team(db: SessionDep, tournament_team_id: int, tournament_team_data: TournamentTeamUpdate) -> TournamentTeamResponse:
    """
    Обновление турнирной команды
    """
    tournament_team = await db.execute(select(TournamentTeam).where(TournamentTeam.id == tournament_team_id))
    tournament_team = tournament_team.scalar()

    if not tournament_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Турнирная команда не найдена"
        )

    for field, value in tournament_team_data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(tournament_team, field, value)
        
    
    await db.commit()
    await db.refresh(tournament_team)
    
    return tournament_team

async def delete_tournament_team(db: SessionDep, tournament_team_id: int) -> dict:

    tournament_team = await db.execute(select(TournamentTeam).where(TournamentTeam.id == tournament_team_id))
    tournament_team = tournament_team.scalar()

    if not tournament_team:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Турнирная команда не найдена"
        )
    
    await db.delete(tournament_team)
    await db.commit()

    return {"detail": "Турнирная команда удалена"}
