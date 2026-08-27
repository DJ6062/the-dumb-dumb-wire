import { createFileRoute } from "@tanstack/react-router";
import { StoryFeed } from "@/components/StoryFeed";

export const Route = createFileRoute("/op-ed")({
  head: () => ({
    meta: [
      { title: "Op-Ed — Hey! Dumb Dumb" },
      {
        name: "description",
        content:
          "Opinion columns from the right, the center, and the left on the same argument.",
      },
      { property: "og:title", content: "Op-Ed — Hey! Dumb Dumb" },
      {
        property: "og:description",
        content: "Three columnists, one argument, zero agreement.",
      },
    ],
  }),
  component: () => <StoryFeed fixedTopic="Op-Ed" title="Op-Ed" />,
});
