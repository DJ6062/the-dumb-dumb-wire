import { createServerFn } from "@tanstack/react-start";
import {
  archiveSchema,
  passwordSchema,
  storySchema,
  storyWithIdSchema,
  wireIdSchema,
  wireSchema,
} from "./admin-schema";

export const checkAdminPassword = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => passwordSchema.parse(d))
  .handler(async ({ data }) => {
    const { assertPassword } = await import("./admin.server");
    assertPassword(data.password);
    return { ok: true };
  });

export const createStory = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => storySchema.parse(d))
  .handler(async ({ data }) => {
    const { assertPassword, insertStory } = await import("./admin.server");
    assertPassword(data.password);
    return insertStory(data);
  });

export const updateStory = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => storyWithIdSchema.parse(d))
  .handler(async ({ data }) => {
    const { assertPassword, saveStory } = await import("./admin.server");
    assertPassword(data.password);
    return saveStory(data);
  });

export const setStoryArchived = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => archiveSchema.parse(d))
  .handler(async ({ data }) => {
    const { assertPassword, archiveStory } = await import("./admin.server");
    assertPassword(data.password);
    return archiveStory(data.id, data.archived);
  });

export const listAllStories = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => passwordSchema.parse(d))
  .handler(async ({ data }) => {
    const { assertPassword, allStories } = await import("./admin.server");
    assertPassword(data.password);
    return allStories();
  });

export const addWireLink = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => wireSchema.parse(d))
  .handler(async ({ data }) => {
    const { assertPassword, insertWire } = await import("./admin.server");
    assertPassword(data.password);
    return insertWire(data.headline_text, data.external_url);
  });

export const deleteWireLink = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => wireIdSchema.parse(d))
  .handler(async ({ data }) => {
    const { assertPassword, removeWire } = await import("./admin.server");
    assertPassword(data.password);
    return removeWire(data.id);
  });
