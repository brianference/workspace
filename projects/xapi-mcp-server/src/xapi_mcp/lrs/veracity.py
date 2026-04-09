"""Veracity Learning LRS plugin (HMAC-SHA1 signed requests)."""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
import uuid
from typing import Any
from urllib.parse import urlparse

import httpx

from xapi_mcp.lrs.base import BaseLRS


def _hmac_signature(
    method: str,
    url: str,
    key: str,
    secret: str,
) -> dict[str, str]:
    """Build OAuth 1.0a-style HMAC-SHA1 Authorization header fields."""
    parsed = urlparse(url)
    base_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"
    nonce = uuid.uuid4().hex
    timestamp = str(int(time.time()))
    sig_base = "&".join([
        method.upper(),
        base_url,
        f"oauth_consumer_key={key}&oauth_nonce={nonce}&oauth_timestamp={timestamp}"
        "&oauth_signature_method=HMAC-SHA1&oauth_version=1.0",
    ])
    raw_secret = f"{secret}&"
    sig = base64.b64encode(
        hmac.new(raw_secret.encode(), sig_base.encode(), hashlib.sha1).digest()
    ).decode()
    return {
        "oauth_consumer_key": key,
        "oauth_nonce": nonce,
        "oauth_timestamp": timestamp,
        "oauth_signature_method": "HMAC-SHA1",
        "oauth_version": "1.0",
        "oauth_signature": sig,
    }


def _auth_header(method: str, url: str, key: str, secret: str) -> str:
    parts = _hmac_signature(method, url, key, secret)
    fields = ", ".join(f'{k}="{v}"' for k, v in parts.items())
    return f"OAuth {fields}"


class VeracityLRS(BaseLRS):
    """Connects to the Veracity Learning LRS using OAuth 1.0a HMAC-SHA1."""

    _XAPI_VERSION = "1.0.3"

    def __init__(
        self,
        endpoint: str,
        key: str,
        secret: str,
        timeout: int = 30,
    ) -> None:
        if not endpoint:
            raise ValueError("VERACITY_ENDPOINT must be set for the 'veracity' plugin")
        self._base = endpoint.rstrip("/")
        self._key = key
        self._secret = secret
        self._timeout = timeout

    def _headers(self, method: str, url: str) -> dict[str, str]:
        return {
            "Authorization": _auth_header(method, url, self._key, self._secret),
            "X-Experience-API-Version": self._XAPI_VERSION,
            "Content-Type": "application/json",
        }

    def _url(self, path: str) -> str:
        return f"{self._base}{path}"

    # ------------------------------------------------------------------
    # Interface
    # ------------------------------------------------------------------

    async def put_statement(self, statement: dict[str, Any]) -> str:
        statement_id: str = statement["id"]
        url = self._url("/statements")
        async with httpx.AsyncClient(timeout=self._timeout) as c:
            resp = await c.put(
                url,
                params={"statementId": statement_id},
                headers=self._headers("PUT", url),
                content=json.dumps(statement),
            )
        resp.raise_for_status()
        return statement_id

    async def post_statements(self, statements: list[dict[str, Any]]) -> list[str]:
        url = self._url("/statements")
        async with httpx.AsyncClient(timeout=self._timeout) as c:
            resp = await c.post(
                url,
                headers=self._headers("POST", url),
                content=json.dumps(statements),
            )
        resp.raise_for_status()
        return resp.json()

    async def get_statements(self, params: dict[str, str]) -> dict[str, Any]:
        url = self._url("/statements")
        async with httpx.AsyncClient(timeout=self._timeout) as c:
            resp = await c.get(url, params=params, headers=self._headers("GET", url))
        resp.raise_for_status()
        return resp.json()

    async def get_statement(self, statement_id: str) -> dict[str, Any]:
        url = self._url("/statements")
        async with httpx.AsyncClient(timeout=self._timeout) as c:
            resp = await c.get(
                url,
                params={"statementId": statement_id},
                headers=self._headers("GET", url),
            )
        resp.raise_for_status()
        return resp.json()

    async def get_activity(self, activity_id: str) -> dict[str, Any]:
        url = self._url("/activities")
        async with httpx.AsyncClient(timeout=self._timeout) as c:
            resp = await c.get(
                url,
                params={"activityId": activity_id},
                headers=self._headers("GET", url),
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
        url = self._url("/activities/state")
        params: dict[str, str] = {
            "activityId": activity_id,
            "agent": agent,
            "stateId": state_id,
        }
        if registration:
            params["registration"] = registration
        async with httpx.AsyncClient(timeout=self._timeout) as c:
            resp = await c.get(url, params=params, headers=self._headers("GET", url))
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
        url = self._url("/activities/state")
        params: dict[str, str] = {
            "activityId": activity_id,
            "agent": agent,
            "stateId": state_id,
        }
        if registration:
            params["registration"] = registration
        async with httpx.AsyncClient(timeout=self._timeout) as c:
            resp = await c.put(
                url,
                params=params,
                headers=self._headers("PUT", url),
                content=json.dumps(document),
            )
        resp.raise_for_status()

    async def health_check(self) -> dict[str, Any]:
        url = self._url("/about")
        try:
            async with httpx.AsyncClient(timeout=self._timeout) as c:
                resp = await c.get(url, headers=self._headers("GET", url))
            return {"status": "ok", "http_status": resp.status_code}
        except httpx.HTTPError as exc:
            return {"status": "error", "detail": type(exc).__name__}
