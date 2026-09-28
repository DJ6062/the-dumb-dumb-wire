import { createStart, createCsrfMiddleware, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";
import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher";

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

// CSRF protection for all serverFns, except the pipeline-pick endpoint
// which is called by the Discord bot over plain HTTP with an
// x-pipeline-api-key header (no browser/CSRF context).
const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => {
    if (ctx.request.headers.get("x-pipeline-api-key")) {
      return false; // skip CSRF for bot calls
    }
    return ctx.handlerType === "serverFn";
  },
});

export const startInstance = createStart(() => ({
  functionMiddleware: [attachSupabaseAuth],
  requestMiddleware: [errorMiddleware, csrfMiddleware],
}));
