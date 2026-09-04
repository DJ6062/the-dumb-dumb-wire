CREATE TYPE public.story_topic AS ENUM ('Politics','Culture','Op-Ed');
CREATE TYPE public.perspective_lean AS ENUM ('Republican','Neutral','Democratic');

CREATE TABLE public.stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  topic public.story_topic NOT NULL,
  headline TEXT NOT NULL,
  date_published TIMESTAMPTZ NOT NULL DEFAULT now(),
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.perspectives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.stories(id) ON DELETE CASCADE,
  lean public.perspective_lean NOT NULL,
  headline TEXT NOT NULL DEFAULT '',
  summary_text TEXT NOT NULL DEFAULT '',
  source_name TEXT NOT NULL DEFAULT '',
  source_url TEXT NOT NULL DEFAULT '',
  youtube_video_id TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (story_id, lean)
);

CREATE TABLE public.wire_links (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  headline_text TEXT NOT NULL,
  external_url TEXT NOT NULL,
  date_added TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.stories TO anon, authenticated;
GRANT SELECT ON public.perspectives TO anon, authenticated;
GRANT SELECT ON public.wire_links TO anon, authenticated;
GRANT ALL ON public.stories TO service_role;
GRANT ALL ON public.perspectives TO service_role;
GRANT ALL ON public.wire_links TO service_role;

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perspectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wire_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read live stories" ON public.stories FOR SELECT TO anon, authenticated USING (archived = false);
CREATE POLICY "Public can read perspectives" ON public.perspectives FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.stories s WHERE s.id = perspectives.story_id AND s.archived = false));
CREATE POLICY "Public can read wire links" ON public.wire_links FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.stories (id, topic, headline, date_published) VALUES
 ('11111111-1111-1111-1111-111111111111','Politics','SENATE BUDGET SHOWDOWN GOES TO THE WIRE', now() - interval '1 day'),
 ('22222222-2222-2222-2222-222222222222','Politics','BORDER BILL COLLAPSES AGAIN ON THE HOUSE FLOOR', now() - interval '3 day'),
 ('33333333-3333-3333-3333-333333333333','Culture','STREAMING GIANT PULLS DOCUMENTARY AFTER BACKLASH', now() - interval '5 day'),
 ('44444444-4444-4444-4444-444444444444','Op-Ed','IS ANYONE STILL READING PAST THE HEADLINE?', now() - interval '7 day');

INSERT INTO public.perspectives (story_id, lean, headline, summary_text, source_name, source_url, youtube_video_id) VALUES
 ('11111111-1111-1111-1111-111111111111','Republican','SPENDING SPREE MUST END','Placeholder summary. Conservative outlets frame the standoff as a long-overdue fight against runaway federal spending. They argue the deficit, not the shutdown threat, is the real emergency.','Placeholder Right Daily','https://example.com/right/budget','dQw4w9WgXcQ'),
 ('11111111-1111-1111-1111-111111111111','Neutral','NEGOTIATORS RUN OUT OF CALENDAR','Placeholder summary. Wire services report both caucuses remain roughly $80 billion apart with three legislative days left. A short-term continuing resolution is the most likely outcome.','Placeholder Wire Service','https://example.com/wire/budget','aqz-KE-bpKQ'),
 ('11111111-1111-1111-1111-111111111111','Democratic','CUTS WOULD HIT FAMILIES FIRST','Placeholder summary. Progressive outlets emphasize which programs face the deepest reductions and who depends on them. They frame the impasse as a choice about priorities, not arithmetic.','Placeholder Left Daily','https://example.com/left/budget','ScMzIvxBSi4'),

 ('22222222-2222-2222-2222-222222222222','Republican','ENFORCEMENT GUTTED, AGAIN','Placeholder summary. Right-leaning coverage focuses on enforcement provisions stripped in committee. The bill is described as a messaging exercise rather than a border fix.','Placeholder Right Wire','https://example.com/right/border','dQw4w9WgXcQ'),
 ('22222222-2222-2222-2222-222222222222','Neutral','VOTE COUNT NEVER MATERIALIZED','Placeholder summary. Neutral reporting notes leadership pulled the bill after failing to secure 218 votes. Both parties blame the other for the collapse.','Placeholder Wire Service','https://example.com/wire/border','aqz-KE-bpKQ'),
 ('22222222-2222-2222-2222-222222222222','Democratic','ASYLUM PROTECTIONS AT STAKE','Placeholder summary. Left-leaning outlets highlight the asylum restrictions in the draft text and the objections from advocacy groups. They frame the failure as avoiding a harmful compromise.','Placeholder Left Wire','https://example.com/left/border','ScMzIvxBSi4'),

 ('33333333-3333-3333-3333-333333333333','Republican','ANOTHER QUIET CANCELLATION','Placeholder summary. Conservative commentary treats the removal as evidence of a narrowing window for dissenting films. The platform''s explanation is described as vague.','Placeholder Right Culture','https://example.com/right/doc','dQw4w9WgXcQ'),
 ('33333333-3333-3333-3333-333333333333','Neutral','PLATFORM CITES LICENSING','Placeholder summary. Trade press reports the title was removed at the end of a licensing window, days after a public complaint. The timing remains unexplained.','Placeholder Trade Weekly','https://example.com/wire/doc','aqz-KE-bpKQ'),
 ('33333333-3333-3333-3333-333333333333','Democratic','SUBJECTS SAY THEY WERE MISLED','Placeholder summary. Left-leaning coverage centers on participants who say their interviews were edited misleadingly. Editorial standards, not censorship, drive the framing.','Placeholder Left Culture','https://example.com/left/doc','ScMzIvxBSi4'),

 ('44444444-4444-4444-4444-444444444444','Republican','THE PRESS EARNED THE DISTRUST','Placeholder summary. A conservative columnist argues that headline-only reading is a rational response to years of corrected stories. Trust, the piece says, is a lagging indicator.','Placeholder Right Opinion','https://example.com/right/oped','dQw4w9WgXcQ'),
 ('44444444-4444-4444-4444-444444444444','Neutral','ATTENTION IS THE SCARCE RESOURCE','Placeholder summary. A media researcher summarizes studies showing most shares happen without a click. The problem is described as structural rather than partisan.','Placeholder Media Review','https://example.com/wire/oped','aqz-KE-bpKQ'),
 ('44444444-4444-4444-4444-444444444444','Democratic','OUTRAGE PAYS BETTER THAN CONTEXT','Placeholder summary. A progressive essayist blames ad-driven incentives that reward inflammatory headlines. The fix proposed is funding models that pay for depth.','Placeholder Left Opinion','https://example.com/left/oped','ScMzIvxBSi4');

INSERT INTO public.wire_links (headline_text, external_url, date_added) VALUES
 ('SENATE STAYS IN SESSION THROUGH WEEKEND...','https://example.com/wire/1', now()),
 ('POLLS TIGHTEN IN THREE SWING STATES...','https://example.com/wire/2', now() - interval '2 hour'),
 ('GOVERNOR SIGNS SURPRISE ENERGY ORDER...','https://example.com/wire/3', now() - interval '4 hour'),
 ('NETWORK ANCHOR OUT AFTER HOT MIC...','https://example.com/wire/4', now() - interval '6 hour'),
 ('CITY COUNCIL VOTES AT 3AM...','https://example.com/wire/5', now() - interval '8 hour'),
 ('MARKETS SHRUG OFF SHUTDOWN TALK...','https://example.com/wire/6', now() - interval '10 hour'),
 ('LEAKED MEMO ROILS CAMPAIGN STAFF...','https://example.com/wire/7', now() - interval '12 hour'),
 ('SCHOOL BOARD FIGHT GOES VIRAL...','https://example.com/wire/8', now() - interval '14 hour');