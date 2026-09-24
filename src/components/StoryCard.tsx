import { Link } from "@tanstack/react-router";
import { ExternalLink, EyeOff } from "lucide-react";
import { LEAN_ORDER, formatDate, type Lean, type Story } from "@/lib/news";

const LEAN_STYLES: Record<Lean, { border: string; text: string; label: string }> = {
  Republican: { border: "border-t-rep", text: "text-rep", label: "Republican" },
  Neutral:    { border: "border-t-neu", text: "text-neu", label: "Neutral" },
  Democratic: { border: "border-t-dem", text: "text-dem", label: "Democratic" },
};

// ---- helpers ----

function ytThumb(videoId: string): string | null {
  if (!videoId || videoId.trim().length < 6) return null;
  return `https://i.ytimg.com/vi/${videoId.trim()}/hqdefault.jpg`;
}

function storyThumb(story: Story): { src: string | null; href: string | null } {
  for (const p of story.perspectives) {
    const t = ytThumb(p.youtube_video_id);
    if (t) return { src: t, href: p.source_url || null };
  }
  return { src: null, href: story.perspectives[0]?.source_url || null };
}

// ---- bias bar ----

function BiasBar({ story }: { story: Story }) {
  return (
    <div className="border-b border-border px-4 py-2">
      <div className="flex gap-4">
        {LEAN_ORDER.map((lean) => {
          const p = story.perspectives.find((item) => item.lean === lean);
          const has = p && p.headline;
          const styles = LEAN_STYLES[lean];
          const colorVar = lean === "Republican" ? "--rep" : lean === "Neutral" ? "--neu" : "--dem";
          return (
            <div key={lean} className="flex items-center gap-2">
              <span className={`bias-segment-label ${styles.text}`}>{styles.label}</span>
              <div className="flex-1 h-1.5 overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${has ? "bg-current" : "opacity-0"}`}
                  style={{
                    width: has ? "100%" : "0%",
                    backgroundColor: has ? `var(${colorVar})` : undefined,
                  }}
                  aria-label={`${lean} take: ${has ? "on" : "off"}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---- thumbnail strip ----

function ThumbStrip({ story }: { story: Story }) {
  const { src, href } = storyThumb(story);
  const hasVideo = src != null;

  if (!src && !href) {
    // no media at all — empty proportional block
    return <div className="sm:w-52 sm:flex-shrink-0 bg-secondary/30" />;
  }

  if (hasVideo) {
    return (
      <div className="sm:w-52 sm:flex-shrink-0 relative flex items-stretch overflow-hidden bg-secondary">
        <img
          src={src}
          alt={`${story.headline} thumbnail`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:w-52"
        />
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:w-52"
            aria-label="Open source"
          >
            <ExternalLink className="h-6 w-6 text-white drop-shadow-lg shrink-0" />
          </a>
        )}
        <div className="kicker absolute top-1.5 left-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white/90 drop-shadow-md shrink-0">
          VIDEO
        </div>
      </div>
    );
  }

  // source link only (no video thumbnail)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="sm:w-52 sm:flex-shrink-0 flex h-full items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-5 text-xs font-semibold uppercase tracking-wide underline underline-offset-2 hover:bg-secondary sm:px-3 sm:py-5"
    >
      <ExternalLink className="h-4 w-4" />
      Source
    </a>
  );
}

// ---- face card ----

export function StoryCard({ story }: { story: Story }) {
  const takeCount = story.perspectives.filter((p) => p.headline).length;
  const total = LEAN_ORDER.length;

  return (
    <article className="group border border-border bg-card shadow-sm transition hover:shadow-md hover:border-foreground/30 overflow-hidden">
      {/* top row: thumbnail (proportional) + headline/meta */}
      <div className="flex flex-col sm:flex-row">
        <ThumbStrip story={story} />

        <div className="flex flex-1 flex-col justify-between gap-2 border-b border-border px-4 py-3 sm:border-l sm:border-b-0 border-border">
          <div>
            <span className="kicker text-primary text-xs">{story.topic}</span>
            <h2 className="headline mt-0.5 text-base uppercase leading-tight sm:text-lg">
              <Link to="/story/$id" params={{ id: story.id }} className="hover:underline underline-offset-4">
                {story.headline}
              </Link>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <time className="kicker text-muted-foreground text-xs shrink-0" dateTime={story.date_published}>
              {formatDate(story.date_published)}
            </time>
            <span className="kicker rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-xs font-semibold uppercase tracking-wide">
              {takeCount}/{total} takes
            </span>
          </div>
        </div>
      </div>

      {/* bias bar */}
      <BiasBar story={story} />
    </article>
  );
}
