import { createFileRoute } from "@tanstack/react-router";
import { StoryFeed } from "@/components/StoryFeed";

export const Route = createFileRoute("/politics")({
  head: () => ({
    meta: [
      { title: "Politics — Hey!! Dum Dum" },
      {
        name: "description",
        content:
          "Political stories with the Republican, neutral, and Democratic coverage side by side.",
      },
      { property: "og:title", content: "Politics — Hey!! Dum Dum" },
      {
        property: "og:description",
        content: "Political stories, three framings at a time.",
      },
    ],
  }),
  component: () => <StoryFeed fixedTopic="Politics" title="Politics" />,
});
