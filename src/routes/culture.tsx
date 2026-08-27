import { createFileRoute } from "@tanstack/react-router";
import { StoryFeed } from "@/components/StoryFeed";

export const Route = createFileRoute("/culture")({
  head: () => ({
    meta: [
      { title: "Culture — Hey! Dumb Dumb" },
      {
        name: "description",
        content:
          "Culture stories with the Republican, neutral, and Democratic coverage side by side.",
      },
      { property: "og:title", content: "Culture — Hey! Dumb Dumb" },
      {
        property: "og:description",
        content: "Culture wars, covered three ways at once.",
      },
    ],
  }),
  component: () => <StoryFeed fixedTopic="Culture" title="Culture" />,
});
