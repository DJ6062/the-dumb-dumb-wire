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
      {/* ---- Top row: thumbnail (left) + headline + meta (right) ---- */}
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail | source link strip */}
        <div className="relative sm:h-48 sm:w-56 sm:flex-shrink-0 flex-row sm:flex-col flex-1 flex items-stretch overflow-hidden bg-secondary">
          {hasVideo ? (
            <>
              <img
                src={thumbSrc}
                alt={`${story.headline} — take thumbnail`}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:w-56 sm:h-48"
              />
              {thumbHref && (
                <a
                  href={thumbHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10 flex h-full w-full items-center justify-center bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:w-56 sm:h-48"
                  aria-label="Open source"
                >
                  <ExternalLink className="h-8 w-8 text-white drop-shadow-lg shrink-0" />
                </a>
              )}
              <div className="absolute top-2 left-2 kicker rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white/90 drop-shadow-md shrink-0">
                VIDEO
              </div>
            </>
          ) : thumbHref ? (
            <a
              href={thumbHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full w-full items-center justify-center gap-2 rounded-md border border-border bg-card px-3 py-6 text-sm font-semibold uppercase tracking-wide underline underline-offset-2 hover:bg-secondary sm:w-56 sm:h-48 sm:px-4 sm:py-6"
            >
              <ExternalLink className="h-4 w-4" />
              Source
            </a>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-foreground/5 sm:w-56 sm:h-48">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">No media</span>
            </div>
          )}
        </div>

        {/* Headline + meta — takes the remaining width */}
        <div className="flex flex-col justify-between gap-3 border-b border-border sm:border-b-0 sm:border-l border-border px-4 sm:px-6 py-4 sm:py-5 flex-1">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="kicker text-primary">{story.topic}</span>
            <time className="kicker text-muted-foreground shrink-0" dateTime={story.date_published}>
              {formatDate(story.date_published)}
            </time>
          </div>
          <h2 className="headline text-xl sm:text-2xl uppercase leading-tight">
            <Link to="/story/$id" params={{ id: story.id }} className="hover:underline underline-offset-4">
              {story.headline}
            </Link>
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="kicker rounded-full bg-primary/10 px-2 py-0.5 text-primary text-xs font-semibold uppercase tracking-wide">
              {takeCount}/{total} takes
            </span>
          </div>
        </div>
      </div>

      {/* ---- Bias mini-bar ---- */}
      <div className="border-b border-border px-4 sm:px-6 py-2">
        <div className="flex gap-1" aria-label="Take coverage by political leaning">
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
      </div>

      {/* ---- Takes: stacked vertically, full width below the fold ---- */}
      <div className="grid grid-cols-1 divide-y divide-border px-4 sm:px-6 pb-4 sm:pb-5">
        {LEAN_ORDER.map((lean) => {
          const p = story.perspectives.find((item) => item.lean === lean);
          const styles = LEAN_STYLES[lean];
          return (
            <div key={lean} className={`p-4 sm:p-5 first:pt-1 ${styles.border}`}>
              <p className={`kicker text-xs font-bold uppercase tracking-widest ${styles.text}`}>
                {styles.label}
              </p>
              {p ? (
                <>
                  <h3 className="headline mt-2 text-base uppercase leading-snug">{p.headline}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">{p.summary_text}</p>
                  {p.source_url && (
                    <a
                      href={p.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide underline underline-offset-4 hover:text-primary"
                    >
                      {p.source_name || "Source"}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </>
              ) : (
                <div className="mt-2 flex items-center gap-1.5 text-sm italic text-muted-foreground">
                  <EyeOff className="h-3.5 w-3.5 shrink-0" />
                  No take filed yet.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </article>
  );
}
