import { createClient } from "@supabase/supabase-js";
import type { Story } from "@/lib/news";
import { LEAN_DB_TO_UI } from "@/lib/news";

/**
 * Fetch a single story by ID server-side.
 * Uses the anon key — sufficient for reading public stories/perspectives.
 */
export async function fetchStoryById(id: string): Promise<Story | null> {
  if (!id || id === "undefined" || id === "null") return null;
  try {
    const url =
      process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"] || "";
    const key =
      process.env["SUPABASE_PUBLISHABLE_KEY"] ||
      process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
      process.env["SUPABASE_ANON_KEY"] ||
      "";
    if (!url || !key || key === "[SENSITIVE]" || key.length < 20) return null;
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("stories")
      .select(
        `id, topic, headline, date_published, archived,
         perspectives (id, lean, headline, summary_text, source_name, source_url, youtube_video_id)`,
      )
      .eq("id", id)
      .single();

    if (error || !data) return null;

    const sorted = [...(data.perspectives ?? [])].map((p) => ({
      ...p,
      lean: LEAN_DB_TO_UI[p.lean as keyof typeof LEAN_DB_TO_UI] ?? (p.lean as any),
    })).sort((a, b) => {
      const order = ["Left", "Center", "Right"] as const;
      return order.indexOf(a.lean as any) - order.indexOf(b.lean as any);
    });

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
    const url =
      process.env["SUPABASE_URL"] || process.env["VITE_SUPABASE_URL"] || "";
    const key =
      process.env["SUPABASE_PUBLISHABLE_KEY"] ||
      process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
      process.env["SUPABASE_ANON_KEY"] ||
      "";
    if (!url || !key || key === "[SENSITIVE]" || key.length < 20) return [];
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("stories")
      .select("id, topic, headline, date_published, archived, perspectives(*)")
      .eq("archived", false)
      .order("date_published", { ascending: false });

    if (error || !data) return [];

    return (data as Partial<Story>[])
      .map((story) => {
        const perspectives = [...(story.perspectives ?? [])].map((p) => ({
          ...p,
          lean: LEAN_DB_TO_UI[p.lean as keyof typeof LEAN_DB_TO_UI] ?? (p.lean as any),
        })).sort((a, b) => {
          const order = ["Left", "Center", "Right"] as const;
          return order.indexOf(a.lean as any) - order.indexOf(b.lean as any);
        });
        return { ...story, perspectives } as Story;
      })
      .filter((s) => s.perspectives && s.perspectives.length > 0);
  } catch {
    return [];
  }
}
