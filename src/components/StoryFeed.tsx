import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { StoryCard } from "./StoryCard";
import { TOPICS, storiesQuery, type Topic } from "@/lib/news";

function scrollStrip(el: HTMLDivElement | null, dir: "left" | "right", gap = 16) {
  if (!el) return;
  const scroll = el.scrollWidth - el.clientWidth;
  if (scroll <= 0) return;
  const step = el.clientWidth * 0.6 + gap;
  el.scrollBy({
    left: dir === "left" ? -step : step,
    behavior: "smooth",
  });
}

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

  const stripRef = useMemo(() => ({ current: null as HTMLDivElement | null }), []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-foreground pb-3">
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

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Loading stories...
        </p>
      ) : ranked.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Nothing here yet. Even dumb dumbs need sources.
        </p>
      ) : (
        <div className="mt-6">
          {/* Horizontal scroll strip */}
          <div className="relative">
            {/* Scroll buttons */}
            <button
              type="button"
              onClick={() => scrollStrip(stripRef.current, "left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 backdrop-blur-sm shadow-sm transition-colors hover:bg-secondary"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollStrip(stripRef.current, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/90 backdrop-blur-sm shadow-sm transition-colors hover:bg-secondary"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <div
              ref={stripRef.current as unknown as (n: HTMLDivElement | null) => void}
              className="flex gap-4 overflow-x-auto pb-4 pt-12 scroll-smooth scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {ranked.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          </div>

          {/* Mini legend: "Biggest = more takes filled" */}
          <p className="mt-2 -ml-2 text-xs text-muted-foreground">
            Biggest stories first — ranked by number of takes filed, then newest.
          </p>
        </div>
      )}
    </section>
  );
}
