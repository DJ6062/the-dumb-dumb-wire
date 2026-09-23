#!/usr/bin/env node
/**
 * Safety net for Nitro/Vercel SSR output.
 *
 * TanStack's createStartHandler() returns a plain RequestHandler function.
 * Older builds sometimes emitted `handler.fetch(request, env, ctx)`.
 * When that pattern is present, rewrite it to call the handler as a function.
 *
 * Do NOT overwrite Nitro's generated index.mjs — that breaks routing.
 */
import { readFile, writeFile, access } from "node:fs/promises";
import { join } from "node:path";

const outDir = process.argv[2] || ".vercel/output";
const ssrPath = join(outDir, "functions", "__server.func", "_ssr", "ssr.mjs");

const SSR_OLD = "await handler.fetch(request, env, ctx)";
const SSR_NEW = "await handler(request, { context: ctx })";

async function exists(path) {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function patch() {
  if (!(await exists(ssrPath))) {
    console.log(`[ssr] Skip — not found: ${ssrPath}`);
    return;
  }

  const ssr = await readFile(ssrPath, "utf8");
  if (ssr.includes(SSR_OLD)) {
    await writeFile(ssrPath, ssr.split(SSR_OLD).join(SSR_NEW));
    console.log("[ssr] Fixed handler.fetch → handler(request, { context: ctx })");
  } else if (ssr.includes("await handler(request")) {
    console.log("[ssr] Already using function-style handler() — no patch needed.");
  } else {
    console.log("[ssr] Pattern not found. Lines with handler:");
    for (const [i, line] of ssr.split("\n").entries()) {
      if (line.includes("handler.fetch") || /await handler\(/.test(line)) {
        console.log(`  ${i + 1}: ${line.trim()}`);
      }
    }
  }
}

patch().catch((e) => {
  console.error(e);
  process.exit(1);
});
