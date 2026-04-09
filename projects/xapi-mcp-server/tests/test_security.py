"""Tests for the secret-sanitization layer."""

import pytest

from xapi_mcp.security import sanitize, sanitize_dict, sanitize_list, sanitize_string

SECRETS = ["s3cr3t", "p@ssw0rd", "myapikey"]


class TestSanitizeString:
    def test_exact_secret_replaced(self):
        result = sanitize_string("The token is s3cr3t", SECRETS)
        assert "s3cr3t" not in result
        assert "[REDACTED]" in result

    def test_multiple_secrets_replaced(self):
        result = sanitize_string("user=p@ssw0rd key=myapikey", SECRETS)
        assert "p@ssw0rd" not in result
        assert "myapikey" not in result

    def test_basic_auth_url_redacted(self):
        url = "https://user:p@ssw0rd@lrs.example.com/xapi"
        result = sanitize_string(url, [])
        assert "p@ssw0rd" not in result
        assert "[REDACTED]" in result

    def test_bearer_token_redacted(self):
        header = "Authorization: Bearer eyJhbGciOiJSUzI1NiJ9.abc.def"
        result = sanitize_string(header, [])
        assert "eyJhbGciOiJSUzI1NiJ9" not in result
        assert "[REDACTED]" in result

    def test_api_key_query_param_redacted(self):
        url = "https://lrs.example.com?api_key=verysecretvalue"
        result = sanitize_string(url, [])
        assert "verysecretvalue" not in result

    def test_safe_string_unchanged(self):
        safe = "Learning completed successfully"
        assert sanitize_string(safe, SECRETS) == safe

    def test_empty_secret_ignored(self):
        # Empty strings should not corrupt output
        result = sanitize_string("hello world", [""])
        assert result == "hello world"


class TestSanitizeDict:
    def test_nested_secret_replaced(self):
        data = {"user": "alice", "token": "s3cr3t", "nested": {"key": "s3cr3t"}}
        result = sanitize_dict(data, SECRETS)
        assert result["token"] == "[REDACTED]"
        assert result["nested"]["key"] == "[REDACTED]"
        assert result["user"] == "alice"

    def test_non_string_values_preserved(self):
        data = {"count": 42, "flag": True, "ratio": 0.9}
        result = sanitize_dict(data, SECRETS)
        assert result == data


class TestSanitizeList:
    def test_list_items_sanitized(self):
        items = ["safe item", "contains s3cr3t here", 123]
        result = sanitize_list(items, SECRETS)
        assert "s3cr3t" not in result[1]
        assert result[0] == "safe item"
        assert result[2] == 123


class TestSanitizeTopLevel:
    def test_string(self):
        assert "s3cr3t" not in sanitize("token: s3cr3t", SECRETS)

    def test_dict(self):
        out = sanitize({"k": "s3cr3t"}, SECRETS)
        assert out["k"] == "[REDACTED]"

    def test_list(self):
        out = sanitize(["s3cr3t", "safe"], SECRETS)
        assert "[REDACTED]" in out[0]
        assert out[1] == "safe"

    def test_passthrough_for_other_types(self):
        assert sanitize(42, SECRETS) == 42
        assert sanitize(None, SECRETS) is None
