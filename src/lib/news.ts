import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Topic = "Politics" | "Culture" | "Op-Ed";
export type Lean = "Republican" | "Neutral" | "Democratic";

export const TOPICS: Topic[] = ["Politics", "Culture", "Op-Ed"];
export const LEAN_ORDER: Lean[] = ["Republican", "Neutral", "Democratic"];

export type Perspective = {
  id: string;
  story_id: string;
  lean: Lean;
  headline: string;
  summary_text: string;
  source_name: string;
  source_url: string;
  youtube_video_id: string;
};

export type Story = {
  id: string;
  topic: Topic;
  headline: string;
  date_published: string;
  archived: boolean;
  perspectives: Perspective[];
};

export type WireLink = {
  id: string;
  headline_text: string;
  external_url: string;
  date_added: string;
};

export const storiesQuery = queryOptions({
  queryKey: ["stories"],
  queryFn: async (): Promise<Story[]> => {
    const { data, error } = await supabase
      .from("stories")
      .select("id, topic, headline, date_published, archived, perspectives(*)")
      .order("date_published", { ascending: false });
    if (error) throw error;
    return (data ?? []).map((story) => ({
      ...story,
      perspectives: [...(story.perspectives ?? [])].sort(
        (a, b) => LEAN_ORDER.indexOf(a.lean as Lean) - LEAN_ORDER.indexOf(b.lean as Lean),
      ),
    })) as Story[];
  },
});

export const wireQuery = queryOptions({
  queryKey: ["wire"],
  queryFn: async (): Promise<WireLink[]> => {
    const { data, error } = await supabase
      .from("wire_links")
      .select("*")
      .order("date_added", { ascending: false });
    if (error) throw error;
    return (data ?? []) as WireLink[];
  },
});

/** Accepts a full YouTube URL or a bare video id and returns the id. */
export function parseYouTubeId(input: string): string {
  const value = input.trim();
  if (!value) return "";
  const match = value.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/,
  );
  return match ? match[1] : value;
}

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
