# Disability Accessibility Review: Debt vs. Growth Visualizer (DEBT-VIZ-1)
## Persona applied: Disability & Chronic Illness User (finxiety/research-findings/persona-renee-disability-user.md)

**Date:** 2026-06-21
**Reviewer:** disability-accessibility agent
**Source file:** `finxiety/src/routes/tools/debt-growth/+page.svelte`
**Prior gates:** ⟦QA-VERIFIED⟧, ⟦BRAND-REVIEWED⟧
**Reference precedent:** COMPOUND-1 (`finxiety/src/routes/tools/compound-interest/+page.svelte`, lines 413-416) — its SSI/ABLE scope-note handling is the benchmark applied below.

**Verdict:** ⟦DISABILITY-REVIEW-WITHHELD⟧ — one HIGH finding (missing SSI asset-limit / ABLE scope note on a savings-growth tool, where the sibling tool COMPOUND-1 already carries one).

---

### Cognitive Accessibility Beyond Compliance

- **Interruption survivability:** Strong. The flow is a single screen with no multi-step wizard, no progress to lose. All inputs persist in component state; results are reactive and recompute from the same inputs. If Renee sets the phone down mid-flare and returns, every field she filled is still there and the chart is still there. Nothing must be re-derived from memory. Pass on this axis.
- **Working memory burden:** Low. No cross-screen dependency — the user never has to carry a number from one screen to another. The investment field auto-mirrors the debt balance, which actively *removes* a decision and a re-typing step rather than adding one. This is well-suited to brain fog.
- **One-glance comprehension of the chart:** Adequate, with a caveat. The two-curve chart is conceptually dense (compound interest in two directions is a genuinely hard idea), but the design does not rely on the chart alone to carry meaning. The callout sentence and the three-cell summary row restate the takeaway in plain language and concrete dollars. A flare-day user who cannot parse the SVG can still read "this debt could grow to about $X / invested could grow to about $Y" and get the point. The results-note ("The point is the shape of the two curves, not an exact dollar prediction") correctly lowers the precision burden. Pass.
- **Finding:** **Pass.** This is one of the more flare-day-safe tools in the suite: single screen, no working-memory carry, reactive recompute, plain-language text equivalent of the chart. The submit-on-demand model (not auto-submit) is also good for cognitive load — the chart doesn't lurch into existence and re-announce while she's still typing.

---

### Sensory Accessibility in Lived Practice

- **Dynamic content announcement:** Pass. A dedicated `sr-only` `aria-live="polite" aria-atomic="true"` region (lines 188-192) announces "Your debt and growth comparison is ready below" on submit. The submit-blocked hint is also `aria-live="polite"`. Announcements are polite, not assertive — correct, they won't interrupt a screen-reader user mid-read.
- **Focus management:** Pass. On submit, focus moves to the results `<h2 tabindex="-1">` (lines 85-86, 330), with a visible focus outline. A screen-reader / keyboard user is delivered to the start of the results rather than left stranded at the submit button.
- **Color-only signals:** Pass. The chart is intentionally `aria-hidden="true"` and the callout + summary row carry the full text equivalent, so no meaning is lost to a screen-reader user. The legend pairs each color swatch with a text label ("Debt balance" / "Same amount invested"). The two summary values are distinguished by both color (terracotta/olive) AND their explicit labels ("Debt after X years" / "Investment after X years"), so a colorblind user is never asked to tell debt from investment by hue alone.
- **Screen-reader chart alternative:** Pass, with a note. There is no `sr-only` data table, but the callout sentence plus the three-cell summary row together form a complete, accurate text equivalent of the chart's takeaway (the endpoint values and the gap between them). For a *conceptual* tool whose stated purpose is "the shape of the two curves, not an exact dollar prediction," endpoint values are the load-bearing information, and they are fully exposed to AT. A per-year sr-only table would be additive but is not required to meet the bar. Carried forward as a LOW enhancement, not a blocker.
- **Finding:** **Pass.** The lived screen-reader experience holds up. Renee on a flare day using VoiceOver gets the announcement, lands on the heading, and reads a complete plain-text result without ever needing the chart.

---

### Physical & Fatigue Considerations

- **Touch target sizing:** Pass. Time-horizon toggles are `min-height: 48px` / `min-width: 64px` (app.css-confirmed via QA gate). Inputs render ~53px tall. Submit button inherits the global 48px minimum. All exceed the 44px floor — important for Renee, whose RA can make fine motor control unreliable on a flare day. Spacing between the four toggles (`gap: var(--space-sm)`) is adequate to avoid mis-taps.
- **Interaction count:** Low and appropriate. Minimum path to a result: type a debt balance (investment auto-mirrors), tap submit. APR, payment, and return all carry sensible defaults (24% / 0 / 7%). A fatigued user can reach a meaningful chart with two interactions. The auto-mirror on the investment field is a real spoon-saver — it removes a required re-typing of the same number.
- **Energy-to-value ratio:** Favorable. The result (a concrete, plain-language picture of compound interest in two directions) is worth the two-tap cost. No field is mandatory beyond debt balance. Nothing demands precision the user doesn't have.
- **Finding:** **Pass.** Genuinely low-spoon. Defaults do the heavy lifting; targets are generous; the auto-mirror removes a step.

---

### Disability-Specific Shame & Disclosure Anxiety

- **Inputs that touch health, capacity, work-history gaps, or benefit enrollment:** None. The five inputs are debt balance, APR, monthly payment, investment amount, expected return, plus a time-horizon toggle. Not one asks about health status, disability, source of income, employment, or program enrollment. There is nothing here that could reveal disability status directly or by inference.
- **Disclosure Safety Test:** No qualifying questions exist to run through the four-question test. The tool requires zero disclosure of anything Renee manages carefully. This is the safest possible posture on this axis — she can use the entire tool without the system learning a single thing about her body or her benefits.
- **Does watching the debt curve outpace savings feel punishing?** Reviewed carefully, because this is the emotional risk specific to this tool. The framing holds up well: the chart never labels the curves with Renee's own identity (it's "Debt balance," not "your debt"), the results-note explicitly redirects from her specific numbers to the conceptual shape, and the callout always pairs the debt figure with the investment figure rather than presenting the debt growth in isolation. The repeated anchor phrase "compound interest runs in both directions" frames the debt curve as a neutral mechanism, not a verdict on her. There is no shame copy. Brand gate confirmed the same across all three callout branches. Pass.
- **Finding:** **Pass.** Zero disclosure surface and non-punishing framing. This is a model for how a debt-themed tool avoids both financial shame and disability shame at once.

---

### Benefit-Cliff Fear Specific to Disability

- **Asset-limit acknowledgment:** **Absent.** The tool's right-hand curve is explicitly a *savings* growth curve — "Same amount invested" growing to "about $X" over up to 30 years. For Renee, who has $1,800 in a Roth IRA and an unresolved, unexplained fear that savings could disqualify her from SSI or jeopardize Medi-Cal once her SSDI appeal resolves, a tool that displays uninterrupted savings growth to (e.g.) $30K+ without acknowledging the ~$2,000 SSI resource limit is showing her a picture that, for her specific situation, could be actively misleading. "More savings is good" is the unstated premise of the entire investment curve, and for an SSI recipient that premise is conditionally false in a way that carries sharp, immediate benefit-cliff consequences.
- **Income-is-not-always-good-news framing:** Absent, on the savings/asset axis. (The tool is not income-tested, so the income-cliff lens is N/A; the *asset*-cliff lens is the one that applies, and it is unaddressed.)
- **ABLE-account surfacing:** **Absent.** Renee has never heard of an ABLE account; the persona names this explicitly as the thing that would solve her exact Roth-IRA confusion. This tool, which models savings growth, is precisely the surface where that pointer belongs.
- **Direct precedent:** COMPOUND-1 — the sibling tool that models the *same* savings-growth curve with the *same* compound engine, same author patterns, same signpost footer — already carries an unconditional SSI/ABLE scope note in its results section (lines 413-416): *"This tool shows how any savings grow. If you receive SSI, a roughly $2,000 resource limit applies separately — saving above that limit in a regular account can affect SSI eligibility. ABLE accounts (CalABLE in California) let eligible people save above that limit without it counting toward SSI."* DEBT-VIZ-1 shows the identical savings curve and omits this note. This is an inconsistency between two tools that present the same risk to the same user.
- **Finding:** **Flag → HIGH.** See Critical Findings #1.

---

### Double Vulnerability

- **Compounding-load check (reviewed as a user who is both ALICE and disabled at once):** On the cognitive/fatigue axis the tool holds up well under the combined load — single screen, defaults, auto-mirror, generous targets, plain-language result. The scarcity bandwidth tax and the flare-day fog draw on the same budget, and this tool spends little of it. Where double vulnerability bites is the asset-cliff gap above: the user carrying *both* axes is exactly the SSI/SSDI-adjacent person for whom "save more, it grows to $X" is not straightforwardly good news, and she is also the user least likely to have the bandwidth or prior knowledge (she's never heard of ABLE) to supply that caveat herself. The tool that handles her fatigue well but silently assumes savings growth is unambiguously good has solved the disability-fatigue axis and missed the disability-benefit-cliff axis for the same person.
- **Finding:** **Flag.** The cognitive-load budget holds. The benefit-cliff blind spot is where the double-vulnerable user is underserved — folded into Critical Finding #1.

---

### Critical Findings

**1. HIGH — Savings-growth curve shown with no SSI asset-limit / ABLE scope note (sibling tool COMPOUND-1 already carries one).**

- *What it is:* The tool renders an "amount invested" curve growing, unqualified, to large balances over up to 30 years, with no acknowledgment that for an SSI recipient a roughly $2,000 resource limit applies and that savings above it in a regular account can affect eligibility — and no mention that ABLE accounts exist to hold savings above that limit without the penalty.
- *Why it matters for this specific user:* Renee has $1,800 in a Roth IRA and a live, unexplained 2am fear that saving more could cost her SSI or Medi-Cal once her appeal resolves. She has never heard of ABLE — the persona names this as the exact gap. A tool whose entire right-hand curve embodies the premise "more savings is good" reinforces, for her, a picture that is conditionally false and carries a sharp benefit-cliff consequence. This is the disability-specific benefit-cliff lens, not the income-cliff lens BEN-1/CLIFF-1 already model.
- *Why HIGH and not Medium:* There is a direct, shipped precedent. COMPOUND-1 — the same-engine, same-curve sibling — already solved this with an unconditional scope note. DEBT-VIZ-1 presents the identical risk to the identical user and omits it. This is not a novel ask; it's an inconsistency that leaves the double-vulnerable user worse served on this tool than on its twin.
- *Solution space (PM/engineer decide):* Add an unconditional scope note to the results section, mirroring COMPOUND-1 lines 413-416. Render it inside the `{#if submitted}` results block (so it appears alongside the savings curve it qualifies), styled as a `role="note"` consistent with the existing `.callout`/`.scope-note` pattern. Keep it unconditional (no "are you on SSI?" gate — that would itself be a disclosure question and would fail the Disclosure Safety Test). Suggested copy can lift COMPOUND-1's verbatim for cross-tool consistency: *"This tool shows how any savings grow. If you receive SSI, a roughly $2,000 resource limit applies separately — saving above that limit in a regular account can affect SSI eligibility. ABLE accounts (CalABLE in California) let eligible people save above that limit without it counting toward SSI."* Brand should confirm the lift; this gate only flags the gap.

**2. LOW — No per-year sr-only data table for the chart (enhancement, not a blocker).**

- *What it is:* The chart is `aria-hidden`; the text equivalent is the endpoint callout plus the three-cell summary. There is no year-by-year tabular alternative.
- *Why it matters / why only LOW:* For a tool whose stated purpose is the *shape* of the curves and whose load-bearing data is the endpoints, the existing text equivalent is complete and meets the bar. A per-year sr-only `<table>` would let a screen-reader user who *wants* the granular trajectory explore it, but its absence does not fail any criterion. Purely additive.
- *Solution space:* Optional sr-only `<table>` of {year, debt balance, investment balance} at the 5-year tick intervals already computed for `xTicks`.

---

### What the Tool Does Well for This User

- **Zero disclosure surface.** Nothing in the tool asks Renee to reveal health status, disability, income source, or benefit enrollment. She can use the whole thing without the system learning anything she manages carefully. This is the strongest possible posture on disclosure anxiety.
- **Genuinely flare-day-safe structure.** Single screen, no multi-step flow, no working-memory carry, reactive recompute, all inputs persist across an interruption. Sensible defaults plus the investment auto-mirror let her reach a result in two interactions — low spoon cost.
- **Non-punishing debt framing.** The curves are never labeled with her identity, the results-note redirects from her numbers to the concept, and every callout pairs the debt figure with the investment figure. "Compound interest runs in both directions" frames the debt curve as neutral mechanism, not a verdict on her.
- **Complete text equivalent of the chart.** A screen-reader user on a flare day gets a polite live announcement, focus delivered to the results heading, and a full plain-language result without ever needing the SVG.
- **Generous, motor-friendly targets.** 48px toggles, ~53px inputs, adequate spacing — built for unreliable fine motor control.

---

## Sign-Off Status

⟦DISABILITY-REVIEW-WITHHELD⟧ tool="debt-growth" ticket="DEBT-VIZ-1" date="2026-06-21" blocker="savings-growth curve shown with no SSI asset-limit / ABLE scope note; sibling tool COMPOUND-1 (compound-interest/+page.svelte lines 413-416) already carries an unconditional one for the identical curve"

**To clear this gate:** Add the unconditional SSI asset-limit / ABLE scope note to the results section, mirroring COMPOUND-1's treatment (placement inside `{#if submitted}`, `role="note"`, unconditional — no disclosure-gating question). LOW finding #2 (sr-only data table) is optional and does not block. After the note is added, re-run this gate; no other axis requires re-review — cognitive accessibility, sensory accessibility, fatigue, and disclosure all pass as-is.

---

## Re-Verification — 2026-06-21

**Trigger:** Fix submitted for HIGH finding #1 (missing SSI asset-limit / ABLE scope note).
**Scope of re-verification:** HIGH finding #1 only. No other axis re-reviewed — all passed as-is in the original review and none of them was touched by this change.

**Verified against the source file (`finxiety/src/routes/tools/debt-growth/+page.svelte`, lines 471-474):**

```html
<!-- SSI/ABLE scope note -->
<div class="scope-note" role="note">
	<p>This tool shows how savings or debt grow over time. If you receive SSI, a roughly $2,000 resource limit applies separately — saving above that limit in a regular account can affect SSI eligibility. <a href="https://www.calable.ca.gov/" target="_blank" rel="noopener noreferrer">ABLE accounts (CalABLE in California)</a> let eligible people save above that limit without it counting toward SSI.</p>
</div>
```

Checklist:

- **Present and unconditional?** Confirmed. The note lives inside the `{#if submitted && lastPoint}` results block (line 344) but is itself ungated — no nested conditional, no "are you on SSI?" question. It renders identically across all three callout branches (debt-paid-off, debt-untouched, standard). The only precondition is that results are displayed at all, which is correct: the note qualifies the savings curve it sits beside, so it appears exactly when and where the curve does. This avoids the disclosure trap the original review warned against — a gating question would itself have failed the Disclosure Safety Test for Renee.
- **Names the asset limit (~$2,000)?** Confirmed. "a roughly $2,000 resource limit applies separately."
- **Mentions ABLE accounts with a CalABLE link?** Confirmed. "ABLE accounts (CalABLE in California)" links to `https://www.calable.ca.gov/` with `target="_blank" rel="noopener noreferrer"`.
- **Neutral framing (describes what exists, not directing action)?** Confirmed. The note states what exists ("a roughly $2,000 resource limit applies," "ABLE accounts let eligible people save above that limit") with no imperative, no "you should," no urgency. Consistent with Do No Harm. For Renee — who has $1,800 in a Roth IRA and a live 2am fear that saving more could cost her SSI/Medi-Cal, and who has never heard of ABLE — this is exactly the "name what exists, don't make her prove anything" posture the persona asks for (What Would Make Her Trust This Tool, items 4 and 7).
- **Matches COMPOUND-1 precedent in content and posture?** Confirmed against `compound-interest/+page.svelte` lines 413-416. Same `.scope-note` / `role="note"` pattern, same `var(--pine)` link color, same placement (results section, after the summary, before sources), same CalABLE URL and link attributes. Copy is intentionally adapted: DEBT-VIZ-1 opens "how savings or debt grow over time" (this tool shows both curves) vs. COMPOUND-1's "how any savings grow" — correct localization, identical substance. The "(CalABLE in California)" parenthetical sits inside the anchor here vs. outside in COMPOUND-1; immaterial to meaning, accessibility, or destination.

**Disclosure Safety Test (re-run on the new note):** The note introduces no question. It is a one-directional statement of fact with no input, no answer, no branch. There is nothing for Renee to disclose, categorize, or be evaluated on. Passes — it adds zero disclosure surface, preserving the tool's strongest existing property.

**Result:** HIGH finding #1 is resolved. LOW finding #2 (per-year sr-only data table) remains open as an optional, non-blocking enhancement. No Critical or High findings remain.

⟦DISABILITY-REVIEWED⟧ tool="debt-growth" ticket="DEBT-VIZ-1" date="2026-06-21"
