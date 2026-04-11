from typing import Optional

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # OpenAI
    openai_api_key: str = Field(..., description="OpenAI API key")
    openai_model: str = Field("gpt-4o-mini", description="LLM model name")

    # App
    app_env: str = Field("dev", description="Environment: dev | production")
    app_host: str = Field("0.0.0.0", description="Host")
    app_port: int = Field(8765, description="Port")
    
    # SMTP
    smtp_host: str = Field("mailhog", description="SMTP host")
    smtp_port: int = Field(1026, description="SMTP port")
    smtp_user: Optional[str] = Field(None, description="SMTP username")
    smtp_pass: Optional[str] = Field(None, description="SMTP password")
    smtp_from_email: str = Field("no-reply@educhatbot.local", description="SMTP sender")
    smtp_use_tls: bool = Field(False, description="Enable STARTTLS for SMTP")

    # Database
    database_url: str = Field(..., description="Database URL")
    debug: bool = Field(False, description="Debug mode")

    # JWT
    jwt_secret_key: str = Field(..., description="JWT secret key")
    jwt_algorithm: str = Field("HS256", description="JWT algorithm")
    jwt_access_token_expire_days: int = Field(7, description="Access token expire time in days")
    auth_cookie_name: str = Field("access_token", description="Authentication cookie name")

    frontend_url: str = Field("http://localhost:5173", description="Frontend URL for CORS and reset password link")
    
    @property
    def is_production(self) -> bool:
        return self.app_env.lower() == "production"

# Export
settings = Settings()