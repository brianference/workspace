"""Pydantic models for xAPI 1.0.3 objects.

Only the fields most commonly used by AI agents are modelled here.
The full spec lives at https://github.com/adlnet/xAPI-Spec.
"""

from __future__ import annotations

import uuid
from typing import Any, Literal

from pydantic import BaseModel, Field, field_validator, model_validator


# ---------------------------------------------------------------------------
# Actor
# ---------------------------------------------------------------------------

class Account(BaseModel):
    homePage: str
    name: str


class Agent(BaseModel):
    objectType: Literal["Agent"] = "Agent"
    name: str | None = None
    mbox: str | None = None           # mailto:address
    mbox_sha1sum: str | None = None
    openid: str | None = None
    account: Account | None = None

    @model_validator(mode="after")
    def _require_ifi(self) -> "Agent":
        if not any([self.mbox, self.mbox_sha1sum, self.openid, self.account]):
            raise ValueError("Agent must have at least one Inverse Functional Identifier")
        return self


class Group(BaseModel):
    objectType: Literal["Group"] = "Group"
    name: str | None = None
    mbox: str | None = None
    mbox_sha1sum: str | None = None
    openid: str | None = None
    account: Account | None = None
    member: list[Agent] = Field(default_factory=list)


Actor = Agent | Group


# ---------------------------------------------------------------------------
# Verb
# ---------------------------------------------------------------------------

class LanguageMap(BaseModel):
    model_config = {"extra": "allow"}

    # Allow arbitrary language-tag keys, e.g. {"en-US": "completed"}
    def __getitem__(self, key: str) -> str:
        return self.__pydantic_extra__[key]  # type: ignore[index]


class Verb(BaseModel):
    id: str   # IRI
    display: dict[str, str] | None = None


# ---------------------------------------------------------------------------
# Object (Activity is the most common)
# ---------------------------------------------------------------------------

class ActivityDefinition(BaseModel):
    name: dict[str, str] | None = None
    description: dict[str, str] | None = None
    type: str | None = None           # IRI
    moreInfo: str | None = None
    extensions: dict[str, Any] | None = None


class Activity(BaseModel):
    objectType: Literal["Activity"] = "Activity"
    id: str   # IRI
    definition: ActivityDefinition | None = None


# ---------------------------------------------------------------------------
# Result
# ---------------------------------------------------------------------------

class Score(BaseModel):
    scaled: float | None = Field(None, ge=-1.0, le=1.0)
    raw: float | None = None
    min: float | None = None
    max: float | None = None


class Result(BaseModel):
    score: Score | None = None
    success: bool | None = None
    completion: bool | None = None
    response: str | None = None
    duration: str | None = None   # ISO 8601 duration
    extensions: dict[str, Any] | None = None


# ---------------------------------------------------------------------------
# Context
# ---------------------------------------------------------------------------

class ContextActivities(BaseModel):
    parent: list[Activity] | None = None
    grouping: list[Activity] | None = None
    category: list[Activity] | None = None
    other: list[Activity] | None = None


class Context(BaseModel):
    registration: str | None = None
    instructor: Agent | None = None
    team: Group | None = None
    contextActivities: ContextActivities | None = None
    revision: str | None = None
    platform: str | None = None
    language: str | None = None
    extensions: dict[str, Any] | None = None


# ---------------------------------------------------------------------------
# Statement
# ---------------------------------------------------------------------------

class Statement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    actor: Agent | Group
    verb: Verb
    object: Activity                   # simplified: only Activity objects
    result: Result | None = None
    context: Context | None = None
    timestamp: str | None = None       # ISO 8601
    stored: str | None = None          # set by LRS
    authority: Agent | None = None     # set by LRS

    @field_validator("id")
    @classmethod
    def _validate_uuid(cls, v: str) -> str:
        uuid.UUID(v)  # raises ValueError if not a valid UUID
        return v

    def model_dump_xapi(self) -> dict[str, Any]:
        """Serialise to xAPI-spec dict, omitting None values."""
        return self.model_dump(exclude_none=True, mode="json")


# ---------------------------------------------------------------------------
# Query parameters for GET /statements
# ---------------------------------------------------------------------------

class StatementsQuery(BaseModel):
    statementId: str | None = None
    voidedStatementId: str | None = None
    agent: str | None = None           # JSON-encoded Agent/Group
    verb: str | None = None            # IRI
    activity: str | None = None        # IRI
    registration: str | None = None    # UUID
    related_activities: bool | None = None
    related_agents: bool | None = None
    since: str | None = None           # ISO 8601 timestamp
    until: str | None = None           # ISO 8601 timestamp
    limit: int | None = Field(None, ge=1, le=1000)
    format: Literal["ids", "exact", "canonical"] | None = None
    attachments: bool | None = None
    ascending: bool | None = None

    def to_query_params(self) -> dict[str, str]:
        """Convert to the string query params expected by xAPI endpoints."""
        params: dict[str, str] = {}
        for name, value in self.model_dump(exclude_none=True).items():
            params[name] = str(value).lower() if isinstance(value, bool) else str(value)
        return params
