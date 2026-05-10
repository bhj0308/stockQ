from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "StockQ API"
    debug: bool = False
    cors_origins: list[str] = ["http://localhost:3000"]

    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/stockq"
    redis_url: str = "redis://localhost:6379/0"

    s3_endpoint_url: str = "http://localhost:9000"
    s3_access_key: str = "minioadmin"
    s3_secret_key: str = "minioadmin"
    s3_bucket: str = "stockq"
    s3_region: str = "us-east-1"

    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440  # 24 hours

    dramatiq_queue_name: str = "stockq-runs"


settings = Settings()
