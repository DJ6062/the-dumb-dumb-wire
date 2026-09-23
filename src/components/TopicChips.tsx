import { useState } from "react";
import { Bell } from "lucide-react";
import { TOPICS, type Topic } from "@/lib/news";

const STORAGE_KEY = "ddm-followed-topics";

function loadFollowed(): Set<Topic> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set(TOPICS);
    return new Set(JSON.parse(raw) as Topic[]);
  } catch {
    return new Set(TOPICS);
  }
}

function saveFollowed(topics: Set<Topic>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...topics]));
  } catch {
    /* noop */
  }
}

export function TopicChips({
  onToggle,
}: {
  onToggle?: (topic: Topic, followed: boolean) => void;
}) {
  const [followed, setFollowed] = useState<Set<Topic>>(loadFollowed);

  function toggle(topic: Topic) {
    const next = new Set(followed);
    if (next.has(topic)) next.delete(topic);
    else next.add(topic);
    setFollowed(next);
    saveFollowed(next);
    onToggle?.(topic, next.has(topic));
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {TOPICS.map((topic) => {
        const isFollowed = followed.has(topic);
        return (
          <button
            key={topic}
            type="button"
            onClick={() => toggle(topic)}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors ${
              isFollowed
                ? "border-foreground/30 bg-foreground/10 text-foreground"
                : "border-border bg-card text-muted-foreground hover:border-foreground/20 hover:text-foreground"
            }`}
            title={isFollowed ? `Following ${topic}` : `Follow ${topic}`}
          >
            {isFollowed ? (
              <Bell className="h-3 w-3 shrink-0" />
            ) : (
              <span className="h-3 w-3 rounded-full border border-current/40 shrink-0" />
            )}
            {topic}
          </button>
        );
      })}
    </div>
  );
}
