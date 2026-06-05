from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    host: str = "0.0.0.0"
    port: int = 8000
    frontend_url: str = "http://localhost:3000"
    totp_secret_file: str = ".totp_secret"
    session_ttl_seconds: int = 3600
    totp_issuer: str = "TrainBoard"
    totp_account: str = "admin"

    class Config:
        env_file = ".env"

settings = Settings()
