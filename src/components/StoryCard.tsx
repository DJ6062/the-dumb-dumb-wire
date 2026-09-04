import { ExternalLink } from "lucide-react";
import { LazyYouTube } from "./LazyYouTube";
import { LEAN_ORDER, formatDate, type Lean, type Story } from "@/lib/news";

const LEAN_STYLES: Record<Lean, { border: string; text: string; label: string }> = {
  Republican: { border: "border-t-rep", text: "text-rep", label: "Republican View" },
  Neutral: { border: "border-t-neu", text: "text-neu", label: "Neutral / Center View" },
  Democratic: { border: "border-t-dem", text: "text-dem", label: "Democratic View" },
};

export function StoryCard({ story }: { story: Story }) {
  return (
    <article className="border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <span className="kicker text-primary">{story.topic}</span>
          <h2 className="headline mt-1 text-2xl uppercase sm:text-3xl">{story.headline}</h2>
        </div>
        <time className="kicker text-muted-foreground" dateTime={story.date_published}>
          {formatDate(story.date_published)}
        </time>
      </div>

      <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
        {LEAN_ORDER.map((lean) => {
          const p = story.perspectives.find((item) => item.lean === lean);
          const styles = LEAN_STYLES[lean];
          return (
            <div key={lean} className={`border-t-4 p-4 ${styles.border}`}>
              <p className={`kicker ${styles.text}`}>{styles.label}</p>
              {p ? (
                <>
                  <h3 className="headline mt-2 text-lg uppercase">{p.headline}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">
                    {p.summary_text}
                  </p>
                  {p.source_url ? (
                    <a
                      href={p.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide underline underline-offset-4 hover:text-primary"
                    >
                      {p.source_name || "Source"}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : null}
                  <div className="mt-3">
                    <LazyYouTube videoId={p.youtube_video_id} title={p.headline} />
                  </div>
                </>
              ) : (
                <p className="mt-2 text-sm italic text-muted-foreground">
                  No take filed yet.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}
