"""Abstract base class for all LRS plugins."""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any


class BaseLRS(ABC):
    """All LRS plugins must implement this interface."""

    @abstractmethod
    async def put_statement(self, statement: dict[str, Any]) -> str:
        """Store a single xAPI statement.  Returns the statement UUID."""

    @abstractmethod
    async def post_statements(self, statements: list[dict[str, Any]]) -> list[str]:
        """Store one or more xAPI statements.  Returns list of UUIDs."""

    @abstractmethod
    async def get_statements(self, params: dict[str, str]) -> dict[str, Any]:
        """Query statements.  Returns xAPI StatementResult object."""

    @abstractmethod
    async def get_statement(self, statement_id: str) -> dict[str, Any]:
        """Fetch a single statement by UUID."""

    @abstractmethod
    async def get_activity(self, activity_id: str) -> dict[str, Any]:
        """Fetch an activity definition by IRI."""

    @abstractmethod
    async def get_state(
        self,
        activity_id: str,
        agent: str,
        state_id: str,
        registration: str | None = None,
    ) -> dict[str, Any]:
        """Fetch a state document."""

    @abstractmethod
    async def put_state(
        self,
        activity_id: str,
        agent: str,
        state_id: str,
        document: dict[str, Any],
        registration: str | None = None,
    ) -> None:
        """Store a state document."""

    @abstractmethod
    async def health_check(self) -> dict[str, Any]:
        """Return a status dict; must NOT include any credential values."""
