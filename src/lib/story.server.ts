import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Story } from "@/lib/news";

/**
 * Server-side story fetcher.
 * Uses the admin client (service role key) — bypasses RLS, works during SSR.
 * Called via createServerFn so it runs on the server, not the browser.
 */
export const getStory = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => {
    if (typeof d !== "object" || d === null) return "";
    return (d as { id?: string }).id ?? "";
  })
  .handler(async ({ data: id }) => {
    if (!id || id === "undefined" || id === "null") {
      return null as Story | null;
    }
    try {
      const { data, error } = await supabaseAdmin
        .from("stories")
        .select(
          `id, topic, headline, date_published, archived,
           perspectives (id, lean, headline, summary_text, source_name, source_url, youtube_video_id)`
        )
        .eq("id", id)
        .single();

      if (error || !data) return null as Story | null;

      // Sort perspectives into LEAN_ORDER: Republican, Neutral, Democratic
      const LEAN_ORDER = ["Republican", "Neutral", "Democratic"] as const;
      const sorted = [...(data.perspectives ?? [])].sort((a, b) => {
        const ai = LEAN_ORDER.indexOf(a.lean as (typeof LEAN_ORDER)[number]);
        const bi = LEAN_ORDER.indexOf(b.lean as (typeof LEAN_ORDER)[number]);
        return ai - bi;
      });

      return { ...data, perspectives: sorted } as Story;
    } catch {
      return null as Story | null;
    }
  });
