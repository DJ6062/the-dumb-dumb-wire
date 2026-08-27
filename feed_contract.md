# feed.json contract (what the Discord bot reads)

The Room Rummy bot does `GET NEWSLETTER_FEED_URL` (this file) every 5 min and
posts any `items` whose `id` it hasn't seen. Keep this shape exact.

```json
{
  "generated_at": "2026-08-27T12:00:00Z",
  "site": "https://the-dumb-dumb-wire.github.io",
  "items": [
    {
      "id": "senate-session-weekend",          // unique slug; dedup key
      "topic": "politics",                       // politics | culture | op-ed  (only these post)
      "title": "SENATE STAYS IN SESSION…",
      "url": "https://…/story/x",
      "summary": "Raw links, no commentary.",
      "published_at": "2026-08-27T11:30:00Z",
      "takes": {                                 // optional; omit sides you don't have
        "right":   { "source": "Right Daily", "url": "https://…" },
        "neutral": { "source": "Wire Service", "url": "https://…" },
        "left":    { "source": "Left Daily",  "url": "https://…" }
      }
    }
  ]
}
```

## Rules
- `topic` must be `politics`, `culture`, or `op-ed` (case-insensitive; `op-ed`/
  `oped` tolerated). Other topics are **dropped** by the bot.
- `id` must be unique per story (used for dedupe). Reusing an id = no re-post.
- `url` should be absolute. Missing `url` falls back to the site URL.
- `takes` sides: `right`, `neutral`, `left` (each `{source, url}`). Any subset ok.
- Order: bot posts in array order; put newest first.
