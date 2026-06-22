# Disability Accessibility Review: GUIDE ("What's going on?")

- **Tool:** GUIDE — situation-picker routing tool at `/tools/guide`
- **File:** `finxiety/src/routes/tools/guide/+page.svelte`
- **Persona applied:** Disability & Chronic Illness User (`finxiety/research-findings/persona-renee-disability-user.md`), held simultaneously with the ALICE User (`finxiety/research-findings/persona-alice-primary-user.md`)
- **Reviewer:** disability-accessibility
- **Date:** 2026-06-22
- **Device walked:** 375px, keyboard-only and screen-reader paths considered

---

## Summary

GUIDE is a no-input routing layer: five situation cards in a `radiogroup`, each revealing a short list of matched tools. There are no income fields, no health questions, no disability questions, and nothing is stored. That fact alone removes most of the disclosure-anxiety surface that the Renee persona is most sensitive to, and the tool is genuinely strong on cognitive load and physical access.

The findings that remain are not about the GUIDE's own mechanics. They are about what the GUIDE *promises* and *routes toward* for a disability + poverty user, and one real fatigue-path regression created by the focus-move behavior. No Critical findings. One High finding (the focus-move regression), and three Medium findings about disability-relevant routing coverage that the GUIDE creates an expectation it does not fully keep.

---

### Cognitive Accessibility Beyond Compliance

- **Interruption survivability:** Strong. The tool holds no working state beyond a single selected card. If Renee sets the phone down mid-flare and comes back, the selection persists in the DOM and nothing is lost. There is no multi-step flow to resume from the top. This is exactly what the persona's "flow must survive interruption" requirement asks for.
- **Working memory burden:** None. There is no cross-screen dependency. Selecting a card reveals results on the same screen; she never has to carry a value forward. This is the single best thing about the tool for a fog-day user.
- **Label processing on a fog day:** The five labels are first-person, plain-language, and scannable. At 375px the longest label ("I'm trying to figure out what programs or assistance I might be able to get", line 36) wraps to roughly three lines but is a single complete thought; she does not have to hold the front of a sentence in mind to parse the end. No jargon, no acronyms at the entry layer. This passes the bad-day test.
- **Finding: pass.** The entry layer is genuinely completable on a bad-symptom day. Five options is at the upper edge of comfortable for a fog-day pick, but the labels are distinct enough that there is no agonizing between near-identical choices.

### Sensory Accessibility in Lived Practice

- **Dynamic content announcement:** The results `<section>` carries `aria-live="polite"` and `aria-label="Matched tools"` (line 215). New results announce. Good. However, see the focus-management finding below — `aria-live` plus a programmatic `.focus()` move on the same container can produce a double or competing announcement in some screen reader / browser pairings (the container is both focused and announced as a live region). This is a lived-practice friction the automated audit will not catch.
- **Focus management:** The `$effect` (lines 152-157) sets `tabindex="-1"` on the results container and calls `.focus()` whenever a selection is made. This moves focus *away from the card group* and into the results region every time a card is chosen. See High finding 1 — for a fatigue user this is the wrong default.
- **Color-only signals:** Selected state is conveyed by border color *and* a thicker left border (5px vs 3px, lines 296-301) *and* `font-weight: 600` *and* `aria-checked`. Not color-alone. Passes.
- **Focus-visible contrast:** `outline: 3px solid var(--forest)` with a 2px offset (lines 303-306). 3px forest outline on the light background is a clearly visible, non-color-dependent focus ring. Adequate.
- **Finding: flag.** Sensory mechanics are largely correct, but the focus-move-into-live-region pattern is both an announcement-doubling risk and a fatigue regression (carried as High finding 1).

### Physical & Fatigue Considerations

- **Touch target sizing:** Cards are `width: 100%`, `min-height: 48px`, `padding: 16px` (lines 271-284). Comfortably exceeds the 44px minimum, and full-width targets are the most forgiving possible shape for imprecise input during a flare when fine motor control is reduced. The tool-row links in results are full-width with `padding: var(--space-sm) 0` and a 22px icon — verify the result rows clear 44px in practice, but the full-width hit area makes mis-taps unlikely. Passes.
- **Interaction count:** One tap to a result set. This is the lowest possible interaction cost for a router. Excellent.
- **Roving tabindex vs. standard tab:** The roving tabindex pattern (lines 204, 163-177) means Renee tabs *once* to reach the card group, then arrows within it, rather than tabbing through five separate stops. For a keyboard or switch user managing a finite key-press budget, this is a real fatigue reduction — fewer discrete actions to traverse the group, and the group reads as one control rather than five. This is the right pattern and it is implemented correctly (Arrow keys wrap, Space/Enter select).
- **Energy-to-value ratio:** One tap returns a curated shortlist instead of the full tools index. For a fog-day user, that is a favorable trade — the GUIDE spends one spoon to save her the larger cognitive cost of scanning the entire catalog.
- **Finding: pass.** Physically, this is one of the lightest-weight tools in the suite. The roving tabindex choice specifically serves the persona.

### Disability-Specific Shame & Disclosure Anxiety

- **Disclosure Safety Test — questions that touch health, capacity, work gaps, or program enrollment:**
  - The GUIDE asks **zero** such questions. There is no field, no binary, no health prompt, no "are you disabled" toggle. Renee can reach a full result without disclosing anything to the tool. This is the cleanest possible outcome on the disclosure axis and it should be preserved in any future change.
  - The one label worth testing is the "benefits" card: *"I'm trying to figure out what programs or assistance I might be able to get"* (line 36).
    1. *Does answering honestly feel safe, or like a test?* Safe. It is a self-selected statement of intent, not an eligibility claim. There is no right/wrong answer and nothing is evaluated. The phrasing "might be able to get" is appropriately tentative — it does not require her to assert she qualifies.
    2. *Is there room for "it varies" / "not sure"?* The card is a soft, low-commitment entry ("trying to figure out"). It accommodates uncertainty by design; she is not declaring a status, she is declaring a question.
    3. *Does framing imply a benefit/penalty attached to the answer?* No. Picking it simply reveals tools. No gate, no consequence.
    4. *If she answers honestly and gets the least favorable result, does she feel treated fairly?* At the GUIDE layer there is no unfavorable result — it routes, it does not judge. (The *downstream* screener can return "may not match," but that is out of this tool's scope and is reviewed there.)
  - Persona note: the persona explicitly observes Renee says "I have arthritis" more easily than "I'm disabled," and that food assistance carries a quiet shame ("for people more broke than me"). The "benefits/assistance" label is framed around *programs and assistance*, not around *being needy* or *being disabled*, which is the right framing for her. It does not ask her to take up the identity; it asks what she is trying to do. Pass.
- **Finding: pass.** The GUIDE is disclosure-safe. This is its strongest property for this persona and the review's single most important confirmation: nothing here makes Renee out herself to proceed.

### Benefit-Cliff Fear Specific to Disability

- **Scope check:** The GUIDE itself models no eligibility and touches no asset-tested or income-tested program directly — so strictly, asset-limit and cliff copy is not *owed* at this layer. But the GUIDE is described as often the *first* Finxiety page a new user meets, and it is the doorway to the screener, the cliff-calculator, and recertification. The question is whether the doorway sets the right expectation for a disability user.
- **Asset-limit acknowledgment:** Not present in GUIDE (acceptable at a router layer; the screener carries it at line 290).
- **Income-is-not-always-good-news framing:** The "news" card (line 41) explicitly names "a raise" and routes to the cliff-calculator — good, the doorway does point a raise toward the right tool. But it routes a raise the same way for everyone; nothing signals that for a Medi-Cal/SSI user the cliff is sharper. Again, acceptable to defer to the cliff-calculator, but see Medium finding 3.
- **ABLE account surfacing:** Confirmed **absent from the entire `src/` tree**, not just GUIDE. The persona is explicit that an ABLE account "would solve her exact problem" (the Roth-IRA-vs-asset-limit fear) and "she doesn't know it exists." GUIDE is not the natural home for ABLE education, but the suite has a real gap here and the GUIDE is where it becomes visible: a user picking the "debt/savings" or "benefits" card who is also disability-navigating is routed toward savings tools that may *worsen* her asset-limit exposure with no mention that ABLE exists. This is a suite-level finding surfaced by the GUIDE, recorded as Medium finding 3.
- **Finding: flag.** Nothing wrong inside GUIDE's own scope, but the router currently routes a disability user toward downstream tools without the one acknowledgment (income/savings are not straightforwardly good news under asset limits; ABLE exists) that would mark the suite as built for her.

### Double Vulnerability

- **Compounding-load check (read as one person who is both ALICE and disabled at once):** On a flare day Renee opens this between shifts. The tool asks one thing, in plain language, with one tap to an answer, and stores nothing. The scarcity bandwidth tax and the fog tax both draw on the same budget, and GUIDE spends very little of it. This holds up well under the compounded load — until the focus-move (High finding 1), which on a fog day can disorient her by silently relocating her attention to a region she did not ask to be moved into, exactly when her working memory is least able to reconstruct "where am I now."
- **Finding: flag.** The tool's load budget holds for the double-vulnerable user *except* at the focus transition, which is where compounded fog + scarcity is least forgiving.

---

## Findings (ordered by severity)

### HIGH

**1. Forced focus-move into the results region penalizes the fatigue/fog user and risks a doubled screen-reader announcement.**
`finxiety/src/routes/tools/guide/+page.svelte:152-157` (the `$effect` that does `resultsEl.setAttribute('tabindex','-1'); resultsEl.focus();`), interacting with `aria-live="polite"` at line 215.

- *What it is:* Every time a card is selected, focus is programmatically yanked off the card group and dropped onto the results container. The container is simultaneously an `aria-live` region, so a screen reader may both announce the live update *and* announce the newly focused container — a competing/duplicated announcement. For a sighted fog-day user, the visible focus ring and scroll position move without her initiating it.
- *Why it matters for this user:* The task brief flags exactly this ("should the tool offer to scroll to results rather than focus-move?"). The persona's working memory "erodes unpredictably" under fog. A self-initiated tap that then silently relocates her focus context is the kind of "where did I just go" disorientation that costs a spoon to recover from. She also loses her arrow-key position in the card group — if she wants to try a different card she must re-find the group, which is precisely the "lose your place and start over" risk the brief raises.
- *Solution space:* Prefer a non-focus-stealing pattern. Options for the PM/engineer to choose between: (a) keep the `aria-live` announcement but do **not** call `.focus()` — let the polite live region announce the new results while focus stays on the selected card, so arrow-keys still work and she can re-pick freely; (b) if a focus move is desired for screen-reader discoverability, move focus to a non-live results *heading* element (not the live container) so announcement and focus are separate nodes, avoiding the double-announce; (c) scroll the results into view with `scrollIntoView` rather than moving focus at all. Respect `prefers-reduced-motion` for any scroll (the tool already honors it elsewhere, lines 416-426). Note there is also a latent reference to `.results h2` styling (lines 327-331) but the results markup renders no `<h2>` — worth reconciling if option (b) is taken.

### MEDIUM

**2. The "benefits" card promises program discovery but routes to no disability-specific program path.**
`finxiety/src/routes/tools/guide/+page.svelte:33-38` (benefits situation → `screener`, `document-checklist`, `recertification`, `myth-quiz`).

- *What it is:* When Renee picks "what programs or assistance I might be able to get," the four matched tools are SNAP/Medi-Cal-style screening, a document checklist, a renewal-date tracker, and a myths quiz. The screener does surface SSI/SSDI *as context* (it tells her some programs also count assets, screener line 290) and points to 211, but there is no routing toward IHSS, SSI, SSDI-appeal guidance, or any disability-program path. For a user whose *primary* unmet needs are CalFresh-while-disabled, IHSS, and the SSDI appeal, the curated shortlist quietly tells her the suite's "programs" lane is not really built for her situation.
- *Why it matters for this user:* This is the persona's core fear made structural — "am I disabled enough to take up space in a system built for people worse off than me." If she picks the most on-the-nose card and the results contain nothing that names her reality, the silence reads as the same answer the SSDI letter gave her. The router is honest about scope but the *absence* lands as exclusion for the exact user the gate exists to protect.
- *Solution space:* This is a coverage decision for the PM, not a GUIDE-code bug. Either (a) accept the gap deliberately and document that disability-specific programs are out of current suite scope (the persona itself notes SSI/IHSS/CalABLE tools are "not yet in scope"), and/or (b) add one honest signpost in the screener results for the benefits path — naming that disability programs (SSI, IHSS) and the SSDI appeal exist and are navigated through 211 / a disability advocate — so the doorway does not over-promise. The GUIDE label could also be left as-is; the fix belongs downstream, but the GUIDE is where the expectation is set, so flag it here.

**3. The router sends a disability user toward savings/raise tools with no acknowledgment of asset limits or that ABLE accounts exist.**
`finxiety/src/routes/tools/guide/+page.svelte:39-52` (the "news" card → cliff-calculator, and the "debt-savings" card → compound-interest / savings-commitment); ABLE confirmed absent across `src/`.

- *What it is:* The "debt-savings" and "news (raise)" cards route to tools that encourage saving and model raises. For a user on Medi-Cal/SSI with an asset limit and a Roth IRA she's already afraid of, "start saving" and "you came out ahead on the raise" can be actively misleading without the asset-limit caveat. ABLE — the exact instrument that resolves her Roth-vs-asset-limit fear — appears nowhere in the product.
- *Why it matters for this user:* The persona says ABLE "would solve her exact problem" and she has never heard of it. A suite that routes her toward generic savings tools while staying silent on the one disability-specific savings vehicle is solving the ALICE half and missing the Renee half — the definition of a double-vulnerability miss.
- *Solution space:* Suite-level, PM-owned. Not a GUIDE code change. Track as a backlog item: surface ABLE/CalABLE where asset-tested benefits and savings intersect (most naturally in the cliff-calculator and/or savings-commitment results, and in the screener's existing SSI/SSDI asset note at line 290, which is the single best existing hook). Flagged here because the GUIDE is the entry point that makes the omission visible.

### LOW

**4. Five options at the entry layer is at the upper bound for a fog-day pick.**
`finxiety/src/routes/tools/guide/+page.svelte:33-59`.

- *What it is:* Five distinct situation cards. The labels are well-differentiated so this is not a real overload, but five is the most a fog-day user should be asked to weigh at once, and the "learning" card (line 56) overlaps conceptually with both "benefits" and "paycheck."
- *Why it matters:* Minor. On a depleted day, more options = more comparison cost. The current labels are distinct enough that this stays Low.
- *Solution space:* No action required now. If future analytics show the "learning" card is rarely chosen or frequently chosen by users who then bounce to a different card, consider whether it earns its slot. Do not pre-emptively cut it.

---

## What the Tool Does Well for This User

- **It asks her to disclose nothing.** No health question, no disability binary, no income field, nothing stored. This is the single most important property for the Renee persona and the GUIDE gets it completely right. Preserve this in every future change.
- **One tap to value, zero working-memory carry.** Interruption-survivable, fog-friendly, the lightest spoon cost in the suite.
- **Roving tabindex is the correct, fatigue-reducing keyboard pattern** and is implemented correctly (wrap-around arrows, Space/Enter select, single tab-stop for the group).
- **Selected state is multi-channel** (border weight + color + font-weight + `aria-checked`), not color-alone; focus ring is high-contrast and honors `prefers-reduced-motion`.
- **Plain, first-person, non-shaming labels.** "What's going on?" and "assistance I might be able to get" frame the user's *intent*, not her *neediness* or her *status* — exactly the framing the persona needs.
- **Touch targets are generous and full-width**, the most forgiving shape for reduced fine-motor control during a flare.

---

## Disposition

One **High** finding (the forced focus-move / live-region interaction, finding 1) is a real fatigue-and-disorientation regression for the fog-day user and is within this tool's own code. It must be addressed or explicitly accepted by the PM before sign-off.

The two **Medium** findings (2 and 3) are suite-level coverage decisions surfaced *by* the GUIDE but not fixable *inside* it; they are routed to the PM/backlog and do not by themselves block the GUIDE, but they should be acknowledged.

Sign-off is **withheld** pending resolution or deliberate acceptance of High finding 1.

⟦DISABILITY-BLOCKED⟧ tool="guide" ticket="GUIDE" date="2026-06-22"
reason="HIGH: forced focus-move into aria-live results region (page.svelte:152-157 × :215) is a fatigue/fog disorientation regression and a screen-reader double-announce risk. Resolve or deliberately accept before sign-off. MEDIUM 2 & 3 (disability-program routing coverage; ABLE absent from suite) routed to PM as backlog, non-blocking at GUIDE layer."

---

## Re-verify

- **Date:** 2026-06-22
- **Trigger:** Fix applied to HIGH finding 1 (forced focus-move into the `aria-live` results region).
- **File re-read:** `finxiety/src/routes/tools/guide/+page.svelte`

### What changed

The `$effect` no longer mutates `tabindex` or calls `.focus()` on the results container. It is now scroll-only:

```js
// page.svelte:152-156
$effect(() => {
    if (selected && resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
```

The dead `.results h2` CSS block (referenced in the original review as a latent reconcile item) has been removed.

### Verification against the four checks

1. **`$effect` is scrollIntoView-only.** Confirmed (page.svelte:152-156). No `setAttribute('tabindex', ...)`, no `.focus()` on `resultsEl`. The focus-stealing mechanism that caused the fog-day disorientation and the competing screen-reader announcement is gone.

2. **aria-live region intact.** Confirmed (page.svelte:214): `<section class="results" aria-live="polite" aria-label="Matched tools" bind:this={resultsEl}>`. The polite live region still announces matched tools when a card is selected. New results are announced to screen-reader users; the difference is that the container is no longer *also* focused, which removes the double-announce risk.

3. **Roving tabindex survives selection.** Confirmed. Because focus is never moved off the card group, the selected card retains `tabindex=0` (page.svelte:203) and keeps DOM focus. `onKeydown` (page.svelte:162-176) is unchanged and still arrow-navigates `cardEls`. A keyboard or switch user can continue arrow-keying to other situations after results render, and re-selecting a different card costs no re-orientation — exactly the fatigue/fog behavior the persona needs. The fog-day "lose your place and start over" risk is resolved.

4. **Reduced-motion.** The fade-in animation is gated by `prefers-reduced-motion` (page.svelte:409-419). The smooth `scrollIntoView` with `block: 'nearest'` produces minimal movement and is honored by browsers respecting the OS reduced-motion setting. Not a regression; acceptable.

### Disposition

HIGH finding 1 is **resolved** — the fix matches the persona-grounded solution space (option (c): scroll into view rather than move focus, with the live region preserved for announcement). The fix is clean and introduces no new findings.

MEDIUM findings 2 (no disability-specific program path off the "benefits" card) and 3 (ABLE absent across `src/`; raise/savings routing carries no asset-limit acknowledgment) are **accepted as PM backlog items**. They are suite-level coverage decisions, not fixable inside GUIDE's router code, and were explicitly scoped as non-blocking at the GUIDE layer in the original review. They remain open against the persona (the ABLE gap in particular is a real double-vulnerability miss for Renee) and should be tracked in `finxiety/PRODUCT_BACKLOG.md`, not closed.

LOW finding 4 (five entry options) unchanged, no action required.

With no Critical or High findings remaining, the gate clears.

⟦DISABILITY-REVIEWED⟧ tool="guide" ticket="GUIDE" date="2026-06-22"
