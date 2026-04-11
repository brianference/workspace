# HTTP transport + Railway deployment

**Date:** 2026-04-10
**Status:** Approved

## Problem

The x-search MCP server only supports stdio transport, which requires it to run
locally. Claude platform agents (platform.claude.com) can only reach remote HTTP
endpoints. The goal is to deploy x-search to Railway so the platform agent can call
X API tools directly instead of hitting the platform-level `web_fetch` block on x.com.

## Auth model

The X bearer token lives exclusively in the platform's credential vault. On every
MCP request the vault injects it as `Authorization: Bearer <token>`. The server
reads it from the header and passes it to the X API client for that request.
No X credentials are stored in Railway environment variables.

## Architecture

```
Platform agent
  → POST /mcp  Authorization: Bearer <x_bearer_token>
  → Railway (Starlette app)
      → AuthMiddleware: extract token, 401 if missing, store in ContextVar
      → StreamableHTTPSessionManager (stateless=True)
          → MCP app.call_tool()
              → _dispatch(name, args, client=XClient(token_from_context_var))
              → X API v2
```

Stdio mode is unchanged. The existing `x-search-mcp-server` entry point and all
local Claude Code wiring stay as-is.

## Files

### Modified

**`src/x_search_mcp/main.py`**
- Add `_TOKEN: ContextVar[str]` module-level context variable
- Refactor `_dispatch(name, args)` → `_dispatch(name, args, xclient: XClient)`
- In `call_tool` handler: read token from `_TOKEN`, create `XClient(token)`, pass
  to `_dispatch`. Falls back to the module-level `client` singleton when the
  context var is unset (stdio path stays unchanged).

**`pyproject.toml`**
- Add `starlette>=0.40.0` and `uvicorn[standard]>=0.30.0` to dependencies
- Add script entry: `x-search-mcp-server-http = "x_search_mcp.http_server:run"`

**`requirements.txt`**
- Add `starlette>=0.40.0` and `uvicorn[standard]>=0.30.0`

### New

**`src/x_search_mcp/http_server.py`**
- `_TOKEN: ContextVar[str]` imported from `main`
- `AuthMiddleware(BaseHTTPMiddleware)`: reads `Authorization: Bearer <token>`,
  returns 401 JSON if missing/empty, sets `_TOKEN` before calling `call_next`
- `GET /health` route: returns `{"status": "ok"}` 200
- `POST /mcp` (and all MCP paths) handled by `StreamableHTTPASGIApp` wrapping
  `StreamableHTTPSessionManager(app=app, stateless=True)`
- `run()`: reads `HOST` (default `0.0.0.0`) and `PORT` (default `8000`) from env,
  starts uvicorn

**`Dockerfile`**
- Base: `python:3.11-slim`
- Install package with `pip install .`
- `EXPOSE $PORT` (Railway sets PORT at runtime)
- `CMD ["x-search-mcp-server-http"]`

**`railway.toml`**
- `[build]` startCommand = `x-search-mcp-server-http`
- `[deploy]` healthcheckPath = `/health`, healthcheckTimeout = 30

## Constraints

- Stateless mode means no SSE resumability -- each POST is a complete round trip.
  Acceptable since X API calls are themselves stateless.
- `XClient` is created per tool call (not per request). Cost is negligible --
  it's just header construction, no connection pooling needed.
- The global `client` singleton (loaded from env/`.env`) is still created at
  startup and used by the stdio path. In HTTP mode it is bypassed entirely.

## Out of scope

- OAuth 2.0 / user-context X API calls
- Rate limiting / request queuing
- Multi-tenant support (multiple different X accounts)
