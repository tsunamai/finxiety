# Behavioral Science Validation — CLIFF-1 (Benefits Cliff Calculator)

**Date:** 2026-06-21
**Reviewer:** behavioral-science agent
**Persona applied:** ALICE Primary User (`finxiety/research-findings/persona-alice-primary-user.md`)
**Prior gates cleared:** brand, QA
**Files reviewed:**
- `finxiety/src/routes/tools/cliff-calculator/+page.svelte`
- `finxiety/src/lib/calculators/cliff.ts`
- `finxiety/src/lib/data/snap-eligibility.ts` (referenced thresholds)

---

## Why this tool carries unusual weight

The persona names this moment directly (lines 110–112): a raise or job offer is "the most emotionally complex moment in the suite." Dani "may decline the raise without asking anyone, or take it without understanding the tradeoff." CLIFF-1 exists for exactly the seconds in which she is deciding. That makes the output of this tool a potential input to a real, consequential, hard-to-reverse choice about her income. Every other Finxiety tool describes a present state. This one sits next to a fork in the road.

That elevates the stakes on two of our lenses above their usual level: **locus of control** (does she leave with a lever, or with confirmation she's trapped?) and **Do No Harm / no verdict** (the math must inform the choice without making it).

I walked the worst-case path with Dani's real numbers (single parent, household of 3, ~$2,000/mo, raise on the table). I review that negative state separately from the beneficial one below.

---

## Scarcity Mindset

- **Cognitive steps to first answer:** Two real inputs (current income, proposed income) plus household size and one checkbox. The two converters (paycheck → monthly, annual → monthly) are progressive-disclosure and optional — they reduce, not add, load for someone who only knows their per-check number. This is well within one cognitive step. **Good.**
- **Tunneling risk:** The result page is long. After the verdict box, a scarcity-tunneled user reading on a 375px phone in a ten-minute window may stop at the first emotionally complete unit — the verdict box — and never scroll to the employer questions, the Medi-Cal note, or the screener signpost. The single most important "what can I do" content sits *below* the most alarming message, and is the part most likely to be missed. (See Critical Findings #1 and #2.)
- **Present-bias risk:** Low and appropriate. The tool compares two *present* states ("right now" vs. "at the new income"), not a speculative future. It does not ask Dani to project or plan. **Good.**
- **Finding:** **flag** — the structure is one-step to answer, but the actionable content is positioned where a tunneled user won't reach it.

---

## Financial Shame

- **Result-display triggers reviewed line by line:**
  - The two scenario cards show benefits as facts ("~$288/month estimated," "Free coverage," "Over the income limit"). "Over the income limit" is neutral and structural, not a judgment of Dani. **Good.**
  - The verdict box summary for a real cliff reads: *"You'd have about $X less per month in total resources than you do now. This is the benefits cliff."* (line 496). The framing attributes the loss to **the system's structure** ("This is the benefits cliff"), not to Dani's choice. That is the correct target. It does not say "the raise you wanted would hurt you" or anything that makes her almost-decision feel foolish. **This is handled well.** It answers the prompt's question 3 directly: she is given a named structural phenomenon to negotiate from, not a mirror of a bad personal call.
- **Implicit comparisons:** None found. No "experts recommend," no "most people," no standard she's measured against. **Good.**
- **The "verdict" language:** Internally the markup uses `verdict-box`, `verdict-cliff`, `verdict-gain`. These class names are **not user-visible** and carry no shame risk. I flag them only as a naming note for the team (see Low findings) — "verdict" is precisely the framing Do No Harm tells us the *output* must avoid, so the vocabulary in the code is worth not letting leak into copy later. No action required for this gate.
- **Color of the cliff state:** The negative verdict uses the terracotta left-border (`verdict-cliff`, line 918–921) — the brand's alarm/attention color. This is restrained (a 4px left border, not a red fill), and pairs with calm explanatory prose. It reads as "pay attention here," not "you failed." Acceptable, but it is the highest-shame-risk visual on the page; keep it restrained.
- **Finding:** **pass** — the cliff result is framed as a structural fact, attributed to the system, not to the user. This is the hardest thing for this tool to get right and it gets it right.

---

## Trust

- **Trust-building elements:** No login, no email, no PII (consistent with the suite). Plain-language program names with parentheticals ("CalFresh (food assistance)"). Estimates explicitly tagged `estimated` at every dollar figure. Sources section with official URLs and a "last verified October 2025" line. The Medi-Cal note openly admits the limits of its own math ("This calculator does not estimate Covered California premium costs," line 524–527). Admitting what the tool *can't* do is one of the strongest trust signals available to a user with calibrated distrust. **Strong.**
- **Trust-breaking risks:** The Covered California link and the employer-questions block are the two places that could read as "this is steering me." Both are defused in copy: the employer block says "These are questions, not recommendations" (line 635), and the Medi-Cal note frames Covered California as a place to *see actual prices*, not a product to buy. **Defused well.**
- **Trust arc:** Dani arrives distrustful (the persona's rational baseline). The tool asks for nothing personal, shows its work, labels every estimate, and admits its blind spots. She should end with *more* trust than she came in with — provided the negative result doesn't leave her stranded (see locus of control).
- **Finding:** **pass.**

---

## Locus of Control & Agency (Do No Harm — no verdict)

This is the lens that matters most for this tool, and where I have my central concern.

- **Verdict vs. information:** The copy stays on the right side of the line. It never says "don't take the raise" or "you should." It says what the math shows and names the structure. The prompt's question 2 — does the employer section create obligation or provide agency — resolves in favor of **agency**: the questions are framed as "questions some people ask," explicitly "not recommendations," and tied to "your specific situation." **Good.**
- **Path forward on the BENEFICIAL result:** When the raise is clearly net-positive, the summary is reassuring without being prescriptive ("Your total monthly resources would stay about the same" / "up about $X/month"). It states the fact and stops. It does **not** say "so take it." Correct. (Answers prompt question 5.) **Good.**
- **Path forward on the NEGATIVE result — the gap:** When the result is a true cliff (net resource loss), the verdict box itself ends on *"This is the benefits cliff."* and nothing else. The two things that could give Dani a lever — the employer questions and the Medi-Cal/Covered California note — are rendered **outside** and **below** the verdict box, and the employer block is **conditionally gated** (`result.netDelta < 100 && (result.calFreshDelta < 0 || result.losingMediCal)`, line 622). So there exist real cliff scenarios where the most distressing sentence on the page is also the *last* thing in its visual container, with the path forward either below the fold or not rendered at all. For a scarcity-tunneled user, "This is the benefits cliff." can land as a closed door — exactly the externalized-locus confirmation the persona warns about (lines on external locus / "a result with no path forward is just a mirror," persona #7).
- **Finding:** **flag → escalated to Critical #1.** The tool has the agency-giving content; it is positioned where a tunneled user in crisis may never see it, and absent entirely in some cliff cases.

---

## Cross-Tool Bridge

- **Where the bridge is:** A single generic signpost footer at the very bottom of the page (lines 654–660), pointing to the Benefits Screener and Document Checklist. It is the *same* footer regardless of result. It is not tied to the cliff outcome.
- **The missed opportunity:** When CLIFF-1 shows a loss, it has only modeled CalFresh, Medi-Cal, and Lifeline. It has **not** modeled WIC, school meals, HEAP, or CalEITC — all of which exist in the eligibility data and several of which Dani (household of 3, school-age kids) may newly or still qualify for at the *higher* income. The natural, non-directive bridge in a cliff scenario is: "this tool only checked three programs — others exist, and the Screener can check them." That reframes a loss from "the system took something" to "there may be offsets you haven't checked" — which restores agency without recommending anything. Right now that bridge is generic and buried, so the reframe doesn't happen at the moment it's most needed.
- **Character of the existing bridge:** Informational and non-directive (good), but **not contextual** and **not positioned** for the cliff result.
- **Finding:** **flag → escalated to High #2.**

---

## Enabling Environment (Matuschak)

- **Changed capability:** Yes, genuinely. Before this tool, Dani "can't fully run those numbers" (persona line 111). After it, she can *see* the cliff and — crucially — she has a vocabulary ("the benefits cliff," "phased raise," "Medi-Cal vs. Covered California subsidies") she did not have walking in. That vocabulary is the real durable artifact: it lets her have a different conversation with an employer or a caseworker. This is closer to a true enabling environment than most calculators achieve.
- **The after-the-tab question:** If Dani closes the tab, what's different in 24 hours? She knows the raise has a benefits consequence and roughly its size, and she has 2–3 concrete questions to ask. That is a real change. The risk to durability: the numbers are estimates she can't reproduce, so if she's asked "by how much?" a week later she has the *concept* but not the figure. The concept is the part that matters most here, and it's the part that survives. **Acceptable.**
- **Active vs. passive:** Mostly passive reception (she reads a result). The one active moment is entering both income figures — which does require her to *locate herself* at two points on the curve, which is more engaging than a single-number readout. The chart invites comparison. Reasonable for this tool type.
- **Illusion-of-understanding risk:** Low-to-moderate. The danger is that the clean two-column comparison produces a feeling of precision the estimates don't support — Dani may over-trust the exact net-delta dollar figure. This is mitigated by the pervasive `estimated` tags and the Medi-Cal "we don't calculate this" admission. **Acceptable.**
- **Finding:** **pass** — this tool changes capability, not just transmits a number. The vocabulary it hands Dani is its most enabling feature.

---

## Critical Findings (ordered by severity)

### Critical #1 — The cliff verdict box ends on the alarm sentence; the path forward lives outside it and is sometimes absent
**What it is:** In a true-cliff result, the verdict box closes with *"This is the benefits cliff."* (line 496). The agency-giving content — employer questions (conditionally gated, line 622) and the Medi-Cal/Covered California note (line 510) — is rendered *outside and below* the verdict box. The employer block does not render at all when its gate fails, and on a 375px screen even when it does render it is below the most distressing sentence.
**Why it matters for Dani:** The persona is explicit that a result with no visible path forward "is just a mirror" and reinforces external locus of control (persona #7; lens 4). A scarcity-tunneled user reading in a ten-minute window is precisely the person who stops at the first emotionally complete unit. Ending the cliff message on "This is the benefits cliff." with nothing actionable attached *in the same container* risks delivering the system's worst news as a closed door.
**Solution space (PM decides):**
- Add one non-directive forward-looking sentence *inside* the verdict-cliff branch, e.g. a plain line noting that this tool checked three programs and that other programs and pre-tax options exist — with the screener link adjacent. Not "do X"; a signpost.
- And/or ensure that whenever a true cliff renders, *something* with a forward signal is always present (remove the dependency on the conditional employer block being the only path-forward in some cases).

### High #2 — The cross-tool bridge to BEN-1 is generic and buried, missing the cliff-specific reframe
**What it is:** The only bridge to the Benefits Screener is the page-bottom signpost footer (lines 654–660), identical for every result. CLIFF-1 models only CalFresh, Medi-Cal, and Lifeline; WIC, school meals, HEAP, and CalEITC exist in the data and may apply at the higher income, especially for a household with children.
**Why it matters for Dani:** In a loss scenario, a contextual bridge ("this tool checked three programs; the Screener can check the rest") converts "the system took something" into "there may be offsets you haven't checked." That is the exact informational, non-directive door the suite is supposed to provide at a near-zero/loss moment (lens 5; persona "What This Means for the Suite"). A generic footer at the bottom doesn't fire at the moment of need.
**Solution space:** Surface a result-contextual screener signpost near the verdict box on negative/near-zero outcomes, naming that other programs weren't included here. Keep it informational, not "you should apply."

---

## Medium / Low Findings

- **Medium — chart legibility under load.** The dual-line SVG (solid = income + benefits, dashed = income only) plus two vertical markers is dense for a 375px screen and a tunneled reader. The accessible data table covers screen-reader users well, but the visual cliff may not "read" at a glance for a stressed sighted user. Consider whether the chart earns its space on mobile or whether the two scenario cards + verdict box already carry the message. Not a blocker.
- **Low — "verdict" vocabulary in code.** `verdict-box`, `verdict-cliff`, `verdict-gain` are not user-visible and are fine for this gate. Flagged only so the team keeps "verdict" out of any future user-facing copy — Do No Harm asks the output to be information, not a verdict.
- **Low — beneficial-result completeness.** When the raise is clearly positive, the tool correctly stops at the fact. Confirmed this does *not* tip into "so take it." No change needed; noted as verified.

---

## What the Tool Does Well for This User

1. **It refuses to render a verdict on her choice.** The hardest thing this tool had to do — describe a result that could read as "your raise hurts you" without telling her what to do — it does correctly. "This is the benefits cliff" points at the system, not at Dani.
2. **It hands her language, not just numbers.** "Benefits cliff," "phased raise," "Medi-Cal vs. Covered California subsidies" — durable vocabulary she can carry into a real negotiation. This is the genuinely enabling part.
3. **It admits its own limits.** The Medi-Cal note saying "this calculator does not estimate Covered California premiums" is a top-tier trust signal for a user with calibrated distrust.
4. **The employer questions are framed as agency, not obligation.** "These are questions, not recommendations" is exactly right.
5. **Estimates are labeled everywhere; sources are official and dated.** Consistent with Do No Harm and with the trust the persona requires in the first thirty seconds.
6. **One-step to an answer, with optional converters that reduce load rather than add it.**

---

## Sign-off

Two findings remain open at Critical/High severity, both concerning the same underlying issue: in the negative-result state, the tool has the agency-restoring content but positions it where a scarcity-tunneled user may not reach it, and in some cliff cases omits it. This is the precise failure mode the ALICE persona warns about for this exact moment in her life. The tool is close — the copy and framing are right; the *placement and conditionality* of the path-forward are the gap.

Withholding behavioral sign-off pending resolution (or deliberate, documented acceptance) of Critical #1 and High #2.

⟦BEHAVIORAL-BLOCKED⟧ tool="cliff-calculator" ticket="CLIFF-1" date="2026-06-21"

---

## Re-Verification — 2026-06-21

**Reviewer:** behavioral-science agent
**Trigger:** Both prior findings reported fixed; re-reading source from filesystem.
**File re-read:** `finxiety/src/routes/tools/cliff-calculator/+page.svelte` (full).

Both blockers were the same underlying failure: in the negative-result state, the tool *had* the agency-restoring content but positioned it where a scarcity-tunneled user might never reach it, and in some cliff cases omitted it entirely. Re-verifying each against the current code.

### Critical #1 — Path forward after the negative verdict — RESOLVED

Three changes claimed; all three present and confirmed.

1. **Verdict box is now the first element in results.** Lines 400–438. The `verdict-box` renders immediately after the `<h2>` and results-note, *before* the comparison grid (line 472) and the chart. The in-code comment (line 400) documents the intent: key number above the fold at 375px. The alarm sentence ("This is the benefits cliff.") no longer closes the visual region with the path-forward stranded below the fold — forward-signal content now follows it directly.

2. **`.cliff-signpost` renders on any negative net delta.** Lines 465–470. `{#if result.netDelta < 0}` wraps a `role="note"` div placed immediately after the medi-cal-note block and before the comparison grid: *"This tool covers CalFresh, Medi-Cal, and Lifeline. The Benefits Screener covers more programs — there may be offsets this view doesn't show."* Because the gate is the bare `netDelta < 0`, there is no cliff scenario in which the user sees the alarm with no adjacent forward signal. This closes the "closed door" failure mode named in the persona (#7: a result with no path forward is just a mirror).

3. **Employer-questions gate widened to `netDelta < 100`.** Line 649. The prior compound gate (`netDelta < 100 && (calFreshDelta < 0 || losingMediCal)`) is gone; the block now renders for any near-zero or negative result regardless of which specific program changed. Agency framing preserved by the eq-note "These are questions, not recommendations." (line 662).

**Finding:** **pass.** The agency-giving content is no longer conditional on which program changed, and is positioned in the same above-the-fold-adjacent region as the verdict box. A tunneled user who stops at the first emotionally complete unit now meets a forward signal there, not a closed door.

### High #2 — Cross-tool bridge generic and buried — RESOLVED

Resolved by the same `.cliff-signpost` (lines 466–470). The bridge is now:
- **Result-contextual** — fires only on `netDelta < 0`, the loss moment where it matters.
- **Positioned at the point of need** — immediately after the verdict box / medi-cal-note, not solely in the page-bottom footer.
- **Carries the cliff-specific reframe** — names that this tool checked three programs and that the Screener covers more, converting "the system took something" into "there may be offsets you haven't checked."
- **Informational, not directive** — "there may be offsets this view doesn't show," not "you should apply." Consistent with Do No Harm.

The generic signpost footer (lines 681–687) still exists but is no longer the *only* bridge, so the contextual reframe now fires at the moment of maximum relevance.

**Finding:** **pass.**

### Note carried to the release gate (non-blocking)

The contextual signpost links to `/tools/screener` (BEN-1), which the product context lists as planned rather than live. If that route is not live at distribution time the warm handoff would 404. This is not a behavioral regression — the page footer already used the same path — and it is a release/link-checker concern, not a behavioral one. Flagged here so it is not lost: confirm `/tools/screener` resolves before any public distribution push.

### Sign-off

Both Critical/High findings are resolved. No new Critical or High behavioral findings introduced by the fixes. The Medium (chart legibility on mobile) and Low (in-code "verdict" vocabulary) notes from the original review remain open as non-blocking and are unchanged.

⟦BEHAVIORAL-REVIEWED⟧ tool="cliff-calculator" ticket="CLIFF-1" date="2026-06-21"
