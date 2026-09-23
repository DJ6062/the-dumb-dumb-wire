import { useMemo } from "react";
import { Eye, AlertTriangle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { LEAN_ORDER, formatDate, type Story } from "@/lib/news";

export function BlindspotSection({ stories }: { stories: Story[] }) {
  const blindspots = useMemo(() => {
    return stories.filter((story) => {
      let filled = 0;
      for (const lean of LEAN_ORDER) {
        if (story.perspectives.some((p) => p.lean === lean && p.headline)) filled++;
      }
      // Blindspot = only 1 lean has a take (or 0 — but we want at least 1)
      return filled === 1;
    });
  }, [stories]);

  if (blindspots.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-8 pt-6">
      <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <h2 className="headline text-2xl uppercase tracking-tight">Blindspot</h2>
        <span className="kicker text-muted-foreground">
          {blindspots.length} story{blindspots.length !== 1 ? "s" : ""} covered by only one side
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {blindspots.map((story) => {
          const filledLeans: string[] = [];
          for (const lean of LEAN_ORDER) {
            if (story.perspectives.some((p) => p.lean === lean && p.headline)) {
              filledLeans.push(lean);
            }
          }
          const covering = filledLeans[0];

          return (
            <article
              key={story.id}
              className="group border border-amber-300/30 bg-amber-50/50 dark:border-amber-500/20 dark:bg-amber-950/10 shadow-sm transition hover:shadow-md hover:border-amber-400/40 dark:hover:border-amber-500/30"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/60 bg-amber-100/30 dark:bg-amber-950/20 px-4 py-2">
                <span className="kicker text-amber-700 dark:text-amber-400">
                  {story.topic}
                </span>
                <Eye className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              </div>

              {/* Headline */}
              <div className="px-4 py-3">
                <h3 className="headline text-lg uppercase leading-snug">
                  <Link
                    to="/story/$id"
                    params={{ id: story.id }}
                    className="hover:underline underline-offset-4"
                  >
                    {story.headline}
                  </Link>
                </h3>
                <time className="kicker mt-1 text-muted-foreground" dateTime={story.date_published}>
                  {formatDate(story.date_published)}
                </time>
              </div>

              {/* Which side is covering it */}
              <div className="border-t border-border/60 bg-amber-100/20 px-4 py-2 dark:bg-amber-950/10">
                <div className="flex items-center gap-2 rounded-md bg-primary/10 px-2.5 py-1">
                  <span className="kicker text-xs" style={{ color: "var(--primary)" }}>
                    Only covered by
                  </span>
                  <span className="kicker text-xs font-bold" style={{ color: "var(--primary)" }}>
                    {covering}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  The other two sides haven't filed a take on this yet.
                </p>
              </div>

              {/* CTA */}
              <div className="border-t border-border/60 px-4 py-2">
                <Link
                  to="/story/$id"
                  params={{ id: story.id }}
                  className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide underline underline-offset-4 hover:text-primary"
                >
                  Read the story
                  <Eye className="h-3 w-3" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <p className="mt-3 -ml-2 text-xs text-muted-foreground">
        Blindspot stories are ones where only one side of the political spectrum has published a take.
        Come back later for the other views — or be the first to file one.
      </p>
    </section>
  );
}
