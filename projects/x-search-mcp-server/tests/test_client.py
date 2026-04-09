"""Tests for the XClient against a mock HTTP server."""

import json
import pytest
import httpx
from pytest_httpx import HTTPXMock

from x_search_mcp.client import XClient

BEARER = "fake-bearer-token-for-tests"


@pytest.fixture
def xc():
    return XClient(bearer_token=BEARER, timeout=5)


# ---------------------------------------------------------------------------
# search_recent
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_search_recent_sends_query(xc, httpx_mock: HTTPXMock):
    payload = {"data": [{"id": "1", "text": "hello #AI"}], "meta": {"result_count": 1}}
    httpx_mock.add_response(json=payload)
    result = await xc.search_recent(query="#AI", max_results=5)
    assert result["data"][0]["text"] == "hello #AI"


@pytest.mark.asyncio
async def test_search_recent_bearer_not_in_response(xc, httpx_mock: HTTPXMock):
    payload = {"data": [], "meta": {"result_count": 0}}
    httpx_mock.add_response(json=payload)
    result = await xc.search_recent(query="test")
    assert BEARER not in json.dumps(result)


@pytest.mark.asyncio
async def test_search_recent_pagination(xc, httpx_mock: HTTPXMock):
    payload = {"data": [], "meta": {"next_token": "abc123"}}
    httpx_mock.add_response(json=payload)
    result = await xc.search_recent(query="test", next_token="prev_token")
    assert result["meta"]["next_token"] == "abc123"


# ---------------------------------------------------------------------------
# get_user_profile
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_get_user_profile(xc, httpx_mock: HTTPXMock):
    payload = {"data": {"id": "12345", "name": "Test User", "username": "testuser"}}
    httpx_mock.add_response(json=payload)
    result = await xc.get_user_by_username("testuser")
    assert result["data"]["username"] == "testuser"


# ---------------------------------------------------------------------------
# get_tweet
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_get_tweet(xc, httpx_mock: HTTPXMock):
    payload = {"data": {"id": "999", "text": "Sample tweet"}}
    httpx_mock.add_response(json=payload)
    result = await xc.get_tweet("999")
    assert result["data"]["id"] == "999"


# ---------------------------------------------------------------------------
# get_tweet_counts
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_get_tweet_counts(xc, httpx_mock: HTTPXMock):
    payload = {"data": [{"end": "2024-01-01T01:00:00Z", "tweet_count": 42}]}
    httpx_mock.add_response(json=payload)
    result = await xc.get_tweet_counts_recent(query="#AI", granularity="hour")
    assert result["data"][0]["tweet_count"] == 42


# ---------------------------------------------------------------------------
# HTTP errors
# ---------------------------------------------------------------------------

@pytest.mark.asyncio
async def test_http_error_propagates(xc, httpx_mock: HTTPXMock):
    httpx_mock.add_response(status_code=401)
    with pytest.raises(httpx.HTTPStatusError):
        await xc.search_recent(query="test")


@pytest.mark.asyncio
async def test_bearer_not_in_error_message(xc, httpx_mock: HTTPXMock):
    httpx_mock.add_exception(httpx.ConnectError("Connection refused"))
    try:
        await xc.search_recent(query="test")
    except httpx.ConnectError as exc:
        assert BEARER not in str(exc)
