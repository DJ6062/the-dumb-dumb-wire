import { createFileRoute } from "@tanstack/react-router";
import { notFound } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { StoryCard } from "@/components/StoryCard";
import { formatDate, type Story } from "@/lib/news";

function getServerClient() {
  const url = process.env["SUPABASE_URL"] || "";
  const key = process.env["SUPABASE_ANON_KEY"] || "";
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createClient(url, key);
}

export const Route = createFileRoute("/story/$id")({
  loader: async ({ params }) => {
    if (!params.id) throw notFound();
    const supabase = getServerClient();
    const { data, error } = await supabase
      .from("stories")
      .select(`id, topic, headline, date_published, archived,
              perspectives (id, lean, headline, summary_text, source_name, source_url, youtube_video_id)`)
      .eq("id", params.id)
      .single();
    if (error || !data) throw notFound();
    const LEAN_ORDER = ["Republican", "Neutral", "Democratic"] as const;
    const sorted = [...(data.perspectives ?? [])].sort((a, b) =>
      LEAN_ORDER.indexOf(a.lean as (typeof LEAN_ORDER)[number]) -
      LEAN_ORDER.indexOf(b.lean as (typeof LEAN_ORDER)[number])
    );
    return { ...data, perspectives: sorted } as Story;
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.id.slice(0, 8)} — Hey!! Dum Dum` },
      { name: "description", content: "Three takes on one story." },
    ],
  }),
  component: function StoryPage() {
    const story = Route.useLoaderData() as Story;
    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 border-b-2 border-foreground pb-4">
          <h1 className="headline text-3xl uppercase sm:text-4xl">
            {story.headline}
          </h1>
          <p className="mt-2 kicker text-muted-foreground">
            {story.topic} · {new Date(story.date_published).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
        {story.perspectives.length > 0 ? (
          <div className="mt-6 grid gap-6">
            {story.perspectives.map((p) => (
              <StoryCard key={p.id} story={{ id: story.id, ...story, perspectives: [p] }} />
            ))}
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No takes yet. Even dumb dumbs need sources.
          </p>
        )}
      </section>
    );
  },
});
// rebuild trigger
