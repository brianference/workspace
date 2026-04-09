"""Integration-style tests for the GenericLRS plugin using a mock HTTP server."""

import json
import pytest
import pytest_asyncio
import httpx

from pytest_httpx import HTTPXMock

from xapi_mcp.lrs.generic import GenericLRS


ENDPOINT = "https://lrs.example.com/xapi"
USERNAME = "testuser"
PASSWORD = "testpass"


@pytest.fixture
def lrs():
    return GenericLRS(endpoint=ENDPOINT, username=USERNAME, password=PASSWORD, timeout=5)


@pytest.mark.asyncio
async def test_put_statement(lrs, httpx_mock: HTTPXMock):
    stmt_id = "00000000-0000-0000-0000-000000000001"
    httpx_mock.add_response(
        method="PUT",
        url=f"{ENDPOINT}/statements?statementId={stmt_id}",
        status_code=204,
    )
    result = await lrs.put_statement({"id": stmt_id, "verb": {"id": "..."}})
    assert result == stmt_id


@pytest.mark.asyncio
async def test_post_statements(lrs, httpx_mock: HTTPXMock):
    returned_ids = ["id-1", "id-2"]
    httpx_mock.add_response(
        method="POST",
        url=f"{ENDPOINT}/statements",
        status_code=200,
        json=returned_ids,
    )
    result = await lrs.post_statements([{"id": "id-1"}, {"id": "id-2"}])
    assert result == returned_ids


@pytest.mark.asyncio
async def test_get_statements(lrs, httpx_mock: HTTPXMock):
    payload = {"statements": [], "more": ""}
    httpx_mock.add_response(
        method="GET",
        url=f"{ENDPOINT}/statements",
        status_code=200,
        json=payload,
    )
    result = await lrs.get_statements({})
    assert result == payload


@pytest.mark.asyncio
async def test_health_check_ok(lrs, httpx_mock: HTTPXMock):
    httpx_mock.add_response(
        method="GET",
        url=f"{ENDPOINT}/about",
        status_code=200,
        json={"version": ["1.0.3"]},
    )
    result = await lrs.health_check()
    assert result["status"] == "ok"


@pytest.mark.asyncio
async def test_health_check_error(lrs, httpx_mock: HTTPXMock):
    httpx_mock.add_exception(httpx.ConnectError("Connection refused"))
    result = await lrs.health_check()
    assert result["status"] == "error"
    # Must not contain any secret
    assert USERNAME not in str(result)
    assert PASSWORD not in str(result)


@pytest.mark.asyncio
async def test_credentials_never_in_response(lrs, httpx_mock: HTTPXMock):
    """Even if the LRS echoes back request headers, our response scrubbing
    in main.py would strip them.  Here we verify the raw plugin response
    doesn't include credentials in the URL or body."""
    payload = {"statements": [], "more": ""}
    httpx_mock.add_response(
        method="GET",
        url=f"{ENDPOINT}/statements",
        json=payload,
    )
    result = await lrs.get_statements({})
    result_str = json.dumps(result)
    assert USERNAME not in result_str
    assert PASSWORD not in result_str
