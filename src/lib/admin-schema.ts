import { z } from "zod";

export const perspectiveSchema = z.object({
  lean: z.enum(["Republican", "Neutral", "Democratic"]),
  headline: z.string().default(""),
  summary_text: z.string().default(""),
  source_name: z.string().default(""),
  source_url: z.string().default(""),
  youtube_video_id: z.string().default(""),
});

export const storySchema = z.object({
  password: z.string(),
  topic: z.enum(["Politics", "Culture", "Op-Ed"]),
  headline: z.string().min(1),
  date_published: z.string().optional(),
  perspectives: z.array(perspectiveSchema).length(3),
});

export const storyWithIdSchema = storySchema.extend({ id: z.string().uuid() });
export const passwordSchema = z.object({ password: z.string() });
export const archiveSchema = z.object({
  password: z.string(),
  id: z.string().uuid(),
  archived: z.boolean(),
});
export const wireSchema = z.object({
  password: z.string(),
  headline_text: z.string().min(1),
  external_url: z.string().min(1),
});
export const wireIdSchema = z.object({ password: z.string(), id: z.string().uuid() });

export type StoryInput = z.infer<typeof storySchema>;
