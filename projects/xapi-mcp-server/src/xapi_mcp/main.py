"""xAPI MCP Server entry point.

All tool responses are passed through the security sanitizer before
being returned, so credentials can never leak into the conversation.
"""

from __future__ import annotations

import json
import traceback
import uuid
from typing import Any

import mcp.server.stdio
import mcp.types as types
from mcp.server import Server
from mcp.server.models import InitializationOptions

from xapi_mcp.config import cfg
from xapi_mcp.lrs import get_lrs
from xapi_mcp.security import sanitize
from xapi_mcp.xapi.models import (
    Activity,
    ActivityDefinition,
    Agent,
    Context,
    Result,
    Score,
    Statement,
    StatementsQuery,
    Verb,
)

# ---------------------------------------------------------------------------
# LRS singleton
# ---------------------------------------------------------------------------

def _build_lrs():
    plugin = cfg.lrs_plugin
    if plugin == "generic":
        return get_lrs(
            "generic",
            endpoint=cfg.lrs_endpoint,
            username=cfg.lrs_username,
            password=cfg.lrs_password,
            timeout=cfg.lrs_timeout,
        )
    if plugin == "ralph":
        return get_lrs(
            "ralph",
            endpoint=cfg.ralph_endpoint,
            client_id=cfg.ralph_client_id,
            client_secret=cfg.ralph_client_secret,
            timeout=cfg.lrs_timeout,
        )
    if plugin == "veracity":
        return get_lrs(
            "veracity",
            endpoint=cfg.veracity_endpoint,
            key=cfg.veracity_key,
            secret=cfg.veracity_secret,
            timeout=cfg.lrs_timeout,
        )
    raise ValueError(f"Unsupported plugin: {plugin}")


lrs = _build_lrs()

# ---------------------------------------------------------------------------
# MCP server
# ---------------------------------------------------------------------------

app = Server("xapi-mcp-server")


def _safe(data: Any) -> Any:
    """Sanitize output – strip any secret values."""
    return sanitize(data, cfg.secrets)


def _error_text(exc: Exception) -> str:
    """Return a safe error message, never containing credentials."""
    raw = str(exc)
    return sanitize(raw, cfg.secrets)


# ---------------------------------------------------------------------------
# Tool definitions
# ---------------------------------------------------------------------------

TOOLS = [
    types.Tool(
        name="record_statement",
        description=(
            "Record a single xAPI statement in the configured Learning Record Store (LRS). "
            "Use this to capture a learning event such as a user completing, passing, "
            "or attempting an activity."
        ),
        inputSchema={
            "type": "object",
            "required": ["actor_mbox", "verb_id", "verb_display", "activity_id"],
            "properties": {
                "actor_mbox": {
                    "type": "string",
                    "description": "Learner email as mailto: IRI, e.g. 'mailto:alice@example.com'",
                },
                "actor_name": {
                    "type": "string",
                    "description": "Display name of the learner (optional)",
                },
                "verb_id": {
                    "type": "string",
                    "description": "xAPI verb IRI, e.g. 'http://adlnet.gov/expapi/verbs/completed'",
                },
                "verb_display": {
                    "type": "string",
                    "description": "Human-readable verb label in English, e.g. 'completed'",
                },
                "activity_id": {
                    "type": "string",
                    "description": "Activity IRI, e.g. 'https://example.com/course/intro'",
                },
                "activity_name": {
                    "type": "string",
                    "description": "Activity display name (optional)",
                },
                "activity_description": {
                    "type": "string",
                    "description": "Activity description (optional)",
                },
                "result_success": {
                    "type": "boolean",
                    "description": "Whether the learner succeeded (optional)",
                },
                "result_completion": {
                    "type": "boolean",
                    "description": "Whether the learner completed the activity (optional)",
                },
                "result_score_scaled": {
                    "type": "number",
                    "description": "Score between -1.0 and 1.0 (optional)",
                    "minimum": -1.0,
                    "maximum": 1.0,
                },
                "result_score_raw": {
                    "type": "number",
                    "description": "Raw score value (optional)",
                },
                "result_score_min": {
                    "type": "number",
                    "description": "Minimum possible score (optional)",
                },
                "result_score_max": {
                    "type": "number",
                    "description": "Maximum possible score (optional)",
                },
                "result_response": {
                    "type": "string",
                    "description": "Learner's response string (optional)",
                },
                "result_duration": {
                    "type": "string",
                    "description": "ISO 8601 duration, e.g. 'PT1H30M' (optional)",
                },
                "context_registration": {
                    "type": "string",
                    "description": "UUID for grouping related statements (optional)",
                },
                "context_platform": {
                    "type": "string",
                    "description": "Platform name, e.g. 'Canvas LMS' (optional)",
                },
                "timestamp": {
                    "type": "string",
                    "description": "ISO 8601 datetime when the event occurred (optional)",
                },
                "statement_id": {
                    "type": "string",
                    "description": "UUID for this statement; auto-generated if omitted",
                },
            },
        },
    ),
    types.Tool(
        name="get_statements",
        description=(
            "Query xAPI statements from the LRS. "
            "Filter by verb, activity, actor, date range, or registration UUID. "
            "Returns a StatementResult with a list of statements and optional 'more' cursor URL."
        ),
        inputSchema={
            "type": "object",
            "properties": {
                "verb": {
                    "type": "string",
                    "description": "Filter by verb IRI",
                },
                "activity": {
                    "type": "string",
                    "description": "Filter by activity IRI",
                },
                "actor_mbox": {
                    "type": "string",
                    "description": "Filter by actor mailto IRI",
                },
                "registration": {
                    "type": "string",
                    "description": "Filter by registration UUID",
                },
                "since": {
                    "type": "string",
                    "description": "ISO 8601 timestamp lower bound (inclusive)",
                },
                "until": {
                    "type": "string",
                    "description": "ISO 8601 timestamp upper bound (inclusive)",
                },
                "limit": {
                    "type": "integer",
                    "description": "Maximum number of statements to return (1–1000)",
                    "minimum": 1,
                    "maximum": 1000,
                },
                "ascending": {
                    "type": "boolean",
                    "description": "Return oldest first if true (default: false = newest first)",
                },
                "related_activities": {
                    "type": "boolean",
                    "description": "Include statements where activity appears in context",
                },
                "related_agents": {
                    "type": "boolean",
                    "description": "Include statements where agent appears in context or result",
                },
            },
        },
    ),
    types.Tool(
        name="get_statement",
        description="Retrieve a single xAPI statement by its UUID.",
        inputSchema={
            "type": "object",
            "required": ["statement_id"],
            "properties": {
                "statement_id": {
                    "type": "string",
                    "description": "UUID of the statement to retrieve",
                },
            },
        },
    ),
    types.Tool(
        name="get_activity",
        description="Retrieve the definition of an xAPI activity by its IRI.",
        inputSchema={
            "type": "object",
            "required": ["activity_id"],
            "properties": {
                "activity_id": {
                    "type": "string",
                    "description": "IRI of the activity",
                },
            },
        },
    ),
    types.Tool(
        name="get_activity_state",
        description=(
            "Retrieve a state document associated with a specific activity and agent. "
            "Useful for fetching learner progress or preference data."
        ),
        inputSchema={
            "type": "object",
            "required": ["activity_id", "actor_mbox", "state_id"],
            "properties": {
                "activity_id": {
                    "type": "string",
                    "description": "Activity IRI",
                },
                "actor_mbox": {
                    "type": "string",
                    "description": "Actor mailto IRI",
                },
                "state_id": {
                    "type": "string",
                    "description": "State document identifier",
                },
                "registration": {
                    "type": "string",
                    "description": "Optional registration UUID",
                },
            },
        },
    ),
    types.Tool(
        name="put_activity_state",
        description=(
            "Store a state document for a specific activity and agent. "
            "Use this to persist learner progress, bookmarks, or preferences."
        ),
        inputSchema={
            "type": "object",
            "required": ["activity_id", "actor_mbox", "state_id", "document"],
            "properties": {
                "activity_id": {
                    "type": "string",
                    "description": "Activity IRI",
                },
                "actor_mbox": {
                    "type": "string",
                    "description": "Actor mailto IRI",
                },
                "state_id": {
                    "type": "string",
                    "description": "State document identifier",
                },
                "document": {
                    "type": "object",
                    "description": "JSON document to store as state",
                },
                "registration": {
                    "type": "string",
                    "description": "Optional registration UUID",
                },
            },
        },
    ),
    types.Tool(
        name="health_check",
        description=(
            "Check connectivity to the configured LRS. "
            "Returns status 'ok' or 'error' — never exposes credentials."
        ),
        inputSchema={
            "type": "object",
            "properties": {},
        },
    ),
    types.Tool(
        name="lrs_info",
        description=(
            "Return non-sensitive information about the current LRS configuration: "
            "plugin name and whether an endpoint has been set. "
            "Credentials are never included."
        ),
        inputSchema={
            "type": "object",
            "properties": {},
        },
    ),
]


# ---------------------------------------------------------------------------
# Tool handlers
# ---------------------------------------------------------------------------

@app.list_tools()
async def list_tools() -> list[types.Tool]:
    return TOOLS


@app.call_tool()
async def call_tool(name: str, arguments: dict[str, Any]) -> list[types.TextContent]:
    try:
        result = await _dispatch(name, arguments)
    except Exception as exc:  # noqa: BLE001
        safe_msg = _error_text(exc)
        return [types.TextContent(type="text", text=f"Error: {safe_msg}")]

    safe_result = _safe(result)
    return [types.TextContent(type="text", text=json.dumps(safe_result, indent=2))]


async def _dispatch(name: str, args: dict[str, Any]) -> Any:
    if name == "record_statement":
        return await _record_statement(args)
    if name == "get_statements":
        return await _get_statements(args)
    if name == "get_statement":
        return await lrs.get_statement(args["statement_id"])
    if name == "get_activity":
        return await lrs.get_activity(args["activity_id"])
    if name == "get_activity_state":
        return await lrs.get_state(
            activity_id=args["activity_id"],
            agent=json.dumps({"objectType": "Agent", "mbox": args["actor_mbox"]}),
            state_id=args["state_id"],
            registration=args.get("registration"),
        )
    if name == "put_activity_state":
        await lrs.put_state(
            activity_id=args["activity_id"],
            agent=json.dumps({"objectType": "Agent", "mbox": args["actor_mbox"]}),
            state_id=args["state_id"],
            document=args["document"],
            registration=args.get("registration"),
        )
        return {"status": "ok"}
    if name == "health_check":
        return await lrs.health_check()
    if name == "lrs_info":
        return _lrs_info()
    raise ValueError(f"Unknown tool: {name}")


# ---------------------------------------------------------------------------
# Handler helpers
# ---------------------------------------------------------------------------

async def _record_statement(args: dict[str, Any]) -> dict[str, Any]:
    actor = Agent(
        mbox=args["actor_mbox"],
        name=args.get("actor_name"),
    )

    verb = Verb(
        id=args["verb_id"],
        display={"en": args["verb_display"]},
    )

    definition: ActivityDefinition | None = None
    if args.get("activity_name") or args.get("activity_description"):
        definition = ActivityDefinition(
            name={"en": args["activity_name"]} if args.get("activity_name") else None,
            description={"en": args["activity_description"]} if args.get("activity_description") else None,
        )

    activity = Activity(id=args["activity_id"], definition=definition)

    result: Result | None = None
    has_score = any(
        args.get(k) is not None
        for k in ("result_score_scaled", "result_score_raw", "result_score_min", "result_score_max")
    )
    if any([
        args.get("result_success") is not None,
        args.get("result_completion") is not None,
        args.get("result_response"),
        args.get("result_duration"),
        has_score,
    ]):
        score = Score(
            scaled=args.get("result_score_scaled"),
            raw=args.get("result_score_raw"),
            min=args.get("result_score_min"),
            max=args.get("result_score_max"),
        ) if has_score else None
        result = Result(
            score=score,
            success=args.get("result_success"),
            completion=args.get("result_completion"),
            response=args.get("result_response"),
            duration=args.get("result_duration"),
        )

    context: Context | None = None
    if args.get("context_registration") or args.get("context_platform"):
        context = Context(
            registration=args.get("context_registration"),
            platform=args.get("context_platform"),
        )

    statement = Statement(
        id=args.get("statement_id") or str(uuid.uuid4()),
        actor=actor,
        verb=verb,
        object=activity,
        result=result,
        context=context,
        timestamp=args.get("timestamp"),
    )

    statement_id = await lrs.put_statement(statement.model_dump_xapi())
    return {"statement_id": statement_id, "status": "recorded"}


async def _get_statements(args: dict[str, Any]) -> dict[str, Any]:
    params: dict[str, str] = {}

    if args.get("verb"):
        params["verb"] = args["verb"]
    if args.get("activity"):
        params["activity"] = args["activity"]
    if args.get("actor_mbox"):
        params["agent"] = json.dumps({"objectType": "Agent", "mbox": args["actor_mbox"]})
    if args.get("registration"):
        params["registration"] = args["registration"]
    if args.get("since"):
        params["since"] = args["since"]
    if args.get("until"):
        params["until"] = args["until"]
    if args.get("limit") is not None:
        params["limit"] = str(args["limit"])
    if args.get("ascending") is not None:
        params["ascending"] = str(args["ascending"]).lower()
    if args.get("related_activities") is not None:
        params["related_activities"] = str(args["related_activities"]).lower()
    if args.get("related_agents") is not None:
        params["related_agents"] = str(args["related_agents"]).lower()

    return await lrs.get_statements(params)


def _lrs_info() -> dict[str, Any]:
    """Return only non-sensitive config info."""
    plugin = cfg.lrs_plugin
    endpoint_set: bool
    if plugin == "generic":
        endpoint_set = bool(cfg.lrs_endpoint)
    elif plugin == "ralph":
        endpoint_set = bool(cfg.ralph_endpoint)
    else:
        endpoint_set = bool(cfg.veracity_endpoint)

    return {
        "plugin": plugin,
        "endpoint_configured": endpoint_set,
        "xapi_version": "1.0.3",
    }


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------

async def _main() -> None:
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await app.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="xapi-mcp-server",
                server_version="0.1.0",
                capabilities=app.get_capabilities(
                    notification_options=None,
                    experimental_capabilities={},
                ),
            ),
        )


def run() -> None:
    import asyncio
    asyncio.run(_main())


if __name__ == "__main__":
    run()
