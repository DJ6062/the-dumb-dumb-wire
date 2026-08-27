import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const leanSchema = z.enum(["Republican", "Neutral", "Democratic"]);

const perspectiveSchema = z.object({
  lean: leanSchema,
  headline: z.string().default(""),
  summary_text: z.string().default(""),
  source_name: z.string().default(""),
  source_url: z.string().default(""),
  youtube_video_id: z.string().default(""),
});

const createStorySchema = z.object({
  password: z.string(),
  topic: z.enum(["Politics", "Culture", "Op-Ed"]),
  headline: z.string().min(1),
  date_published: z.string().optional(),
  perspectives: z.array(perspectiveSchema).length(3),
});

function assertPassword(password: string) {
  const expected = process.env["ADMIN_PASSWORD"];
  if (!expected || password !== expected) {
    throw new Error("Wrong password.");
  }
}

export const checkAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string() }).parse(d))
  .handler(async ({ data }) => {
    assertPassword(data.password);
    return { ok: true };
  });

export const createStory = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => createStorySchema.parse(d))
  .handler(async ({ data }) => {
    assertPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
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
  });

export const updateStory = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    createStorySchema.extend({ id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    assertPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
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
  });

export const setStoryArchived = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ password: z.string(), id: z.string().uuid(), archived: z.boolean() }).parse(d),
  )
  .handler(async ({ data }) => {
    assertPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("stories")
      .update({ archived: data.archived })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAllStories = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ password: z.string() }).parse(d))
  .handler(async ({ data }) => {
    assertPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("stories")
      .select("id, topic, headline, date_published, archived, perspectives(*)")
      .order("date_published", { ascending: false });
    if (error) throw new Error(error.message);
    return rows ?? [];
  });

export const addWireLink = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z
      .object({
        password: z.string(),
        headline_text: z.string().min(1),
        external_url: z.string().min(1),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    assertPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("wire_links").insert({
      headline_text: data.headline_text,
      external_url: data.external_url,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteWireLink = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) =>
    z.object({ password: z.string(), id: z.string().uuid() }).parse(d),
  )
  .handler(async ({ data }) => {
    assertPassword(data.password);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("wire_links").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
