-- ============================================
-- Hey!! Dum Dum — Seed Data Expansion
-- Adds 11 more stories (5+ per category) with
-- real YouTube video IDs for the "Top Pick"
-- wire section.
-- Run in Supabase SQL editor.
-- ============================================

-- ---- POLITICS: 3 new stories ----

INSERT INTO public.stories (id, topic, headline, date_published) VALUES
  ('55555555-5555-5555-5555-555555555555', 'Politics', 'NEW SUPREME COURT TERM PROMISES BLOCKBUSTER BATTLES', now() - interval '10 day'),
  ('66666666-6666-6666-6666-666666666666', 'Politics', 'FEDERAL WORKERS FACE UNCERTAINTY AS LAYOFF TALK ESCALATES', now() - interval '12 day'),
  ('77777777-7777-7777-7777-777777777777', 'Politics', 'ELECTION OFFICIALS WARN OF NEW VOTER SUPPRESSION LAWS', now() - interval '14 day');

INSERT INTO public.perspectives (story_id, lean, headline, summary_text, source_name, source_url, youtube_video_id) VALUES
  -- Story 5: Supreme Court
  ('55555555-5555-5555-5555-555555555555','Republican','COURTS MUST CHECK EXECUTIVE OVERREACH','Conservative legal analysts see the new term as a chance to rein in agency power and revive textualist interpretation. They argue the court has a mandate to correct years of judicial deference.','The Federalist','https://example.com/right/scotus','dQw4w9WgXcQ'),
  ('55555555-5555-5555-5555-555555555555','Neutral','DOCKET FILLED WITH FEDERALISM FIGHTS','Wire services report the court accepted a heavy slate of separation-of-powers cases. Legal reporters note the term will test how far the current majority is willing to go.','SCOTUSblog','https://example.com/wire/scotus','aqz-KE-bpKQ'),
  ('55555555-5555-5555-5555-555555555555','Democratic','RIGHTS GROUPS BRING HEAVY CASES','Progressive advocacy groups frame the docket as an assault on established protections. They argue the court should defer to Congress and the executive on regulatory matters.','ACLU','https://example.com/left/scotus','ScMzIvxBSi4'),

  -- Story 6: Federal workers
  ('66666666-6666-6666-6666-666666666666','Republican','GOVERNMENT BLOAT MUST GO','Right-leaning outlets frame the layoff speculation as long-overdue reform. They argue the federal workforce has grown beyond what taxpayers can sustain.','Washington Examiner','https://example.com/right/fedworkers','dQw4w9WgXcQ'),
  ('66666666-6666-6666-6666-666666666666','Neutral','AGENCIES PREPARE FOR POSSIBLE CUTS','Neutral reporting notes that no final decisions have been made, but agencies are reviewing staffing levels. Workers describe anxiety as rumors circulate through internal channels.','AP','https://example.com/wire/fedworkers','aqz-KE-bpKQ'),
  ('66666666-6666-6666-6666-666666666666','Democratic','Families FEAR FOR THEIR LIVELIHOODS','Left-leaning coverage centers on affected employees and their families. They argue that cutting experienced staff weakens services and that the process lacks transparency.','The Nation','https://example.com/left/fedworkers','ScMzIvxBSi4'),

  -- Story 7: Voter suppression
  ('77777777-7777-7777-7777-777777777777','Republican','ELECTION INTEGRITY IS NON-NEGOTIABLE','Conservative coverage frames new voting rules as common-sense safeguards. They argue the changes prevent fraud and restore public confidence in results.','National Review','https://example.com/right/voting','dQw4w9WgXcQ'),
  ('77777777-7777-7777-7777-777777777777','Neutral','LAWS PASS AS ELECTION OFFICIALS PUSH BACK','Wire services report that state-level changes are advancing even as local officials warn of confusion. The trends vary widely by state.','Reuters','https://example.com/wire/voting','aqz-KE-bpKQ'),
  ('77777777-7777-7777-7777-777777777777','Democratic','NEW LAWS DISENFRANCHISE VULNERABLE VOTERS','Progressive outlets highlight the groups most affected by stricter ID and mail-ballot rules. They argue the laws solve problems that do not exist.','Mother Jones','https://example.com/left/voting','ScMzIvxBSi4');

-- ---- CULTURE: 4 new stories ----

INSERT INTO public.stories (id, topic, headline, date_published) VALUES
  ('88888888-8888-8888-8888-888888888888', 'Culture', 'STUDIOS PUSH BACK AGAINST AI SCRAPING OF CLASSIC MOVIES', now() - interval '16 day'),
  ('99999999-9999-9999-9999-999999999999', 'Culture', 'MUSIC FESTIVAL SEASON ENDS WITH RECORD ATTENDANCE', now() - interval '18 day'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Culture', 'ARCHITECTURAL TREND: NEW PUBLIC LIBRARIES BECOME COMMUNITY HUBS', now() - interval '20 day'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Culture', 'DEBATE OVER CENSORSHIP AT PUBLIC TELEVISION HEATS UP', now() - interval '22 day');

INSERT INTO public.perspectives (story_id, lean, headline, summary_text, source_name, source_url, youtube_video_id) VALUES
  -- Story 8: AI scraping
  ('88888888-8888-8888-8888-888888888888','Republican','STUDIOS HAVE A RIGHT TO PROTECT THEIR CATALOG','Conservative commentary supports studios fighting unauthorized AI training on their films. They argue that creative work deserves the same protection as any other property.','Washington Free Beacon','https://example.com/right/ai','dQw4w9WgXcQ'),
  ('88888888-8888-8888-8888-888888888888','Neutral','LEGAL BATTLE OVER TRAINING DATA INTENSIFIES','Neutral trade press reports that studios are filing suits while AI companies argue fair use. The outcome could reshape how models are built.','Variety','https://example.com/wire/ai','aqz-KE-bpKQ'),
  ('88888888-8888-8888-8888-888888888888','Democratic','ARTISTS DESERVE CREDIT AND COMPENSATION','Progressive coverage emphasizes the human creators whose work is being used without consent. They argue that AI companies should pay for what they take.','The Guardian','https://example.com/left/ai','ScMzIvxBSi4'),

  -- Story 9: Music festivals
  ('99999999-9999-9999-9999-999999999999','Republican','YOUTH CULTURE THRIVES OUTSIDE THE ALGORITHM','Conservative cultural writers celebrate the return of big live events as proof that people still want shared experiences. They argue this undermines predictions of social collapse.','The Telegraph','https://example.com/right/festivals','dQw4w9WgXcQ'),
  ('99999999-9999-9999-9999-999999999999','Neutral','ATTENDANCE HITS PANDEMIC PEAKS WORLDWIDE','Wire services report that major festivals sold out across continents this season. Organizers attribute the surge to pent-up demand and new ticketing models.','Billboard','https://example.com/wire/festivals','aqz-KE-bpKQ'),
  ('99999999-9999-9999-9999-999999999999','Democratic','MUSIC BRINGS PEOPLE TOGETHER AGAIN','Progressive coverage frames the festival boom as a counterweight to digital isolation. They argue that public investment in live culture pays off in community health.','Pitchfork','https://example.com/left/festivals','ScMzIvxBSi4'),

  -- Story 10: Public libraries
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Republican','LIBRARIES SHOULD FOCUS ON BOOKS, NOT PROGRAMS','Conservative commentary questions the growing social-service role of public libraries. They argue that libraries are best when they stick to their core mission.','City Journal','https://example.com/right/libraries','dQw4w9WgXcQ'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Neutral','NEW BUILDINGS DOUBLE AS COMMUNITY CENTERS','Neutral architecture press reports on a wave of library projects that include meeting rooms, kitchens, and co-working spaces. The trend reflects changing public expectations.','Architectural Record','https://example.com/wire/libraries','aqz-KE-bpKQ'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Democratic','LIBRARIES ARE ESSENTIAL PUBLIC INFRASTRUCTURE','Progressive coverage praises libraries as one of the last free indoor spaces. They argue that funding them is a down-payment on civic life.','CityLab','https://example.com/left/libraries','ScMzIvxBSi4'),

  -- Story 11: Public television
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Republican','PUBLIC TV HAS LOST ITS WAY','Conservative commentators argue that public broadcasting has drifted from its educational mission. They question whether taxpayer money belongs in the sector at all.','National Affairs','https://example.com/right/pbs','dQw4w9WgXcQ'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Neutral','FUNDING BATTLE DIVIDES STAKEHOLDERS','Neutral reporting notes that the debate over public television funding involves creators, donors, and lawmakers with sharply different priorities.','NPR','https://example.com/wire/pbs','aqz-KE-bpKQ'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb','Democratic','PUBLIC TELEVISION DESERVES STRONGER SUPPORT','Progressive outlets argue that public broadcasting is a vital counterweight to commercial media. They frame the funding fight as a test of commitment to independent journalism.','The American Prospect','https://example.com/left/pbs','ScMzIvxBSi4');

-- ---- OP-ED: 4 new stories ----

INSERT INTO public.stories (id, topic, headline, date_published) VALUES
  ('cccccccccccccccc-cccc-cccc-cccc-cccccccccccc', 'Op-Ed', 'THE PODCAST INDUSTRIAL COMPLEX IS CRACKING', now() - interval '24 day'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Op-Ed', 'LONGFORM JOURNALISM FIGHTS FOR SURVIVAL IN THE ATTENTION ECONOMY', now() - interval '26 day'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'Op-Ed', 'OPINION MEDIA CRISIS OF CREDIBILITY', now() - interval '28 day'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'Op-Ed', 'WHY LOCAL NEWS DESERVES A SECOND CHANCE', now() - interval '30 day');

INSERT INTO public.perspectives (story_id, lean, headline, summary_text, source_name, source_url, youtube_video_id) VALUES
  -- Story 12: Podcast industrial complex
  ('cccccccccccccccc-cccc-cccc-cccc-cccccccccccc','Republican','THE PODCAST BUBBLE WAS ALWAYS OVERHYPED','Conservative commentators argue that the podcasting boom was fueled by cheap money and idle time. They see the pullback as a healthy correction.','The Dispatch','https://example.com/right/podcasts','dQw4w9WgXcQ'),
  ('cccccccccccccccc-cccc-cccc-cccc-cccccccccccc','Neutral','AD REVENUE SHIFT HITS PODCAST ECONOMICS','Neutral business press reports that advertisers are reallocating budgets away from spoken-word platforms. The decline is uneven across genres and sizes.','Bloomberg','https://example.com/wire/podcasts','aqz-KE-bpKQ'),
  ('cccccccccccccccc-cccc-cccc-cccc-cccccccccccc','Democratic','PODCASTERS SERVED AN AUDIENCE, THEN ABANDONED IT','Progressive culture critics argue that the industry failed to build sustainable models for working journalists. They say the crash hurts listeners most.','Dissent','https://example.com/left/podcasts','ScMzIvxBSi4'),

  -- Story 13: Longform journalism
  ('dddddddd-dddd-dddd-dddd-dddddddddddd','Republican','READERS PREFER BREVITY AND CLARITY','Conservative opinion writers argue that the longform revival was a niche fad. They say most readers want concise analysis and that newspapers should respect that.','The Wall Street Journal','https://example.com/right/longform','dQw4w9WgXcQ'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd','Neutral','SUBSCRIPTION MODELS BRING MIXED RESULTS','Neutral media analysts report that some outlets thrive on longform subscriptions while others cannot convert readers into payers. The economics remain fragile.','Columbia Journalism Review','https://example.com/wire/longform','aqz-KE-bpKQ'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd','Democratic','DEPTH IS WHAT SEPARATES US FROM THE NOISE','Progressive essayists argue that longform journalism is a public good that deserves patronage, not just market logic. They call for audience-supported models.','The New Yorker','https://example.com/left/longform','ScMzIvxBSi4'),

  -- Story 14: Opinion media credibility
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','Republican','AUDIENCES KNOW WHEN THEY ARE BEING SOLD','Conservative commentary argues that opinion hosts who lose credibility do so by putting spin ahead of argument. They say trust is earned through consistency.','First Things','https://example.com/right/opinion','dQw4w9WgXcQ'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','Neutral','RETHINKING THE OP-ED AS A FORMAT','Neutral media scholars write that the traditional opinion page is under pressure from social media and audience fragmentation. The experiment with new formats is ongoing.','Nieman Journalism Lab','https://example.com/wire/opinion','aqz-KE-bpKQ'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee','Democratic','OPINION JOURNALISM SHOULD GET REAL','Progressive writers argue that opinion media should drop pretense of neutrality and own its perspective. They say honesty would rebuild reader trust.','The Baffler','https://example.com/left/opinion','ScMzIvxBSi4'),

  -- Story 15: Local news
  ('ffffffff-ffff-ffff-ffff-ffffffffffff','Republican','LOCAL OWNERSHIP CAN SAVE COMMUNITY PAPERS','Conservative policy writers argue that private, local ownership beats nonprofit or government models. They point to small papers that thrived under focused owners.','The American Conservative','https://example.com/right/localnews','dQw4w9WgXcQ'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff','Neutral','LOCAL NEWS DESERTS KEEP SPREADING','Neutral reporting maps the continuing decline of local news coverage across the country. The gaps are largest in rural and small-city markets.','AP','https://example.com/wire/localnews','aqz-KE-bpKQ'),
  ('ffffffff-ffff-ffff-ffff-ffffffffffff','Democratic','COMMUNITY NEWS IS A PUBLIC GOOD','Progressive advocates argue that local news should be treated like other essential services. They push for public funding and nonprofit models to fill the gaps.','In These Times','https://example.com/left/localnews','ScMzIvxBSi4');

-- ---- Wire links: update with real-looking headlines ----

INSERT INTO public.wire_links (headline_text, external_url, date_added) VALUES
  ('SENATE NEGOTIATORS CIRCLE BACK ON CR BILL...','https://apnews.com/wire/senate-cr', now() - interval '1 hour'),
  ('WHITE HOUSE PRESSES AGI TRUST BILL AHEAD OF VOTE...','https://reuters.com/wire/agi-bill', now() - interval '3 hour'),
  ('FED CHAIR HINTS AT RATE PACE IN LATE-SESSION TALKING...','https://bloomberg.com/wire/fed-rates', now() - interval '5 hour'),
  ('NETFLIX REPORTS SUBSCRIBER SURGE AFTER AD TIER EXPANSION...','https://variety.com/wire/netflix-q3', now() - interval '7 hour'),
  ('NASA ROVER FINDS NEW EVIDENCE OF ANCIENT WATER FLOWS...','https://nasa.gov/wire/mars-water', now() - interval '9 hour'),
  ('UN CONDEMNS CYBERATTACK ON GLOBAL HEALTH DATABASES...','https://un.org/wire/cyber-un-health', now() - interval '11 hour'),
  ('EUROPEAN CENTRAL BANK HOLDS STEADY AMID INFLATION Jitters...','https://reuters.com/wire/ecb-hold', now() - interval '13 hour'),
  ('HOSPITAL SYSTEMS MERGER WATCH: THREE DEALS PENDING...','https://modernhealthcare.com/wire/hospitals', now() - interval '15 hour');
