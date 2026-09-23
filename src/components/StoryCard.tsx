import { Link } from "@tanstack/react-router";
import { ExternalLink, EyeOff } from "lucide-react";
import { LEAN_ORDER, formatDate, type Lean, type Story } from "@/lib/news";

const LEAN_STYLES: Record<Lean, { border: string; text: string; label: string }> = {
  Republican: { border: "border-t-rep", text: "text-rep", label: "Republican View" },
  Neutral:    { border: "border-t-neu", text: "text-neu", label: "Neutral / Center View" },
  Democratic: { border: "border-t-dem", text: "text-dem", label: "Democratic View" },
};

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

export function StoryCard({ story }: { story: Story }) {
  const { src: thumbSrc, href: thumbHref } = storyThumb(story);
  const hasVideo = thumbSrc != null;
  const takeCount = story.perspectives.filter((p) => p.headline).length;
  const total = LEAN_ORDER.length;

  return (
    <article className="group border border-border bg-card shadow-sm transition hover:shadow-md hover:border-foreground/30 overflow-hidden">
      {/* ---- Thumbnail | source strip (left) ---- */}
      <div className="sm:w-44 sm:flex-shrink-0 flex items-stretch overflow-hidden bg-secondary">
        {hasVideo ? (
          <>
            <img
              src={thumbSrc}
              alt={`${story.headline} thumbnail`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:w-44"
            />
            {thumbHref && (
              <a
                href={thumbHref}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:w-44"
                aria-label="Open source"
              >
                <ExternalLink className="h-7 w-7 text-white drop-shadow-lg shrink-0" />
              </a>
            )}
            <div className="absolute top-1.5 left-1.5 kicker rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest text-white/90 drop-shadow-md shrink-0">
              VIDEO
            </div>
          </>
        ) : thumbHref ? (
          <a
            href={thumbHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 py-4 text-xs font-semibold uppercase tracking-wide underline underline-offset-2 hover:bg-secondary sm:w-44 sm:px-3 sm:py-4"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Source
          </a>
        ) : (
          <div className="flex h-full items-center justify-center bg-foreground/5 sm:w-44">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">No media</span>
          </div>
        )}
      </div>

      {/* ---- Headline + meta (rest of card, single row) ---- */}
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

      {/* ---- Bias mini-bar ---- */}
      <div className="flex gap-1 border-b border-border px-4 py-1.5">
        {LEAN_ORDER.map((lean) => {
          const p = story.perspectives.find((item) => item.lean === lean);
          const has = p && p.headline;
          return (
            <button
              key={lean}
              type="button"
              disabled
              className={`h-1.5 flex-1 rounded-full transition-colors ${has ? "bg-foreground/40" : "bg-foreground/8"}`}
              title={`${lean}: ${has ? "take filed" : "no take yet"}`}
            />
          );
        })}
      </div>
    </article>
  );
}
