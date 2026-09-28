import { Link } from "@tanstack/react-router";

const NAV = [
  { href: "#politics", label: "Politics" },
  { href: "#culture", label: "Culture" },
  { href: "#op-ed", label: "Op-Ed" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return (
    <header className="border-b-4 border-foreground bg-card">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col items-center gap-1 py-5 text-center">
          <Link to="/" className="block">
            <h1 className="headline text-4xl uppercase sm:text-6xl tracking-wide">
              Hey!!!{" "}
              <span className="text-primary">Dum Dum</span>
            </h1>
          </Link>
          <p className="kicker text-muted-foreground">
            Three takes. One story. Read them all.
          </p>
          <blockquote className="mt-3 border-l-4 border-primary bg-card/50 p-3">
            <p className="text-sm italic text-muted-foreground leading-snug">
              &ldquo;I&rsquo;m dumb dumb! Who are you?<br />
              Are you &ndash; dumb dumb &ndash; too?<br />
              Then there&rsquo;s a pair of us!<br />
              Don&rsquo;t tell! they&rsquo;d advertise &ndash; you know!&rdquo;
            </p>
            <footer className="kicker mt-1 text-xs text-muted-foreground/70">
              With apologies to Emily Dickinson
            </footer>
          </blockquote>
        </div>
        <nav className="flex items-center justify-center gap-1 border-t border-border py-2">
          {NAV.map((item) =>
            "href" in item ? (
              <a
                key={item.href}
                href={item.href}
                className="kicker px-3 py-1 text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className="kicker px-3 py-1 text-foreground transition-colors hover:bg-foreground hover:text-background"
                activeProps={{ className: "bg-foreground text-background" }}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t-4 border-foreground bg-card">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center">
        <p className="headline text-lg uppercase">Hey!! Dum Dum</p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          An aggregator. We link out to other people's journalism and let you
          compare the framing yourself. We don't assign bias — the outlets do
          that for free.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <Link to="/about" className="kicker underline underline-offset-4">
            About
          </Link>
          <Link to="/admin" className="kicker underline underline-offset-4">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
