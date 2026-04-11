"""X Search MCP Server.

Every tool response is passed through the security sanitizer before being
returned, so the Bearer Token can never appear in the conversation.
"""

from __future__ import annotations

import json
from typing import Any

import mcp.server.stdio
import mcp.types as types
from mcp.server import Server
from mcp.server.lowlevel.server import NotificationOptions
from mcp.server.models import InitializationOptions

from x_search_mcp.client import XClient
from x_search_mcp.config import cfg
from x_search_mcp.context import request_token
from x_search_mcp.security import sanitize

# ---------------------------------------------------------------------------
# Singletons
# ---------------------------------------------------------------------------

app = Server("x-search-mcp-server")

# Global client used by the stdio path only.
# Only created when X_BEARER_TOKEN is present in the environment so that the
# HTTP entry point can start without any env-level credentials.
_stdio_client: XClient | None = (
    XClient(bearer_token=cfg.bearer_token) if cfg.bearer_token else None
)


def _safe(data: Any) -> Any:
    return sanitize(data, cfg.secrets)


def _err(exc: Exception) -> str:
    return sanitize(str(exc), cfg.secrets)


# ---------------------------------------------------------------------------
# Tool definitions
# ---------------------------------------------------------------------------

TOOLS = [
    types.Tool(
        name="search_recent_tweets",
        description=(
            "Search tweets posted in the last 7 days using X's full query syntax. "
            "Supports operators like: #hashtag, @mention, from:username, to:username, "
            "lang:en, has:media, is:retweet, -is:retweet, url:example.com, AND/OR/NOT. "
            "Returns tweet text, author, timestamp, and engagement metrics."
        ),
        inputSchema={
            "type": "object",
            "required": ["query"],
            "properties": {
                "query": {
                    "type": "string",
                    "description": (
                        "X search query. Examples: "
                        "'#AI lang:en -is:retweet', "
                        "'from:elonmusk has:media', "
                        "'\"machine learning\" OR \"deep learning\" -is:retweet'"
                    ),
                },
                "max_results": {
                    "type": "integer",
                    "description": "Number of tweets to return (1–100, default 10)",
                    "minimum": 1,
                    "maximum": 100,
                },
                "sort_order": {
                    "type": "string",
                    "enum": ["recency", "relevancy"],
                    "description": "Sort by newest first (recency) or most relevant (relevancy)",
                },
                "start_time": {
                    "type": "string",
                    "description": "ISO 8601 start time, e.g. '2024-01-01T00:00:00Z'",
                },
                "end_time": {
                    "type": "string",
                    "description": "ISO 8601 end time",
                },
                "next_token": {
                    "type": "string",
                    "description": "Pagination token from a previous response's 'next_token' field",
                },
            },
        },
    ),
    types.Tool(
        name="search_all_tweets",
        description=(
            "Search the full X archive (all time, not just 7 days). "
            "Requires a Basic ($100/mo) or Academic tier API access. "
            "Same query syntax as search_recent_tweets."
        ),
        inputSchema={
            "type": "object",
            "required": ["query"],
            "properties": {
                "query": {"type": "string", "description": "X search query"},
                "max_results": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 500,
                    "description": "Number of tweets (1–500 for archive search)",
                },
                "sort_order": {
                    "type": "string",
                    "enum": ["recency", "relevancy"],
                },
                "start_time": {"type": "string", "description": "ISO 8601 start time"},
                "end_time": {"type": "string", "description": "ISO 8601 end time"},
                "next_token": {"type": "string", "description": "Pagination token"},
            },
        },
    ),
    types.Tool(
        name="get_user_profile",
        description=(
            "Look up a public X user profile by @username. "
            "Returns display name, bio, follower/following counts, verified status, and join date."
        ),
        inputSchema={
            "type": "object",
            "required": ["username"],
            "properties": {
                "username": {
                    "type": "string",
                    "description": "X username without the @, e.g. 'elonmusk'",
                },
            },
        },
    ),
    types.Tool(
        name="get_user_timeline",
        description=(
            "Fetch recent tweets posted by a specific user. "
            "Requires the user's numeric ID (use get_user_profile first to find it)."
        ),
        inputSchema={
            "type": "object",
            "required": ["user_id"],
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "Numeric X user ID",
                },
                "max_results": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                    "description": "Number of tweets to return (default 10)",
                },
                "exclude": {
                    "type": "string",
                    "description": "Comma-separated list to exclude: 'retweets', 'replies', or 'retweets,replies'",
                },
                "start_time": {"type": "string"},
                "end_time": {"type": "string"},
                "next_token": {"type": "string", "description": "Pagination token"},
            },
        },
    ),
    types.Tool(
        name="get_user_mentions",
        description="Fetch recent tweets that mention a specific user by their numeric ID.",
        inputSchema={
            "type": "object",
            "required": ["user_id"],
            "properties": {
                "user_id": {"type": "string", "description": "Numeric X user ID"},
                "max_results": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                },
                "next_token": {"type": "string"},
            },
        },
    ),
    types.Tool(
        name="get_tweet",
        description="Fetch a single tweet by its ID, including metrics and author info.",
        inputSchema={
            "type": "object",
            "required": ["tweet_id"],
            "properties": {
                "tweet_id": {
                    "type": "string",
                    "description": "Numeric tweet ID (the number at the end of an X URL)",
                },
            },
        },
    ),
    types.Tool(
        name="get_tweet_thread",
        description=(
            "Fetch all tweets in a thread using the conversation ID. "
            "The conversation_id is the same as the ID of the first tweet in the thread."
        ),
        inputSchema={
            "type": "object",
            "required": ["conversation_id"],
            "properties": {
                "conversation_id": {
                    "type": "string",
                    "description": "Conversation/thread ID (= ID of the root tweet)",
                },
                "max_results": {
                    "type": "integer",
                    "minimum": 1,
                    "maximum": 100,
                },
            },
        },
    ),
    types.Tool(
        name="get_tweet_counts",
        description=(
            "Get the volume of tweets matching a query over the last 7 days, "
            "broken down by hour or day. Useful for spotting trends and spikes."
        ),
        inputSchema={
            "type": "object",
            "required": ["query"],
            "properties": {
                "query": {"type": "string", "description": "X search query"},
                "granularity": {
                    "type": "string",
                    "enum": ["minute", "hour", "day"],
                    "description": "Time bucket size (default: hour)",
                },
                "start_time": {"type": "string"},
                "end_time": {"type": "string"},
            },
        },
    ),
]


# ---------------------------------------------------------------------------
# Handlers
# ---------------------------------------------------------------------------

@app.list_tools()
async def list_tools() -> list[types.Tool]:
    return TOOLS


@app.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[types.TextContent]:
    # HTTP path: bearer token injected per-request by the auth middleware.
    # Stdio path: fall back to the module-level client.
    token = request_token.get(None)
    if token:
        xclient = XClient(bearer_token=token)
    elif _stdio_client is not None:
        xclient = _stdio_client
    else:
        return [types.TextContent(type="text", text="Error: no bearer token available")]

    try:
        result = await _dispatch(name, arguments, xclient)
    except Exception as exc:  # noqa: BLE001
        return [types.TextContent(type="text", text=f"Error: {_err(exc)}")]
    return [types.TextContent(type="text", text=json.dumps(_safe(result), indent=2))]


async def _dispatch(name: str, args: dict[str, Any], xclient: XClient) -> Any:
    """Route a tool call to the appropriate XClient method."""
    max_results = args.get("max_results", cfg.default_max_results)

    if name == "search_recent_tweets":
        return await xclient.search_recent(
            query=args["query"],
            max_results=max_results,
            next_token=args.get("next_token"),
            sort_order=args.get("sort_order", "recency"),
            start_time=args.get("start_time"),
            end_time=args.get("end_time"),
        )

    if name == "search_all_tweets":
        return await xclient.search_all(
            query=args["query"],
            max_results=max_results,
            next_token=args.get("next_token"),
            sort_order=args.get("sort_order", "recency"),
            start_time=args.get("start_time"),
            end_time=args.get("end_time"),
        )

    if name == "get_user_profile":
        return await xclient.get_user_by_username(args["username"])

    if name == "get_user_timeline":
        return await xclient.get_user_timeline(
            user_id=args["user_id"],
            max_results=max_results,
            next_token=args.get("next_token"),
            exclude=args.get("exclude"),
            start_time=args.get("start_time"),
            end_time=args.get("end_time"),
        )

    if name == "get_user_mentions":
        return await xclient.get_user_mentions(
            user_id=args["user_id"],
            max_results=max_results,
            next_token=args.get("next_token"),
        )

    if name == "get_tweet":
        return await xclient.get_tweet(args["tweet_id"])

    if name == "get_tweet_thread":
        return await xclient.get_tweet_thread(
            conversation_id=args["conversation_id"],
            max_results=max_results,
        )

    if name == "get_tweet_counts":
        return await xclient.get_tweet_counts_recent(
            query=args["query"],
            granularity=args.get("granularity", "hour"),
            start_time=args.get("start_time"),
            end_time=args.get("end_time"),
        )

    raise ValueError(f"Unknown tool: {name}")


# ---------------------------------------------------------------------------
# Entry point (stdio)
# ---------------------------------------------------------------------------

async def _main() -> None:
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="x-search-mcp-server",
                server_version="0.1.0",
                capabilities=app.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                ),
            ),
        )


def run() -> None:
    import asyncio
    asyncio.run(_main())


if __name__ == "__main__":
    run()
