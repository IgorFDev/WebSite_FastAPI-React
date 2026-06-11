import enum
from sqlalchemy import String, Boolean, DateTime, Text, Enum, Integer, ForeignKey, Date, UniqueConstraint
from sqlalchemy.sql import func
from db.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime, date


class ParserStatus(enum.Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class PlayerPosition(enum.Enum):
    SETTER = "SETTER" # Связующий
    LIBERO = "LIBERO" # Либеро
    MIDDLE_BLOCKER = "MIDDLE_BLOCKER" # Центральный блокировщик
    OUTSIDE_HITTER = "OUTSIDE_HITTER" # Доигровщик
    OPPOSITE = "OPPOSITE" # Диагональный


class MatchStatus(enum.Enum):
    SCHEDULED = "SCHEDULED"
    FINISHED = "FINISHED"
    POSTPONED = "POSTPONED"
    CANCELLED = "CANCELLED"


class AdminRole(enum.Enum):
    SUPERADMIN = "SUPERADMIN"
    ADMIN = "ADMIN"
    EDITOR = "EDITOR"


class Season(Base):
    __tablename__ = "seasons"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False
    )
    is_current: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    matches: Mapped[list["Match"]] = relationship(back_populates="season", cascade="all, delete-orphan", lazy="selectin")
    player_statistics: Mapped[list["PlayerStatistic"]] = relationship(back_populates="season", cascade="all, delete-orphan", lazy="selectin")
    standings: Mapped[list["Standings"]] = relationship(back_populates="season")
    tournament_teams: Mapped[list["TournamentTeam"]] = relationship(back_populates="season", cascade="all, delete-orphan", lazy="selectin")


class Admin(Base):
    __tablename__ = "admins"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(String(50), nullable=False)
    last_name: Mapped[str] = mapped_column(String(50), nullable=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[AdminRole] = mapped_column(Enum(AdminRole, name="admin_role"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class ParserRun(Base):
    __tablename__ = "parser_runs"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    finished_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[ParserStatus] = mapped_column(Enum(ParserStatus, name="parser_status"), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)


class MediaAsset(Base):
    __tablename__ = "media_assets"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    storage_key: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    width: Mapped[int] = mapped_column(Integer, nullable=True)
    height: Mapped[int] = mapped_column(Integer, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    player_avatar: Mapped["Player"] = relationship(back_populates="avatar", uselist=False, foreign_keys="[Player.avatar_media_id]")
    player_background: Mapped["Player"] = relationship(back_populates="background", uselist=False, foreign_keys="[Player.background_media_id]")
    news_covers: Mapped[list["News"]] = relationship(back_populates="cover")
    gallery_items: Mapped[list["PlayerGallery"]] = relationship(back_populates="media_asset")

class ClubTeam(Base):
    __tablename__ = "club_teams"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    league_name: Mapped[str] = mapped_column(String(255), nullable=False)
    group_name: Mapped[str] = mapped_column(String(255), nullable=False)
    results_url: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    players: Mapped[list["Player"]] = relationship(back_populates="club_team", lazy="selectin")
    matches: Mapped[list["Match"]] = relationship(back_populates="club_team", cascade="all, delete-orphan", lazy="selectin")

class TournamentTeam(Base):
    __tablename__ = "tournament_teams"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    season_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("seasons.id"),
        nullable=False
    )
    league_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    group_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    UniqueConstraint("season_id", "name", "league_name", "group_name", name="unique_tournament_team")

    matches: Mapped[list["Match"]] = relationship(back_populates="opponent_team", lazy="selectin")
    standings: Mapped[list["Standings"]] = relationship(back_populates="team")
    season: Mapped["Season"] = relationship(back_populates="tournament_teams", lazy="selectin")


class Player(Base):
    __tablename__ = "players"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    club_team_id: Mapped[int] = mapped_column(Integer, ForeignKey("club_teams.id"), index=True, nullable=False)
    first_name: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    position: Mapped[PlayerPosition] = mapped_column(Enum(PlayerPosition, name="player_position"), nullable=False)
    birth_date: Mapped[date] = mapped_column(Date, nullable=False)
    height: Mapped[int] = mapped_column(Integer, nullable=True)
    weight: Mapped[int] = mapped_column(Integer, nullable=True)
    sport_rank: Mapped[str] = mapped_column(String(255), nullable=True)
    avatar_media_id: Mapped[int] = mapped_column(Integer, ForeignKey("media_assets.id"), unique=True, nullable=True)
    background_media_id: Mapped[int] = mapped_column(Integer, ForeignKey("media_assets.id"), nullable=True)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    UniqueConstraint('number','club_team_id', name='unique_number_player')

    club_team: Mapped["ClubTeam"] = relationship(back_populates="players", lazy="selectin")
    gallery_items: Mapped[list["PlayerGallery"]] = relationship(back_populates="player", cascade="all, delete-orphan", lazy="selectin")
    statistics: Mapped[list["PlayerStatistic"]] = relationship(back_populates="player", cascade="all, delete-orphan", lazy="selectin")
    avatar: Mapped["MediaAsset"] = relationship(back_populates="player_avatar", uselist=False, lazy="selectin", foreign_keys=[avatar_media_id])
    background: Mapped["MediaAsset"] = relationship(back_populates="player_background", uselist=False, lazy="selectin", foreign_keys=[background_media_id])


class PlayerGallery(Base):
    __tablename__ = "player_gallery"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    player_id: Mapped[int] = mapped_column(Integer, ForeignKey("players.id"), index=True, nullable=False)
    media_asset_id: Mapped[int] = mapped_column(Integer, ForeignKey("media_assets.id"), index=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    UniqueConstraint('player_id', 'media_asset_id', name='unique_player_media')

    player: Mapped["Player"] = relationship(back_populates="gallery_items", lazy="selectin")
    media_asset: Mapped["MediaAsset"] = relationship(back_populates="gallery_items", lazy="selectin")


class PlayerStatistic(Base):
    __tablename__ = "player_statistics"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    player_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("players.id"),
        nullable=False
    )
    season_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("seasons.id"),
        nullable=False
    )
    matches_played: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    sets_played: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    total_points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    blocks: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    attacks: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    aces: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    errors: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    UniqueConstraint('player_id', 'season_id', name='unique_player_season')

    player: Mapped["Player"] = relationship(back_populates="statistics", lazy="selectin")
    season: Mapped["Season"] = relationship(back_populates="player_statistics", lazy="selectin")


class Match(Base):
    __tablename__ = "matches"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    season_id: Mapped[int] = mapped_column(Integer, ForeignKey("seasons.id"), index=True, nullable=False)
    club_team_id: Mapped[int] = mapped_column(Integer, ForeignKey("club_teams.id"), index=True, nullable=False)
    opponent_team_id: Mapped[int] = mapped_column(Integer, ForeignKey("tournament_teams.id"), index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    match_datetime: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=False)
    our_score: Mapped[int] = mapped_column(Integer, nullable=True)
    opponent_score: Mapped[int] = mapped_column(Integer, nullable=True)
    is_home: Mapped[bool] = mapped_column(Boolean, nullable=False)
    address: Mapped[str] = mapped_column(Text, nullable=True)
    status: Mapped[MatchStatus] = mapped_column(Enum(MatchStatus, name="match_status"), server_default=MatchStatus.SCHEDULED.value, index=True, nullable=False)
    parsed_from_url: Mapped[str] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    match_sets: Mapped[list["MatchSet"]] = relationship(back_populates="match", cascade="all, delete-orphan", lazy="selectin")
    season: Mapped["Season"] = relationship(back_populates="matches", lazy="selectin")
    opponent_team: Mapped["TournamentTeam"] = relationship(back_populates="matches", lazy="selectin")
    club_team: Mapped["ClubTeam"] = relationship(back_populates="matches", lazy="selectin")
    

class MatchSet(Base):
    __tablename__ = "match_sets"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    match_id: Mapped[int] = mapped_column(Integer, ForeignKey("matches.id"), index=True, nullable=False)
    set_number: Mapped[int] = mapped_column(Integer, nullable=False)
    our_score: Mapped[int] = mapped_column(Integer, nullable=False)
    opponent_score: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    UniqueConstraint('match_id', 'set_number', name='unique_match_set')

    match: Mapped["Match"] = relationship(back_populates="match_sets", lazy="selectin")


class Standings(Base):
    __tablename__ = "standings"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    sets_won: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    sets_lost: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    season_id: Mapped[int] = mapped_column(Integer, ForeignKey("seasons.id"), index=True, nullable=False)
    league_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    group_name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    team_id: Mapped[int] = mapped_column(Integer, ForeignKey("tournament_teams.id"), index=True, nullable=False)
    position: Mapped[int] = mapped_column(Integer, nullable=False)
    matches_played: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    points: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    wins: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    losses: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    UniqueConstraint('season_id', 'league_name', 'group_name', 'team_id', name='unique_standings')

    season: Mapped["Season"] = relationship(back_populates="standings")
    team: Mapped["TournamentTeam"] = relationship(back_populates="standings")


class News(Base):
    __tablename__ = "news"
    
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    cover_media_id: Mapped[int] = mapped_column(Integer, ForeignKey("media_assets.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)

    cover: Mapped["MediaAsset"] = relationship(back_populates="news_covers", lazy="selectin")