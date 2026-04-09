"""X API v2 client – all requests authenticated via Bearer Token."""

from __future__ import annotations

from typing import Any

import httpx

# Default tweet fields to request on every tweet object
_TWEET_FIELDS = "id,text,author_id,created_at,public_metrics,lang,conversation_id,referenced_tweets"
_USER_FIELDS = "id,name,username,description,public_metrics,verified,created_at,location"
_EXPANSIONS_TWEET = "author_id,referenced_tweets.id"

_BASE = "https://api.twitter.com/2"


class XClient:
    def __init__(self, bearer_token: str, timeout: int = 15) -> None:
        if not bearer_token:
            raise ValueError("X_BEARER_TOKEN must be set")
        self._bearer = bearer_token
        self._timeout = timeout

    def _client(self) -> httpx.AsyncClient:
        return httpx.AsyncClient(
            headers={"Authorization": f"Bearer {self._bearer}"},
            timeout=self._timeout,
        )

    # ------------------------------------------------------------------
    # Search
    # ------------------------------------------------------------------

    async def search_recent(
        self,
        query: str,
        max_results: int = 10,
        next_token: str | None = None,
        sort_order: str = "recency",
        start_time: str | None = None,
        end_time: str | None = None,
    ) -> dict[str, Any]:
        """Search tweets from the last 7 days (free/basic tier)."""
        params: dict[str, Any] = {
            "query": query,
            "max_results": max_results,
            "tweet.fields": _TWEET_FIELDS,
            "user.fields": _USER_FIELDS,
            "expansions": _EXPANSIONS_TWEET,
            "sort_order": sort_order,
        }
        if next_token:
            params["next_token"] = next_token
        if start_time:
            params["start_time"] = start_time
        if end_time:
            params["end_time"] = end_time

        async with self._client() as c:
            resp = await c.get(f"{_BASE}/tweets/search/recent", params=params)
        resp.raise_for_status()
        return resp.json()

    async def search_all(
        self,
        query: str,
        max_results: int = 10,
        next_token: str | None = None,
        sort_order: str = "recency",
        start_time: str | None = None,
        end_time: str | None = None,
    ) -> dict[str, Any]:
        """Full-archive search (requires Basic $100/mo or Academic tier)."""
        params: dict[str, Any] = {
            "query": query,
            "max_results": max_results,
            "tweet.fields": _TWEET_FIELDS,
            "user.fields": _USER_FIELDS,
            "expansions": _EXPANSIONS_TWEET,
            "sort_order": sort_order,
        }
        if next_token:
            params["next_token"] = next_token
        if start_time:
            params["start_time"] = start_time
        if end_time:
            params["end_time"] = end_time

        async with self._client() as c:
            resp = await c.get(f"{_BASE}/tweets/search/all", params=params)
        resp.raise_for_status()
        return resp.json()

    # ------------------------------------------------------------------
    # Users
    # ------------------------------------------------------------------

    async def get_user_by_username(self, username: str) -> dict[str, Any]:
        """Look up a user profile by @handle (without the @)."""
        async with self._client() as c:
            resp = await c.get(
                f"{_BASE}/users/by/username/{username}",
                params={"user.fields": _USER_FIELDS},
            )
        resp.raise_for_status()
        return resp.json()

    async def get_users_by_usernames(self, usernames: list[str]) -> dict[str, Any]:
        """Bulk user lookup – up to 100 usernames."""
        async with self._client() as c:
            resp = await c.get(
                f"{_BASE}/users/by",
                params={
                    "usernames": ",".join(usernames[:100]),
                    "user.fields": _USER_FIELDS,
                },
            )
        resp.raise_for_status()
        return resp.json()

    # ------------------------------------------------------------------
    # Timelines
    # ------------------------------------------------------------------

    async def get_user_timeline(
        self,
        user_id: str,
        max_results: int = 10,
        next_token: str | None = None,
        exclude: str | None = None,
        start_time: str | None = None,
        end_time: str | None = None,
    ) -> dict[str, Any]:
        """Fetch a user's recent tweets (newest first)."""
        params: dict[str, Any] = {
            "max_results": max_results,
            "tweet.fields": _TWEET_FIELDS,
            "expansions": "author_id",
            "user.fields": _USER_FIELDS,
        }
        if next_token:
            params["pagination_token"] = next_token
        if exclude:
            params["exclude"] = exclude   # e.g. "retweets,replies"
        if start_time:
            params["start_time"] = start_time
        if end_time:
            params["end_time"] = end_time

        async with self._client() as c:
            resp = await c.get(f"{_BASE}/users/{user_id}/tweets", params=params)
        resp.raise_for_status()
        return resp.json()

    async def get_user_mentions(
        self,
        user_id: str,
        max_results: int = 10,
        next_token: str | None = None,
    ) -> dict[str, Any]:
        """Fetch recent tweets that mention a user."""
        params: dict[str, Any] = {
            "max_results": max_results,
            "tweet.fields": _TWEET_FIELDS,
            "expansions": "author_id",
            "user.fields": _USER_FIELDS,
        }
        if next_token:
            params["pagination_token"] = next_token

        async with self._client() as c:
            resp = await c.get(f"{_BASE}/users/{user_id}/mentions", params=params)
        resp.raise_for_status()
        return resp.json()

    # ------------------------------------------------------------------
    # Single tweet
    # ------------------------------------------------------------------

    async def get_tweet(self, tweet_id: str) -> dict[str, Any]:
        async with self._client() as c:
            resp = await c.get(
                f"{_BASE}/tweets/{tweet_id}",
                params={
                    "tweet.fields": _TWEET_FIELDS,
                    "expansions": _EXPANSIONS_TWEET,
                    "user.fields": _USER_FIELDS,
                },
            )
        resp.raise_for_status()
        return resp.json()

    async def get_tweet_thread(self, conversation_id: str, max_results: int = 20) -> dict[str, Any]:
        """Fetch all tweets in a thread by conversation_id."""
        return await self.search_recent(
            query=f"conversation_id:{conversation_id}",
            max_results=max_results,
            sort_order="recency",
        )

    # ------------------------------------------------------------------
    # Trending / counts
    # ------------------------------------------------------------------

    async def get_tweet_counts_recent(
        self,
        query: str,
        granularity: str = "hour",
        start_time: str | None = None,
        end_time: str | None = None,
    ) -> dict[str, Any]:
        """Get tweet volume counts for a query over the last 7 days."""
        params: dict[str, Any] = {"query": query, "granularity": granularity}
        if start_time:
            params["start_time"] = start_time
        if end_time:
            params["end_time"] = end_time

        async with self._client() as c:
            resp = await c.get(f"{_BASE}/tweets/counts/recent", params=params)
        resp.raise_for_status()
        return resp.json()
