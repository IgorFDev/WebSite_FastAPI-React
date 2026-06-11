from fastapi import APIRouter
from starlette.responses import RedirectResponse
from .healthdb import router as healthdb_router
from .api_v1_router import make_v1_router
from .admins import router as admin_router
from .auth import router as auth_router
from .superadmin_router.create import router as admin_create_router
from .superadmin_router.read import router as admin_read_router
from .superadmin_router.delete import router as admin_delete_router
from .admin_router.seasons import router as seasons_router
from .admin_router.media import router as media_router
from .admin_router.news import router as news_router
from .admin_router.players import router as players_router
from .public_router.players import router as public_players_router
from .admin_router.club_team import router as club_team_router
from .public_router.club_team import router as public_club_team_router
from .admin_router.tournament_team import router as tournament_team_router
from .public_router.tournament_team import router as public_tournament_team_router
from .admin_router.player_gallery import router as player_gallery_router
from .public_router.player_gallery import router as public_player_gallery_router
from .admin_router.player_statistic import router as player_statistic_router
from .public_router.player_statistic import router as public_player_statistic_router
from .admin_router.match import router as match_router
from .public_router.match import router as public_match_router
from .admin_router.match_set import router as match_set_router
from .public_router.match_set import router as public_match_set_router
from .admin_router.standings import router as standings_router
from .public_router.standings import router as public_standings_router

def make_root_router() -> APIRouter:
    router = APIRouter()

    @router.get(
        "/",
        include_in_schema=False,
    )
    async def redirect_to_docs() -> RedirectResponse:
        return RedirectResponse(url="/docs")

    router.include_router(healthdb_router, prefix="/health", tags=["health"])
    router.include_router(make_v1_router(), tags=["api_v1"])
    router.include_router(admin_router, tags=["admins"])
    router.include_router(auth_router, tags=["auth"])
    router.include_router(admin_create_router, tags=["superadmin"])
    router.include_router(admin_read_router, tags=["superadmin"])
    router.include_router(admin_delete_router, tags=["superadmin"])
    router.include_router(seasons_router, tags=["seasons"])
    router.include_router(media_router, tags=["media"])
    router.include_router(news_router, tags=["news"])
    router.include_router(club_team_router, tags=["club_team"])
    router.include_router(players_router, tags=["players"])
    router.include_router(public_players_router, tags=["players"])
    router.include_router(public_club_team_router, tags=["club_team"])
    router.include_router(tournament_team_router, tags=["tournament_team"])
    router.include_router(public_tournament_team_router, tags=["tournament_team"])
    router.include_router(public_player_gallery_router, tags=["player_gallery"])
    router.include_router(public_player_statistic_router, tags=["player_statistic"])
    router.include_router(player_gallery_router, tags=["player_gallery"])
    router.include_router(player_statistic_router, tags=["player_statistic"])
    router.include_router(match_router, tags=["match"])
    router.include_router(public_match_router, tags=["match"])
    router.include_router(match_set_router, tags=["match_set"])
    router.include_router(public_match_set_router, tags=["match_set"])
    router.include_router(standings_router, tags=["standings"])
    router.include_router(public_standings_router, tags=["standings"])

    return router