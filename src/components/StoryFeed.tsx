import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { StoryCard } from "./StoryCard";
import { TOPICS, storiesQuery, type Topic } from "@/lib/news";

export function StoryFeed({
  fixedTopic,
  title = "The Story Grid",
}: {
  fixedTopic?: Topic;
  title?: string;
}) {
  const { data: stories, isLoading } = useQuery(storiesQuery);
  const [topic, setTopic] = useState<Topic | "All">(fixedTopic ?? "All");
  const [search, setSearch] = useState("");

  const activeTopic = fixedTopic ?? topic;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (stories ?? []).filter((story) => {
      if (activeTopic !== "All" && story.topic !== activeTopic) return false;
      if (!term) return true;
      return (
        story.headline.toLowerCase().includes(term) ||
        story.perspectives.some(
          (p) =>
            p.headline.toLowerCase().includes(term) ||
            p.summary_text.toLowerCase().includes(term),
        )
      );
    });
  }, [stories, activeTopic, search]);

  // "Biggest" = most takes filled, then most recent
  const ranked = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aTakes = a.perspectives.filter((p) => p.headline).length;
      const bTakes = b.perspectives.filter((p) => p.headline).length;
      if (aTakes !== bTakes) return bTakes - aTakes;
      return (
        new Date(b.date_published).getTime() -
        new Date(a.date_published).getTime()
      );
    });
  }, [filtered]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      {/* ---- Kicker / heading ---- */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <h2 className="headline text-2xl uppercase">{title}</h2>
        <div className="flex flex-wrap items-center gap-2">
          {!fixedTopic && (
            <div className="flex">
              {(["All", ...TOPICS] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTopic(t)}
                  className={`kicker border border-border px-3 py-1.5 transition-colors ${
                    topic === t
                      ? "bg-foreground text-background"
                      : "bg-card hover:bg-secondary"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
          <label className="flex items-center gap-2 border border-border bg-card px-2 py-1.5">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search headlines..."
              aria-label="Search headlines"
              className="w-44 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>
      </div>

      {/* ---- Body: responsive article grid ---- */}
      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Loading stories...
        </p>
      ) : ranked.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Nothing here yet. Even dumb dumbs need sources.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ranked.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      )}

      {/* Mini legend */}
      <p className="mt-3 -ml-2 text-xs text-muted-foreground">
        Biggest stories first — ranked by number of takes filed, then newest.
      </p>
    </section>
  );
}
