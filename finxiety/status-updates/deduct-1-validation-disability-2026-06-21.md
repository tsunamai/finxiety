# DEDUCT-1 (Tax Clarity) — Disability Accessibility Review

**Ticket:** DEDUCT-1
**Tool:** Tax Clarity — deduction / credit / refund clarifier
**Date:** 2026-06-21
**Reviewer:** Disability & Chronic Illness accessibility lens
**Persona applied:** Renee (`finxiety/research-findings/persona-renee-disability-user.md`), held together with Dani (`persona-alice-primary-user.md`)
**Gate status before this review:** Brand passed, QA passed
**File reviewed:** `finxiety/src/routes/tools/tax-clarity/+page.svelte`, `finxiety/src/lib/calculators/deduct.ts`

---

## Disability Accessibility Review: Tax Clarity

### Cognitive Accessibility Beyond Compliance

- **Interruption survivability:** Strong. Each mode is a single short form (one to three inputs) reachable from the picker in one tap. If Renee sets the phone down mid-flare and comes back, nothing has timed out, nothing is lost, and the picker re-orients her in one glance. `goBack()` deliberately preserves typed inputs (line 124–133) so re-entry doesn't wipe work — this is exactly right for a fluctuating-capacity user.
- **Working memory burden:** Low and self-contained. Each mode's result is computed and displayed on the same screen as its inputs; there is no "remember this number, carry it to the next screen" dependency. The three modes are independent, not sequential — Renee never has to hold state from one mode to use another. This satisfies persona requirement: "Nothing should require the user to remember something from one screen to use on another."
- **Plain-language-under-stress:** The mode descriptions ("Something that lowers the income you're taxed on," "Money that came back to you after you filed") are genuinely readable on a fog day. The result copy explains the *why* ("A deduction comes off your income, so it saves you your bracket's share of it"), which is concept-teaching, not just number-dumping. Good.
- **Finding: pass.**

### Sensory Accessibility in Lived Practice

- **Dynamic content announcement:** Result blocks carry `aria-live="polite"` (lines 259, 329, 395). When a user submits and the result renders, a screen reader will announce it. Confirmed for all three modes.
- **Focus management — FLAG.** The whole step region is wrapped in `{#key step}` (line 170), which tears down and rebuilds the DOM on every step change. After `chooseMode()` moves to step 2, focus is not explicitly moved to the new step's heading (`<h2 class="picker-heading">`). On a keyboard or screen reader, the user activates a mode card and focus is dropped — likely reset to document top or lost — with no announcement that a new form has appeared. For a screen-reader user this is the single most disorienting moment in the flow. Same concern on `goBack()` and `startOver()`: focus is not returned to the picker heading.
- **Color-only signals:** No status is conveyed by color alone. The required-field asterisk is `aria-hidden` but every required field also has visible label text and the error path names which field is missing. Result figures use the terracotta accent for emphasis but the meaning is carried entirely in text. Pass on this sub-point.
- **Finding: flag** (focus management on step transitions). This is a lived-experience screen-reader gap that an automated WCAG scan can pass without catching, which is exactly the class of issue this lens exists to surface.

### Physical & Fatigue Considerations

- **Touch target sizing:** Mode cards are `min-height: 48px` (line 511), select and primary button likewise (`min-height: 48px`, line 590). Meets the 44px floor with margin. Spacing between cards is `--space-sm`. Adequate for imprecise tapping on a swollen-hands day.
- **Interaction count:** Minimal. Worst case (deduction mode) is: tap a card, fill three inputs, tap submit — and one of the three (filing status) defaults to "single," so it can be left untouched. Credit and refund modes are one input plus submit. This is close to the floor for what the tool computes. Energy cost is low.
- **Energy-to-value ratio:** Favorable. A user spends a handful of taps and gets a concept clarified that is genuinely worth real money to understand. Nothing here costs more capacity than it returns.
- **Finding: pass.**

### Disability-Specific Shame & Disclosure Anxiety

This is the section the ticket flagged as highest-risk (the taxable-income field). I ran the Disclosure Safety Test on every input that touches income, work, or program enrollment.

**Inputs that touch the disclosure surface:**
1. *Estimated taxable income* (deduction mode)
2. *Filing status*
3. *Deduction amount / credit amount / refund amount*

**Disclosure Safety Test — "Estimated taxable income":**
1. *Does answering honestly feel safe, or like a test?* Safe. The hint explicitly says "A rough number is fine... We only use it to find your bracket." It asks for a number, not a source. It never asks where the income came from — wages, SSDI, gig shifts, a mix — so Renee is never put in the position of disclosing that some of it is disability income, or that it varies month to month. The field asks for an annual taxable figure off last year's return, which sidesteps the "what's your stable monthly income" trap that the persona explicitly warns about for BEN-1.
2. *Room for "it varies" / "not sure"?* Partial. The copy says a rough number is fine, which softens the precision demand. But the field is a single number with no acknowledgment that for someone with shift-variable income, "taxable income" is itself a moving and stressful figure. This is a soft edge, not a failure — the tool never claims the number must be exact.
3. *Does framing suggest a benefit or penalty attached to the answer?* No. The result is the same explanatory concept regardless of the number entered. There is no "you qualify / you don't" verdict riding on it.
4. *Honest answer, least favorable result — still treated fairly?* Yes. The least favorable case is a low income landing in the 10% bracket, which yields a smaller deduction-savings figure. The copy frames this as math, not as a grade, and the credit-vs-deduction comparison still delivers the insight. No verdict.

**Result:** The income field does **not** pressure disability disclosure. It asks "how much" and never "from where." This is the correct design and is the most important thing the tool got right for this user.

**Filing status:** Neutral. Standard IRS categories, defaults to single, no disability inference.

- **Finding: pass** on disclosure safety. No question in this flow reads as a test with a right/wrong answer, and no input forces or infers disability status.

### Benefit-Cliff Fear Specific to Disability

- **Asset-limit / income-tested program touch:** The tool's scope is federal income-tax concepts only. It does not touch SSI, Medi-Cal, IHSS, or any asset-tested program, so the asset-limit and ABLE-account considerations are **out of scope by design** and their absence is not a finding. Surfacing ABLE here would be off-topic.
- **However — refund mode has a disability-specific blind spot worth flagging (MEDIUM).** The refund mode reframes a refund as "money that was already yours... overwithheld" and illustrates what it could have earned in a savings account if set aside monthly instead. That framing is sound for a W-2 wage earner. But for a large share of this tool's intended users, a tax refund is not overwithholding at all — it is a *refundable credit* (EITC, Additional Child Tax Credit) that arrives as a lump sum and was never withheld from a paycheck. The current copy ("money that was already yours... withheld from your pay during the year") quietly assumes the refund came from withholding. For Renee or Dani, telling them their EITC refund was "really" their own overwithheld money, and gently implying they'd be better off adjusting withholding to receive it sooner, is inaccurate and could nudge a harmful action (you cannot un-withhold an EITC). The neutral-box on lines 415–421 ("Neither is wrong") softens the nudge well, but the underlying premise still misframes the most common refund this population receives. See finding #2.

- **Finding: flag** — not for a missing disability benefit cliff, but for a refund framing that misdescribes the refundable-credit refund this population most often receives.

### Double Vulnerability

- **Compounding-load check (reviewed as one person who is both ALICE and disabled):** The flow holds up. Picker-first architecture means a low-bandwidth, low-spoon user makes exactly one decision to start, gets a self-contained single-screen answer, and is never asked to disclose health, income source, or work-gap history. The scarcity bandwidth tax and the fog tax both draw on the same budget, and this tool keeps that budget small: one decision, one to three inputs, one screen. The one place the compound load spikes is the lost-focus moment on step transition (Sensory finding) — for a screen-reader user who is also fatigued, being dropped to the top of the page with no announcement is more costly than it would be for either condition alone.
- **Finding: pass with the focus caveat carried from the Sensory section.**

---

## Critical Findings

### 1. Focus is not managed on step transitions — HIGH
**What it is:** `{#key step}` (line 170) rebuilds the step region on every transition. `chooseMode()`, `goBack()`, and `startOver()` change `step`/`mode` but never move focus to the new region's heading. A keyboard or screen-reader user who picks a mode has focus dropped with no announcement that a new form appeared.
**Why it matters for this user:** Renee on a flare day, navigating by screen reader or keyboard because fine motor control is unreliable, activates "A tax deduction" and lands nowhere — no spoken cue that the form arrived, no obvious place to resume. This is the highest-cost moment in the flow precisely because the disability and fatigue loads compound here. An automated WCAG pass does not catch it because every element is individually labeled; the break is in the *transition*, which is what this lens is for.
**Solution space:** After each step change, move focus to the new step's `<h2>` (give it `tabindex="-1"` and `.focus()` in an effect that runs on step change), or render an `aria-live` region announcing the new step. Returning focus to the picker heading on `goBack`/`startOver` closes the same gap in reverse.

### 2. Refund mode misframes the refundable-credit refund — MEDIUM
**What it is:** Refund mode asserts the refund is "money that was already yours — withheld from your pay during the year" (lines 360–362, 401–403) and illustrates earning interest on it if set aside monthly instead. For EITC/ACTC recipients — a large share of this tool's intended population — the refund was never withheld; it is a refundable credit that cannot be received incrementally through withholding adjustment.
**Why it matters for this user:** Renee's variable, often-low annual income makes her a likely EITC recipient. Telling her the refund was "really" overwithheld money, with a built-in nudge toward receiving it sooner, is factually wrong for her case and brushes against the Do No Harm "no implied recommendation" line. The "Neither is wrong" neutral-box mitigates the nudge but not the false premise.
**Solution space:** Add a one-line caveat that some refunds come from refundable credits (like the EITC) rather than overwithholding, and that those can't be adjusted through withholding. This is a copy addition, not a flow change. Flag to PM/brand rather than fixing here.

### 3. Income field doesn't acknowledge income variability — LOW
**What it is:** "Estimated taxable income" asks for a single annual figure. The "a rough number is fine" hint helps, but there's no acknowledgment that this number is itself unstable for shift- or gig-income users.
**Why it matters for this user:** Persona requirement #3 — "Variable income is treated as normal, not as an error to correct." The annual-figure framing partly dodges this (annual is more stable than monthly), so the risk is mild, but the field could read as built for a steady salary.
**Solution space:** Optional softening of the hint; low priority. Not a blocker.

---

## What the Tool Does Well for This User

- **It never asks where income comes from.** The single most important disclosure-safety property: a disabled user with SSDI, gig, or mixed income is never forced to reveal it. The income field asks "how much," never "from what source."
- **No disability question exists at all**, so there is no binary-disability-status trap, no "disabled enough" framing, no determination requirement. The persona's top three trust conditions are met by omission, which here is the right call.
- **Interruption-safe by construction.** Single-screen modes, preserved inputs on back-navigation, no timeouts, no cross-screen memory. Built for a flare day, not just a good day.
- **Results are facts, not grades.** Every result is framed as illustrative math with a verify-at source link, no verdict, no "you should." The refund mode's "Neither is wrong" explicitly refuses to judge a withholding preference.
- **Energy-cheap.** One decision to start, one to three inputs, sensible defaults, 48px targets. Low spoon cost for real conceptual value.
- **Correctly scoped on benefits.** It does not pretend to cover disability-specific tax provisions; it stays in its federal-concepts lane. The `illustrative-note` blocks already disclaim "other income, phaseouts, or state taxes," which is honest about its limits per persona trust condition #7.

---

## Sign-off

One HIGH finding (focus management on step transitions) remains open. Per the gate rule, sign-off is withheld until the HIGH is addressed or accepted with deliberate rationale by the PM. The MEDIUM (refund framing) and LOW (income variability) should be routed to PM/brand but are not, on their own, blocking.

⟦DISABILITY-REVIEW-WITHHELD⟧ tool="tax-clarity" ticket="DEDUCT-1" date="2026-06-21"

Re-review the focus-management fix and this clears to ⟦DISABILITY-REVIEWED⟧.

---

## Re-verification — Focus management on step transitions (HIGH)

**Date:** 2026-06-21
**Trigger:** Fix submitted in response to HIGH finding #1.
**File re-read:** `finxiety/src/routes/tools/tax-clarity/+page.svelte` (full).

### What the fix does, verified line by line

- `import { tick } from 'svelte'` — present, line 2.
- `let stepHeadingEl: HTMLElement | null = $state(null)` — present, line 52.
- `chooseMode(m)` is `async`; sets `mode = m`, `step = 2`, then `await tick(); stepHeadingEl?.focus()` — lines 74–80.
- `goBack()` is `async`; sets `mode = null`, `step = 1`, then `await tick(); stepHeadingEl?.focus()` — lines 140–149.
- `startOver()` is `async`; resets inputs, sets `step = 1`, `mode = null`, then `await tick(); stepHeadingEl?.focus()` — lines 151–165.
- `tabindex="-1"` + `bind:this={stepHeadingEl}` on all four step `<h2 class="picker-heading">`: line 191 (step-1 picker), line 208 (deduction), line 319 (credit), line 385 (refund).

### Binding-correctness analysis (the part that actually had to be right)

The step region is wrapped in `{#key step}` (line 188), which unmounts and rebuilds the subtree on every `step` change. Because the `{#if}/{:else if}` chain renders exactly one branch at a time, only one `<h2 bind:this={stepHeadingEl}>` is mounted at any moment. On a step change, Svelte nulls the binding when the old subtree unmounts and re-points it at the newly mounted heading. `await tick()` waits for that DOM flush to complete before `.focus()` runs, so the binding is guaranteed live and correct at focus time — never stale.

### Per-transition trace

- `chooseMode('deduction' | 'credit' | 'refund')`: step 1→2 → `{#key}` rebuilds → the matching step-2 H2 (208 / 319 / 385) mounts → `tick()` flushes → focus lands on that mode's heading. PASS.
- `goBack()`: step 2→1, mode cleared → rebuild → step-1 picker H2 (191) mounts → focus returns to "Which one do you want to understand?". PASS.
- `startOver()`: step 2→1, mode cleared, inputs reset → rebuild → focus returns to the same picker heading (191). PASS.

All targets carry `tabindex="-1"`, so they are programmatically focusable without entering the tab order. Focus lands on the new step's heading — the correct orientation point for a screen-reader or keyboard user, since the heading text is announced and establishes context for the form that follows. The lost-focus / no-announcement gap described in HIGH finding #1 is closed in both directions (forward via `chooseMode`, backward via `goBack`/`startOver`).

**Double-vulnerability note:** This was the one place the compound disability + fatigue load spiked in the original review. With focus now restored to the heading on every transition, the highest-cost moment in the flow for a fatigued screen-reader user is resolved.

### Non-blocking observation logged for the record (not part of this HIGH)

The three result handlers (`calculateDeduction` / `calculateCredit` / `calculateRefund`, lines 109 / 123 / 137) move focus into the result block, which also carries `aria-live="polite"` (lines 277 / 356 / 422). Moving focus into a live region can produce a double announcement on some screen reader / browser pairings. This is a pre-existing pattern unrelated to the step-transition fix, does not regress anything, and lands at most as minor polish. Routing to PM as an optional future item, not a blocker.

### Disposition

- HIGH #1 (focus management on step transitions): **RESOLVED.**
- MEDIUM #2 (refund framing misdescribes refundable-credit refunds): unchanged, non-blocking, routed to PM/brand.
- LOW #3 (income-variability acknowledgment): unchanged, non-blocking.

No Critical or High findings remain open. Sign-off cleared.

⟦DISABILITY-REVIEWED⟧ tool="tax-clarity" ticket="DEDUCT-1" date="2026-06-21"
