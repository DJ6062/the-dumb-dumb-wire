import { createClient } from "@supabase/supabase-js";
import { writeFileSync, mkdirSync } from "node:fs";

const SUPABASE_URL = process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"] || "";
const SUPABASE_KEY =
  process.env["SUPABASE_PUBLISHABLE_KEY"] ||
  process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
  process.env["SUPABASE_ANON_KEY"] ||
  "";
const SITE_URL = process.env["VITE_SITE_URL"] || "https://hey-dum-dum.vercel.app";
const OUT_PATH = process.env["FEED_OUT_PATH"] || "public/feed.json";

function isUsableKey(v) {
  return Boolean(v && v !== "[SENSITIVE]" && String(v).trim().length >= 20);
}

if (!SUPABASE_URL || !isUsableKey(SUPABASE_KEY)) {
  console.error("SUPABASE_URL / publishable|anon key not set — skipping feed.json generation");
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

function hasRealVideoId(v) {
  return Boolean(v && typeof v === "string" && v.trim().length >= 6);
}

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
      source_url,
      youtube_video_id
    )
  `)
  .eq("archived", false)
  .order("date_published", { ascending: false });

if (error) {
  console.error("Supabase query error:", error.message);
  process.exit(1);
}

const LEAN_LANE = {
  democratic: "left",
  neutral: "neutral",
  republican: "right",
};

const items = (stories || []).map((s) => {
  const perspectives = (s.perspectives || []).filter((p) => p.headline);
  const takes = {};

  for (const lane of ["left", "neutral", "right"]) {
    const p = perspectives.find(
      (p) => LEAN_LANE[String(p.lean).toLowerCase()] === lane
    );
    if (p) {
      takes[lane] = {
        source: p.source_name || "",
        url: p.source_url || "",
        headline: p.headline || "",
        summary: p.summary_text || "",
        video_id: hasRealVideoId(p.youtube_video_id)
          ? String(p.youtube_video_id).trim()
          : "",
      };
    }
  }

  return {
    id: String(s.id),
    topic: String(s.topic || "politics").toLowerCase(),
    title: s.headline || "Untitled",
    url: `${SITE_URL}/story/${s.id}`,
    summary: "",
    published_at: s.date_published || new Date().toISOString(),
    takes: Object.keys(takes).length ? takes : undefined,
  };
});

const feed = { items };
const outDir = OUT_PATH.split("/").slice(0, -1).join("/");
try {
  mkdirSync(outDir, { recursive: true });
} catch {}

writeFileSync(OUT_PATH, JSON.stringify(feed, null, 2) + "\n");

console.log(`feed.json generated — ${items.length} stories → ${OUT_PATH}`);
if (items.length > 0) {
  console.log("Latest stories:");
  for (const it of items.slice(0, 3)) {
    console.log(`  • ${it.title} (${it.topic})`);
    if (it.takes) {
      const lanes = Object.keys(it.takes);
      console.log(`    takes: ${lanes.join(" → ")}`);
    }
  }
}
