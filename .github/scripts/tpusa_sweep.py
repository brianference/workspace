"""TPUSA Monitor sweep script -- runs via GitHub Actions every 6 hours."""

import json
import os
import sys
import urllib.request
from datetime import datetime, timedelta, timezone

MCP_URL = os.environ["MCP_URL"]
ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")


def mcp_call(method, params, call_id=1):
    """Call the Railway MCP server and return the result data."""
    payload = json.dumps({
        "jsonrpc": "2.0",
        "method": method,
        "params": params,
        "id": call_id,
    }).encode()
    req = urllib.request.Request(
        MCP_URL,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json, text/event-stream",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        for line in resp:
            line = line.decode().strip()
            if line.startswith("data:"):
                d = json.loads(line[5:])
                if "result" in d:
                    return json.loads(d["result"]["content"][0]["text"])
                if "error" in d:
                    raise RuntimeError(f"MCP error: {d['error']}")
    raise RuntimeError("No result from MCP server")


def search_tweets():
    """Run all three searches and return deduplicated tweet list."""
    start_time = (datetime.now(timezone.utc) - timedelta(hours=12)).strftime(
        "%Y-%m-%dT%H:%M:%SZ"
    )
    print(f"Searching from {start_time}")

    queries = [
        "turning point usa OR TPUSA",
        "erika kirk",
        '"charlie kirk" murder OR trial',
    ]

    all_tweets = []
    for query in queries:
        print(f"Searching: {query}")
        result = mcp_call("tools/call", {
            "name": "search_recent_tweets",
            "arguments": {"query": query, "max_results": 20, "start_time": start_time},
        })
        tweets = result.get("data", [])
        users = {u["id"]: u for u in result.get("includes", {}).get("users", [])}
        for tweet in tweets:
            author = users.get(tweet.get("author_id"), {})
            all_tweets.append({
                "id": tweet["id"],
                "text": tweet["text"],
                "author": "@" + author.get("username", "unknown"),
                "followers": author.get("public_metrics", {}).get("followers_count", 0),
                "impressions": tweet.get("public_metrics", {}).get("impression_count", 0),
                "created_at": tweet.get("created_at", ""),
            })
        print(f"  Got {len(tweets)} tweets")

    # Deduplicate
    seen = set()
    unique = []
    for tweet in all_tweets:
        if tweet["id"] not in seen:
            seen.add(tweet["id"])
            unique.append(tweet)
    print(f"Total unique: {len(unique)}")
    return unique


def analyze_with_claude(tweets):
    """Use Claude API to intelligently filter and categorize tweets."""
    tweets_json = json.dumps(tweets, indent=2)
    prompt = (
        "You are a TPUSA monitoring analyst. Review these tweets and flag only those "
        "that are newsworthy and directly relevant to:\n"
        "- TPUSA org news or staff acting in TPUSA capacity\n"
        "- Erika Kirk\n"
        "- Charlie Kirk murder investigation or trial\n"
        "- Tyler Bowyer legal threats\n"
        "- nihiloX TPUSA posts\n\n"
        "EXCLUDE: Trump/MAGA general, Swalwell, ranked choice voting, foreign policy, "
        "AZ state benefits/policy.\n"
        "THRESHOLD: Only flag if author has >25K followers OR high impressions.\n\n"
        'For each flagged tweet return a JSON array with objects:\n'
        '{"handle": "@username", "excerpt": "tweet text", '
        '"category": "legal|mention|org|flag", "tags": ["tag1"], '
        '"source_url": "https://x.com/USERNAME/status/ID"}\n\n'
        f"Tweets:\n{tweets_json}\n\n"
        "Return ONLY the JSON array, no other text. If nothing is newsworthy return []."
    )

    api_payload = json.dumps({
        "model": "claude-sonnet-4-6",
        "max_tokens": 2000,
        "messages": [{"role": "user", "content": prompt}],
    }).encode()

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=api_payload,
        headers={
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        analysis = json.loads(resp.read())

    raw_text = analysis["content"][0]["text"].strip()
    if raw_text.startswith("```"):
        raw_text = "\n".join(raw_text.split("\n")[1:])
    if raw_text.endswith("```"):
        raw_text = "\n".join(raw_text.split("\n")[:-1])
    return json.loads(raw_text.strip())


def analyze_simple(tweets):
    """Keyword-based filter fallback when no Anthropic API key."""
    keywords = ["tpusa", "turning point", "charlie kirk", "erika kirk",
                "tyler bowyer", "candace owens"]
    flagged = []
    for tweet in tweets:
        if tweet["followers"] >= 25000 and any(k in tweet["text"].lower() for k in keywords):
            flagged.append({
                "handle": tweet["author"],
                "excerpt": tweet["text"][:500],
                "category": "mention",
                "tags": ["tpusa"],
                "source_url": f"https://x.com/i/web/status/{tweet['id']}",
            })
    return flagged


def main():
    tweets = search_tweets()

    if ANTHROPIC_API_KEY:
        print("Analyzing with Claude...")
        flagged = analyze_with_claude(tweets)
        summary = f"Claude-analyzed sweep: {len(tweets)} tweets reviewed, {len(flagged)} flagged."
        print(f"Claude flagged {len(flagged)} posts")
    else:
        print("No ANTHROPIC_API_KEY -- using keyword filter")
        flagged = analyze_simple(tweets)
        summary = f"Keyword-filtered sweep: {len(tweets)} tweets reviewed, {len(flagged)} flagged."
        print(f"Keyword filter flagged {len(flagged)} posts")

    legal_count = sum(1 for f in flagged if f.get("category") == "legal")
    mention_count = sum(1 for f in flagged if f.get("category") == "mention")
    org_count = sum(1 for f in flagged if f.get("category") == "org")

    sweep = mcp_call("tools/call", {
        "name": "write_sweep",
        "arguments": {
            "flag_count": len(flagged),
            "legal_count": legal_count,
            "mention_count": mention_count,
            "org_count": org_count,
            "summary": summary,
        },
    }, call_id=10)
    sweep_id = sweep["sweep_id"]
    print(f"Sweep written: {sweep_id}")

    for i, post in enumerate(flagged):
        mcp_call("tools/call", {
            "name": "write_flagged_post",
            "arguments": {
                "sweep_id": sweep_id,
                "handle": post["handle"],
                "excerpt": post["excerpt"],
                "category": post.get("category", "flag"),
                "tags": post.get("tags", ["tpusa"]),
                "source_url": post["source_url"],
            },
        }, call_id=20 + i)

    print(f"Wrote {len(flagged)} flagged posts")
    print(f"SWEEP COMPLETE - sweep_id={sweep_id} flag_count={len(flagged)}")


if __name__ == "__main__":
    main()
