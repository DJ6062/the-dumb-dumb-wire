import { createClient } from "@supabase/supabase-js";
import type { Story } from "@/lib/news";

/**
 * Fetch a single story by ID server-side.
 * Uses the anon key — sufficient for reading public stories/perspectives.
 */
export async function fetchStoryById(id: string): Promise<Story | null> {
  if (!id || id === "undefined" || id === "null") return null;
  try {
    const url = process.env["SUPABASE_URL"] || "";
    const key = process.env["SUPABASE_ANON_KEY"] || "";
    if (!url || !key) return null;
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("stories")
      .select(
        `id, topic, headline, date_published, archived,
         perspectives (id, lean, headline, summary_text, source_name, source_url, youtube_video_id)`
      )
      .eq("id", id)
      .single();

    if (error || !data) return null;

    const LEAN_ORDER = ["Republican", "Neutral", "Democratic"] as const;
    const sorted = [...(data.perspectives ?? [])].sort((a, b) =>
      LEAN_ORDER.indexOf(a.lean as (typeof LEAN_ORDER)[number]) -
      LEAN_ORDER.indexOf(b.lean as (typeof LEAN_ORDER)[number])
    );

    return { ...data, perspectives: sorted } as Story;
  } catch {
    return null;
  }
}

/**
 * Get all stories for the homepage feed (SSR).
 */
export async function fetchAllStories(): Promise<Story[]> {
  try {
    const url = process.env["SUPABASE_URL"] || "";
    const key = process.env["SUPABASE_ANON_KEY"] || "";
    if (!url || !key) return [];
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("stories")
      .select("id, topic, headline, date_published, archived, perspectives(*)")
      .eq("archived", false)
      .order("date_published", { ascending: false });

    if (error || !data) return [];

    const LEAN_ORDER = ["Republican", "Neutral", "Democratic"] as const;
    return (data as Partial<Story>[])
      .map((story) => {
        const perspectives = [...(story.perspectives ?? [])].sort((a, b) =>
          LEAN_ORDER.indexOf(a.lean as (typeof LEAN_ORDER)[number]) -
          LEAN_ORDER.indexOf(b.lean as (typeof LEAN_ORDER)[number])
        );
        return { ...story, perspectives } as Story;
      })
      .filter((s) => s.perspectives && s.perspectives.length > 0);
  } catch {
    return [];
  }
}
