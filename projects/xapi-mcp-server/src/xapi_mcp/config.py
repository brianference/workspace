"""Configuration – loaded exclusively from environment variables.

Secrets are NEVER returned to callers; only the `secrets` list is exposed
so the security sanitizer can scrub them from outgoing responses.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

# Load .env if present (dev convenience; production uses real env vars)
load_dotenv(Path(__file__).resolve().parents[3] / ".env", override=False)


@dataclass(frozen=True)
class Config:
    # Which LRS plugin to activate
    lrs_plugin: str

    # Generic / any xAPI-compliant LRS
    lrs_endpoint: str
    lrs_username: str
    lrs_password: str

    # Ralph LRS
    ralph_endpoint: str
    ralph_client_id: str
    ralph_client_secret: str

    # Veracity Learning LRS
    veracity_endpoint: str
    veracity_key: str
    veracity_secret: str

    # Request timeout
    lrs_timeout: int

    # All non-empty secret values – used by the sanitizer
    secrets: list[str] = field(compare=False)

    @classmethod
    def from_env(cls) -> "Config":
        lrs_username = os.environ.get("LRS_USERNAME", "")
        lrs_password = os.environ.get("LRS_PASSWORD", "")
        ralph_client_id = os.environ.get("RALPH_CLIENT_ID", "")
        ralph_client_secret = os.environ.get("RALPH_CLIENT_SECRET", "")
        veracity_key = os.environ.get("VERACITY_KEY", "")
        veracity_secret = os.environ.get("VERACITY_SECRET", "")

        secrets = [
            s for s in [
                lrs_username,
                lrs_password,
                ralph_client_id,
                ralph_client_secret,
                veracity_key,
                veracity_secret,
            ]
            if s
        ]

        return cls(
            lrs_plugin=os.environ.get("LRS_PLUGIN", "generic"),
            lrs_endpoint=os.environ.get("LRS_ENDPOINT", ""),
            lrs_username=lrs_username,
            lrs_password=lrs_password,
            ralph_endpoint=os.environ.get("RALPH_ENDPOINT", ""),
            ralph_client_id=ralph_client_id,
            ralph_client_secret=ralph_client_secret,
            veracity_endpoint=os.environ.get("VERACITY_ENDPOINT", ""),
            veracity_key=veracity_key,
            veracity_secret=veracity_secret,
            lrs_timeout=int(os.environ.get("LRS_TIMEOUT", "30")),
            secrets=secrets,
        )


# Module-level singleton loaded once at import time
cfg: Config = Config.from_env()
