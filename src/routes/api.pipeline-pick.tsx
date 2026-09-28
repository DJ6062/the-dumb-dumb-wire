import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const Route = createFileRoute("/api/pipeline-pick")({
  action: async ({ request }) => {
    // Auth: shared secret from env
    const apiKey = request.headers.get("x-pipeline-api-key") || "";
    if (apiKey !== process.env["PIPELINE_API_KEY"]) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    let data: {
      story_id?: string;
      headline?: string;
      topic?: string;
      url?: string;
      summary?: string;
      outlet?: string;
    };
    try {
      data = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "invalid json" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { story_id, headline, topic, url, summary, outlet } = data;

    // If story_id provided, just insert the perspective row
    if (story_id) {
      const lean = "Neutral";
      const result = await supabaseAdmin
        .from("perspectives")
        .insert({
          story_id,
          lean,
          headline: headline || "Untitled",
          summary_text: summary || "",
          source_name: outlet || "Rummy RSS",
          source_url: url || "",
        })
        .select()
        .maybeSingle();

      if (result.error) {
        return new Response(
          JSON.stringify({ error: result.error.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({ ok: true, story_id, perspective_id: result.data?.id }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // No story_id: insert story + perspective
    if (!headline || !topic) {
      return new Response(
        JSON.stringify({ error: "missing headline or topic" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const topicMap: Record<string, string> = {
      politics: "Politics",
      culture: "Culture",
      "op-ed": "Op-Ed",
    };
    const dbTopic = topicMap[topic] || topic;

    const storyResult = await supabaseAdmin
      .from("stories")
      .insert({
        topic: dbTopic,
        headline,
        date_published: new Date().toISOString(),
      })
      .select()
      .single();

    if (storyResult.error) {
      return new Response(
        JSON.stringify({ error: storyResult.error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const sid = storyResult.data!.id;

    const perspResult = await supabaseAdmin
      .from("perspectives")
      .insert({
        story_id: sid,
        lean: "Neutral",
        headline: headline,
        summary_text: summary || "",
        source_name: outlet || "Rummy RSS",
        source_url: url || "",
      })
      .select()
      .maybeSingle();

    if (perspResult.error) {
      console.error("perspective insert failed:", perspResult.error.message);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        story_id: sid,
        perspective_id: perspResult.data?.id,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  },
});
