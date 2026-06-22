# Brand Review: COMPOUND-1 — The Compounding Effect

**Date:** 2026-06-21
**Brand agent:** brand (claude-sonnet-4-6)
**Files reviewed:**
- `finxiety/src/routes/tools/compound-interest/+page.svelte`
- `tsunam_vault/finxiety/Finxiety — Brand & Mission.md`
- `finxiety/status-updates/compound-1-validation-qa-2026-06-21.md` (QA findings, for context)

---

## Voice Violations

None blocking.

One advisory:

- "money roughly doubles every X years (a rule of thumb called the Rule of 72)" — the parenthetical "a rule of thumb called" is slightly over-explanatory for the Finxiety register. The voice rule is: describe what it shows, don't explain that you're explaining it. A tighter read: "At 7%, money roughly doubles every 10 years. That's the Rule of 72." Short declarative sentences land cleaner than embedded definitions. Not a blocker — the current sentence is not wrong, just slightly padded.

---

## Do No Harm Flags

**F-DNH-1 — BLOCKER: Signpost sentence creates a misleading promise**

Line 390 (signpost footer):
> "The same compound math runs on debt too."

This sentence sets up an expectation — the user expects the next thing to be about debt compounding. The two links that follow go to `/tools/emergency-fund` and `/tools/myth-quiz`. Neither is a debt tool.

This is not merely a copy-coherence issue (as QA categorized it). Under the Do No Harm principle, misleading signpost copy can cause a user to form an incorrect mental model — specifically, that the compound interest tool they just used applies the same way to their debt, and that either the Emergency Fund Checker or the Myth Quiz will help them with that. The Emergency Fund Checker does not address debt compounding at all. The Myth Quiz may touch related concepts but is not a debt tool.

The harm vector is small but real: a user with debt trying to understand how compound interest works against them clicks through expecting debt-specific help, finds something unrelated, and leaves with less clarity than they came in with. For a Finxiety tool, reducing clarity is a Do No Harm failure.

**Required fix (choose one):**

Option A — Rewrite the signpost to not imply a debt link:
> "The math compounds the same way in reverse if you have debt. The Emergency Fund Checker looks at the runway you have right now, and the Benefits Myth-Check Quiz covers other places money works differently than most people assume."

The phrase "in reverse if you have debt" acknowledges the connection without pointing somewhere it doesn't go. The links follow naturally as related Finxiety tools, not as debt resources.

Option B — Add the debt-growth tool link alongside the others:
> "The same compound math runs on debt too — see it in the Debt vs. Growth Visualizer. The Emergency Fund Checker looks at the runway you have right now, and the Benefits Myth-Check Quiz covers other places money works differently than most people assume."

This requires confirming `/tools/debt-growth` is live. The route exists in the filesystem (`src/routes/tools/debt-growth/`) and the QA file for DEBT-VIZ-1 exists, but whether that tool has passed its own full validation gate is outside the scope of this review. If DEBT-VIZ-1 is distribution-ready, Option B is the stronger fix because it gives the user exactly what the sentence promises.

---

## Strengths

**Tool name and meta description: clean.**
- Title: "The Compounding Effect | Finxiety" — accurate, plain, no inflation. Describes what the tool does.
- Meta description: "See how a starting amount and a monthly addition grow over time with compound interest, split into what you put in and what the interest added. Free, nothing saved." — tells the user exactly what they get. "Nothing saved" is excellent Finxiety voice: it pre-empts the privacy concern without making a big deal of it.

**Intro copy: correct register.**
"Compound interest is money earning interest, and then that interest earning interest too." — plain, accurate, no jargon. Treats complexity as Finxiety's problem, not the user's.

**Estimates labeled correctly.**
Every modeled output carries the "estimated" label or is explicitly framed as an estimate. "You put in" (totalContributed, which is exact arithmetic) correctly carries no estimate label. The distinction is handled precisely.

**Past-returns disclaimer: placed well and doubled.**
Appears in the rate field hint ("Past returns don't predict future results") and again in the sources list. The field-level placement is particularly good — it reaches the user at the moment they interact with the 7% default, not only after they've already seen a large number.

**investor.gov link present and in the right position.**
The primary official source is a .gov URL, placed in the sources section before the third-party S&P 500 link.

**No recommendation language anywhere.**
No "you should," "consider," "we recommend," "start saving," or any directive. The callout ("The longer it compounds, the more the back half outpaces the front") is observational, not motivational. This is exactly right.

**"Can be 0" on both amount fields.**
Small copy choice, high value. It removes the implicit assumption that the user has a starting balance or can afford a monthly contribution. Treats the user's situation as a given, not a problem.

**No investment product or account type mentioned.**
No IRAs, 401(k)s, brokerage accounts, or any financial product. The tool shows math, not a product recommendation.

**Results section aria-label and sr-only live region.**
Accessible result announcement is in place and worded correctly for screen reader users.

---

## Distribution Notes

**Who finds this first:**
The tool's strongest organic entry point is the search term "compound interest calculator." That is a high-volume, low-intent query — people trying to understand a concept, often students, people who just heard the term, or people looking at a savings account rate. Finxiety's framing ("see what you put in vs. what interest added, not just the final number") is differentiated from the standard calculator.

The meta description does this well. "Nothing saved" is also a differentiator worth surfacing in SEO copy if Finxiety builds out an /about page or tool index descriptions — it directly addresses the trust deficit in the target population.

**What's shareable:**
The callout with the user's own numbers ("the last 20 years add $X in interest — more than the $Y from the first 10") is a natural share moment. It is concrete, personal, and surprising. This is the kind of copy that gets screenshot-shared. Consider whether a share-friendly formatting treatment (the callout box is already visually distinct) is worth a UX pass later.

The Rule of 72 callout is also share-worthy for a different audience — more conceptually curious. "At 7%, money doubles every 10 years" is exactly the kind of thing people forward.

**What is not shareable:**
The headline future value ("~$245,000 estimated") is not a shareable moment by design — it is personal and contextual. The "estimated" label and the results-note copy correctly frame it as illustrative math, not a prediction. This is the right call. No design push toward making it shareable; leave it as is.

**Related-tool CTAs:**
See Do No Harm flag F-DNH-1 above. The signpost footer is the only distribution-relevant fix required before the review clears.

---

## Sign-Off Decision

F-DNH-1 (signpost sentence creates a misleading promise) is a blocker under the Do No Harm principle. The fix is a one-sentence copy change and does not require a code change in any logic. Once either Option A or Option B is applied and the signpost is internally consistent, this review clears.

All other copy passes voice and Do No Harm checks. The tool is otherwise brand-ready.

```
⟦BRAND-BLOCKED⟧ tool="compound-interest" ticket="COMPOUND-1" date="2026-06-21" blocker="F-DNH-1: signpost sentence 'The same compound math runs on debt too' implies a debt-tool link; neither linked tool is a debt tool; misleading promise violates Do No Harm" fix="rewrite signpost opening sentence (Option A) or add /tools/debt-growth link if DEBT-VIZ-1 is distribution-ready (Option B)" all-other-copy="passes voice and Do No Harm checks; clear to ship once F-DNH-1 resolved"
```

---

## Re-Verification — 2026-06-21

**F-DNH-1 fixed (Option A).** `compound-interest/+page.svelte` signpost footer:

Old: "The same compound math runs on debt too."
New: "The same compound math runs in reverse on debt — it's the same engine, different direction."

The implied debt-tool promise is removed. The sentence now explains the concept rather than setting up an expectation that the next link will be a debt tool. Both linked tools (Emergency Fund Checker, Benefits Myth-Check Quiz) remain and are accurately described. Do No Harm blocker resolved.

⟦BRAND-REVIEWED⟧ tool="compound-interest" ticket="COMPOUND-1" date="2026-06-21"
