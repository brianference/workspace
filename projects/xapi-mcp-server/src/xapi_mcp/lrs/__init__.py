"""LRS plugin registry."""

from __future__ import annotations

from xapi_mcp.lrs.base import BaseLRS
from xapi_mcp.lrs.generic import GenericLRS
from xapi_mcp.lrs.ralph import RalphLRS
from xapi_mcp.lrs.veracity import VeracityLRS


def get_lrs(plugin: str, **kwargs) -> BaseLRS:
    """Return an LRS instance for the named plugin."""
    registry: dict[str, type[BaseLRS]] = {
        "generic": GenericLRS,
        "ralph": RalphLRS,
        "veracity": VeracityLRS,
    }
    cls = registry.get(plugin.lower())
    if cls is None:
        raise ValueError(
            f"Unknown LRS plugin '{plugin}'. "
            f"Available: {', '.join(registry)}"
        )
    return cls(**kwargs)


__all__ = ["BaseLRS", "GenericLRS", "RalphLRS", "VeracityLRS", "get_lrs"]
