import { createFileRoute } from "@tanstack/react-router";
import { notFound } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { ExternalLink } from "lucide-react";
import { type Perspective, type Story } from "@/lib/news";

function isUsableKey(value: string | undefined | null): value is string {
  if (!value) return false;
  const v = value.trim();
  if (!v) return false;
  if (v === "[SENSITIVE]" || v.toLowerCase() === "your-key") return false;
  return v.length >= 20;
}

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

/**
 * Server client for public story reads.
 * Prefer publishable key (Lovable / new Supabase API keys). Fall back to a real anon JWT.
 * Never treat placeholder values like "[SENSITIVE]" as valid.
 */
function getServerClient() {
  const url =
    process.env["SUPABASE_URL"] ||
    process.env["VITE_SUPABASE_URL"] ||
    "";
  const keyCandidates = [
    process.env["SUPABASE_PUBLISHABLE_KEY"],
    process.env["VITE_SUPABASE_PUBLISHABLE_KEY"],
    process.env["SUPABASE_ANON_KEY"],
  ];
  const key = keyCandidates.find(isUsableKey);
  if (!url || !key) {
    throw new Error("Missing Supabase env vars (need SUPABASE_URL + publishable/anon key)");
  }
  return createClient(url, key, {
    global: { fetch: createSupabaseFetch(key) },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

const LEAN_ORDER = ["Republican", "Neutral", "Democratic"] as const;
const LEAN_STYLES: Record<string, { border: string; text: string; label: string }> = {
  Republican: { border: "border-t-rep", text: "text-rep", label: "Republican View" },
  Neutral:    { border: "border-t-neu", text: "text-neu", label: "Neutral / Center View" },
  Democratic: { border: "border-t-dem", text: "text-dem", label: "Democratic View" },
};

function TakeCard({ take, idx }: { take: Perspective; idx: number }) {
  const styles = LEAN_STYLES[take.lean] ?? { border: "border-t-foreground", text: "text-foreground", label: take.lean };
  return (
    <article className="border border-border bg-card shadow-sm">
      <div className="flex items-baseline justify-between gap-2 border-b border-border px-4 py-3">
        <p className={`kicker ${styles.text}`}>{styles.label}</p>
        <span className="kicker text-muted-foreground text-xs">Take {idx + 1} of {LEAN_ORDER.length}</span>
      </div>
      <div className="p-4">
        <h3 className="headline mt-1 text-xl uppercase">{take.headline}</h3>
        {take.summary_text && (
          <p className="mt-3 text-sm leading-relaxed text-foreground/85">{take.summary_text}</p>
        )}
        {take.source_url ? (
          <a
            href={take.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide underline underline-offset-4 hover:text-primary"
          >
            {take.source_name || "Source"}
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export const Route = createFileRoute("/story/$id")({
  loader: async ({ params }) => {
    if (!params.id) throw notFound();
    const supabase = getServerClient();
    const { data, error } = await supabase
      .from("stories")
      .select(`id, topic, headline, date_published, archived,
              perspectives (id, lean, headline, summary_text, source_name, source_url, youtube_video_id)`)
      .eq("id", params.id)
      .single();
    if (error || !data) throw notFound();
    const sorted = [...(data.perspectives ?? [])].sort((a, b) =>
      LEAN_ORDER.indexOf(a.lean as (typeof LEAN_ORDER)[number]) -
      LEAN_ORDER.indexOf(b.lean as (typeof LEAN_ORDER)[number])
    );
    return { ...data, perspectives: sorted } as Story;
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.id.slice(0, 8)} — Hey!! Dum Dum` },
      { name: "description", content: "Three takes on one story." },
    ],
  }),
  component: function StoryPage() {
    const story = Route.useLoaderData() as Story;
    const takes = LEAN_ORDER.map((lean) => story.perspectives.find((p) => p.lean === lean)).filter(Boolean) as Perspective[];
    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 border-b-2 border-foreground pb-4">
          <h1 className="headline text-3xl uppercase sm:text-4xl">{story.headline}</h1>
          <p className="mt-2 kicker text-muted-foreground">
            {story.topic} · {new Date(story.date_published).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
          </p>
        </div>
        {takes.length > 0 ? (
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {takes.map((p, i) => <TakeCard key={p.id} take={p} idx={i} />)}
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No takes yet. Even dumb dumbs need sources.
          </p>
        )}
      </section>
    );
  },
});
// rebuild trigger
