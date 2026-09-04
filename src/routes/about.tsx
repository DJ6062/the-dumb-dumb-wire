import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Hey!! Dum Dum" },
      {
        name: "description",
        content:
          "Why this site exists: we aggregate and link out to existing outlets instead of assigning bias ourselves.",
      },
      { property: "og:title", content: "About — Hey!! Dum Dum" },
      {
        property: "og:description",
        content: "I'm dumb dumb! Who are you? Are you – dumb dumb – too?",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="headline text-4xl uppercase sm:text-5xl">About</h1>

      <blockquote className="mt-8 border-l-4 border-primary bg-card p-6">
        <p className="headline text-2xl italic leading-snug">
          "I'm dumb dumb! Who are you?
          <br />
          Are you – dumb dumb – too?
          <br />
          Then there's a pair of us!
          <br />
          Don't tell! they'd advertise – you know!"
        </p>
        <footer className="kicker mt-4 text-muted-foreground">
          With apologies to Emily Dickinson
        </footer>
      </blockquote>

      <div className="mt-8 space-y-5 text-base leading-relaxed">
        <p>
          Everybody looks like a dumb dumb from someone else's side of the aisle. That's
          the joke, and it's also the whole product. We don't think you're stupid — we
          think you're reading one column of a three-column story.
        </p>

        <h2 className="headline pt-4 text-2xl uppercase">The format</h2>
        <p>
          Above the fold is <strong>The Wire</strong>: a dense, all-caps dump of headline
          links straight out to the original outlets. No summaries, no framing, no us.
        </p>
        <p>
          Below it is the <strong>Story Grid</strong>. Each story is one card split into
          three columns — a right-leaning take, a neutral/center take, and a left-leaning
          take. Each column carries its own headline, a short summary, the outlet name
          with a link to the original piece, and a video segment when one exists. Read
          across, not down.
        </p>

        <h2 className="headline pt-4 text-2xl uppercase">Sourcing philosophy</h2>
        <p>
          We aggregate. We link. We don't rate outlets, score bias, or fact-check on your
          behalf. The column labels describe where a piece is <em>published</em>, not a
          verdict on whether it's right. If a summary reads unfairly, the fix is to click
          the source — that's why the link is always there.
        </p>
        <p>
          Everything on this site belongs to the outlet that reported it. We keep our
          summaries short on purpose, so the traffic and the credit go where they belong.
        </p>

        <h2 className="headline pt-4 text-2xl uppercase">Coming later</h2>
        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
          <li>
            <strong className="text-foreground">Dum Dum Meter</strong> — a small
            indicator per story showing how far apart the three takes actually are.
          </li>
          <li>
            <strong className="text-foreground">RSS import</strong> — pull candidate
            stories straight from outlet feeds to speed up entry.
          </li>
          <li>
            <strong className="text-foreground">Newsletter</strong> — the week's widest
            splits, in your inbox.
          </li>
        </ul>
      </div>
    </div>
  );
}
