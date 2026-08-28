# The Daily Dumb

Build a Drudge Report–style political news aggregator called "Hey!! Dum Dum".

Concept & Branding

Tagline / About-page text (a riff on Emily Dickinson's "I'm Nobody! Who are you?"): "I'm dumb dumb! Who are you? Are you – dumb dumb – too? Then there's a pair of us! Don't tell! they'd advertise – you know!"

Tone: self-aware, tongue-in-cheek media-literacy site — pokes fun at how everyone looks "dumb dumb" from someone else's political side, while still taking the actual journalism seriously.

Visual style: dense, headline-driven tabloid layout (Drudge Report DNA) modernized with clean card grids, bold serif headline type, high-contrast dark-on-light or newsprint palette. Avoid generic SaaS-blue styling — go for "digital newsstand."

Site Structure

Top nav: Politics | Culture | Op-Ed | About

Homepage, top section — "The Wire" A dense, all-caps ticker/list of bold headline links (Drudge-style), each linking out to the original external source. This is the raw, unfiltered link dump above the fold.

Below the fold — Story Grid Each story is a single card. Every card splits into three side-by-side sub-columns:

Republican ViewNeutral / Center ViewDemocratic ViewHeadlineHeadlineHeadline2–3 sentence summary2–3 sentence summary2–3 sentence summarySource outlet name + linkSource outlet name + linkSource outlet name + linkEmbedded YouTube videoEmbedded YouTube videoEmbedded YouTube video

Color-code the three columns subtly (e.g. red / gray-purple / blue accent borders) — keep it a visual cue, not a loud partisan skin.

On mobile, columns stack vertically in order: Republican → Neutral → Democratic.

Cards filterable by topic (Politics / Culture / Op-Ed) via the nav or a filter bar.

Data Model

Story {
  id
  topic: "Politics" | "Culture" | "Op-Ed"
  headline
  date_published
  perspectives: [
    {
      lean: "Republican" | "Neutral" | "Democratic"
      summary_text
      source_name
      source_url
      youtube_video_id
    }
  ]
}

WireLink {
  id
  headline_text
  external_url
  date_added
}

Admin / Content Entry

Build a simple admin page (password-gated) to:

Add a new Story with its three perspective entries (paste in summary text + YouTube URL/ID + source link for each)

Add/remove Wire ticker links

Edit or archive existing stories

Functional Requirements

Responsive grid, fast load, lazy-load YouTube embeds (don't autoplay)

Topic filter tabs

Search bar across headlines

"About" page with the Dickinson-riff tagline and a short explainer of the site's format and sourcing philosophy (i.e., the site aggregates and links to existing outlets rather than assigning bias itself)

Simple, clean typography hierarchy: bold headline serif font for headlines, readable sans-serif for summaries

Nice-to-haves (v2, mention as future scope)

"Dumb Dumb Meter" — a small visual indicator per story showing how far apart the three takes are

RSS/feed import to speed up story creation

Newsletter signup

Build this as a full working site with sample seed data (3–4 example stories across the three topics, using placeholder text and real embeddable YouTube video IDs) so the layout can be reviewed immediately.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://the-dumb-dumb-wire.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8f215cf6-284b-4102-946f-60e424a48a82).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
