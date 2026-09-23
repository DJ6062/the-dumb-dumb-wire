import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { StoryCard } from "./StoryCard";
import { BlindspotSection } from "./BlindspotSection";
import { TopicChips } from "./TopicChips";
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
  const [followedTopics, setFollowedTopics] = useState<Set<Topic>>(() => {
    try {
      const raw = localStorage.getItem("ddm-followed-topics");
      return raw ? new Set(JSON.parse(raw) as Topic[]) : new Set(TOPICS);
    } catch {
      return new Set(TOPICS);
    }
  });

  const activeTopic = fixedTopic ?? topic;

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const pool = (stories ?? []).filter((story) => {
      if (activeTopic !== "All" && story.topic !== activeTopic) return false;
      // Only show followed topics when not searching
      if (!term && activeTopic === "All" && followedTopics.size < TOPICS.length) {
        return followedTopics.has(story.topic);
      }
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
    return pool;
  }, [stories, activeTopic, search, followedTopics]);

  const ranked = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aTakes = a.perspectives.filter((p) => p.headline).length;
      const bTakes = b.perspectives.filter((p) => p.headline).length;
      if (aTakes !== bTakes) return bTakes - aTakes;
      return (
        new Date(b.date_published).getTime() - new Date(a.date_published).getTime()
      );
    });
  }, [filtered]);

  const handleToggle = (topic: Topic, followed: boolean) => {
    const next = new Set(followedTopics);
    if (followed) next.delete(topic);
    else next.add(topic);
    setFollowedTopics(next);
    setTopic(next.has(topic) ? topic : "All");
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-8">
      {/* ---- Kicker / heading ---- */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
        <div>
          <h2 className="headline text-2xl uppercase tracking-tight">{title}</h2>
          {!fixedTopic && (
            <p className="kicker mt-0.5 text-muted-foreground">
              {ranked.length} story{ranked.length !== 1 ? "s" : ""} ·
              {followedTopics.size < TOPICS.length ? " filtered by your follows" : " all topics"}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!fixedTopic && <TopicChips onToggle={handleToggle} />}
          <label className="flex items-center gap-2 border border-border bg-card px-2 py-1.5 rounded-full">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search headlines..."
              aria-label="Search headlines"
              className="w-40 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
        </div>
      </div>

      {/* ---- Blindspot strip (stories covered by only one side) ---- */}
      {!isLoading && stories && (
        <BlindspotSection stories={stories.filter((s) =>
          activeTopic === "All" || s.topic === activeTopic
        )} />
      )}

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
        <br />
        Click a topic chip to follow or unfollow. Unfollowed topics are hidden until you search.
      </p>
    </section>
  );
}
