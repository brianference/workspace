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
    secrets: list[str] = field(compare=False)

    @classmethod
    def from_env(cls) -> "Config":
        bearer_token = os.environ.get("X_BEARER_TOKEN", "")
        client_id = os.environ.get("X_CLIENT_ID", "")
        client_secret = os.environ.get("X_CLIENT_SECRET", "")

        secrets = [s for s in [bearer_token, client_id, client_secret] if s]

        return cls(
            bearer_token=bearer_token,
            client_id=client_id,
            client_secret=client_secret,
            default_max_results=int(os.environ.get("X_DEFAULT_MAX_RESULTS", "10")),
            secrets=secrets,
        )


cfg: Config = Config.from_env()
