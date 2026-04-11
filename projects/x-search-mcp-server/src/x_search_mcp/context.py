"""Request-scoped context variables for the HTTP transport."""

from __future__ import annotations

from contextvars import ContextVar

# Set by the HTTP auth middleware for each incoming request.
# Contains the raw bearer token extracted from the Authorization header.
# Unset in stdio mode -- callers must handle the unset case.
request_token: ContextVar[str] = ContextVar("request_token")
