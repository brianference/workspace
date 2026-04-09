"""Generic xAPI-compliant LRS plugin (Basic-Auth, xAPI 1.0.3)."""

from __future__ import annotations

import json
from typing import Any

import httpx

from xapi_mcp.lrs.base import BaseLRS


class GenericLRS(BaseLRS):
    """Works with any LRS that follows the xAPI 1.0.3 HTTP specification."""

    _XAPI_VERSION = "1.0.3"

    def __init__(self, endpoint: str, username: str, password: str, timeout: int = 30) -> None:
        if not endpoint:
            raise ValueError("LRS_ENDPOINT must be set for the 'generic' plugin")
        # Strip trailing slash for consistent URL construction
        self._base = endpoint.rstrip("/")
        self._auth = (username, password)
        self._timeout = timeout

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _client(self) -> httpx.AsyncClient:
        return httpx.AsyncClient(
            auth=self._auth,
            headers={
                "X-Experience-API-Version": self._XAPI_VERSION,
                "Content-Type": "application/json",
            },
            timeout=self._timeout,
        )

    def _statements_url(self) -> str:
        return f"{self._base}/statements"

    def _activities_url(self) -> str:
        return f"{self._base}/activities"

    def _state_url(self) -> str:
        return f"{self._base}/activities/state"

    # ------------------------------------------------------------------
    # Interface implementation
    # ------------------------------------------------------------------

    async def put_statement(self, statement: dict[str, Any]) -> str:
        statement_id: str = statement["id"]
        async with self._client() as client:
            resp = await client.put(
                self._statements_url(),
                params={"statementId": statement_id},
                content=json.dumps(statement),
            )
        resp.raise_for_status()
        return statement_id

    async def post_statements(self, statements: list[dict[str, Any]]) -> list[str]:
        async with self._client() as client:
            resp = await client.post(
                self._statements_url(),
                content=json.dumps(statements),
            )
        resp.raise_for_status()
        return resp.json()

    async def get_statements(self, params: dict[str, str]) -> dict[str, Any]:
        async with self._client() as client:
            resp = await client.get(self._statements_url(), params=params)
        resp.raise_for_status()
        return resp.json()

    async def get_statement(self, statement_id: str) -> dict[str, Any]:
        async with self._client() as client:
            resp = await client.get(
                self._statements_url(),
                params={"statementId": statement_id},
            )
        resp.raise_for_status()
        return resp.json()

    async def get_activity(self, activity_id: str) -> dict[str, Any]:
        async with self._client() as client:
            resp = await client.get(
                self._activities_url(),
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
        async with self._client() as client:
            resp = await client.get(self._state_url(), params=params)
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
        async with self._client() as client:
            resp = await client.put(
                self._state_url(),
                params=params,
                content=json.dumps(document),
            )
        resp.raise_for_status()

    async def health_check(self) -> dict[str, Any]:
        # Hit the /about endpoint which requires no auth on most LRS
        url = f"{self._base}/about"
        try:
            async with self._client() as client:
                resp = await client.get(url)
            return {"status": "ok", "http_status": resp.status_code}
        except httpx.HTTPError as exc:
            return {"status": "error", "detail": type(exc).__name__}
