import { useQuery } from "@tanstack/react-query";
import { wireQuery } from "@/lib/news";

export function WireSection() {
  const { data: links, isLoading } = useQuery(wireQuery);

  return (
    <section className="mx-auto max-w-6xl px-4 pt-8">
      <div className="flex items-baseline justify-between border-b-2 border-foreground pb-2">
        <h2 className="headline text-2xl uppercase">The Wire</h2>
        <span className="kicker text-muted-foreground">Raw links. No commentary.</span>
      </div>
      {isLoading ? (
        <p className="py-6 text-sm text-muted-foreground">Loading the wire...</p>
      ) : (
        <ul className="grid gap-x-8 gap-y-2 py-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {(links ?? []).map((link) => (
            <li key={link.id} className="border-b border-dashed border-border pb-2">
              <a
                href={link.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="wire-link"
              >
                {link.headline_text}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
