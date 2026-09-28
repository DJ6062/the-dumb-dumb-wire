import { createFileRoute } from "@tanstack/react-router";
import { WireSection } from "@/components/WireSection";
import { StoryFeed } from "@/components/StoryFeed";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hey!! Dum Dum — Three Takes on Every Story" },
      {
        name: "description",
        content:
          "A tabloid-dense news aggregator: raw wire links up top, then every story split into Left, Center, and Right coverage.",
      },
      { property: "og:title", content: "Hey!! Dum Dum — Three Takes on Every Story" },
      {
        name: "description",
        content: "Raw wire links up top. Left, Center, and Right takes below.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <>
      <WireSection />
      <section id="politics" className="scroll-mt-20">
        <StoryFeed fixedTopic="Politics" title="Politics" />
      </section>
      <section id="culture" className="scroll-mt-20">
        <StoryFeed fixedTopic="Culture" title="Culture" />
      </section>
      <section id="op-ed" className="scroll-mt-20">
        <StoryFeed fixedTopic="Op-Ed" title="Op-Ed" />
      </section>
    </>
  );
}
