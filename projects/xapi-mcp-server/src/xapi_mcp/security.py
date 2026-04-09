"""Security utilities: prevent any secret from leaking into tool responses."""

from __future__ import annotations

import re
from typing import Any

# Patterns that commonly appear in credential-bearing strings
_SECRET_PATTERNS: list[re.Pattern[str]] = [
    # Basic-auth embedded in URLs: https://user:pass@host
    re.compile(r"https?://[^/@\s]+:[^/@\s]+@", re.IGNORECASE),
    # Bearer / Basic auth header values
    re.compile(r"(Bearer|Basic)\s+[A-Za-z0-9+/=._\-]{8,}", re.IGNORECASE),
    # API key query-param patterns
    re.compile(r"(?:api[_-]?key|token|secret|password|passwd|pwd)=[^\s&\"']+", re.IGNORECASE),
]

_REDACTED = "[REDACTED]"


def sanitize_string(value: str, secrets: list[str]) -> str:
    """Remove known secret values and suspicious patterns from *value*."""
    result = value
    # Remove exact known secrets first (longest first to avoid partial matches)
    for secret in sorted(secrets, key=len, reverse=True):
        if secret:
            result = result.replace(secret, _REDACTED)
    # Then strip pattern-matched credential strings
    for pattern in _SECRET_PATTERNS:
        result = pattern.sub(_REDACTED, result)
    return result


def sanitize_dict(data: dict[str, Any], secrets: list[str]) -> dict[str, Any]:
    """Recursively sanitize all string values in a dict."""
    cleaned: dict[str, Any] = {}
    for k, v in data.items():
        if isinstance(v, str):
            cleaned[k] = sanitize_string(v, secrets)
        elif isinstance(v, dict):
            cleaned[k] = sanitize_dict(v, secrets)
        elif isinstance(v, list):
            cleaned[k] = sanitize_list(v, secrets)
        else:
            cleaned[k] = v
    return cleaned


def sanitize_list(data: list[Any], secrets: list[str]) -> list[Any]:
    """Recursively sanitize all string values in a list."""
    result = []
    for item in data:
        if isinstance(item, str):
            result.append(sanitize_string(item, secrets))
        elif isinstance(item, dict):
            result.append(sanitize_dict(item, secrets))
        elif isinstance(item, list):
            result.append(sanitize_list(item, secrets))
        else:
            result.append(item)
    return result


def sanitize(data: Any, secrets: list[str]) -> Any:
    """Top-level sanitizer – accepts str, dict, or list."""
    if isinstance(data, str):
        return sanitize_string(data, secrets)
    if isinstance(data, dict):
        return sanitize_dict(data, secrets)
    if isinstance(data, list):
        return sanitize_list(data, secrets)
    return data
