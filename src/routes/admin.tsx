import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import {
  addWireLink,
  checkAdminPassword,
  createStory,
  deleteWireLink,
  listAllStories,
  setStoryArchived,
  updateStory,
} from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import {
  LEAN_ORDER,
  TOPICS,
  formatDate,
  parseYouTubeId,
  type Lean,
  type Topic,
  type WireLink,
} from "@/lib/news";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Hey!! Dum Dum" },
      { name: "description", content: "Password-protected content entry for editors." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin — Hey!! Dum Dum" },
      { property: "og:description", content: "Editor tools." },
    ],
  }),
  component: AdminPage,
});

type PerspectiveForm = {
  lean: Lean;
  headline: string;
  summary_text: string;
  source_name: string;
  source_url: string;
  youtube_video_id: string;
};

type StoryForm = {
  id?: string;
  topic: Topic;
  headline: string;
  date_published: string;
  perspectives: PerspectiveForm[];
};

type AdminStory = {
  id: string;
  topic: Topic;
  headline: string;
  date_published: string;
  archived: boolean;
  perspectives: PerspectiveForm[];
};

const emptyForm = (): StoryForm => ({
  topic: "Politics",
  headline: "",
  date_published: new Date().toISOString().slice(0, 10),
  perspectives: LEAN_ORDER.map((lean) => ({
    lean,
    headline: "",
    summary_text: "",
    source_name: "",
    source_url: "",
    youtube_video_id: "",
  })),
});

const inputClass =
  "w-full border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary";

function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState("");
  const check = useServerFn(checkAdminPassword);

  useEffect(() => {
    const saved = sessionStorage.getItem("hdd_admin_pw");
    if (saved) {
      setPassword(saved);
      check({ data: { password: saved } })
        .then(() => setAuthed(true))
        .catch(() => sessionStorage.removeItem("hdd_admin_pw"));
    }
  }, [check]);

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="headline text-3xl uppercase">Editor Login</h1>
        <form
          className="mt-6 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            try {
              await check({ data: { password } });
              sessionStorage.setItem("hdd_admin_pw", password);
              setAuthed(true);
            } catch {
              setError("Wrong password.");
            }
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            aria-label="Admin password"
            className={inputClass}
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button
            type="submit"
            className="kicker w-full bg-foreground px-4 py-2 text-background"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return <AdminDashboard password={password} />;
}

function AdminDashboard({ password }: { password: string }) {
  const queryClient = useQueryClient();
  const [stories, setStories] = useState<AdminStory[]>([]);
  const [wire, setWire] = useState<WireLink[]>([]);
  const [form, setForm] = useState<StoryForm>(emptyForm());
  const [status, setStatus] = useState("");
  const [wireHeadline, setWireHeadline] = useState("");
  const [wireUrl, setWireUrl] = useState("");

  const loadStories = useServerFn(listAllStories);
  const saveNew = useServerFn(createStory);
  const saveEdit = useServerFn(updateStory);
  const archive = useServerFn(setStoryArchived);
  const addWire = useServerFn(addWireLink);
  const removeWire = useServerFn(deleteWireLink);

  const refresh = async () => {
    const rows = (await loadStories({ data: { password } })) as unknown as AdminStory[];
    setStories(
      rows.map((s) => ({
        ...s,
        perspectives: [...(s.perspectives ?? [])].sort(
          (a, b) => LEAN_ORDER.indexOf(a.lean) - LEAN_ORDER.indexOf(b.lean),
        ),
      })),
    );
    const { data } = await supabase
      .from("wire_links")
      .select("*")
      .order("date_added", { ascending: false });
    setWire((data ?? []) as WireLink[]);
    queryClient.invalidateQueries();
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setPerspective = (lean: Lean, patch: Partial<PerspectiveForm>) =>
    setForm((prev) => ({
      ...prev,
      perspectives: prev.perspectives.map((p) => (p.lean === lean ? { ...p, ...patch } : p)),
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");
    const payload = {
      password,
      topic: form.topic,
      headline: form.headline,
      date_published: new Date(form.date_published).toISOString(),
      perspectives: form.perspectives.map((p) => ({
        ...p,
        youtube_video_id: parseYouTubeId(p.youtube_video_id),
      })),
    };
    try {
      if (form.id) {
        await saveEdit({ data: { ...payload, id: form.id } });
      } else {
        await saveNew({ data: payload });
      }
      setForm(emptyForm());
      await refresh();
      setStatus("Saved.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed.");
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="headline text-4xl uppercase">Newsroom</h1>

      <section className="mt-8 border border-border bg-card p-5">
        <h2 className="headline text-2xl uppercase">
          {form.id ? "Edit story" : "New story"}
        </h2>
        <form className="mt-4 space-y-4" onSubmit={submit}>
          <div className="grid gap-3 sm:grid-cols-[160px_1fr_180px]">
            <select
              value={form.topic}
              aria-label="Topic"
              onChange={(e) => setForm({ ...form, topic: e.target.value as Topic })}
              className={inputClass}
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <input
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              placeholder="Story headline"
              aria-label="Story headline"
              required
              className={inputClass}
            />
            <input
              type="date"
              value={form.date_published}
              aria-label="Publish date"
              onChange={(e) => setForm({ ...form, date_published: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {form.perspectives.map((p) => (
              <div key={p.lean} className="space-y-2 border border-border p-3">
                <p className="kicker">{p.lean}</p>
                <input
                  value={p.headline}
                  onChange={(e) => setPerspective(p.lean, { headline: e.target.value })}
                  placeholder="Headline"
                  aria-label={`${p.lean} headline`}
                  className={inputClass}
                />
                <textarea
                  value={p.summary_text}
                  onChange={(e) => setPerspective(p.lean, { summary_text: e.target.value })}
                  placeholder="2-3 sentence summary"
                  aria-label={`${p.lean} summary`}
                  rows={4}
                  className={inputClass}
                />
                <input
                  value={p.source_name}
                  onChange={(e) => setPerspective(p.lean, { source_name: e.target.value })}
                  placeholder="Source outlet"
                  aria-label={`${p.lean} source outlet`}
                  className={inputClass}
                />
                <input
                  value={p.source_url}
                  onChange={(e) => setPerspective(p.lean, { source_url: e.target.value })}
                  placeholder="https://source-url"
                  aria-label={`${p.lean} source url`}
                  className={inputClass}
                />
                <input
                  value={p.youtube_video_id}
                  onChange={(e) =>
                    setPerspective(p.lean, { youtube_video_id: e.target.value })
                  }
                  placeholder="YouTube URL or ID"
                  aria-label={`${p.lean} YouTube video`}
                  className={inputClass}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="kicker bg-foreground px-4 py-2 text-background"
            >
              {form.id ? "Update story" : "Publish story"}
            </button>
            {form.id ? (
              <button
                type="button"
                onClick={() => setForm(emptyForm())}
                className="kicker border border-border px-4 py-2"
              >
                Cancel edit
              </button>
            ) : null}
            {status ? <span className="text-sm text-muted-foreground">{status}</span> : null}
          </div>
        </form>
      </section>

      <section className="mt-8 border border-border bg-card p-5">
        <h2 className="headline text-2xl uppercase">Wire links</h2>
        <form
          className="mt-4 grid gap-2 sm:grid-cols-[2fr_2fr_auto]"
          onSubmit={async (e) => {
            e.preventDefault();
            await addWire({
              data: { password, headline_text: wireHeadline, external_url: wireUrl },
            });
            setWireHeadline("");
            setWireUrl("");
            await refresh();
          }}
        >
          <input
            value={wireHeadline}
            onChange={(e) => setWireHeadline(e.target.value)}
            placeholder="HEADLINE TEXT..."
            aria-label="Wire headline"
            required
            className={inputClass}
          />
          <input
            value={wireUrl}
            onChange={(e) => setWireUrl(e.target.value)}
            placeholder="https://external-url"
            aria-label="Wire link URL"
            required
            className={inputClass}
          />
          <button type="submit" className="kicker bg-foreground px-4 py-2 text-background">
            Add
          </button>
        </form>
        <ul className="mt-4 divide-y divide-border">
          {wire.map((link) => (
            <li key={link.id} className="flex items-center justify-between gap-3 py-2">
              <span className="wire-link text-sm">{link.headline_text}</span>
              <button
                type="button"
                aria-label={`Remove ${link.headline_text}`}
                onClick={async () => {
                  await removeWire({ data: { password, id: link.id } });
                  await refresh();
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 border border-border bg-card p-5">
        <h2 className="headline text-2xl uppercase">All stories</h2>
        <ul className="mt-4 divide-y divide-border">
          {stories.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p className="kicker text-muted-foreground">
                  {s.topic} · {formatDate(s.date_published)}
                  {s.archived ? " · ARCHIVED" : ""}
                </p>
                <p className="headline text-lg uppercase">{s.headline}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setForm({
                      id: s.id,
                      topic: s.topic,
                      headline: s.headline,
                      date_published: s.date_published.slice(0, 10),
                      perspectives: LEAN_ORDER.map(
                        (lean) =>
                          s.perspectives.find((p) => p.lean === lean) ?? {
                            lean,
                            headline: "",
                            summary_text: "",
                            source_name: "",
                            source_url: "",
                            youtube_video_id: "",
                          },
                      ),
                    })
                  }
                  className="kicker border border-border px-3 py-1.5"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await archive({ data: { password, id: s.id, archived: !s.archived } });
                    await refresh();
                  }}
                  className="kicker border border-border px-3 py-1.5"
                >
                  {s.archived ? "Restore" : "Archive"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
