import { createFileRoute } from "@tanstack/react-router";
import { WireSection } from "@/components/WireSection";
import { StoryFeed } from "@/components/StoryFeed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hey! Dumb Dumb — Three Takes on Every Story" },
      {
        name: "description",
        content:
          "A tabloid-dense news aggregator: raw wire links up top, then every story split into Republican, neutral, and Democratic coverage.",
      },
      { property: "og:title", content: "Hey! Dumb Dumb — Three Takes on Every Story" },
      {
        property: "og:description",
        content: "Raw wire links up top. Republican, neutral, and Democratic takes below.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <WireSection />
      <StoryFeed />
    </>
  );
}
