import { createFileRoute } from "@tanstack/react-router";
import { readFileSync } from "fs";
import { join } from "path";

export const Route = createFileRoute("/api/feed/json")({
  async handler() {
    const feedPath = join(process.cwd(), "public", "feed.json");
    try {
      const raw = readFileSync(feedPath, "utf-8");
      return new Response(raw, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "public, max-age=60, must-revalidate",
          "Content-Disposition": 'inline; filename="feed.json"',
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch {
      return new Response('{"error":"feed.json not found"}', {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
