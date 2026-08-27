import { useState } from "react";
import { Play } from "lucide-react";

export function LazyYouTube({ videoId, title }: { videoId: string; title: string }) {
  const [active, setActive] = useState(false);

  if (!videoId) return null;

  if (active) {
    return (
      <div className="aspect-video w-full overflow-hidden border border-border bg-foreground">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={`Play video: ${title}`}
      className="group relative block aspect-video w-full overflow-hidden border border-border bg-secondary"
    >
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt={`Video thumbnail: ${title}`}
        loading="lazy"
        className="h-full w-full object-cover transition-opacity group-hover:opacity-80"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
          <Play className="h-5 w-5 translate-x-px" fill="currentColor" />
        </span>
      </span>
    </button>
  );
}
