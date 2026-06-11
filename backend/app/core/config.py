from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field


class Settings(BaseSettings):
    DATABASE_URL: str
    
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )


settings = Settings()


class PasswordHasherSettings(BaseSettings):
    # https://www.ietf.org/archive/id/draft-ietf-kitten-password-storage-04.html#section-4.2
    PEPPER: str = Field(min_length=32)

    # https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#introduction
    WORK_FACTOR: int = 11
    # CPU-bound & GIL released: per-worker ≈ max(1, floor(effective vCPUs / workers))
    MAX_THREADS: int = 8
    # Fail-fast cap: max semaphore wait before timeout (start ~1 second, tune to peak)
    SEMAPHORE_WAIT_TIMEOUT_S: float = 1.0


class JwtSettings(BaseSettings):
    # Min length 32 for 256-bit: https://www.rfc-editor.org/rfc/rfc7518#section-3.2
    JWT_SECRET: str = Field(min_length=32)

    ALGORITHM: str = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

jwt_settings = JwtSettings()


class SuperadminSettings(BaseSettings):
    SUPERADMIN_EMAIL: str
    SUPERADMIN_PASSWORD: str
    SUPERADMIN_FIRST_NAME: str
    SUPERADMIN_LAST_NAME: str
    
    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

superadmin_settings = SuperadminSettings()

