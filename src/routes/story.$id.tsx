import { createFileRoute } from "@tanstack/react-router";
import { notFound } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { ExternalLink, EyeOff } from "lucide-react";
import { LEAN_ORDER, LEAN_DB_TO_UI, formatDate, type Perspective, type Story } from "@/lib/news";

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

const LEAN_STYLES: Record<string, { border: string; text: string; label: string }> = {
  Left:    { border: "border-t-left", text: "text-left",  label: "Left View" },
  Center:  { border: "border-t-cen",  text: "text-cen",   label: "Center / Neutral View" },
  Right:   { border: "border-t-rep",  text: "text-right", label: "Right View" },
};

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

    const sorted = [...(data.perspectives ?? [])].map((p) => ({
      ...p,
      lean: LEAN_DB_TO_UI[p.lean as keyof typeof LEAN_DB_TO_UI] ?? p.lean,
    })).sort((a, b) => {
      const order = ["Left", "Center", "Right"] as const;
      return order.indexOf(a.lean as any) - order.indexOf(b.lean as any);
    });

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

    return (
      <section className="mx-auto max-w-6xl px-4 py-8">
        {/* ---- Header ---- */}
        <div className="mb-6 border-b-2 border-foreground pb-4">
          <h1 className="headline text-3xl uppercase sm:text-4xl">{story.headline}</h1>
          <p className="mt-2 kicker text-muted-foreground">
            {story.topic} · {new Date(story.date_published).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* ---- Takes: full-width stacked rows (NOT 3-column grid) ---- */}
        {story.perspectives.length > 0 ? (
          <div className="grid grid-cols-1 divide-y divide-border">
            {story.perspectives.map((take, i) => {
              const styles =
                LEAN_STYLES[take.lean] ?? {
                  border: "border-t-foreground",
                  text: "text-foreground",
                  label: take.lean,
                };
              return (
                <div
                  key={take.id}
                  className={`p-4 sm:p-5 first:pt-1 ${styles.border}`}
                >
                  {/* Lean label + take counter */}
                  <div className="flex items-baseline justify-between gap-2 border-b border-border pb-3">
                    <p
                      className={`kicker text-xs font-bold uppercase tracking-widest ${styles.text}`}
                    >
                      {styles.label}
                    </p>
                    <span className="kicker text-muted-foreground text-xs">
                      Take {i + 1} of {story.perspectives.length}
                    </span>
                  </div>
                  {/* Take headline + summary + source */}
                  <div className="mt-4">
                    <h3 className="headline mt-1 text-xl uppercase">{take.headline}</h3>
                    {take.summary_text && (
                      <p className="mt-3 text-sm leading-relaxed text-foreground/85">
                        {take.summary_text}
                      </p>
                    )}
                    {take.source_url && (
                      <a
                        href={take.source_url}
                        target="__blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide underline underline-offset-4 hover:text-primary"
                      >
                        {take.source_name || "Source"}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
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
