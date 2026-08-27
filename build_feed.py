#!/usr/bin/env python3
"""
build_feed.py — maintain the static newsletter feed.json for Hey! Dumb Dumb.

The Room Rummy Discord bot polls NEWSLETTER_FEED_URL = <site>/feed.json every
5 min. This script writes that file. You then publish it: commit/push to your
Lovable project (it serves public/ at the site root) OR drop feed.json into the
site's public folder and redeploy.

Usage:
    python build_feed.py --add \
        --topic politics \
        --title "SENATE STAYS IN SESSION THROUGH THE WEEKEND" \
        --url "https://the-dumb-dumb-wire.lovable.app/story/senate" \
        --summary "Raw links, no commentary." \
        --right "Right Daily|https://..." --neutral "Wire Service|https://..." --left "Left Daily|https://..."

    python build_feed.py --list            # show current items
    python build_feed.py --remove <id>     # drop a story
"""
import argparse
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
FEED = HERE / "feed.json"
TOPICS = {"politics", "culture", "op-ed"}
SITE = "https://the-dumb-dumb-wire.lovable.app"


def load():
    if FEED.exists():
        try:
            return json.loads(FEED.read_text())
        except Exception:
            return {"generated_at": "", "site": SITE, "items": []}
    return {"generated_at": "", "site": SITE, "items": []}


def save(feed):
    from datetime import datetime, timezone
    feed["generated_at"] = datetime.now(timezone.utc).isoformat()
    FEED.write_text(json.dumps(feed, indent=2) + "\n")


def main():
    p = argparse.ArgumentParser()
    g = p.add_mutually_exclusive_group(required=True)
    g.add_argument("--add", action="store_true")
    g.add_argument("--list", action="store_true")
    g.add_argument("--remove", metavar="ID")
    p.add_argument("--topic", choices=sorted(TOPICS))
    p.add_argument("--title")
    p.add_argument("--url")
    p.add_argument("--summary", default="")
    p.add_argument("--right")
    p.add_argument("--neutral")
    p.add_argument("--left")
    args = p.parse_args()

    feed = load()

    if args.list:
        for it in feed["items"]:
            print(f"  [{it['topic']}] {it['id']}  {it['title']}")
        return

    if args.remove:
        feed["items"] = [i for i in feed["items"] if i["id"] != args.remove]
        save(feed)
        print("removed", args.remove)
        return

    # --add
    if not (args.topic and args.title and args.url):
        sys.exit("--add requires --topic, --title, --url")
    sid = args.url.rstrip("/").rsplit("/", 1)[-1]
    takes = {}
    for side, val in (("right", args.right), ("neutral", args.neutral), ("left", args.left)):
        if val:
            src, _, url = val.partition("|")
            takes[side] = {"source": src.strip(), "url": url.strip()}
    item = {
        "id": sid,
        "topic": args.topic,
        "title": args.title,
        "url": args.url,
        "summary": args.summary,
        "published_at": feed.get("generated_at") or "",
        "takes": takes,
    }
    feed["items"] = [i for i in feed["items"] if i["id"] != sid]  # dedupe by id
    feed["items"].insert(0, item)  # newest first
    save(feed)
    print("added:", sid, f"({len(feed['items'])} items total)")


if __name__ == "__main__":
    main()
