import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Play, ExternalLink } from "lucide-react";
import { storiesQuery } from "@/lib/news";

/* ------------------------------------------------------------------ */
/*  Big News / Breaknews — Netflix-style hero                         */
/*                                                                    */
/*  The single biggest story of the week, shown as three takes        */
/*  side by side:                                                     */
/*                                                                    */
/*    Democratic (blue)   │  Neutral (middle)  │  Republican (red)   */
/*                                                                    */
/*  Each take has its own YouTube video. Dark, bold, eye-catching     */
/*  to pull visitors in.                                              */
/* ------------------------------------------------------------------ */

const LEAN_ORDER = ["Democratic", "Neutral", "Republican"] as const;
type LeanKey = (typeof LEAN_ORDER)[number];

const LEAN_VARS: Record<LeanKey, { color: string; bg: string; border: string; label: string }> = {
  Democratic: { color: "var(--dem)",  bg: "rgba(30,60,140,0.15)",  border: "rgba(50,90,200,0.5)",  label: "DEMOCRATS" },
  Neutral:    { color: "var(--neu)",  bg: "rgba(120,120,120,0.12)", border: "rgba(180,180,180,0.25)", label: "NEUTRAL" },
  Republican: { color: "var(--rep)",  bg: "rgba(170,30,30,0.15)",  border: "rgba(200,50,50,0.5)",  label: "REPUBLICANS" },
};

export function WireSection() {
  const { data: stories, isLoading } = useQuery(storiesQuery);

  /* Biggest story = most takes filled, newest first as tie-breaker */
  const hero = (stories ?? [])
    .sort((a, b) => {
      const aTakes = a.perspectives.filter((p) => p.headline).length;
      const bTakes = b.perspectives.filter((p) => p.headline).length;
      if (aTakes !== bTakes) return bTakes - aTakes;
      return new Date(b.date_published).getTime() - new Date(a.date_published).getTime();
    })
    .slice(0, 1)[0];

  /* Takes ordered left→right: Dem | Neu | Rep */
  const takes = hero
    ? LEAN_ORDER
        .map((lean) => hero.perspectives.find((p) => p.lean === lean))
        .filter(Boolean)
    : [];

  /* YouTube embed id helper */
  function ytId(take: (typeof takes)[number]): string | null {
    if (!take?.youtube_video_id) return null;
    const v = String(take.youtube_video_id).trim();
    return v.length >= 6 ? v : null;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pt-6">
      {/* ---- Section header ---- */}
      <div className="section-header">
        <div>
          <p className="kicker text-primary mb-0.5">This Week's Big Story</p>
          <h2 className="headline text-2xl uppercase tracking-tight sm:text-3xl">
            Big News
          </h2>
        </div>
        <span className="kicker text-muted-foreground text-right sm:text-left shrink-0">
          {isLoading
            ? "Loading…"
            : !hero
            ? "No stories yet"
            : `${takes.length}/3 takes`}
        </span>
      </div>

      {/* ---- Loading skeleton ---- */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border bg-card p-4 skeleton" style={{ height: "280px" }} />
          ))}
        </div>
      )}

      {/* ---- Empty state ---- */}
      {!isLoading && !hero && (
        <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-card px-4">
          <p className="text-center text-sm text-muted-foreground">
            No stories yet — stories appear here once published.
          </p>
        </div>
      )}

      {/* ---- Netflix-style hero: 3 takes side by side ---- */}
      {!isLoading && hero && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {takes.map((take) => {
            if (!take) return null;
            const lean = take.lean as LeanKey;
            const v = LEAN_VARS[lean];
            const embedId = ytId(take);

            return (
              <article
                key={take.id}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-br p-4 shadow-lg transition hover:shadow-xl sm:border-0 sm:shadow-none ${
                  lean === "Democratic"
                    ? "border-blue-800/40 sm:border-blue-900/60"
                    : lean === "Republican"
                    ? "border-red-800/40 sm:border-red-900/60"
                    : "border-foreground/10 sm:border-foreground/20"
                }`}
                style={{ backgroundColor: v.bg, borderColor: v.border }}
              >
                {/* Video thumbnail — click-to-load iframe */}
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/40 cursor-pointer">
                  {embedId ? (
                    <>
                      {/* lazy iframe — loads on first interaction */}
                      <iframe
                        className="h-full w-full transition-transform duration-300 group-hover:scale-[1.02]"
                        src={`https://www.youtube.com/embed/${embedId}?autoplay=0&rel=0&modestbranding=1&controls=1&showinfo=0`}
                        title={`${lean} perspective video`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      {/* play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/60 backdrop-blur pointer-events-none">
                          <Play className="h-6 w-6 fill-white text-white drop-shadow-lg" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary text-muted-foreground">
                      <Play className="h-12 w-12" />
                    </div>
                  )}
                </div>

                {/* Take content */}
                <div className="mt-3">
                  {/* Lean label */}
                  <p
                    className="kicker text-xs font-bold uppercase tracking-widest"
                    style={{ color: v.color }}
                  >
                    {v.label}
                  </p>
                  <h3 className="headline text-xl font-bold leading-snug sm:text-2xl">
                    {take.headline}
                  </h3>
                  {take.summary_text && (
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {take.summary_text}
                    </p>
                  )}
                </div>

                {/* BIG NEWS badge — always visible, top-right */}
                <div className="absolute top-3 right-3 kicker text-[10px] font-black uppercase tracking-widest text-white/80 drop-shadow-lg z-10">
                  BIG NEWS
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ---- Bottom CTA strip ---- */}
      {!isLoading && hero && (
        <div className="mt-4 flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-sm">
          <Play className="h-5 w-5 text-primary shrink-0" />
          <p className="text-sm text-muted-foreground">
            Watch all three takes. Read the full story{" "}
            <Link
              to="/story/$id"
              params={{ id: hero.id }}
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              {hero.headline}
            </Link>
          </p>
          <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground" />
        </div>
      )}
    </section>
  );
}
