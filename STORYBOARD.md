# Paste Due — Story Board

**Last updated: 2026-09-24 (after RSS pipeline fix + professional polish deploy)**

---

## ✅ Done & Working

### Site Infrastructure
- [x] TanStack Start codebase on `main` branch
- [x] Pushed to `github.com/DJ6062/the-dumb-dumb-wire`
- [x] Vercel project `hey-dum-dumb` connected to correct GitHub repo
- [x] `nitro.config.mjs` — preset `"vercel"`, Supabase client bundled (was external, blocking SSR)
- [x] `vercel.json` — framework `"nitro"`, outputDirectory `".vercel/output"`
- [x] `.gitignore` merged
- [x] `src/server.ts` — imports `@tanstack/react-start/server`, creates `createStartHandler(defaultStreamHandler)`

### Post-Build Patch (`scripts/post-build-nitro-patch.mjs`)
- [x] Fix 1: `ssr.mjs` — `handler.fetch(request, env, ctx)` → `handler(request, { context: ctx })` (createStartHandler returns a function, not an object with .fetch)
- [x] Fix 2: `index.mjs` — replaced Nitro's H3/nitroApp entry with TanStack Start SSR handler directly
- [x] Integrated into build: `package.json` build script runs `vite build && node scripts/post-build-nitro-patch.mjs .vercel/output`

### Live Site — `https://hey-dumb-dumb.vercel.app`
- [x] `/` → 200, TanStack SSR homepage (red header, manifesto, join form, stories feed)
- [x] `/feed.json` → 200, 4 stories with 3 takes each from Supabase
- [x] `/story/{id}` → 200, SSR story page with headline + 3 takes (Republican/Neutral/Democratic) + YouTube thumbnails + sources — **VERIFIED ALL 4 STORIES WORK**

### Supabase
- [x] `stories` table: 4 rows
- [x] `perspectives` table: 12 rows (3 per story)
- [x] `wire_links` table: exists
- [x] Vercel env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SITE_URL`, `SUPABASE_SERVICE_ROLE_KEY`

### Build & Deploy
- [x] `npm run build` → ~300ms locally, produces `.vercel/output/`
- [x] Post-build patch applied automatically during build
- [x] Direct `--prebuilt` deploys work
- [x] GitHub-triggered builds on `main` → Vercel
- [x] Professional polish deployed (c31ce18): typography, dot-grid, dark mode, bias bars, skeleton loaders, Ground News-inspired cards

---

## 🔴 Broken / Needs Fixing

### Pipeline gaps
- [ ] `!pipeline_pick` vote-to-Supabase write-back not wired — handler exists in `rss/discord.py` but bot uses `SUPABASE_ANON_KEY` (read-only via RLS). Need service role key in bot `.env` or a write path through the site's API.
- [ ] Newsletter channel ID wrong — `NEWSLETTER_CHANNEL_ID=1529529296736227553` resolves to `rummys-room`, not `room-rummy-builds`. Need correct channel ID.

### Supabase content gap
- [ ] Only 4 stories in Supabase (2 Politics, 1 Culture, 1 Op-Ed) — need 5+ per category. `supabase/seed-expansion.sql` (11 new stories) committed but not applied. Service role key unavailable locally for writes; one-shot seed route `src/routes/api.setup-seed.tsx` committed but not deployed/called.

---

## 🔵 Still To Do (Paste Due + Other)

### Paste Due Section (Priority #1)
- [ ] Design bill schema (title, status, chamber, vote_date, summary, sources, etc.)
- [ ] Create Supabase tables for bills/proposals/votes
- [ ] Decide data source: manual admin entry? RSS? API?
- [ ] Create `/bills` route (or section on homepage)
- [ ] Wire up SSR data fetching (same pattern as stories — anon key)

### Discord Bot
- [x] Bot (`rummy-bot/main.py`) running via launchd, connected to Discord (PID 1777, session active)
- [x] RSS pipeline feeding #story-pipeline (3-min cycle) — 11 working outlets, 35 candidates today
- [x] Newsletter poll loop active (5-min cycle, posting to #room-rummy-builds)
- [ ] Fix `NEWSLETTER_CHANNEL_ID` in `.env` — currently points to wrong channel
- [ ] Wire `!pipeline_pick` to write winning story to Supabase (needs service role key or API route)
- [ ] Bot `.env` has `NEWSLETTER_SOURCE=supabase`

### Join Form → Mailer
- [ ] Join form shows "Join the newsletter" — placeholder only
- [ ] Fix: connect mail provider (Buttondown/Kit/Loops) + wire form handler

### Content & Features (Later)
- [x] Categories filter — Politics, Culture, Op-Ed tabs (nav + pages working)
- [x] Story page YouTube embeds — thumbnails rendered server-side
- [x] Professional polish — typography, dot-grid, dark mode, bias bars, skeletons, Ground News-inspired cards (deployed c31ce18)
- [ ] Search — search stories by headline/topic
- [ ] Admin password + UI — `ADMIN_PASSWORD` env var, `/admin` route
- [ ] Night publish scheduler (launchd)
- [ ] clustering.py + story_poster.py (not wired)

---

## 📋 Quick Status Summary

| What | Where | Status |
|---|---|---|
| Homepage | `https://hey-dumb-dumb.vercel.app/` | ✅ Working |
| feed.json | `https://hey-dumb-dumb.vercel.app/feed.json` | ✅ Working (4 stories, takes) |
| Story page | `https://hey-dumb-dumb.vercel.app/story/[id]` | ✅ Working (SSR, takes, YouTube thumbnails) |
| Paste Due | — | ❌ Not started (no Supabase tables, no route) |
| Discord bot | `rummy-bot/main.py` | ✅ Running (PID 1777, launchd) |
| 　├ Pipeline | `#story-pipeline` | ✅ Posting candidates (35 today) |
| 　├ Pick-to-Supabase | `!pipeline_pick` | ❌ Not wired (RLS blocks anon key) |
| 　└ Newsletter | `#room-rummy-builds` | ❌ Wrong channel ID in .env |
| Join form | Homepage | ⚠️ Placeholder, mailer not wired |

---

**One-line summary:** Site fully live with professional polish (c31ce18). RSS→Discord pipeline feeding #story-pipeline with 11 working outlets — 35 candidates today, all with ✅ reacts for voting. Two blockers: `!pipeline_pick` can't write to Supabase (anon key is read-only), and newsletter channel ID is wrong. 4 stories in Supabase, need 5+ per category — `seed-expansion.sql` ready to apply when service role key is available.
