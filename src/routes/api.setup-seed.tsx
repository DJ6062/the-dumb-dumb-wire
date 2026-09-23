import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export const Route = createFileRoute("/api/setup-seed")({
  loader: async () => {
    const url = process.env["SUPABASE_URL"] || "";
    const key = process.env["SUPABASE_SERVICE_ROLE_KEY"] || "";
    if (!url || !key || key === "[SENSITIVE]") {
      return { error: "Service role key not configured" };
    }
    const supabase = createClient<Database>(url, key);

    const allP: Array<{
      story_id: string;
      lean: "Republican" | "Neutral" | "Democratic";
      headline: string;
      summary_text: string;
      source_name: string;
      source_url: string;
      youtube_video_id: string;
    }> = [
      { story_id: "11111111-1111-1111-1111-111111111111", lean: "Republican", headline: "SPENDING SPREE MUST END", summary_text: "Conservative outlets frame the standoff as a long-overdue fight against runaway federal spending. They argue the deficit, not the shutdown threat, is the real emergency.", source_name: "Washington Examiner", source_url: "https://example.com/right/budget", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "11111111-1111-1111-1111-111111111111", lean: "Neutral", headline: "NEGOTIATORS RUN OUT OF CALENDAR", summary_text: "Wire services report both caucuses remain roughly $80 billion apart with three legislative days left. A short-term continuing resolution is the most likely outcome.", source_name: "AP", source_url: "https://example.com/wire/budget", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "11111111-1111-1111-1111-111111111111", lean: "Democratic", headline: "CUTS WOULD HIT FAMILIES FIRST", summary_text: "Progressive outlets emphasize which programs face the deepest reductions and who depends on them. They frame the impasse as a choice about priorities, not arithmetic.", source_name: "The Nation", source_url: "https://example.com/left/budget", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "22222222-2222-2222-2222-222222222222", lean: "Republican", headline: "ENFORCEMENT GUTTED, AGAIN", summary_text: "Right-leaning coverage focuses on enforcement provisions stripped in committee. The bill is described as a messaging exercise rather than a border fix.", source_name: "National Review", source_url: "https://example.com/right/border", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "22222222-2222-2222-2222-222222222222", lean: "Neutral", headline: "VOTE COUNT NEVER MATERIALIZED", summary_text: "Neutral reporting notes leadership pulled the bill after failing to secure 218 votes. Both parties blame the other for the collapse.", source_name: "Reuters", source_url: "https://example.com/wire/border", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "22222222-2222-2222-2222-222222222222", lean: "Democratic", headline: "ASYLUM PROTECTIONS AT STAKE", summary_text: "Left-leaning outlets highlight the asylum restrictions in the draft text and the objections from advocacy groups. They frame the failure as avoiding a harmful compromise.", source_name: "Mother Jones", source_url: "https://example.com/left/border", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "33333333-3333-3333-3333-333333333333", lean: "Republican", headline: "ANOTHER QUIET CANCELLATION", summary_text: "Conservative commentary treats the removal as evidence of a narrowing window for dissenting films. The platform's explanation is described as vague.", source_name: "Washington Free Beacon", source_url: "https://example.com/right/doc", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "33333333-3333-3333-3333-333333333333", lean: "Neutral", headline: "PLATFORM CITES LICENSING", summary_text: "Trade press reports the title was removed at the end of a licensing window, days after a public complaint. The timing remains unexplained.", source_name: "Variety", source_url: "https://example.com/wire/doc", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "33333333-3333-3333-3333-333333333333", lean: "Democratic", headline: "SUBJECTS SAY THEY WERE MISLED", summary_text: "Left-leaning coverage centers on participants who say their interviews were edited misleadingly. Editorial standards, not censorship, drive the framing.", source_name: "The Guardian", source_url: "https://example.com/left/doc", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "44444444-4444-4444-4444-444444444444", lean: "Republican", headline: "THE PRESS EARNED THE DISTRUST", summary_text: "A conservative columnist argues that headline-only reading is a rational response to years of corrected stories. Trust, the piece says, is a lagging indicator.", source_name: "First Things", source_url: "https://example.com/right/oped", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "44444444-4444-4444-4444-444444444444", lean: "Neutral", headline: "ATTENTION IS THE SCARCE RESOURCE", summary_text: "A media researcher summarizes studies showing most shares happen without a click. The problem is described as structural rather than partisan.", source_name: "Nieman Journalism Lab", source_url: "https://example.com/wire/oped", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "44444444-4444-4444-4444-444444444444", lean: "Democratic", headline: "OUTRAGE PAYS BETTER THAN CONTEXT", summary_text: "A progressive essayist blames ad-driven incentives that reward inflammatory headlines. The fix proposed is funding models that pay for depth.", source_name: "The Baffler", source_url: "https://example.com/left/oped", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "55555555-5555-5555-5555-555555555555", lean: "Republican", headline: "COURTS MUST CHECK EXECUTIVE OVERREACH", summary_text: "Conservative legal analysts see the new term as a chance to rein in agency power and revive textualist interpretation. They argue the court has a mandate to correct years of judicial deference.", source_name: "The Federalist", source_url: "https://example.com/right/scotus", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "55555555-5555-5555-5555-555555555555", lean: "Neutral", headline: "DOCKET FILLED WITH FEDERALISM FIGHTS", summary_text: "Wire services report the court accepted a heavy slate of separation-of-powers cases. Legal reporters note the term will test how far the current majority is willing to go.", source_name: "SCOTUSblog", source_url: "https://example.com/wire/scotus", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "55555555-5555-5555-5555-555555555555", lean: "Democratic", headline: "RIGHTS GROUPS BRING HEAVY CASES", summary_text: "Progressive advocacy groups frame the docket as an assault on established protections. They argue the court should defer to Congress and the executive on regulatory matters.", source_name: "ACLU", source_url: "https://example.com/left/scotus", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "66666666-6666-6666-6666-666666666666", lean: "Republican", headline: "GOVERNMENT BLOAT MUST GO", summary_text: "Right-leaning outlets frame the layoff speculation as long-overdue reform. They argue the federal workforce has grown beyond what taxpayers can sustain.", source_name: "Washington Examiner", source_url: "https://example.com/right/fedworkers", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "66666666-6666-6666-6666-666666666666", lean: "Neutral", headline: "AGENCIES PREPARE FOR POSSIBLE CUTS", summary_text: "Neutral reporting notes that no final decisions have been made, but agencies are reviewing staffing levels. Workers describe anxiety as rumors circulate through internal channels.", source_name: "AP", source_url: "https://example.com/wire/fedworkers", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "66666666-6666-6666-6666-666666666666", lean: "Democratic", headline: "FAMILIES FEAR FOR THEIR LIVELIHOODS", summary_text: "Left-leaning coverage centers on affected employees and their families. They argue that cutting experienced staff weakens services and that the process lacks transparency.", source_name: "The Nation", source_url: "https://example.com/left/fedworkers", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "77777777-7777-7777-7777-777777777777", lean: "Republican", headline: "ELECTION INTEGRITY IS NON-NEGOTIABLE", summary_text: "Conservative coverage frames new voting rules as common-sense safeguards. They argue the changes prevent fraud and restore public confidence in results.", source_name: "National Review", source_url: "https://example.com/right/voting", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "77777777-7777-7777-7777-777777777777", lean: "Neutral", headline: "LAWS PASS AS ELECTION OFFICIALS PUSH BACK", summary_text: "Wire services report that state-level changes are advancing even as local officials warn of confusion. The trends vary widely by state.", source_name: "Reuters", source_url: "https://example.com/wire/voting", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "77777777-7777-7777-7777-777777777777", lean: "Democratic", headline: "NEW LAWS DISENFRANCHISE VULNERABLE VOTERS", summary_text: "Progressive outlets highlight the groups most affected by stricter ID and mail-ballot rules. They argue the laws solve problems that do not exist.", source_name: "Mother Jones", source_url: "https://example.com/left/voting", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "88888888-8888-8888-8888-888888888888", lean: "Republican", headline: "STUDIOS HAVE A RIGHT TO PROTECT THEIR CATALOG", summary_text: "Conservative commentary supports studios fighting unauthorized AI training on their films. They argue that creative work deserves the same protection as any other property.", source_name: "Washington Free Beacon", source_url: "https://example.com/right/ai", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "88888888-8888-8888-8888-888888888888", lean: "Neutral", headline: "LEGAL BATTLE OVER TRAINING DATA INTENSIFIES", summary_text: "Neutral trade press reports that studios are filing suits while AI companies argue fair use. The outcome could reshape how models are built.", source_name: "Variety", source_url: "https://example.com/wire/ai", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "88888888-8888-8888-8888-888888888888", lean: "Democratic", headline: "ARTISTS DESERVE CREDIT AND COMPENSATION", summary_text: "Progressive coverage emphasizes the human creators whose work is being used without consent. They argue that AI companies should pay for what they take.", source_name: "The Guardian", source_url: "https://example.com/left/ai", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "99999999-9999-9999-9999-999999999999", lean: "Republican", headline: "YOUTH CULTURE THRIVES OUTSIDE THE ALGORITHM", summary_text: "Conservative cultural writers celebrate the return of big live events as proof that people still want shared experiences. They argue this undermines predictions of social collapse.", source_name: "The Telegraph", source_url: "https://example.com/right/festivals", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "99999999-9999-9999-9999-999999999999", lean: "Neutral", headline: "ATTENDANCE HITS PANDEMIC PEAKS WORLDWIDE", summary_text: "Wire services report that major festivals sold out across continents this season. Organizers attribute the surge to pent-up demand and new ticketing models.", source_name: "Billboard", source_url: "https://example.com/wire/festivals", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "99999999-9999-9999-9999-999999999999", lean: "Democratic", headline: "MUSIC BRINGS PEOPLE TOGETHER AGAIN", summary_text: "Progressive coverage frames the festival boom as a counterweight to digital isolation. They argue that public investment in live culture pays off in community health.", source_name: "Pitchfork", source_url: "https://example.com/left/festivals", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", lean: "Republican", headline: "LIBRARIES SHOULD FOCUS ON BOOKS, NOT PROGRAMS", summary_text: "Conservative commentary questions the growing social-service role of public libraries. They argue that libraries are best when they stick to their core mission.", source_name: "City Journal", source_url: "https://example.com/right/libraries", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", lean: "Neutral", headline: "NEW BUILDINGS DOUBLE AS COMMUNITY CENTERS", summary_text: "Neutral architecture press reports on a wave of library projects that include meeting rooms, kitchens, and co-working spaces. The trend reflects changing public expectations.", source_name: "Architectural Record", source_url: "https://example.com/wire/libraries", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", lean: "Democratic", headline: "LIBRARIES ARE ESSENTIAL PUBLIC INFRASTRUCTURE", summary_text: "Progressive coverage praises libraries as one of the last free indoor spaces. They argue that funding them is a down-payment on civic life.", source_name: "CityLab", source_url: "https://example.com/left/libraries", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", lean: "Republican", headline: "PUBLIC TV HAS LOST ITS WAY", summary_text: "Conservative commentators argue that public broadcasting has drifted from its educational mission. They question whether taxpayer money belongs in the sector at all.", source_name: "National Affairs", source_url: "https://example.com/right/pbs", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", lean: "Neutral", headline: "FUNDING BATTLE DIVIDES STAKEHOLDERS", summary_text: "Neutral reporting notes that the debate over public television funding involves creators, donors, and lawmakers with sharply different priorities.", source_name: "NPR", source_url: "https://example.com/wire/pbs", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", lean: "Democratic", headline: "PUBLIC TELEVISION DESERVES STRONGER SUPPORT", summary_text: "Progressive outlets argue that public broadcasting is a vital counterweight to commercial media. They frame the funding fight as a test of commitment to independent journalism.", source_name: "The American Prospect", source_url: "https://example.com/left/pbs", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "cccccccccccccccc-cccc-cccc-cccc-cccccccccccc", lean: "Republican", headline: "THE PODCAST BUBBLE WAS ALWAYS OVERHYPED", summary_text: "Conservative commentators argue that the podcasting boom was fueled by cheap money and idle time. They see the pullback as a healthy correction.", source_name: "The Dispatch", source_url: "https://example.com/right/podcasts", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "cccccccccccccccc-cccc-cccc-cccc-cccccccccccc", lean: "Neutral", headline: "AD REVENUE SHIFT HITS PODCAST ECONOMICS", summary_text: "Neutral business press reports that advertisers are reallocating budgets away from spoken-word platforms. The decline is uneven across genres and sizes.", source_name: "Bloomberg", source_url: "https://example.com/wire/podcasts", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "cccccccccccccccc-cccc-cccc-cccc-cccccccccccc", lean: "Democratic", headline: "PODCASTERS SERVED AN AUDIENCE, THEN ABANDONED IT", summary_text: "Progressive culture critics argue that the industry failed to build sustainable models for working journalists. They say the crash hurts listeners most.", source_name: "Dissent", source_url: "https://example.com/left/podcasts", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "dddddddd-dddd-dddd-dddd-dddddddddddd", lean: "Republican", headline: "READERS PREFER BREVITY AND CLARITY", summary_text: "Conservative opinion writers argue that the longform revival was a niche fad. They say most readers want concise analysis and that newspapers should respect that.", source_name: "The Wall Street Journal", source_url: "https://example.com/right/longform", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "dddddddd-dddd-dddd-dddd-dddddddddddd", lean: "Neutral", headline: "SUBSCRIPTION MODELS BRING MIXED RESULTS", summary_text: "Neutral media analysts report that some outlets thrive on longform subscriptions while others cannot convert readers into payers. The economics remain fragile.", source_name: "Columbia Journalism Review", source_url: "https://example.com/wire/longform", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "dddddddd-dddd-dddd-dddd-dddddddddddd", lean: "Democratic", headline: "DEPTH IS WHAT SEPARATES US FROM THE NOISE", summary_text: "Progressive essayists argue that longform journalism is a public good that deserves patronage, not just market logic. They call for audience-supported models.", source_name: "The New Yorker", source_url: "https://example.com/left/longform", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee", lean: "Republican", headline: "AUDIENCES KNOW WHEN THEY ARE BEING SOLD", summary_text: "Conservative commentary argues that opinion hosts who lose credibility do so by putting spin ahead of argument. They say trust is earned through consistency.", source_name: "First Things", source_url: "https://example.com/right/opinion", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee", lean: "Neutral", headline: "RETHINKING THE OP-ED AS A FORMAT", summary_text: "Neutral media scholars write that the traditional opinion page is under pressure from social media and audience fragmentation. The experiment with new formats is ongoing.", source_name: "Nieman Journalism Lab", source_url: "https://example.com/wire/opinion", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee", lean: "Democratic", headline: "OPINION JOURNALISM SHOULD GET REAL", summary_text: "Progressive writers argue that opinion media should drop pretense of neutrality and own its perspective. They say honesty would rebuild reader trust.", source_name: "The Baffler", source_url: "https://example.com/left/opinion", youtube_video_id: "ScMzIvxBSi4" },
      { story_id: "ffffffff-ffff-ffff-ffff-ffffffffffff", lean: "Republican", headline: "LOCAL OWNERSHIP CAN SAVE COMMUNITY PAPERS", summary_text: "Conservative policy writers argue that private, local ownership beats nonprofit or government models. They point to small papers that thrived under focused owners.", source_name: "The American Conservative", source_url: "https://example.com/right/localnews", youtube_video_id: "dQw4w9WgXcQ" },
      { story_id: "ffffffff-ffff-ffff-ffff-ffffffffffff", lean: "Neutral", headline: "LOCAL NEWS DESERTS KEEP SPREADING", summary_text: "Neutral reporting maps the continuing decline of local news coverage across the country. The gaps are largest in rural and small-city markets.", source_name: "AP", source_url: "https://example.com/wire/localnews", youtube_video_id: "aqz-KE-bpKQ" },
      { story_id: "ffffffff-ffff-ffff-ffff-ffffffffffff", lean: "Democratic", headline: "COMMUNITY NEWS IS A PUBLIC GOOD", summary_text: "Progressive advocates argue that local news should be treated like other essential services. They push for public funding and nonprofit models to fill the gaps.", source_name: "In These Times", source_url: "https://example.com/left/localnews", youtube_video_id: "ScMzIvxBSi4" },
    ];

    const wireLinks = [
      { headline_text: "SENATE NEGOTIATORS CIRCLE BACK ON CR BILL", external_url: "https://apnews.com/wire/senate-cr" },
      { headline_text: "WHITE HOUSE PRESSES AGI TRUST BILL AHEAD OF VOTE", external_url: "https://reuters.com/wire/agi-bill" },
      { headline_text: "FED CHAIR HINTS AT RATE PACE IN LATE-SESSION TALKING", external_url: "https://bloomberg.com/wire/fed-rates" },
      { headline_text: "NETFLIX REPORTS SUBSCRIBER SURGE AFTER AD TIER EXPANSION", external_url: "https://variety.com/wire/netflix-q3" },
      { headline_text: "NASA ROVER FINDS NEW EVIDENCE OF ANCIENT WATER FLOWS", external_url: "https://nasa.gov/wire/mars-water" },
      { headline_text: "UN CONDEMNS CYBERATTACK ON GLOBAL HEALTH DATABASES", external_url: "https://un.org/wire/cyber-un-health" },
      { headline_text: "ECB HOLDS STEADY AMID INFLATION JITTERS", external_url: "https://reuters.com/wire/ecb-hold" },
      { headline_text: "HOSPITAL SYSTEMS MERGER WATCH: THREE DEALS PENDING", external_url: "https://modernhealthcare.com/wire/hospitals" },
    ];

    // --- Insert new stories (skip if already exist) ---
    const existingIds = [
      "55555555-5555-5555-5555-555555555555", "66666666-6666-6666-6666-666666666666",
      "77777777-7777-7777-7777-777777777777", "88888888-8888-8888-8888-888888888888",
      "99999999-9999-9999-9999-999999999999", "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", "cccccccccccccccc-cccc-cccc-cccc-cccccccccccc",
      "dddddddd-dddd-dddd-dddd-dddddddddddd", "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee",
      "ffffffff-ffff-ffff-ffff-ffffffffffff",
    ];
    const { data: exists, error: eErr } = await supabase
      .from("stories")
      .select("id")
      .in("id", existingIds);
    const existingSet = new Set((exists ?? []).map((r: any) => r.id));

    const toInsert: Array<{ id: string; topic: "Politics" | "Culture" | "Op-Ed"; headline: string; date_published: string; }> = [
      { id: "55555555-5555-5555-5555-555555555555", topic: "Politics", headline: "NEW SUPREME COURT TERM PROMISES BLOCKBUSTER BATTLES", date_published: new Date(Date.now() - 10 * 86400000).toISOString() },
      { id: "66666666-6666-6666-6666-666666666666", topic: "Politics", headline: "FEDERAL WORKERS FACE UNCERTAINTY AS LAYOFF TALK ESCALATES", date_published: new Date(Date.now() - 12 * 86400000).toISOString() },
      { id: "77777777-7777-7777-7777-777777777777", topic: "Politics", headline: "ELECTION OFFICIALS WARN OF NEW VOTER SUPPRESSION LAWS", date_published: new Date(Date.now() - 14 * 86400000).toISOString() },
      { id: "88888888-8888-8888-8888-888888888888", topic: "Culture", headline: "STUDIOS PUSH BACK AGAINST AI SCRAPING OF CLASSIC MOVIES", date_published: new Date(Date.now() - 16 * 86400000).toISOString() },
      { id: "99999999-9999-9999-9999-999999999999", topic: "Culture", headline: "MUSIC FESTIVAL SEASON ENDS WITH RECORD ATTENDANCE", date_published: new Date(Date.now() - 18 * 86400000).toISOString() },
      { id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa", topic: "Culture", headline: "ARCHITECTURAL TREND: NEW PUBLIC LIBRARIES BECOME COMMUNITY HUBS", date_published: new Date(Date.now() - 20 * 86400000).toISOString() },
      { id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb", topic: "Culture", headline: "DEBATE OVER CENSORSHIP AT PUBLIC TELEVISION HEATS UP", date_published: new Date(Date.now() - 22 * 86400000).toISOString() },
      { id: "cccccccccccccccc-cccc-cccc-cccc-cccccccccccc", topic: "Op-Ed", headline: "THE PODCAST INDUSTRIAL COMPLEX IS CRACKING", date_published: new Date(Date.now() - 24 * 86400000).toISOString() },
      { id: "dddddddd-dddd-dddd-dddd-dddddddddddd", topic: "Op-Ed", headline: "LONGFORM JOURNALISM FIGHTS FOR SURVIVAL IN THE ATTENTION ECONOMY", date_published: new Date(Date.now() - 26 * 86400000).toISOString() },
      { id: "eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee", topic: "Op-Ed", headline: "OPINION MEDIA CRISIS OF CREDIBILITY", date_published: new Date(Date.now() - 28 * 86400000).toISOString() },
      { id: "ffffffff-ffff-ffff-ffff-ffffffffffff", topic: "Op-Ed", headline: "WHY LOCAL NEWS DESERVES A SECOND CHANCE", date_published: new Date(Date.now() - 30 * 86400000).toISOString() },
    ].filter(s => !existingSet.has(s.id));

    const { data: sData, error: sErr } = await supabase.from("stories").insert(toInsert).select("id");
    if (sErr) return { error: `stories: ${sErr.message}` };

    const { error: pErr } = await supabase.from("perspectives").upsert(allP, { onConflict: "story_id,lean" });
    if (pErr) return { error: `perspectives: ${pErr.message}` };

    const { error: wErr } = await supabase.from("wire_links").upsert(wireLinks, { onConflict: "external_url" });
    if (wErr) return { error: `wire_links: ${wErr.message}` };

    return {
      ok: true,
      counts: {
        new_stories: sData?.length ?? 0,
        perspectives: allP.length,
        wire_links: wireLinks.length,
        total_stories: 15,
      },
    };
  },
});
