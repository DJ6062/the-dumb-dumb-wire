import { Link } from "@tanstack/react-router";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { LEAN_ORDER, LEAN_UI_TO_DB, formatDate, type Lean, type Perspective, type Story } from "@/lib/news";
import { useState } from "react";

const LEAN_VARIANTS: Record<Lean, { label: string; textClass: string }> = {
  Left:    { label: "LEFT",     textClass: "text-left" },
  Center:  { label: "CENTER",   textClass: "text-cen" },
  Right:   { label: "RIGHT",    textClass: "text-right" },
};

/* ---- bias bar: one segment per lean, shows take count ---- */

function BiasBar({ story }: { story: Story }) {
  const counts = LEAN_ORDER.reduce<Record<Lean, number>>(
    (acc, lean) => {
      acc[lean] = story.perspectives.filter((p) => p.lean === lean && p.headline).length;
      return acc;
    },
    { Left: 0, Center: 0, Right: 0 },
  );
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="border-b border-border bg-muted/30 px-4 py-2">
      <div className="flex gap-4">
        {LEAN_ORDER.map((lean) => {
          const has = counts[lean] > 0;
          const colorVar =
            lean === "Right"
              ? "--rep"
              : lean === "Center"
              ? "--cen"
              : "--left";
          return (
            <div key={lean} className="flex items-center gap-2">
              <span
                className={`bias-segment-label ${LEAN_VARIANTS[lean].textClass}`}
              >
                {LEAN_VARIANTS[lean].label}
              </span>
              <div className="flex-1 h-1.5 overflow-hidden rounded-full">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    has ? "bg-current" : "opacity-0"
                  }`}
                  style={{
                    width: has ? "100%" : "0%",
                    backgroundColor: has ? `var(${colorVar})` : undefined,
                  }}
                  aria-label={`${lean}: ${counts[lean]} takes`}
                />
              </div>
              <span className="kicker text-xs text-muted-foreground shrink-0">
                {counts[lean]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---- thumbnail strip: pick first video across all takes ---- */

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

function ThumbStrip({ story }: { story: Story }) {
  const { src, href } = storyThumb(story);
  const hasVideo = src != null;

  if (!src && !href) {
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

/* ---- single take row within a lean column ---- */

function TakeRow({ take, columnLean }: { take: Perspective; columnLean: Lean }) {
  const isVideo = !!take.youtube_video_id && ytThumb(take.youtube_video_id);

  return (
    <article className="group border-b border-border last:border-b-0 pb-3 last:pb-0">
      <div className="flex items-start gap-2">
        {isVideo && (
          <div className="relative flex h-10 w-14 shrink-0 items-center justify-center overflow-hidden rounded bg-black/40">
            <img
              src={ytThumb(take.youtube_video_id)!}
              alt=""
              loading="lazy"
              className="h-10 w-14 object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity duration-150 group-hover:opacity-100">
              <PlayIcon className="h-4 w-4 fill-white text-white" />
            </div>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="kicker text-[10px] font-black uppercase tracking-widest mb-0.5">
            {take.source_name}
          </p>
          <h4 className="headline text-sm font-bold leading-snug line-clamp-2">
            {take.headline}
          </h4>
          {take.summary_text && (
            <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {take.summary_text}
            </p>
          )}
          <a
            href={take.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
          >
            Source
            <ArrowUpRight className="h-3 w-3" />
          </a>
        </div>
      </div>
    </article>
  );
}

/* ---- a single lean column: stacked takes ---- */

function LeanColumn({
  storyId,
  lean,
  takes,
}: {
  storyId: string;
  lean: Lean;
  takes: Perspective[];
}) {
  const variant = LEAN_VARIANTS[lean];
  const colorVar =
    lean === "Right" ? "--rep" : lean === "Center" ? "--cen" : "--left";

  return (
    <div className="flex flex-col">
      <div className="kicker border-b border-border/60 pb-1.5 text-center text-xs font-bold uppercase tracking-widest" style={{ color: `var(${colorVar})` }}>
        {variant.label}
        <span className="ml-1 text-muted-foreground font-normal">
          ({takes.length})
        </span>
      </div>
      {takes.length === 0 ? (
        <p className="mt-2 text-center text-xs italic text-muted-foreground/60">
          No takes filed on this side yet.
        </p>
      ) : (
        takes.map((take) => (
          <TakeRow key={take.id} take={take} columnLean={lean} />
        ))
      )}
    </div>
  );
}

/* ---- face card: story headline + 3 lean columns ---- */

export function StoryCard({ story }: { story: Story }) {
  // Group perspectives by lean, preserving order
  const byLean: Record<Lean, Perspective[]> = {
    Left: [],
    Center: [],
    Right: [],
  };
  for (const p of story.perspectives) {
    if (p.headline) byLean[p.lean].push(p);
  }

  return (
    <article className="group border border-border bg-card shadow-sm transition hover:shadow-md hover:border-foreground/30 overflow-hidden">
      {/* top row: thumbnail + story headline + meta */}
      <div className="flex flex-col sm:flex-row">
        <ThumbStrip story={story} />

        <div className="flex flex-1 flex-col justify-between gap-2 border-b border-border px-4 py-3 sm:border-l sm:border-b-0 border-border">
          <div>
            <span className="kicker text-primary text-xs">{story.topic}</span>
            <h2 className="headline mt-0.5 text-base uppercase leading-tight sm:text-lg">
              <Link
                to="/story/$id"
                params={{ id: story.id }}
                className="hover:underline underline-offset-4"
              >
                {story.headline}
              </Link>
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <time className="kicker text-muted-foreground text-xs shrink-0" dateTime={story.date_published}>
              {formatDate(story.date_published)}
            </time>
          </div>
        </div>
      </div>

      {/* bias bar */}
      <BiasBar story={story} />

      {/* 3 lean columns: each stacks its takes */}
      <div className="grid grid-cols-3 divide-x divide-border px-4 py-3">
        {LEAN_ORDER.map((lean) => (
          <LeanColumn
            key={lean}
            storyId={story.id}
            lean={lean}
            takes={byLean[lean]}
          />
        ))}
      </div>
    </article>
  );
}

/* ---- icon (inline to avoid extra import if lucide not present) ---- */

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-4 w-4"}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 5.5v13l9-6.5-9-6.5z" />
    </svg>
  );
}
