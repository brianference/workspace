"""Tests: Bearer Token must never appear in sanitized output."""

from x_search_mcp.security import sanitize

SECRET = "AAAAAAAAAAAAAAAAAAAAA_FAKE_BEARER_TOKEN_xyz123"
SECRETS = [SECRET]


def test_bearer_token_scrubbed_from_string():
    raw = f"Authorization: Bearer {SECRET}"
    assert SECRET not in sanitize(raw, SECRETS)


def test_bearer_token_scrubbed_from_dict():
    data = {"auth": f"Bearer {SECRET}", "count": 42}
    out = sanitize(data, SECRETS)
    assert SECRET not in str(out)
    assert out["count"] == 42


def test_bearer_token_scrubbed_from_nested():
    data = {"meta": {"token": SECRET, "next_token": "safe_pagination_cursor"}}
    out = sanitize(data, SECRETS)
    assert SECRET not in str(out)
    # pagination cursor should survive
    assert "safe_pagination_cursor" in str(out)


def test_bearer_header_pattern_scrubbed():
    raw = "Bearer eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.sig"
    out = sanitize(raw, [])
    assert "eyJhbGciOiJSUzI1NiJ9" not in out
    assert "[REDACTED]" in out


def test_api_key_query_param_scrubbed():
    url = "https://api.twitter.com/2/tweets?token=supersecret"
    out = sanitize(url, [])
    assert "supersecret" not in out


def test_safe_content_unchanged():
    tweet = "Just posted a tweet about #AI and machine learning!"
    assert sanitize(tweet, SECRETS) == tweet


def test_list_items_sanitized():
    items = [f"token={SECRET}", "safe text", 99]
    out = sanitize(items, SECRETS)
    assert SECRET not in str(out)
    assert out[1] == "safe text"
    assert out[2] == 99


def test_non_string_passthrough():
    assert sanitize(True, SECRETS) is True
    assert sanitize(None, SECRETS) is None
    assert sanitize(3.14, SECRETS) == 3.14
