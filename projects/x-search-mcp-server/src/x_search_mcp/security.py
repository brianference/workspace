"""Secret sanitizer – prevents credentials leaking into tool responses."""

from __future__ import annotations

import re
from typing import Any

_SECRET_PATTERNS: list[re.Pattern[str]] = [
    # Bearer / Basic auth header values
    re.compile(r"(Bearer|Basic)\s+[A-Za-z0-9+/=._\-]{8,}", re.IGNORECASE),
    # API key / secret query params
    re.compile(r"(?:api[_-]?key|token|secret|password|bearer)=[^\s&\"']+", re.IGNORECASE),
    # Basic-auth embedded in URLs
    re.compile(r"https?://[^/@\s]+:[^/@\s]+@", re.IGNORECASE),
]

_REDACTED = "[REDACTED]"


def sanitize_string(value: str, secrets: list[str]) -> str:
    result = value
    for secret in sorted(secrets, key=len, reverse=True):
        if secret:
            result = result.replace(secret, _REDACTED)
    for pattern in _SECRET_PATTERNS:
        result = pattern.sub(_REDACTED, result)
    return result


def sanitize(data: Any, secrets: list[str]) -> Any:
    if isinstance(data, str):
        return sanitize_string(data, secrets)
    if isinstance(data, dict):
        return {k: sanitize(v, secrets) for k, v in data.items()}
    if isinstance(data, list):
        return [sanitize(item, secrets) for item in data]
    return data
