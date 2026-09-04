import { readFileSync } from "node:fs";

export const config = {
  runtime: "edge",
  maxDuration: 5,
};

export default function handler(req: Request) {
  const url = new URL(req.url);
  if (url.pathname !== "/feed.json") {
    return new Response("not found", { status: 404 });
  }
  try {
    const raw = readFileSync("public/feed.json", "utf-8");
    return new Response(raw, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=60, must-revalidate",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new Response('{"error":"feed.json not found"}', {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
