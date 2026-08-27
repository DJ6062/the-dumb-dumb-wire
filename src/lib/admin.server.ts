import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { StoryInput } from "./admin-schema";

export function assertPassword(password: string) {
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected || password !== expected) {
    throw new Error("Wrong password.");
  }
}

export async function insertStory(data: StoryInput) {
  const { data: story, error } = await supabaseAdmin
    .from("stories")
    .insert({
      topic: data.topic,
      headline: data.headline,
      ...(data.date_published ? { date_published: data.date_published } : {}),
    })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  const { error: pErr } = await supabaseAdmin
    .from("perspectives")
    .insert(data.perspectives.map((p) => ({ ...p, story_id: story.id })));
  if (pErr) throw new Error(pErr.message);
  return { id: story.id };
}

export async function saveStory(data: StoryInput & { id: string }) {
  const { error } = await supabaseAdmin
    .from("stories")
    .update({
      topic: data.topic,
      headline: data.headline,
      ...(data.date_published ? { date_published: data.date_published } : {}),
    })
    .eq("id", data.id);
  if (error) throw new Error(error.message);
  for (const p of data.perspectives) {
    const { error: pErr } = await supabaseAdmin
      .from("perspectives")
      .upsert({ ...p, story_id: data.id }, { onConflict: "story_id,lean" });
    if (pErr) throw new Error(pErr.message);
  }
  return { ok: true };
}

export async function archiveStory(id: string, archived: boolean) {
  const { error } = await supabaseAdmin.from("stories").update({ archived }).eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function allStories() {
  const { data, error } = await supabaseAdmin
    .from("stories")
    .select("id, topic, headline, date_published, archived, perspectives(*)")
    .order("date_published", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function insertWire(headline_text: string, external_url: string) {
  const { error } = await supabaseAdmin
    .from("wire_links")
    .insert({ headline_text, external_url });
  if (error) throw new Error(error.message);
  return { ok: true };
}

export async function removeWire(id: string) {
  const { error } = await supabaseAdmin.from("wire_links").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return { ok: true };
}
