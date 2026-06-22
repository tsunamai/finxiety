# Brand Review: MYTH-2 — Personal Finance Myth Quiz

**Reviewer:** brand agent
**Date:** 2026-06-21
**Files reviewed:**
- `/Users/naomipinto/Documents/tsunam/finxiety/src/routes/tools/myth-quiz-2/+page.svelte`
- `/Users/naomipinto/Documents/tsunam/finxiety/src/lib/data/myth-quiz-2.ts`

---

## Voice Violations

None flagged.

The register is consistent with MYTH-1 and the Brand & Mission source of truth: short declarative sentences, no inflation, no preach, no inspire. The welcome copy ("Ten questions about money rules most people live by. Guess first, then see what the research actually says.") sets tone cleanly. "No grades, no right answers" on the welcome screen carries over the MYTH-1 commitment.

Specific callouts that work especially well against the voice standard:

- "Debt compounds too. The formula doesn't care which side you're on." — direct, a little wry, no inflation.
- "Since 1991. Congress has not changed it once." — the brevity does real work here. No editorializing beyond the fact.
- "Credit scores measure one thing: whether you pay back borrowed money on time." — precision over preamble.

No instances of "empower," "journey," "personalized insights," "unlock," or any of the prohibited register markers.

---

## Do No Harm Flags

### Minor flag — `rewards-myth` signpost is a workaround, not a signpost

The rewards-myth question (`id: 'rewards-myth'`) carries this signpost:

> "No specific Finxiety tool covers rewards math yet — but understanding what interest actually costs is a start."

The signpost then links to `/tools/debt-growth`.

This is honest and accurate, and the honesty is appropriate to the Do No Harm principle. However, the phrasing "is a start" reads slightly as a nudge — implying the user should go understand interest costs. Per the Non-Advice Rule, the signpost should describe what the tool shows, not suggest the user undertake a step.

**Suggested revision:**
> "Debt vs. Growth shows what compound interest looks like on a balance over time — the same math that runs inside a rewards-card calculation."

This describes the tool, not a recommended action for the user.

### Verify before ship — `platform-tips` source URL

The sole source for question `id: 'platform-tips'` is:

> NYC DCWP: Impact of App-Based Tips on Worker Pay (Jan 2026)
> https://www.nyc.gov/site/dca/workers/workersrights/app-based-delivery.page

This URL resolves to a general app-based delivery worker rights page, not the specific January 2026 report cited in the reveal. The figure ($2.17 → $0.76, ~65% drop, $550M/year cost to workers) is precise enough that it needs a direct citation — ideally the report PDF or press release, not the landing page. The link-checker agent or release agent should confirm this before ship. Not a blocking brand issue, but it is a Do No Harm issue if the source can't be verified.

**Action required:** Link-checker or release agent to locate and substitute the direct URL for the Jan 2026 NYC DCWP report. If a direct URL cannot be found, the `sources` entry should describe the report with enough specificity for a user to locate it independently (title, date, issuing agency).

### No violations found on:
- Non-Advice Rule: No question, reveal, or signpost tells the user what to do. Every signpost describes what the tool shows.
- Urgency / fear / scarcity language: None present.
- Estimates labeled as estimates: Not applicable — this is a myth quiz, not a calculator. No estimated outputs are produced.
- Consequential decision framing: None. The quiz informs; it creates no action pressure.

---

## Question-by-Question Assessment

### Frame check: does any question make the user responsible for a systemic problem?

No. The ten questions are all structured as myth/fact probes about systems, policies, or math — not about the user's behavior or choices. The user is invited to guess at a number or direction; the reveal locates the gap in system design, policy, or information asymmetry. This is consistent with MYTH-1's structural attribution standard.

Strongest structural attributions:
- `tipped-minimum`: "This is a policy choice, not an oversight. The 1996 FLSA amendment that froze it was heavily lobbied by the National Restaurant Association."
- `platform-tips`: "The intervention here wasn't the user's psychology — it was the company's product decision."
- `rewards-myth`: "The mechanism is invisible by design."

### Reveal headlines

All ten follow the MYTH-1 pattern: blame system/information gap, never the guesser.

- "Decades of research say otherwise." — the research says it; the guesser didn't fail.
- "Since 1991. Congress has not changed it once." — structural.
- "To $0.76. That one design decision cost NYC delivery workers roughly $550 million per year." — company decision, not worker or consumer failure.
- "A refund is your own money coming back — it earned no interest while the IRS held it." — factual, no shame.
- "A credit is worth dollar-for-dollar. A deduction is worth a fraction of that." — explains the math gap.
- "Checking money is spoken for. An emergency fund is money with a specific job." — clear, no judgment.
- "Debt compounds too. The formula doesn't care which side you're on." — system-neutral; the formula is the actor.
- "Credit scores measure one thing: whether you pay back borrowed money on time." — limits the score, not the person.
- "Rewards are funded by fees — including fees paid by people who don't use rewards cards." — the card network is the actor.
- "Small changes that happen automatically tend to outperform large intentions that don't." — behavioral system framing, not a verdict on the user's willpower.

### Reveal notes (structuralExplanation)

All ten correctly locate the gap in system design, policy, information asymmetry, or product design. None attribute the gap to user ignorance or failure. The explanations are factually scoped and appropriately brief.

---

## Score Screen

The score screen shows "X of Y reveals seen" — not a grade, not a score in the evaluative sense. This continues the MYTH-1 pattern correctly. The label "reveals seen" is accurate and neutral.

The score-screen headline: "The real numbers behind ten things most people believe." — structural, not evaluative. No grading language.

The score-screen body: "Most of these gaps aren't about what any one person did. They're about how the systems are built, and how rarely anyone explains them. Knowing that changes how you move."

One mild note on "Knowing that changes how you move": this is a fine line. It's aspirational without being directive — it doesn't say what to do, only gestures at the value of the information. It passes the Non-Advice Rule but should be monitored in future copy iterations to ensure it doesn't drift toward "now do X."

The disclaimer paragraph is strong: "These figures come from public research, linked on each reveal. Programs change. The official sources are the place to confirm what applies to you." — accurate scope, refers to official sources, no urgency.

---

## Synthesis Prompts

Both prompts are insight-probing, not shame-inducing.

- "Which finding surprised you most?" — curiosity frame, ungraded, optional.
- "Is there something you assumed about money that this changed or confirmed?" — open, non-leading. The helper line "A few words is fine. No right answer." correctly defuses any pressure.

Neither prompt implies the user was wrong, behind, or deficient. The "changed or confirmed" framing explicitly validates both outcomes equally. This is good behavioral design and clean brand execution.

---

## Signpost URLs — Route Verification

All five signpost URLs map to routes that exist in the app:

| signpostUrl | Route exists? |
|---|---|
| `/tools/tip-calculator` | Yes |
| `/tools/tax-clarity` | Yes |
| `/tools/emergency-fund` | Yes |
| `/tools/debt-growth` | Yes |
| `/tools/compound-interest` | Yes |

No broken or placeholder routes.

---

## Sources Assessment

All questions carry at least one source. All are linked to official or peer-reviewed origins:

- DOL and EPI for wage policy questions — appropriate.
- Michael Lynn / Cornell peer-reviewed publications for tipping behavior — appropriate.
- IRS.gov for tax mechanics — appropriate.
- CFPB for consumer credit, emergency funds, and credit scores — appropriate.
- Federal Reserve Bank of Boston (2010) for interchange/rewards — appropriate, though 16 years old. Not a brand flag; the structural mechanism hasn't changed. Release agent should note this as a "best available citation" rather than a current study.
- Thaler & Benartzi (2004) and Milkman et al. (2011) for savings behavior — foundational, appropriate for mechanism claims.

The NYC DCWP source issue is noted above under Do No Harm Flags.

---

## Meta and Tool Name

**Page title:** "Personal Finance Myth Quiz | Finxiety" — accurate, descriptive, no overpromise.

**Meta description:** "Ten things most people believe about personal finance — tips, taxes, credit, and compound interest — and what the data actually shows." — matches voice register, describes exactly what the tool does, no puffery. Solid for SEO and social preview.

---

## Strengths

- **Structural attribution is consistent across all ten questions.** The writer understood the MYTH-1 standard and applied it without variation. Every "why the gap exists" box locates the actor (Congress, a platform company, lender-designed vocabulary, ad-funded framing) rather than the guesser.
- **The tipping cluster (questions 1-3) is the strongest trio.** Three interconnected questions build a cumulative picture of how the tipping system works. The progression from "tips don't reward service" to "the wage has been frozen since Reagan" to "a single UI decision cost workers $550M" is well-sequenced without being agitprop — it's all documented, all sourced, none of it directive.
- **The score screen gets the non-grading principle right.** "Reveals seen" is exactly the right label. Not "correct," not "right," not a score out of 10.
- **Synthesis prompt design is careful.** "Changed or confirmed" is a small but important choice — it doesn't treat the quiz as a knowledge test the user might have failed.
- **The data file is well-documented.** The `LAST_UPDATED` field is present, the comment block at the top describes freshness cadences, and the comment on the type definitions is explicit about the Do No Harm standard. This is infrastructure-level care that the release agent will rely on.

---

## Distribution Notes

**Who finds this first, and how?**

The strongest organic entry points are:
- Search queries around tipping myths ("does tipping actually reward good service," "federal tipped minimum wage history") — questions 1 and 2 target well-searched material. The tipped minimum wage question in particular maps to evergreen news coverage.
- Tax season search terms ("deduction vs credit difference," "why did I get a big refund") — questions 4 and 5 have high seasonal search intent in January-April.
- Credit score misconception queries ("does high credit score mean financially healthy") — the credit-score question addresses a very common misunderstanding with a clear, shareable reveal.

**What is the shareable moment?**

The platform-tips question has the highest virality potential: a specific dollar figure ($2.17 to $0.76), a named company (DoorDash), and a recent report (Jan 2026). This maps to existing public discourse about gig-worker pay. The structural attribution ("the platform changed when you see the screen; workers absorbed the result") is tweetable without being inflammatory.

The tipped-minimum question is also high-value for distribution via food-service worker networks and labor-adjacent publications. "Since 1991" is a concrete, statable fact.

**Cross-tool linkage is appropriate.** The signpost system correctly routes users to related tools (tip-calculator, emergency-fund, debt-growth, tax-clarity, compound-interest) as warm descriptive handoffs, not ads. The one weak signpost (rewards-myth) is flagged above for revision.

**Nonprofit/partner distribution:** The quiz requires no sign-in, runs client-side, and terminates cleanly. It is appropriate for embedding in partner organization link lists (food bank resource pages, community college financial literacy programs) without any friction. The score screen's "← Back to Finxiety" return link means the tool can be deep-linked directly without losing the audience.

---

## Summary

One minor copy revision required (rewards-myth signpost phrasing). One source verification required before ship (NYC DCWP direct URL). Both are non-blocking for brand review purposes.

The voice is clean, the structural attribution is consistent, the score screen avoids grading language, the synthesis prompts probe for insight without shame, and all signpost URLs resolve to live routes.

⟦BRAND-REVIEWED⟧
