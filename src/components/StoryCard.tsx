import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { LEAN_ORDER, formatDate, type Lean, type Story } from "@/lib/news";

const LEAN_STYLES: Record<Lean, { border: string; text: string; label: string }> = {
  Republican: { border: "border-t-rep", text: "text-rep", label: "Republican View" },
  Neutral:    { border: "border-t-neu", text: "text-neu", label: "Neutral / Center View" },
  Democratic: { border: "border-t-dem", text: "text-dem", label: "Democratic View" },
};

/**
 * Build a thumbnail URL from a YouTube video ID.
 * Returns null when videoId is empty, a space, or obviously bogus.
 */
function ytThumb(videoId: string): string | null {
  if (!videoId || videoId.trim() === "" || videoId.trim().length < 6) return null;
  return `https://i.ytimg.com/vi/${videoId.trim()}/hqdefault.jpg`;
}

/**
 * Pick the best available thumbnail for a story:
 *  1. YouTube thumbnail from the first take that has a real video_id
 *  2. Fallback: the source URL as a clickable link hint (no image)
 */
function storyThumb(story: Story): { src: string | null; href: string | null } {
  for (const p of story.perspectives) {
    const t = ytThumb(p.youtube_video_id);
    if (t) return { src: t, href: p.source_url || null };
  }
  return { src: null, href: story.perspectives[0]?.source_url || null };
}

export function StoryCard({ story }: { story: Story }) {
  const { src: thumbSrc, href: thumbHref } = storyThumb(story);
  const hasVideo = thumbSrc != null;

  return (
    <article className="group border border-border bg-card shadow-sm transition hover:shadow-md">
      {/* ---- Thumbnail strip ---- */}
      <div className="relative overflow-hidden bg-secondary">
        {hasVideo ? (
          <>
            <img
              src={thumbSrc}
              alt={`${story.headline} — take thumbnail`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            {/* click-through to source when available */}
            {thumbHref ? (
              <a
                href={thumbHref}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                aria-label="Open source"
              >
                <ExternalLink className="h-8 w-8 text-white drop-shadow-lg" />
              </a>
            ) : null}
            {/* YouTube badge */}
            <div className="absolute top-2 left-2 kicker rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white/90 drop-shadow-md">
              VIDEO
            </div>
          </>
        ) : (
          <div className="flex h-32 w-full items-center justify-center bg-foreground/5">
            {thumbHref ? (
              <a
                href={thumbHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-wide underline underline-offset-2 hover:bg-secondary"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Source
              </a>
            ) : (
              <span className="text-xs text-muted-foreground">No media</span>
            )}
          </div>
        )}
      </div>

      {/* ---- Header ---- */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <span className="kicker text-primary">{story.topic}</span>
          <h2 className="headline mt-1 text-xl uppercase sm:text-2xl">
            <Link
              to="/story/$id"
              params={{ id: story.id }}
              className="hover:underline underline-offset-4"
            >
              {story.headline}
            </Link>
          </h2>
        </div>
        <time className="kicker text-muted-foreground" dateTime={story.date_published}>
          {formatDate(story.date_published)}
        </time>
      </div>

      {/* ---- Takes: 3 columns, NO video ---- */}
      <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
        {LEAN_ORDER.map((lean) => {
          const p = story.perspectives.find((item) => item.lean === lean);
          const styles = LEAN_STYLES[lean];
          return (
            <div key={lean} className={`border-t-4 p-4 ${styles.border}`}>
              <p className={`kicker ${styles.text}`}>{styles.label}</p>
              {p ? (
                <>
                  <h3 className="headline mt-2 text-base uppercase">{p.headline}</h3>
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
