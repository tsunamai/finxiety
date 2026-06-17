# TIP-1 Validation Gate — 2026-06-17

Tool: Tip Calculator (`finxiety/src/routes/tools/tip-calculator/+page.svelte`)
Calculator: `finxiety/src/lib/calculators/tip.ts`

---

## QA Review

Reviewed files:
- `finxiety/src/routes/tools/tip-calculator/+page.svelte`
- `finxiety/src/lib/calculators/tip.ts`
- `finxiety/src/lib/data/states.ts`
- `finxiety/src/lib/data/tip-one-fair-wage-2026.json`
- `finxiety/PRODUCT_BACKLOG.md` lines 600-688 (TIP-1 spec)
- `finxiety/CLAUDE.md` (non-negotiables)

Build status: PASS (`npm run build` exits 0, verified prior to this review).

### Functional correctness

All traces performed against `calculateTip()` in `tip.ts`. Rounding function: `Math.round(value * 100) / 100` (standard half-up to 2 decimal places).

**Case 1 -- Bill=$50.00, tip=20%, party=4**
- tipAmount: round2(50 * 0.20) = round2(10.00) = $10.00
- total: round2(50 + 10) = $60.00
- perPerson: round2(60 / 4) = $15.00
- Result: PASS. Matches the acceptance criterion exactly.

**Case 2 -- Bill=$50.00, tip=20%, party=1**
- tipAmount: $10.00, total: $60.00
- perPerson: null (party === 1, calculator returns null)
- Template guard `{#if partySize > 1 && result.perPerson !== null}` suppresses the per-person row
- Result: PASS. Per-person line does not render at party=1.

**Case 3 -- Bill=$33.33, tip=20%, party=3**
- tipAmount: round2(33.33 * 0.20) = round2(6.666) = $6.67
- total: round2(33.33 + 6.67) = round2(40.00) = $40.00
- perPerson: round2(40.00 / 3) = round2(13.333...) = $13.33
- 4000 cents mod 3 = 1 (does not split evenly)
- UI renders "each (approximately)" on all per-person values unconditionally (line 214)
- Result: PASS. Math is correct. The "(approximately)" label is correct and conservatively applied. `splitsEvenly()` is exported in tip.ts but not consumed in the template; see non-blocking flags below.

**Case 4 -- Bill=$0.00**
- `hasBill = bill > 0` evaluates false
- Template renders the empty-state prompt: "Enter a bill amount to see the tip and total."
- `bill` is clamped by `Math.max(parseFloat(billAmount) || 0, 0)` in the script
- Result: PASS. Zero bill shows empty state correctly.

**Case 5 -- Tip=0% via Other input**
- `tipPercent = Math.min(Math.max(parseFloat(otherPercent) || 0, 0), 100)` clamps to 0
- tipAmount: round2(50 * 0) = $0.00, total: $50.00
- `hasBill` is true so the result block renders showing Tip amount $0.00, Total $50.00
- Result: PASS. Zero tip is reachable and renders correctly without stigma.

### State data correctness

**CA flag:** `true` in JSON. PASS.
**TX flag:** `false` in JSON. PASS.

**State count -- STATE_NAMES in states.ts:** 51 entries (50 states + DC). PASS.

**State count -- JSON `states` object:** 51 entries (50 states + DC). PASS.

**Required One Fair Wage states (AK, CA, MN, MT, NV, OR, WA, DC, MI):**
- AK: true. PASS.
- CA: true. PASS.
- MN: true. PASS.
- MT: true. PASS.
- NV: true. PASS.
- OR: true. PASS.
- WA: true. PASS.
- DC: true. PASS.
- MI: true. PASS.

All 9 required OFW jurisdictions are correctly flagged `true`. MI is included as a full-state entry per the spec's "include if trivial" instruction. PASS.

**`last_updated` field:** present, value "2026-06-17". PASS.
**`verify_at` field:** present, value "https://onefairwage.site/". PASS.

### WCAG 2.1 AA

**All inputs labeled:**
- Bill amount: `<label for="bill">` bound to `id="bill"`. PASS.
- Custom tip percentage: `<label for="other-percent" class="sr-only">Custom tip percentage`. PASS.
- State selector: `<label for="state">` bound to `id="state"`. PASS.
- Tip base toggle: `aria-label="Tip base"` on `role="radiogroup"`. PASS.

**Result has `aria-live="polite"`:**
- `<section class="result" aria-live="polite" aria-label="Tip result">`. PASS.

**Tip segmented group accessibility:**
- `role="radiogroup"` on container. PASS.
- Each preset button and "Other" button has `role="radio"`. PASS.
- `aria-checked` bound reactively on each button. PASS.
- Roving tabindex: selected index gets `tabindex=0`, all others get `tabindex=-1`. PASS.
- Arrow key navigation via `onTipKeydown` (ArrowRight/Down and ArrowLeft/Up, with wraparound). PASS.

**Base (pre-tax/post-tax) segmented group:**
- `role="radiogroup"`, `aria-label="Tip base"`. PASS.
- Both buttons have `role="radio"`, `aria-checked`, roving tabindex. PASS.
- Arrow key navigation via `onBaseKeydown`. PASS.

**Stepper (party size):**
- Decrease button: `aria-label="Decrease party size"`. PASS.
- Increase button: `aria-label="Increase party size"`. PASS.
- Value span: `aria-live="polite"` and `aria-atomic="true"`. PASS.
- Screen-reader-only "person"/"people" label in `.sr-only` span. PASS.
- `role="group"` with `aria-labelledby="party-label"` on stepper container. PASS.

**Touch targets >= 44px:**
- Segmented buttons: `min-height: 48px`. PASS.
- Stepper buttons: `min-width: 48px; min-height: 48px`. PASS.
- State select: `min-height: 48px`. PASS.
- `<details>` summary: `min-height: 44px; display: flex; align-items: center`. PASS.

**`focus-visible` styles:**
- Stepper buttons: `stepper-btn:focus-visible` with 3px terracotta outline. PASS.
- Select: `select:focus-visible` with 3px terracotta outline. PASS.
- Details summary: `base-details summary:focus-visible` with 3px terracotta outline. PASS.
- FLAG (non-blocking): Segmented `.btn-toggle` buttons have no explicit `:focus-visible` rule in the component `<style>` block. These buttons are keyboard-reachable via roving tabindex. If a global `button:focus-visible` rule exists in `app.css`, this is resolved. If not, keyboard focus on preset and base-toggle buttons relies on UA default outlines, which may be invisible in some browsers. Confirm the global rule or add a component-level rule. See Flags below.

**Source link `target="_blank"` + `rel="noopener noreferrer"`:**
- DOL Fact Sheet link: `target="_blank" rel="noopener noreferrer"`. PASS.

**No color as sole conveyor of meaning:**
- Selected state on segmented buttons conveyed by border + background color AND `aria-checked`. PASS.
- Wage note uses left-border accent (`var(--olive)`) plus `role="note"`, not color alone. PASS.

### Do No Harm compliance

**No "you should tip X":** No prescriptive tip language anywhere in the template or calculator. PASS.

**No urgency / fear / guilt framing:** No urgency, countdown, or fear language present. The wage note is matter-of-fact. PASS.

**Wage note is descriptive, not prescriptive:** Both variants inform about wage structure without directing tipping behavior. PASS.

**0% reachable without stigma:** The "Other" button opens a numeric input with `placeholder="0"` and neutral label "Custom tip percentage". No "below recommended" or stigma label. PASS.

**No "recommended" or "standard" labels on presets:** Buttons display "15%", "18%", "20%", "25%" with equal visual weight and no qualifier labels. PASS.

**Default is 18%, not 20%:** `presetPercent = 18` per spec direction (lower anchor, Do-No-Harm aligned). PASS.

**Historical one-liner is factual only:** "The $2.13 federal tipped wage has been unchanged since 1991." No editorializing, no second-person address. PASS.

### Mobile first

**Single-column layout:** Form uses stacked field divs; result block uses `flex-direction: column`. No forced multi-column. PASS.

**Segmented buttons `flex-wrap: wrap`:** `.segmented { display: flex; flex-wrap: wrap; }`. PASS.

**No hardcoded pixel widths that force horizontal scroll at 375px:**
- `.input-suffix-wrap` has `max-width: 8rem` (128px), not a minimum floor.
- `.segmented-two .btn-toggle` has `min-width: 120px`; two buttons with `flex-wrap: wrap` can reflow at 375px.
- No outer container `width` or `min-width` values that would overflow 375px.
- PASS.

**No hardcoded hex colors:**
- `background: white` on the `<select>` element is a hardcoded color value, not a CSS variable. FLAG (non-blocking).
- `color: white` on `.btn-toggle.selected` is hardcoded. FLAG (non-blocking).
- All other color values use `var(--*)` tokens.
- These are cosmetic and not functionally harmful for v1, but deviate from the token convention.

### Edge cases

**Negative bill guarded:** `Math.max(parseFloat(billAmount) || 0, 0)` in the derived `bill`. Calculator also clamps with `Math.max(inputs.billAmount, 0)`. Double-guarded. PASS.

**Party size min 1:** `disabled={partySize <= 1}` on decrease button; `decreaseParty()` guards with `if (partySize > 1)`. Double-guarded. PASS.

**Party size max enforced:** `disabled={partySize >= MAX_PARTY}` on increase button; `increaseParty()` guards with `if (partySize < MAX_PARTY)`. MAX_PARTY = 50. PASS.

**Other tip clamped 0-100:** `Math.min(Math.max(parseFloat(otherPercent) || 0, 0), 100)`. PASS.

**Non-finite inputs in calculator:** `Number.isFinite()` guard on all three inputs in `calculateTip()` before any arithmetic. PASS.

### Copy spot-check

**Tipped-wage variant copy:**
Implementation: "In {stateFull}, the law lets employers pay tipped workers as little as $2.13/hr, with tips expected to make up the rest. Here, a tip is part of the wage, not an extra on top of it."
Spec: "In [STATE], the law lets employers pay tipped workers as little as $2.13/hr, with tips expected to make up the rest. Here, a tip is part of the wage, not an extra on top of it."
PASS. Exact match.

**One Fair Wage state variant copy:**
Implementation: "In {stateFull}, servers receive the full state minimum wage regardless of tips. A tip here is additional income, not a wage substitute."
Spec: "In [STATE], servers receive the full state minimum wage regardless of tips. A tip here is additional income, not a wage substitute."
PASS. Exact match.

**Historical one-liner renders only in tipped-wage states:**
Guard: `{#if !oneFairWage}` wraps the `.historical-fact` paragraph. Renders in tipped-wage states; suppressed in One Fair Wage states. PASS.

**Pre-tax / post-tax toggle has `<details>` disclosure:**
`<details class="base-details"><summary>How much does this change?</summary>...` at lines 333-339. PASS.

**Pre-tax/post-tax note copy:**
The spec one-liner's inline portion and dollar-delta example are split across two elements: `baseNote` gives a two-sentence toggle-following note; `<details>` provides the dollar-delta example ("On a $50 bill in an 8% tax area, post-tax vs. pre-tax is about $0.80 at 20%"). Together they cover the spec copy. Both are factual and non-prescriptive. PASS with note: the split is a reasonable structural decision placing the verbose example behind disclosure.

### Issues summary

**Blocking flags:** None.

**Non-blocking flags:**

1. `splitsEvenly()` helper is exported from `tip.ts` but not consumed in the template. The template unconditionally appends "(approximately)" to every per-person figure -- correct and safe but leaves the helper as dead code. Recommendation: either use the helper to distinguish exact vs. approximate splits, or remove the export. Ticket: TIP-2 / tech-debt.

2. Segmented `.btn-toggle` buttons lack an explicit `focus-visible` rule in the component style block. Confirm that `app.css` provides a global `button:focus-visible` rule; if not, add a component-level `btn-toggle:focus-visible` declaration. Ticket: TIP-2 / WCAG follow-up.

3. `background: white` on `<select>` and `color: white` on `.btn-toggle.selected` are hardcoded values. Should be CSS variables for theme consistency. Non-blocking for v1; must resolve before dark-mode or high-contrast work. Ticket: TIP-2 / design-tokens cleanup.

### Verdict

PASS WITH NOTES

All TIP-1 acceptance criteria are met. Functional math is correct across all traced cases. State data is accurate and complete (51 entries, all 9 OFW states correctly flagged). WCAG structural requirements are satisfied. Do No Harm compliance is clean. Mobile-first layout is correct. Three non-blocking flags are logged as tech-debt for TIP-2 and do not affect correctness or safety for v1.

⟦QA-VERIFIED⟧ ticket="TIP-1" date="2026-06-17"

---

## Behavioral Science Review (ALICE/Dani Persona)

Persona applied: `finxiety/research-findings/persona-alice-primary-user.md`
Framework: `finxiety/docs/socioeconomic-accessibility-framework.md`

Note on method: Bash was unavailable in this session, so this review is from the
source (full component read, CSS read, calculator read) rather than a live 375px
walkthrough. The component is small and the visual hierarchy is fully determined by
markup order plus the inline styles, so the findings below are reliable. A live
375px screenshot pass is still recommended as a confirmation step (QA owns that).

### Scarcity mindset at point of use

The point-of-use context matters more for TIP-1 than for any other tool in the suite.
Dani is at the table, kid next to her, server nearby, people waiting, possibly doing
this on a prepaid phone with the bill in front of her. The cognitive budget here is
seconds, not minutes.

What works:
- The math path is short. Bill amount is the first field; tip percentage is the second;
  the result block is the third element. A user can enter a bill, accept the 18% default,
  and read a tip/total without scrolling past any context. The fastest path to a number
  is genuinely fast, and the number is in the first place she looks (framework Dimension 1
  "answer is in the first place they look" — pass).
- The result is `aria-live="polite"` and recomputes reactively. No submit button, no
  second screen, no working-memory burden. Single cognitive step (Dimension 1 — pass).
- The state selector, wage note, and pre-tax/post-tax toggle all render *below* the result
  block. They do not block or gate the math. This is the correct order for scarcity:
  tactical answer first, context second. The spec's "calculator first, context second"
  is honored in the DOM order.

Flag (minor):
- The result block sits between the tip-percentage field and the party-size stepper.
  A diner splitting a check has to scroll *past the result* to reach "Split between."
  This is a small tunneling risk: a stressed user who sees the total may stop before
  finding the split control. It is not a blocker (party size defaults to 1 and the
  per-person line is additive, not required), but if a layout revision happens, placing
  the split control adjacent to or above the result would better match the at-the-table
  task order. Low severity.

Finding: PASS. Completes in one cognitive step; answer is first; context never gates math.

### Wage note — information vs. guilt

This is the highest-stakes string in the tool for Dani, and the area I scrutinized most.

The tipped-wage variant reads:
> "In [STATE], the law lets employers pay tipped workers as little as $2.13/hr, with
> tips expected to make up the rest. Here, a tip is part of the wage, not an extra on
> top of it."

The construction is doing the right work. The grammatical subject of the harm is
*the law* and *employers* — "the law lets employers pay." The structural cause is named
and located outside Dani. The note never addresses the user's tip, never uses "you,"
never implies an amount. It explains how the system is built, not how she should respond
to it. This matches framework Dimension 2 ("context note explains structural reality, not
personal failure") and the persona's trust condition #6 ("it acknowledges the structural
reality... without excusing it or explaining it at length").

Critically, the note is decoupled from the result. It only appears after she selects a
state (an action she takes for her own reasons), it renders in a calm `--cream` box with
an `--olive` left border — never an alert color — and it carries no number tied to her
tip. A Dani tipping 10% does not see this note change, redden, or respond to her input.
It is system information sitting next to her math, not a reaction to her math.

One residual consideration: the clause "with tips expected to make up the rest" is
factually correct but contains a faint normative pull ("expected"). In the at-the-table
moment, a reader carrying financial shame *could* hear "expected... to make up the rest"
as "and you are the one expected to." I do not think this rises to a shame trigger,
because the surrounding sentence keeps the agent on the employer and the law, and because
the note is spatially and temporally separated from her tip entry. But it is the one
phrase worth a brand eye on a future copy pass. Not a blocker.

Finding: PASS. The note reads as information about the system, not a prompt to feel bad.
The agent of harm is correctly placed on the law and the employer, never the diner.

### Anchoring and preset buttons

Presets are 15 / 18 / 20 / 25 with 18% as the default selection.

What works:
- All four presets plus "Other" use the same `.btn-toggle` class with `flex: 1`, identical
  borders, identical type weight. There is no low-to-high color gradient, no directional
  fill, no visual emphasis that makes 25% the "good" button or 15% the "stingy" button.
  This directly answers the research's anchoring concern (Section 5: suggested-amount
  framing inflates tips). Visually neutral — pass.
- 18% as the default (rather than 20%) is the Do-No-Harm-aligned choice the spec's open
  question raised. A lower anchor is the right call. Good.
- "Other" reaches any value including a low one (the input min is 0) with no stigma label,
  no "below recommended" warning, no friction. A Dani entering 10% via Other meets no
  resistance and no judgment. This is exactly right.

Residual consideration (not a flag, a note for awareness):
- The preset *row* still spans 15 to 25 with 18 pre-selected, so the visible range
  communicates "the normal band is 15-25." Dani who can afford 10% sees her number sitting
  below the lowest visible preset. The "Other" affordance fully neutralizes this (she can
  enter 10 without friction), and removing presets entirely would make the tool worse for
  everyone. So this is an accepted, unavoidable property of any preset design, not a defect.
  The mitigation (equal weight, low default, frictionless Other) is the correct one and is
  present. No action needed.

Finding: PASS. Presets are visually neutral, the default is the low-anchor choice, and the
low-tip path through "Other" carries no stigma.

### Result for a low tip

I traced the exact scenario from the brief: $40 bill, 10% via "Other," party size 1.
`calculateTip` returns tipAmount $4.00, total $44.00, perPerson null.

The render:
- Tip amount: `$4.00` in bold. Total: `$44.00` in bold at 1.25rem.
- Background is `var(--surface)` — a neutral surface, not red, not green.
- No icon, no color change, no comparative copy, no "low tip" signal of any kind.
- The wage note does not change based on the tip percentage; it is driven only by state.
  So a 10% tip produces the identical wage context as a 25% tip. There is no mechanism
  anywhere that reacts to the size of the tip.

This is the single most important pass in the review. The framework's Near-Zero Result
Test, adapted to TIP-1, is "the low-tip result test," and the tool passes it cleanly:
the $4.00 tip appears as a fact, not a verdict. Dani tipping what she can afford sees her
number reported back to her without comment.

Finding: PASS. The low tip displays as plain information. No feedback, color, or copy
signals that the tip is "low." Confirmed at the code level — there is no tip-reactive logic.

### Financial shame triggers

Running the framework's Dimension 2 checklist string by string:

- Results display as facts, not grades — PASS. Neutral surface, bold numbers, no color
  judgment, no iconography.
- No benchmarks unless the benchmark is the point — PASS. There is no "recommended X%,"
  no "average tip," no comparison to any standard anywhere in the tool.
- No "you're behind" framing — PASS. No "most people," no "best practice," no "you should."
- Worst-case (low-tip) state reviewed separately — PASS (see prior section).
- Context note explains structural reality, not personal failure — PASS. Agent of harm is
  the law/employer; see wage-note section.
- No "you should" anywhere — PASS. Verified across all copy strings.
- Historical one-liner — PASS as context. "The $2.13 federal tipped wage has been
  unchanged since 1991." is a statement about policy stagnation, styled quieter than the
  note (`--muted`, 0.8125rem). It carries no second-person address and no implied ask. It
  lands as "this is how long the system has been frozen," not "and therefore you must
  cover it." Good.
- One Fair Wage variant — PASS. "A tip here is additional income, not a wage substitute."
  For a Dani in CA this is accurate and, if anything, *reduces* obligation pressure: it
  tells her the server is not depending on her tip to reach minimum wage. I checked
  carefully for an implicit "so you can tip less / so don't bother" reading — the copy
  does not editorialize in either direction. It states the wage fact and stops. It neither
  absolves nor obligates; it informs. Correct.

Finding: PASS on every shame-checklist item. No copy string implies a correct tip amount.

### Locus of control

The tool's job for Dani is to leave her more informed, not more obligated. It achieves
this on the information axis: she ends the interaction understanding something structural
she very likely did not know — that in most states the tip largely *is* the wage, set by a
law frozen since 1991. That is real, transferable knowledge about how the system is built,
and it is delivered without transferring moral responsibility onto her (the agent-placement
in the copy does this work).

Important: this is genuinely new capability, not just a number. Compare EMG-1, where the
output is largely a mirror of what Dani already knows (she knows she has no savings). Here
the wage-structure fact is something Dani plausibly did *not* know, and it will change how
she reads the next POS screen and the next "expected" tip prompt. That is the enabling-
environment win for this tool: the after-the-tab difference is a revised mental model of
what a tip *is*, not a forgotten dollar figure.

The one limit: the tool informs but does not connect her to anything she can *do* with the
information. For TIP-1 that is largely appropriate (the tool is not an eligibility tool and
there is no "fix the tipped wage" action to offer a diner). But see the cross-tool bridge
finding — the absence of any onward path is the one place the tool ends at the information
rather than pointing past it.

Finding: PASS. The wage note delivers real, structural information and does not transfer
obligation. Locus of control is preserved.

### Trust

What builds trust here:
- No login, no email, no account, no PII, fully client-side. Persona trust condition #1
  satisfied.
- Copy sounds like a person ("Split the check and see the actual math"), not a brochure.
- No product funnel, no upsell, no "talk to an advisor."
- The tool does not assume Dani has anything. A tip calculator is inherently low on the
  "assumes you have money" axis, which makes it a low-shame entry point to the suite.

On the DOL source link specifically (the brief's question): citing DOL Fact Sheet 15 is,
on balance, trust-building rather than friction. It is styled quietly (`--muted`, small,
below the note), it is not a wall the user must pass, and it backs a claim the tool is
making about the law — which is exactly when a source *should* appear. The persona's
concern about negative experiences with government agencies is real, but the link is a
citation, not a referral: it does not send Dani *to* the DOL to do anything, ask her to
prove anything, or imply she must engage an agency. It says "here is where this fact comes
from." For an ALICE user with calibrated distrust, a checkable source on a structural claim
reads as "this tool is not making this up," which is the trust-positive read. Acceptable
as built.

Residual: it opens in a new tab (`target="_blank" rel="noopener"`) — correct, keeps her in
the tool. No trust cost.

Finding: PASS. Trust arc is net positive. Stateless, voice-forward, no funnel; the DOL
citation backs a claim without sending the user into an institution.

### Cross-tool bridge

This is the one finding that withholds an unqualified sign-off.

The built tool has no cross-tool signpost of any kind. The DOM ends at the pre-tax/post-tax
`<details>` block. There is no related-tools footer, no link to the Myth Quiz, no signpost
to anything else in the suite.

The design review for this exact tool (`tip-1-design-review-2026-06-17.md`, line 87)
explicitly called for one: "a warm related-tools footer link to the Myth Quiz fits
naturally; the tipping-wage fact is myth-quiz-adjacent content... Keep the footer a
handoff, not an ad." The research doc reinforces this — it earmarks the tipping-wage,
racial-bias, and tips-do-not-reward-service material specifically for future myth-quiz
questions (research Section 5, Section 6, and the "out of scope / saved for myth quiz"
list). The bridge from "I just learned the tip is the wage" to "what else do I believe
about how this system works that might be wrong?" is the most natural handoff in the suite.

Why this matters for Dani specifically: TIP-1 is a low-stakes, shareable, low-shame tool —
it is one of the most likely *entry points* to Finxiety for a user who would never start at
an eligibility screener. A Dani who arrives here, learns the wage fact, and then closes the
tab has touched exactly one tool. The persona is explicit (condition #7): "There's somewhere
to go next. A result with no path forward is just a mirror." The framework's Dimension 4 is
explicit too: "The tool does not end at the problem... even if only 'here's where this
connects to other tools.'" TIP-1 currently ends at the information.

This is not a Do No Harm violation and it is not a shame risk — which is why it is a flag,
not a fail. But it is a missed obligation that the design review already specified, and it
is the difference between TIP-1 being a single useful calculator and TIP-1 being a door into
the suite for the user least likely to walk through any other door.

Solution space (informational, the PM decides): a single quiet related-tools line at the
foot of the form — e.g., a link to MYTH-1 framed as "Curious what else about money myths is
true? Take the myth quiz" or similar — handoff, not ad, styled like the source link, not the
result. Note MYTH-1 status before wiring a live link; if MYTH-1 is not yet live, this finding
can be accepted-with-rationale and scheduled to land with MYTH-1 rather than blocking TIP-1.

Finding: FLAG (High). No cross-tool bridge present; the design review specified one and the
suite's natural handoff (TIP-1 -> MYTH-1) is absent. Character: absent (should be informational).

### Enabling environment

- Changed capability: YES, meaningfully. After this tool, Dani understands that in most
  states the tip is the wage, not a bonus, and that the floor has been frozen since 1991.
  That is a revised mental model, not a retained number — it will change how she reads the
  next POS screen. This is a stronger after-the-tab outcome than a pure calculator usually
  earns.
- After-the-tab question: in 24 hours, the dollar figure is gone (correctly — it was
  situational), but the structural fact has a real chance of persisting because it is
  surprising and reframes a routine act she performs often. The repeated real-world trigger
  (every future check) is what gives it staying power.
- Active vs. passive: mostly passive reception of the wage fact. The active element is
  choosing her state, which personalizes the note — mild engagement, not deep. Acceptable
  for a calculator; the myth-quiz handoff (see bridge finding) is what would convert the
  passive fact into active belief-revision.
- Illusion of understanding risk: LOW. The fact is concrete and singular ("the tip is the
  wage; $2.13 since 1991"), not a vague feeling of clarity. There is little room for "I get
  it now" without substance.

Finding: PASS. Genuinely changes a mental model; low illusion-of-understanding risk. The
one upgrade available (active belief-revision) is exactly the missing myth-quiz bridge.

### What the tool does well for this user

- The low-tip result is handled exactly right: a fact, never a verdict, with zero
  tip-reactive logic anywhere in the code. This is the hardest thing to get right and it is
  right.
- The wage note places the agent of harm on the law and the employer, never the diner —
  the difference between information and guilt, and it lands on the information side.
- 18% low-anchor default plus equal-weight presets plus a frictionless, unstigmatized
  "Other" path is a textbook anti-anchoring design.
- It teaches something genuinely new and structural — rare for a calculator — without a
  single "you should."
- Stateless, no PII, person-voiced, no funnel: a clean, low-shame entry point to the suite.

### Verdict

PASS WITH NOTES.

No Critical findings. No Do No Harm violations. No shame triggers. The low-tip result, the
wage note, the anchoring design, trust, and locus of control all pass cleanly.

One High flag withholds full sign-off: the cross-tool bridge is absent. The design review
specified a Myth Quiz handoff and the suite's most natural door (TIP-1 -> MYTH-1) is not
built. For the user most likely to enter the suite *through* this tool, ending at the
information rather than pointing onward is a real, framework-named gap (persona condition #7;
framework Dimension 4).

Resolution path: add a quiet related-tools handoff to MYTH-1 at the foot of the form
(handoff, not ad). If MYTH-1 is not yet live, this High flag may be accepted-with-rationale
by the PM and scheduled to land with MYTH-1; it does not need to block TIP-1's release on its
own merits, since TIP-1 in isolation does no harm. That is the PM's call, not mine.

Sign-off is withheld pending the bridge decision (build it, or accept-with-rationale).

⟦BEHAVIORAL-REVIEWED — WITHHELD⟧ ticket="TIP-1" date="2026-06-17"
reason="High finding open: no cross-tool bridge (TIP-1 -> MYTH-1). Resolve by building the
handoff or PM accept-with-rationale pending MYTH-1 go-live."

---

## Disability Accessibility Review (Renee Persona)

Reviewer: disability-accessibility (inline, socket error on background agent)
Reference: `finxiety/docs/disability-accessibility-framework.md`, `finxiety/research-findings/persona-renee-disability-user.md`

Renee: 41, fluctuating RA, mid-SSDI appeal, variable per-shift income, Sacramento. Brain fog on bad days. Imprecise motor control. Phone user. Has been failed by systems that assume stable health and stable capacity.

TIP-1 is not a benefits tool. Renee uses it as a diner, same as anyone. The review asks whether this tool holds up for her on a bad-hands, brain-fog day at a table.

### Dimension 1: Cognitive accessibility

**Interruption survivability.** Single-screen, reactive calculator. If Renee sets her phone down mid-entry and returns, her bill amount and tip selection are still in the fields. Nothing resets. PASS.

**Cross-screen working memory.** No multi-step flow. All inputs and the result are on one screen. The pre-tax/post-tax toggle changes a label and a note but produces no new screen. The one cognitive load risk: the toggle does not change the calculated number in v1, but the label updates to describe what the entered amount represents. On a brain-fog day, a user who flips this toggle and sees no change in the result may be confused. The UX review already flagged this as a conceptual-model risk (open issue 1). This review seconds that flag at Medium severity.

**Sentence length.** Wage note copy is two short sentences. Historical one-liner is one sentence. Pre-tax/post-tax note is one inline sentence plus a collapsed disclosure. Passes the "short even where complex" bar.

**One decision per screen.** The form stacks six fields on one screen, which is more than ideal. However the critical path (bill + tip preset + see result) is two interactions, not six. The secondary controls (party, state, toggle) are clearly subordinate in layout. Acceptable.

**Forgiving errors.** Negative bill: guarded by `Math.max`. Non-numeric bill: coerces to 0. Out-of-range Other tip: clamped 0-100. Stepper: min 1 enforced. No reset of prior inputs on error. PASS.

**Verdict: PASS WITH NOTE** (pre-tax toggle conceptual model, medium, shared with UX finding).

### Dimension 2: Sensory accessibility in lived practice

**Dynamic content announces itself.** Result section has `aria-live="polite"` and `aria-label="Tip result"`. Tip and total update reactively; the live region will announce changes. Stepper value has `aria-live="polite"` and `aria-atomic="true"` so the new party size announces on change. PASS.

**Focus moves sensibly.** The radiogroup uses roving tabindex: one button has `tabindex="0"` at a time, arrow keys move focus within the group, which is the correct ARIA radio pattern. The `<details>` disclosure summary has `focus-visible` styling. PASS.

**Nothing depends on color alone.** Selected segmented button state is communicated by border color AND background change AND `aria-checked="true"`. No status conveyed by color only. PASS.

**Touch and click targets for imprecise input.** Segmented buttons: `min-height: 48px`. Stepper buttons: `min-width: 48px`, `min-height: 48px`. State selector: `min-height: 48px`. `<details>` summary: `min-height: 44px`. All meet or exceed 44px minimum. For Renee's tremor: the stepper's discrete increment/decrement is much safer than a slider would have been (design review made the right call). PASS.

**Verdict: PASS.**

### Dimension 3: Physical and fatigue

**Interaction count for primary result:** bill amount (1 tap + typing) + tip preset (1 tap on 18% default, or 0 taps if default is fine) = result appears. Minimum 1 meaningful interaction after entering the bill. That is the lowest possible for a calculator. PASS.

**Sustained scrolling or typing.** The form is long enough that the pre-tax/post-tax toggle is likely below the fold on a 375px screen. But the primary result (tip + total) is above the fold. Secondary controls are secondary by design. No extended typing required (bill is a number; tip is a button tap). PASS.

**Energy-to-value ratio.** Renee enters one number, taps one button, gets the tip amount and total. If she selects her state, she gets wage context about the system she is transacting in. High value, low cost. PASS.

**Verdict: PASS.**

### Dimension 4: Disclosure safety

TIP-1 does not ask about disability status. The Disclosure Safety Test focuses on the low-tip-entry scenario: Renee enters 5% because that is her budget this month.

The "Other" button opens a plain `<input type="number">` with `placeholder="0"`, `min="0"`, `max="100"`. No label that implies a floor. No "below standard" warning. No color feedback that flags the value as low. PASS.

**Verdict: PASS.**

### Dimension 5: Disability benefit-cliff considerations

TIP-1 does not touch SSI, Medi-Cal, SSDI, IHSS, or ABLE accounts. The only asset or income information it uses is the bill amount the user entered, and it goes nowhere. No benefit-cliff implications.

**Verdict: N/A for this tool.**

### Dimension 6: Double vulnerability (disability x poverty)

The tool handles Renee-as-diner with the same flow as any other user. Her income constraints are not surfaced or implicated by the tool. The wage note lands as systemic information for her too, and because she knows what it means to depend on tips (her own income is shift-variable), she may find it more legible than most. The low-tip path is unstigmatized for her as it is for Dani. Both personas move through the same flow. PASS.

**Verdict: PASS.**

### Disclosure Safety Test (low-tip entry scenario)

Scenario: Renee enters a $45 restaurant bill and types "5" in the Other tip input because that is her budget.

1. **Does answering honestly feel safe?** Yes. The Other input is a plain number field. No label implies a correct range. No placeholder says "standard is 18-20%." Safe.
2. **Is there room for "I can only afford this much"?** Yes. 0-100 is the full valid range. 5% produces a result ($2.25 tip, $47.25 total) without comment or warning.
3. **Does the copy framing suggest a benefit or penalty?** No. The wage note is driven by state selection, not tip size. It reads the same whether Renee tips 5% or 25%. No feedback mechanism exists that varies by tip amount.
4. **If Renee sees her result, does she feel the tool treated her fairly?** Yes. The tool reports her numbers and contextualizes the wage system. It does not comment on her choice. If anything, the wage note may help her understand that tipped workers are depending on tips as primary income, which she already knows from her own variable-income experience. The note is information she can use, not a guilt prompt.

All four questions: PASS.

### Open issues for engineer

1. (Medium) Pre-tax/post-tax toggle conceptual model: the toggle does not recalculate in v1. The inline note mitigates this but does not fully resolve the broken-feedback risk for users with brain fog. Shared with UX open issue 1. Consider a more explicit label: "You entered: [pre-tax subtotal / post-tax total]. Tip percentage applies to this amount."

### Verdict

**PASS** -- no blocking disability accessibility findings. The low-tip-entry scenario is handled without judgment. All interaction targets meet the 44px minimum. The reactive single-screen design is the right call for fluctuating capacity. One medium finding shared with the UX review (toggle conceptual model) is non-blocking for this tool in v1.

⟦DISABILITY-REVIEWED⟧ ticket="TIP-1" date="2026-06-17"

---

## Brand Final Pass

Reviewer: brand (validation gate sign-off, post-build). Verified against the implementation
(`finxiety/src/routes/tools/tip-calculator/+page.svelte`), the homepage card
(`finxiety/src/routes/+page.svelte` lines 31-37), the pre-build review
(`tip-1-design-review-2026-06-17.md`), and the brand source
(`tsunam_vault/finxiety/Finxiety — Brand & Mission.md`). This confirms all six pre-build
open issues were applied. It is not a re-litigation of decisions already settled pre-build.

### Tipped-wage copy

PASS. Lines 277-280 read: "In {stateFull}, the law lets employers pay tipped workers as
little as $2.13/hr, with tips expected to make up the rest. Here, a tip is part of the
wage, not an extra on top of it." This is the exact brand-revised copy from open issue 1,
character-for-character. The advocacy register of the original draft ("Tips aren't a bonus
here, they're most of their wage") is gone. The agent of the harm is the law and the
employer ("the law lets employers pay"), not the diner. No second-person address, no
implied tip amount, no moral stakes. Descriptive, sourced, Non-Advice-compliant. This was
the highest-priority line in the pre-build review and it landed correctly.

### One Fair Wage copy

PASS. Lines 271-273: "In {stateFull}, servers receive the full state minimum wage
regardless of tips. A tip here is additional income, not a wage substitute." This is the
pre-build copy, which I explicitly accepted as passing as written (the suggested polish was
optional, not required). It is factual, low-harm, and states the wage fact without
editorializing in either direction. No flag.

### Voice symmetry

PASS. Read aloud side by side, the two variants are the same voice describing two facts.
Both open with "In {state}," both state the wage structure in plain declaratives, both close
with a "a tip here is / Here, a tip is..." clause that names what the tip is. Neither is
noticeably warmer or cooler than the other; the tool does not read as having an opinion about
which state is "better." Open issue 2 satisfied.

### Historical one-liner

PASS. Line 286: "The $2.13 federal tipped wage has been unchanged since 1991." Factual,
dated, no second-person address, no implied ask. Guarded by `{#if !oneFairWage}` (line 284)
so it appears only in tipped-wage states, which is correct: in a One Fair Wage state the
$2.13 federal floor is not operative context. Styled via `.historical-fact` (lines 593-598)
at 0.8125rem in `var(--muted)` -- visually quieter than the `.signpost-box` note above it,
exactly as the pre-build review asked. It states a number and a date and gets out of the
way. This is the shareable line; it remains screenshot-clean and quotable on its own.

### Pre-tax/post-tax note

PASS. The verbose three-clause draft was split as requested (open issue 3). The inline
`baseNote` (lines 43-47) updates with the toggle: pre-tax shows "Tipping on the pre-tax
subtotal. Most card screens use the post-tax total instead." and post-tax shows the mirror.
Scannable in one glance at 375px, and it tells the truth about the current calculation
state. The worked example moved into a `<details>` disclosure (lines 333-339): "How much
does this change?" reveals "The difference is small. On a $50 bill in an 8% tax area,
post-tax vs. pre-tax is about $0.80 at 20%." "The difference is small" is the fair,
non-directive framing that pre-empts the "am I doing this wrong" spiral without telling
anyone which base to pick. Disclosure correctly contains the example.

### Homepage card

PASS. Lines 33-34 of `+page.svelte`: title "Tip Calculator," description "Split the check
and see the actual math. Plus what your tip means for the person serving you, depending on
the state you're in." This is the recommended card copy verbatim. "Hidden History" is
retired (open issue 5). The meta description (lines 114-117) carries the same line, which
correctly leads distribution with the state-aware context layer rather than the commodity
calculator. Says what the tool does first, names the context plainly, tells no one what to
tip.

### Cross-tool signpost footer

PASS with copy note. Lines 343-345: "More on how financial systems work differently than
most people assume: Benefits Myth-Check Quiz applies the same format to benefits programs."
Linking to `/tools/myth-quiz`, which I confirmed is a fully built 790-line tool, not a
placeholder -- so this is a live, honest handoff, not a link into a void.

Honesty assessment: this reads as a genuine connection, not a non sequitur. The bridge is
not "tipping relates to benefits" (which would be false); it is "the same myth-busting
format applies to another domain where the system works differently than people assume."
That is an accurate description of what MYTH-1 is and a true through-line from what TIP-1
just taught (the tip is the wage; the system is not what most people assume). The phrase
"applies the same format" is the load-bearing honest move -- it bridges on method, not on
subject matter. Non-Advice and Do No Harm compliant: it points to another tool, it does not
tell the user to do anything, it carries no urgency or pressure, and it is styled as a quiet
`var(--muted)` note (lines 649-657), a handoff and not an ad.

One small copy note, non-blocking: the link text "Benefits Myth-Check Quiz" should match
whatever the live MYTH-1 names itself and the homepage card call it, for consistency across
the suite. If MYTH-1's own title or homepage card uses a different string (e.g. "Myth Quiz"
or "Benefits Myth Quiz"), align the three so the user sees one name for one tool. This is a
consistency tidy, not a voice or harm issue, and does not gate sign-off. Logged for the
engineer to verify against the MYTH-1 card.

### Overall voice

In voice throughout. Warm, direct, plain, no preaching. "Split the check and see the actual
math" is the register the brand source calls for. The result block says the number and does
not bury it. The empty state ("Enter a bill amount to see the tip and total.") is plain
instruction, not filler. No banned words ("empower," "journey," "unlock," "personalized
insights," "transformative"), no urgency, scarcity, or fear language, no directive copy
anywhere. The wage notes describe the system without editorializing; nothing reads as
journalistic, academic, or political commentary -- the pre-build advocacy risk was the one
real exposure and it was closed. The DOL citation is a source on a factual claim, not a
referral that sends the user into an institution.

This also resolves the behavioral-science withhold: that review withheld sign-off solely on
the absence of the TIP-1 -> MYTH-1 cross-tool bridge, and that bridge is now built and points
to a live tool. From the brand side the bridge is honest and on-voice.

### Open issues for engineer

1. (Low, non-blocking) Confirm the footer link text "Benefits Myth-Check Quiz" matches the
   live MYTH-1 tool's own title and its homepage card label. Align all three to one name for
   one tool. Consistency tidy only; does not affect this sign-off.

Verdict: PASS. All six pre-build brand issues applied correctly. No voice violations, no Do
No Harm flags, no blocking copy issues. One low-severity naming-consistency note logged.

⟦BRAND-REVIEWED⟧ ticket="TIP-1" date="2026-06-17"

---

## Design-UX Final Pass

Reviewed against my pre-build review (`tip-1-design-review-2026-06-17.md`, Design-UX section) and the as-built component. I did not re-derive QA's WCAG structural pass or behavioral-science's shame/anchoring traces; this is the interaction-design conformance check on the nine open issues plus the anti-pattern and signpost items.

### Open issue resolution

1. **(High) Toggle conceptual model — RESOLVED.** The toggle changes a label and a note, not a number, and the build now makes that honest in two places. The bill label is reactive (`billLabel`, lines 39-41): it reads "Bill amount (pre-tax subtotal)" or "(post-tax total)", so the field itself states what the entered amount *is*. The `baseNote` (lines 43-47) reads differently per mode and describes the amount, not a recalculation ("Tipping on the pre-tax subtotal. Most card screens use the post-tax total instead." vs. "Tipping on the post-tax total. Some people tip on the pre-tax subtotal instead."). A user who flips the toggle sees the label and note change, which is real feedback even though the math is constant. The conceptual-model gap is closed for v1. Renee's brain-fog refinement (an even more explicit "tip applies to this amount" line) remains a non-blocking nicety, not a requirement.

2. **(High) Slider replaced with segmented radiogroup — RESOLVED.** `role="radiogroup"` with five `role="radio"` buttons (four presets + Other), lines 153-178. Roving tabindex (one `tabindex=0`, rest `-1`) and arrow-key navigation with wraparound on both axes via `onTipKeydown` (lines 75-90). All targets `min-height: 48px`, `min-width: 64px` (lines 428-429), equal visual weight, no low-to-high color gradient. No slider anywhere. Exactly the spec.

3. **(High) Live recompute, no Calculate button — RESOLVED.** `result` is `$derived` (lines 27-29); the form's only submit handler is `preventDefault` (line 132). No Calculate button. Result renders the moment `hasBill` is true.

4. **(Med) State-note placeholder slot — RESOLVED.** `.wage-slot` has `min-height: 5.5rem` reserved from first paint (lines 570-571), with a neutral prompt before selection (lines 264-267): "Select your state to see wage context for the person serving you." The reserved min-height prevents the layout jump on selection. Minor wording note below.

5. **(Med) Pre-tax/post-tax disclosure — RESOLVED.** Inline `baseNote` label (line 331) plus `<details>`/`<summary>` "How much does this change?" holding the $0.80 worked example (lines 333-339). Summary is a 44px target with its own focus-visible rule (lines 626-640). Keyboard-operable native disclosure. Matches the brand split.

6. **(Med) Stepper constraints — RESOLVED.** Min 1 (decrease disabled + `if (partySize > 1)` guard, lines 103-105, 230), max 50 (`MAX_PARTY`, guarded both ways, lines 107-109, 243). SR labels "Decrease/Increase party size" (lines 231, 245). Value announced via `aria-live="polite" aria-atomic="true"` with an SR-only person/people noun (lines 235-238). Both buttons 48px. Complete.

7. **(Med) 18% default, no endorsement styling — RESOLVED.** `presetPercent = 18` (line 13). All five buttons share one class with identical border/weight; selected is the only highlight. No "recommended"/"popular" marker, no ascending emphasis.

8. **(Low) Above-fold target at 375px — RESOLVED (from layout structure).** DOM order is bill -> tip control -> result -> party -> state -> wage slot -> toggle. Bill, tip presets, and the result block are the first three blocks and fit the first viewport at 375px; the result is reachable without scrolling once a bill is entered. The full wage note sits below the fold by design ("deepen," not "complete"), which the pre-build review explicitly accepted. No type was shrunk below the readability bar to force it up. Conforms.

9. **(Low) State field from shared input model — RESOLVED.** `selectedState: string` is typed to match `Track1Inputs.state` (string, confirmed `types.ts` line 3), and the component imports `STATE_OPTIONS`, `stateName`, `isOneFairWage` from `$lib/data/states` rather than redefining any state list or the field shape. The shared-model contract is honored.

All nine issues resolved.

### Anti-pattern check

- No low-to-high color gradient on presets — PASS. Single `.btn-toggle` class, equal weight, terracotta selected state only; no per-value coloring.
- No "recommended"/"most popular"/ascending emphasis — PASS.
- No social-norms or guilt copy — PASS. No "most diners tip X," no generosity framing; the wage note is state-driven, not tip-reactive.
- 0% reachable without stigma — PASS. "Other" opens a plain `0-100` numeric input, `placeholder="0"`, neutral SR label "Custom tip percentage"; no Skip/No-tip/below-recommended treatment.
- No worker-watching / performance framing, no urgency, no celebratory animation on higher tips — PASS. Result updates are identical regardless of amount.
- State note neutral, never accusatory — PASS. Renders in the calm `--cream` / `--olive` `role="note"` box, never an alert color; agent of harm is the law and employer.

### Cross-tool signpost placement

The footer is built (lines 343-345), which the pre-build design review called for and the behavioral-science reviewer flagged as the one open High item. It sits at the very bottom, outside the `<form>`, after the toggle and its disclosure, so it never competes with the primary inputs or the result. Visual treatment is `--surface` background, `--muted` text, `role="note"` (lines 649-657): quieter than the result, styled as a handoff, not an ad, with no button chrome or urgency. The link target `/tools/myth-quiz` is live (route confirmed present) and its label "Benefits Myth-Check Quiz" matches the destination page's own h1 exactly, so there is no recognition mismatch on arrival. Placement and treatment are appropriate. This resolves the behavioral-science High flag at the build level (the bridge is built, not deferred).

### New findings (if any)

Two non-blocking observations, neither in the pre-build scope:

- **Wage-prompt wording drift (cosmetic, non-blocking).** The pre-build review specced the prompt as "...what your tip actually *means* for the person serving you"; the build uses "...wage *context* for the person serving you" (lines 265-266). "Wage context" is slightly more clinical and slightly less of a recognition hook than the specced line, but it is accurate, neutral, and Do-No-Harm clean. Brand's call if it wants the warmer phrasing; not a UX blocker.
- **Reserved slot height vs. tallest content (cosmetic, non-blocking).** `.wage-slot` reserves `5.5rem`. The tipped-wage state renders note box + historical one-liner + source link, which exceeds 5.5rem and grows the slot downward on selection. This does not push any content *above* it (the slot is the last form element; only the footer sits below), so the no-layout-shift intent — protecting the result and inputs above the slot — holds. The growth is downward and below the fold. Acceptable; flagged only so it is not mistaken for a regression.

QA's segmented-button focus-visible flag (their non-blocking #2) is resolved: the buttons carry the `.btn` class and the global `.btn:focus-visible` rule (app.css:212) gives them a 3px terracotta outline. Confirmed, not a gap.

### Verdict

PASS

All nine pre-build open issues are resolved in the build. Every anti-pattern check passes. The cross-tool signpost the design review specified is built and appropriately quiet, which also closes the one High item the behavioral-science review withheld sign-off on. The two new findings are cosmetic copy/spacing notes for an optional polish pass and do not block release.

⟦UX-REVIEWED⟧ ticket="TIP-1" date="2026-06-17"
