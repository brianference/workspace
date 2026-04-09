"""Tests for xAPI Pydantic models."""

import pytest
from pydantic import ValidationError

from xapi_mcp.xapi.models import (
    Activity,
    ActivityDefinition,
    Agent,
    Group,
    Result,
    Score,
    Statement,
    StatementsQuery,
    Verb,
)


class TestAgent:
    def test_valid_mbox(self):
        a = Agent(mbox="mailto:alice@example.com")
        assert a.mbox == "mailto:alice@example.com"

    def test_valid_account(self):
        from xapi_mcp.xapi.models import Account
        a = Agent(account=Account(homePage="https://example.com", name="alice"))
        assert a.account.name == "alice"

    def test_missing_ifi_raises(self):
        with pytest.raises(ValidationError):
            Agent()  # no IFI


class TestStatement:
    def _minimal(self, **kwargs) -> Statement:
        return Statement(
            actor=Agent(mbox="mailto:alice@example.com"),
            verb=Verb(id="http://adlnet.gov/expapi/verbs/completed", display={"en": "completed"}),
            object=Activity(id="https://example.com/course/intro"),
            **kwargs,
        )

    def test_auto_uuid(self):
        s = self._minimal()
        import uuid
        uuid.UUID(s.id)  # should not raise

    def test_explicit_uuid(self):
        s = self._minimal(id="00000000-0000-0000-0000-000000000001")
        assert s.id == "00000000-0000-0000-0000-000000000001"

    def test_invalid_uuid_raises(self):
        with pytest.raises(ValidationError):
            self._minimal(id="not-a-uuid")

    def test_model_dump_xapi_omits_none(self):
        s = self._minimal()
        data = s.model_dump_xapi()
        assert "result" not in data
        assert "context" not in data
        assert data["verb"]["id"] == "http://adlnet.gov/expapi/verbs/completed"


class TestScore:
    def test_scaled_bounds(self):
        Score(scaled=1.0)
        Score(scaled=-1.0)
        with pytest.raises(ValidationError):
            Score(scaled=1.1)


class TestStatementsQuery:
    def test_to_query_params_booleans(self):
        q = StatementsQuery(ascending=True, related_activities=False)
        params = q.to_query_params()
        assert params["ascending"] == "true"
        assert params["related_activities"] == "false"

    def test_limit_bounds(self):
        StatementsQuery(limit=1)
        StatementsQuery(limit=1000)
        with pytest.raises(ValidationError):
            StatementsQuery(limit=0)
        with pytest.raises(ValidationError):
            StatementsQuery(limit=1001)
