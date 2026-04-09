"""Ralph LRS plugin (OAuth2 client-credentials flow)."""

from __future__ import annotations

import json
import time
from typing import Any

import httpx

from xapi_mcp.lrs.base import BaseLRS


class RalphLRS(BaseLRS):
    """Authenticates against Ralph via OAuth2 client-credentials, then proxies
    all xAPI requests to the /xapi sub-path."""

    _XAPI_VERSION = "1.0.3"
    _TOKEN_PATH = "/auth/token"
    _XAPI_PREFIX = "/xapi"

    def __init__(
        self,
        endpoint: str,
        client_id: str,
        client_secret: str,
        timeout: int = 30,
    ) -> None:
        if not endpoint:
            raise ValueError("RALPH_ENDPOINT must be set for the 'ralph' plugin")
        self._base = endpoint.rstrip("/")
        self._client_id = client_id
        self._client_secret = client_secret
        self._timeout = timeout
        self._token: str | None = None
        self._token_expiry: float = 0.0

    # ------------------------------------------------------------------
    # Token management
    # ------------------------------------------------------------------

    async def _ensure_token(self) -> str:
        if self._token and time.monotonic() < self._token_expiry:
            return self._token
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            resp = await client.post(
                f"{self._base}{self._TOKEN_PATH}",
                data={
                    "grant_type": "client_credentials",
                    "client_id": self._client_id,
                    "client_secret": self._client_secret,
                },
            )
        resp.raise_for_status()
        data = resp.json()
        self._token = data["access_token"]
        # Expire 60 s early to avoid races
        self._token_expiry = time.monotonic() + data.get("expires_in", 3600) - 60
        return self._token  # type: ignore[return-value]

    def _xapi_url(self, path: str) -> str:
        return f"{self._base}{self._XAPI_PREFIX}{path}"

    async def _client(self) -> httpx.AsyncClient:
        token = await self._ensure_token()
        return httpx.AsyncClient(
            headers={
                "Authorization": f"Bearer {token}",
                "X-Experience-API-Version": self._XAPI_VERSION,
                "Content-Type": "application/json",
            },
            timeout=self._timeout,
        )

    # ------------------------------------------------------------------
    # Interface
    # ------------------------------------------------------------------

    async def put_statement(self, statement: dict[str, Any]) -> str:
        statement_id: str = statement["id"]
        async with await self._client() as c:
            resp = await c.put(
                self._xapi_url("/statements"),
                params={"statementId": statement_id},
                content=json.dumps(statement),
            )
        resp.raise_for_status()
        return statement_id

    async def post_statements(self, statements: list[dict[str, Any]]) -> list[str]:
        async with await self._client() as c:
            resp = await c.post(
                self._xapi_url("/statements"),
                content=json.dumps(statements),
            )
        resp.raise_for_status()
        return resp.json()

    async def get_statements(self, params: dict[str, str]) -> dict[str, Any]:
        async with await self._client() as c:
            resp = await c.get(self._xapi_url("/statements"), params=params)
        resp.raise_for_status()
        return resp.json()

    async def get_statement(self, statement_id: str) -> dict[str, Any]:
        async with await self._client() as c:
            resp = await c.get(
                self._xapi_url("/statements"),
                params={"statementId": statement_id},
            )
        resp.raise_for_status()
        return resp.json()

    async def get_activity(self, activity_id: str) -> dict[str, Any]:
        async with await self._client() as c:
            resp = await c.get(
                self._xapi_url("/activities"),
                params={"activityId": activity_id},
            )
        resp.raise_for_status()
        return resp.json()

    async def get_state(
        self,
        activity_id: str,
        agent: str,
        state_id: str,
        registration: str | None = None,
    ) -> dict[str, Any]:
        params: dict[str, str] = {
            "activityId": activity_id,
            "agent": agent,
            "stateId": state_id,
        }
        if registration:
            params["registration"] = registration
        async with await self._client() as c:
            resp = await c.get(self._xapi_url("/activities/state"), params=params)
        resp.raise_for_status()
        return resp.json()

    async def put_state(
        self,
        activity_id: str,
        agent: str,
        state_id: str,
        document: dict[str, Any],
        registration: str | None = None,
    ) -> None:
        params: dict[str, str] = {
            "activityId": activity_id,
            "agent": agent,
            "stateId": state_id,
        }
        if registration:
            params["registration"] = registration
        async with await self._client() as c:
            resp = await c.put(
                self._xapi_url("/activities/state"),
                params=params,
                content=json.dumps(document),
            )
        resp.raise_for_status()

    async def health_check(self) -> dict[str, Any]:
        url = f"{self._base}/whoami"
        try:
            async with await self._client() as c:
                resp = await c.get(url)
            return {"status": "ok", "http_status": resp.status_code}
        except httpx.HTTPError as exc:
            return {"status": "error", "detail": type(exc).__name__}
