#!/usr/bin/env node
/**
 * Post-build patch: fix TanStack Start SSR integration with Nitro/Vercel.
 *
 * The generated ssr.mjs exports `server_default` (an object with a `.fetch` method)
 * as its default export. Nitro's index.mjs must import it and call `.fetch()`.
 *
 * Two fixes:
 * 1. ssr.mjs: replace `handler.fetch(request, env, ctx)` with
 *    `handler(request, { context: ctx })` because createStartHandler returns a
 *    plain function, not an object with .fetch.
 * 2. index.mjs: replace Nitro's generated entry with a minimal one that imports
 *    the default export and calls its .fetch method.
 */
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = process.argv[2] || ".vercel/output";
const funcDir = join(outDir, "functions", "__server.func");
const ssrPath = join(funcDir, "_ssr", "ssr.mjs");
const indexPath = join(funcDir, "index.mjs");

async function patch() {
  // --- Fix 1: ssr.mjs ---
  const ssrSrc = await readFile(ssrPath, "utf8");
  const oldFetch = "await handler.fetch(request, env, ctx)";
  const newCall = "await handler(request, { context: ctx })";

  if (ssrSrc.includes(oldFetch)) {
    await writeFile(ssrPath, ssrSrc.split(oldFetch).join(newCall));
    console.log("[ssr] Fixed: handler.fetch → handler(request, { context: ctx })");
  } else if (ssrSrc.includes(newCall)) {
    console.log("[ssr] Already patched.");
  } else {
    console.log("[ssr] Pattern not found.");
  }

  // --- Fix 2: index.mjs ---
  const entry = `import startHandlerFn from "./_ssr/ssr.mjs";

export default {
  async fetch(request, env, context) {
    return startHandlerFn.fetch(request, env, context);
  },
};
`;
  await writeFile(indexPath, entry);
  console.log("[entry] Wrote index.mjs");
  console.log("\nDone. Deploy to apply.");
}

patch().catch(e => { console.error(e); process.exit(1); });
