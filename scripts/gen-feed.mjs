// gen-feed.mjs — Supabase Stories 테이블에서 이야기를 읽어 public/feed.json 생성
// npm run prebuild 로 실행. VITE_SITE_URL 환경변수에서 사이트 URL 결정.

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env["SUPABASE_URL"] || "";
const SUPABASE_ANON_KEY = process.env["SUPABASE_ANON_KEY"] || "";
const SITE_URL = process.env["VITE_SITE_URL"] || "https://hey-dum-dumb.vercel.app";
const OUT_PATH = process.env["FEED_OUT_PATH"] || "public/feed.json";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("SUPABASE_URL / SUPABASE_ANON_KEY 미설정 — feed.json 생성 건너뜀");
  process.exit(0); // 빌드는 계속 진행
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false },
});

const { data: stories, error } = await supabase
  .from("stories")
  .select(`
    id,
    topic,
    headline,
    date_published,
    archived,
    perspectives (
      id,
      lean,
      headline,
      summary_text,
      source_name,
      source_url
    )
  `)
  .eq("archived", false)
  .order("date_published", { ascending: false });

if (error) {
  console.error("Supabase 쿼리 오류:", error.message);
  process.exit(1);
}

const items = (stories || []).map((s) => {
  const perspectives = (s.perspectives || []).filter((p) => p.headline);
  const takes = {};
  for (const p of perspectives) {
    const side = String(p.lean).toLowerCase();
    if (side === "republican") takes.right = { source: p.source_name || "", url: p.source_url || "" };
    else if (side === "neutral") takes.neutral = { source: p.source_name || "", url: p.source_url || "" };
    else if (side === "democratic") takes.left = { source: p.source_name || "", url: p.source_url || "" };
  }
  return {
    id: String(s.id),
    topic: s.topic?.toLowerCase() || "politics",
    title: s.headline || "",
    url: `${SITE_URL}/story/${s.id}`,
    summary: "",
    published_at: s.date_published || new Date().toISOString(),
    takes: Object.keys(takes).length ? takes : undefined,
  };
});

const feed = { items };
const fs = await import("fs");
const outDir = OUT_PATH.split("/").slice(0, -1).join("/");
if (outDir && !fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(feed, null, 2) + "\n");
console.log(`feed.json 생성 완료 — ${items.length}개 이야기 → ${OUT_PATH}`);
