"""Config – loaded from environment variables only. Secrets never returned to callers."""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env", override=False)


@dataclass(frozen=True)
class Config:
    bearer_token: str
    client_id: str
    client_secret: str
    default_max_results: int
    supabase_url: str
    supabase_service_role_key: str
    secrets: list[str] = field(compare=False)

    @classmethod
    def from_env(cls) -> "Config":
        bearer_token = os.environ.get("X_BEARER_TOKEN", "")
        client_id = os.environ.get("X_CLIENT_ID", "")
        client_secret = os.environ.get("X_CLIENT_SECRET", "")
        supabase_url = os.environ.get("SUPABASE_URL", "")
        supabase_service_role_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

        secrets = [s for s in [bearer_token, client_id, client_secret, supabase_service_role_key] if s]

        return cls(
            bearer_token=bearer_token,
            client_id=client_id,
            client_secret=client_secret,
            default_max_results=int(os.environ.get("X_DEFAULT_MAX_RESULTS", "10")),
            supabase_url=supabase_url,
            supabase_service_role_key=supabase_service_role_key,
            secrets=secrets,
        )


cfg: Config = Config.from_env()
