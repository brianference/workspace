"""HTTP transport entry point for the x-search MCP server.

Starts a Starlette/uvicorn server that exposes the MCP protocol over
streamable HTTP. Each request must carry the X bearer token in the
Authorization header -- this is supplied by the platform's credential vault.

Usage:
    x-search-mcp-server-http          # reads HOST/PORT from env
    PORT=8080 x-search-mcp-server-http
"""

from __future__ import annotations

import json
import os
from typing import Any

import uvicorn
from mcp.server.streamable_http_manager import StreamableHTTPSessionManager
from starlette.types import ASGIApp, Receive, Scope, Send

from x_search_mcp.context import request_token
from x_search_mcp.main import app


# ---------------------------------------------------------------------------
# Auth middleware (raw ASGI -- avoids BaseHTTPMiddleware streaming issues)
# ---------------------------------------------------------------------------

class _BearerAuthMiddleware:
    """Extract the X bearer token from Authorization header and store in ContextVar.

    Passes /health through without auth so Railway's health check always works.
    Returns 401 for any other request that lacks a valid Authorization: Bearer header.
    """

    def __init__(self, wrapped_app: ASGIApp) -> None:
        self._app = wrapped_app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http":
            path: str = scope.get("path", "")

            if path == "/health":
                await self._app(scope, receive, send)
                return

            headers: dict[str, str] = {
                k.decode(): v.decode()
                for k, v in scope.get("headers", [])
            }
            auth_header = headers.get("authorization", "")

            if not auth_header.lower().startswith("bearer "):
                await _send_401(scope, send)
                return

            token = auth_header[len("bearer "):].strip()
            if not token:
                await _send_401(scope, send)
                return

            token_ctx = request_token.set(token)
            try:
                await self._app(scope, receive, send)
            finally:
                request_token.reset(token_ctx)
            return

        await self._app(scope, receive, send)


async def _send_401(scope: Scope, send: Send) -> None:
    body = json.dumps({"error": "Authorization: Bearer <token> header required"}).encode()
    await send({
        "type": "http.response.start",
        "status": 401,
        "headers": [
            (b"content-type", b"application/json"),
            (b"content-length", str(len(body)).encode()),
        ],
    })
    await send({"type": "http.response.body", "body": body})


# ---------------------------------------------------------------------------
# Core router
# ---------------------------------------------------------------------------

_HEALTH_BODY = json.dumps({"status": "ok"}).encode()


class _Router:
    """`/health` → 200, `/mcp` → MCP session manager, everything else → 404.

    Implements the ASGI lifespan protocol so the session manager's task group
    is started before the first request and shut down cleanly on exit.
    """

    def __init__(self, session_manager: StreamableHTTPSessionManager) -> None:
        self._session_manager = session_manager

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "lifespan":
            await self._handle_lifespan(receive, send)
            return

        path: str = scope.get("path", "")

        if path == "/health":
            await send({
                "type": "http.response.start",
                "status": 200,
                "headers": [
                    (b"content-type", b"application/json"),
                    (b"content-length", str(len(_HEALTH_BODY)).encode()),
                ],
            })
            await send({"type": "http.response.body", "body": _HEALTH_BODY})
            return

        if path.startswith("/mcp"):
            await self._session_manager.handle_request(scope, receive, send)
            return

        body = b'{"error":"not found"}'
        await send({
            "type": "http.response.start",
            "status": 404,
            "headers": [
                (b"content-type", b"application/json"),
                (b"content-length", str(len(body)).encode()),
            ],
        })
        await send({"type": "http.response.body", "body": body})

    async def _handle_lifespan(self, receive: Receive, send: Send) -> None:
        """Start the session manager on startup, stop it on shutdown."""
        message = await receive()
        if message["type"] != "lifespan.startup":
            return

        try:
            async with self._session_manager.run():
                await send({"type": "lifespan.startup.complete"})
                message = await receive()
                # Wait for shutdown signal
        except Exception as exc:  # noqa: BLE001
            await send({"type": "lifespan.startup.failed", "message": str(exc)})
            return

        await send({"type": "lifespan.shutdown.complete"})


# ---------------------------------------------------------------------------
# App factory
# ---------------------------------------------------------------------------

def create_app() -> ASGIApp:
    """Build and return the ASGI application."""
    session_manager = StreamableHTTPSessionManager(
        app=app,
        stateless=True,
    )
    return _BearerAuthMiddleware(_Router(session_manager))


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def run() -> None:
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8000"))

    uvicorn.run(
        create_app(),
        host=host,
        port=port,
        log_level="info",
        lifespan="on",
    )


if __name__ == "__main__":
    run()
