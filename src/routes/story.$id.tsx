import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { notFound } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { StoryCard } from "@/components/StoryCard";
import type { Story } from "@/lib/news";

export const Route = createFileRoute("/story/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id.slice(0, 8)} — Hey!! Dum Dum` },
      { name: "description", content: "Three takes on one story." },
    ],
  }),
  component: function StoryPage() {
    const id = Route.useParams().id;

    const { data: story, isLoading } = useQuery({
      queryKey: ["story", id],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("stories")
          .select(`
            id,
            topic,
            headline,
            date_published,
            archived,
            perspectives (id, lean, headline, summary_text, source_name, source_url)
          `)
          .eq("id", id)
          .single();

        if (error || !data) return null;
        return data as Story;
      },
      staleTime: 1000 * 60 * 5, // 5 min
    });

    if (isLoading) {
      return (
        <section className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="text-sm text-muted-foreground">Loading story...</p>
        </section>
      );
    }

    if (!story || story.archived) {
      throw notFound();
    }

    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 border-b-2 border-foreground pb-4">
          <h1 className="headline text-3xl uppercase sm:text-4xl">
            {story.headline}
          </h1>
          <p className="mt-2 kicker text-muted-foreground">
            {story.topic} · {new Date(story.date_published).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {story.perspectives && story.perspectives.length > 0 ? (
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
