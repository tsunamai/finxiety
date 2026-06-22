# DOC-1 Document Checklist Generator — Disability Accessibility Validation

**Tool:** Document Checklist Generator (`/tools/document-checklist`)
**Ticket:** DOC-1
**Date:** 2026-06-22
**Reviewer:** disability-accessibility agent
**Persona applied:** Disability & Chronic Illness User — Renee (`finxiety/research-findings/persona-renee-disability-user.md`), held simultaneously with ALICE — Dani (`finxiety/research-findings/persona-alice-primary-user.md`)

**Files reviewed:**
- `finxiety/src/routes/tools/document-checklist/+page.svelte`
- `finxiety/src/lib/data/doc-requirements.json`
- `finxiety/src/lib/calculators/doc-checklist.ts`

**Verdict:** ⟦DISABILITY-REVIEWED⟧ — no Critical or High findings. Two Medium and two Low findings logged for the PM. None block distribution.

---

## Summary

This is a strong tool for Renee. It is, structurally, the opposite of the kind of surface that hurts this user: it asks her to disclose nothing about her body, her diagnosis, or her capacity. The only two inputs are program selection and state. There is no income field, no health question, no disability checkbox, no determination required. On a flare day, that is exactly what she needs — and the clipboard/print artifact is a genuine fatigue accommodation that lets her do the cognitive work once and reuse it across multiple low-energy sessions.

The findings below are about places where a benefit document is *named* in a way that brushes against Renee's disclosure reality, and one scope-edge note about Medi-Cal asset limits. None rise to a test-with-a-right-answer. The tool never evaluates her. It hands her a list. That is the right posture.

---

## Dimension-by-dimension

### 1. Cognitive Accessibility Beyond Compliance — PASS

- **Interruption survivability:** Strong. State is held in component `$state` across the session (`+page.svelte:20-27`). If Renee sets the phone down mid-selection, her checkbox and state selections persist until reload. After submit, the result is a flat, scrollable artifact — nothing to re-enter, nothing timed. The clipboard/print output means even a full reload is recoverable: she keeps the artifact, not the form state.
- **Working memory burden:** Minimal. There is no cross-screen dependency. Everything is on one page; the result renders below the form (`+page.svelte:193`), so she never has to carry a number or choice from one screen to the next. This directly answers the persona's "fog erodes working memory unpredictably" requirement.
- **One decision per screen:** Reasonably met. The two decisions (programs, state) are simple and co-located, not stacked complex judgments.
- **Sentence length under stress:** Mostly good. Plain, short copy throughout. The one exception is the `income.benefit_income` description (`doc-requirements.json:78`, repeated at `:162` and `:223`), which is a long compound sentence — see Finding 3 (Low).
- **Errors forgiving:** No punitive states. The submit button is disabled until valid (`+page.svelte:187`) with a plain status hint (`:188-190`). No reset-on-error path exists. Good.

**Finding: PASS.** This flow is completable on a bad-symptom day.

### 2. Sensory Accessibility in Lived Practice — PASS

- **Dynamic content announcement:** Handled deliberately. A persistent polite live region announces "Your document checklist is ready below." when `submitted` flips (`+page.svelte:137-142`), and the copy-status uses `role="status"` `aria-live="polite"` (`:318`). The result heading is programmatically focused after `tick()` (`:73`, `:203`), so a screen-reader user is moved to the result, not stranded at the top.
- **Focus management:** Sensible. Focus lands on the `<h2>` result heading with `tabindex="-1"` and a visible focus ring (`:351-355`). This is correct behavior after an in-place content swap.
- **Color-only signals:** Clean. The status pills carry their meaning in text, not color alone, and the visually-hidden span prepends the label for screen readers (`+page.svelte:245-246`). Print styles convert pills to bordered black-on-white text (`:733-738`), so meaning survives a grayscale print — relevant for a low-ink/grayscale household.
- **Imprecise input tolerance:** Program rows are full-width labels with `min-height: 44px` and the whole row is clickable (`+page.svelte:378-384`), which tolerates tremor and imprecise taps well. See Finding 4 (Low) on the checkbox glyph size.

**Finding: PASS.** Holds up in lived screen-reader and keyboard practice, not just the automated scan.

### 3. Physical & Fatigue Considerations — PASS

- **Touch target sizing:** Program labels are 44px min-height full-row targets (`:378-384`); the state select is 48px (`:411`); source links are 44px (`:627`). Meets the bar.
- **Interaction count:** Minimal and well-chosen. Worst realistic case: 5 checkbox taps + 1 select + 1 submit = 7 interactions to a full cross-program list. The de-duplication in `buildChecklist` (`doc-checklist.ts:124`) is doing real work *on her behalf* — it collapses the same SSN/ID/address document across five programs into one line, which is precisely the energy-saving the persona's spoon budget needs. This is the single best thing the tool does for Renee.
- **Energy-to-value ratio:** Excellent. Seven taps returns a de-duplicated, categorized, reusable artifact. The result is worth more than the energy spent — the inverse of the framework's failure mode.
- **No time limits:** Confirmed. Nothing timed anywhere.

**Finding: PASS.**

### 4. Disability-Specific Shame & Disclosure Anxiety — PASS (with one Medium note)

The tool asks Renee nothing about herself. No disability question, no binary, no capacity question, no "are you disabled enough" framing. That clears the entire Dimension-4 checklist at the input layer.

The disclosure surface is not in the input — it's in the **output**, in one document line. The `income.benefit_income` item appears in CalFresh, Medi-Cal, and LIHEAP with:
- name: "Benefit award letters"
- description naming "a disability or unemployment notice" (`doc-requirements.json:78`)
- condition note: "if anyone in your household receives disability, unemployment, child support, or other benefits" (`:81`)

This is a `conditional` item — rendered as the "If it applies" pill with the prefix "Bring this if anyone in your household receives disability..." (`+page.svelte:266-268`). Run through the **Disclosure Safety Test**:

1. *Does answering honestly feel safe, or like a test?* It is not a question she answers — it's a document she either has or doesn't. There is no input, so there is no test. **Safe.**
2. *Room for "it varies"?* Not applicable — she is not being asked to self-classify. The "If it applies" pill is itself the room for "this may not apply to me." **Adequate.**
3. *Does framing suggest a benefit/penalty attached?* No. The pill explicitly says conditional ("If it applies"). It reads as "if you happen to have this, bring it," not "you must prove disability." **Clean.**
4. *Least-favorable result still feels fair?* There is no unfavorable result — it's a packing list, not an eligibility verdict. **Fair.**

The Disclosure Safety Test passes. The one residual concern, logged as Medium below (Finding 1), is subtler than the formal test: the word "disability" appears in a benefits-document context that, for a user mid-SSDI-appeal, is loaded. She *has* an SSDI denial letter and an appeal in progress. "Bring this if anyone in your household receives disability... payments" can read, on a bad day, as "and if you've been denied, you have nothing to bring" — a small, unintended echo of the denial. It is not a Disclosure Safety failure, but it is worth softening.

**Finding: PASS.** No question evaluates her. Finding 1 (Medium) is a copy-tone refinement, not a gate.

### 5. Benefit-Cliff Fear Specific to Disability — PASS (with one Medium note)

This is a document-checklist tool, not an eligibility or income tool. It models no income, computes no benefit amount, and implies no "earning more is good" message. So the classic disability benefit-cliff failure mode (a number that, if acted on, costs healthcare) is structurally absent. Good.

However: the tool's scope explicitly includes **Medi-Cal**, which for a meaningful share of pathways is asset-tested, and the tool's whole premise is helping someone apply to *multiple* programs at once. Renee is exactly the user who holds $1,800 in a Roth IRA and has been told conflicting things about whether it disqualifies her. She has never heard of an ABLE account. The framework's Dimension-5 checklist says: *if a tool's scope touches an asset-tested program, the existence of an asset limit is not silently ignored, and ABLE is surfaced where genuinely relevant.*

Right now the tool is silent on this. That silence is defensible — a document checklist is not the place to teach asset limits, and over-stuffing the result would tax the spoon budget the tool otherwise protects. But "defensible silence" is a PM call, not an automatic pass. Logged as Finding 2 (Medium): consider a single, low-weight signpost (not a calculation, not advice) for the case where Medi-Cal is among the selected programs. This is a candidate for a cross-tool bridge rather than inline copy.

**Finding: PASS, with Finding 2 (Medium) flagged for PM decision.** No cliff is modeled, so nothing here is harmful as-is; the question is whether a known, unmet user need (ABLE awareness) should get a signpost given Medi-Cal is in scope.

### 6. Double Vulnerability (Disability × Poverty) — PASS

Reviewed as one screen for a user who is both Renee and Dani at once, not two passes.

- **One flow, not a disability branch:** Confirmed. There is no "disability version." Renee and Dani walk the identical path. Correct per the Dimension-6 checklist.
- **Compounding load:** The compounded scarcity-tax-plus-fog budget holds because the tool deliberately keeps the input to two simple choices and offloads the hardest cognitive work (de-duplication across five programs) onto the calculator. A both-at-once user is not asked to mentally cross-reference which program needs which document — the tool does it. This is the design decision that makes the screen survivable under double load.
- **Same screen, both personas:** The artifact (clipboard/print) serves Dani's "I have ten minutes between shifts" window and Renee's "I'll do the cognitive work once and reuse it across flare days" need with the *same* feature. One accommodation, both vulnerabilities.

**Finding: PASS.**

---

## Findings Log

### Finding 1 — "disability" in the benefit-letter line can echo the denial, for a mid-appeal user
**Severity: Medium**
**Location:** `finxiety/src/lib/data/doc-requirements.json:78, :81` (and the duplicated copies at `:162, :165` and `:223, :226`)
**Lens:** Dimension 4 (Disclosure Anxiety)

The `income.benefit_income` item names "a disability or unemployment notice" in its description and "if anyone in your household receives disability... benefits" in its condition note. For Renee — mid-SSDI-appeal, holding a denial letter — the phrasing "if you *receive* disability payments" can read as a quiet line she falls on the wrong side of (denied = receives nothing = nothing to bring), gently reproducing the denial's "we determined you are not disabled" sting. It is not a Disclosure Safety Test failure (she is not being asked to self-classify, and it's a conditional "if it applies" line), but the word choice is loaded for this population in a way the rest of the copy is careful to avoid.

**Prescribed fix (PM/brand call):** Reframe around the *document*, not the *status*. Lead with the artifact rather than the receipt of benefits. For example, condition note: *"if you have an award or denial letter from any benefit program — disability, unemployment, or child support — bring it; the letter itself is what helps."* Naming "or denial letter" explicitly normalizes the mid-appeal state and matches persona requirement #4 ("It names the institutional reality without being asked"). Brand and behavioral-science should weigh in; this is a tone refinement, not a structural change. Note the copy is triplicated across three programs — fix all three occurrences identically (do not let them drift).

### Finding 2 — Medi-Cal is in scope but asset limit / ABLE is never surfaced
**Severity: Medium**
**Location:** Tool scope; `doc-requirements.json:85-168` (Medi-Cal program), no corresponding signpost in `+page.svelte`
**Lens:** Dimension 5 (Benefit-Cliff Fear)

The tool's scope includes Medi-Cal (asset-tested in several pathways) and its premise is multi-program application. The framework asks that asset limits not be *silently* ignored where an asset-tested program is in scope, and that ABLE be surfaced where genuinely relevant. Renee is the canonical user with modest savings (a Roth IRA) who has never heard of ABLE and has been given conflicting information about disqualification. This is one of few places she might encounter the option.

The current silence is defensible (a packing list is not an asset-limit tutorial, and inline asset copy risks taxing the spoon budget). But it is a deliberate PM decision, not an automatic pass.

**Prescribed fix (PM decision required):** Do *not* add a calculation or any "you may/may not qualify" language (Do No Harm: no recommendations). If anything is added, it should be a single low-weight signpost, shown only when Medi-Cal is among the selected programs, in the existing `signpost-box` pattern — e.g. a one-line "Good to know: some programs like Medi-Cal can have savings/asset limits; an ABLE account is a savings option designed not to count against them," linking out to the official ABLE/CalABLE resource. Strongly consider routing this through a future cross-tool bridge (a dedicated asset-limit/ABLE explainer) rather than inline, to protect this tool's cognitive minimalism. Defer to PM on whether DOC-1 is the right surface at all.

### Finding 3 — `income.benefit_income` description is a long compound sentence
**Severity: Low**
**Location:** `doc-requirements.json:78` (and duplicates `:162, :223`)
**Lens:** Dimension 1 (sentence length under stress)

"Any letter or statement that shows benefits someone in your household gets and how much — for example, a disability or unemployment notice, or a record of child support payments. Whatever you have that shows the amount works." This is the longest, most clause-heavy description in the dataset. On a fog day it requires more parsing than the surrounding items.

**Prescribed fix:** Split into two short sentences and lead with the action. e.g. *"A letter showing a benefit someone in your household gets, and the amount. A disability, unemployment, or child-support notice all work — bring whatever shows the amount."* Coordinate with Finding 1; both touch the same three triplicated strings, so fix them in one pass.

### Finding 4 — Checkbox glyph is 18px inside a 44px row
**Severity: Low**
**Location:** `+page.svelte:386-392`
**Lens:** Dimension 2 / 3 (imprecise input)

The clickable target is the full 44px row (correct), but the visible checkbox is `1.125rem` (~18px). The hit area is fine; this is purely about *legibility* for a low-vision user confirming a tap registered, and about visible affordance for someone with tremor checking their selections. Minor.

**Prescribed fix:** Optional. Bump the checkbox visual to ~22-24px, or add a clearer checked-state visual on the row (e.g. background tint on the selected label). Defer to design-ux; not a blocker.

---

## What the tool does well for this user (honest accounting)

- **It asks Renee nothing about her body.** Two inputs, neither of which touches health, capacity, or disability status. The single biggest disclosure-safety win available to a tool, achieved by scope.
- **De-duplication is the accommodation.** `buildChecklist` collapsing one document across five programs is the spoon-budget feature. The tool does the cross-referencing so the fog-affected user doesn't have to.
- **The artifact is reusable across energy levels.** Clipboard and print let her do the cognitive work once, on a good hour, and carry it into a flare. The print header (`+page.svelte:194-199`) stamps program names, date, and source URL so the artifact stands alone without reopening the tool — exactly the "resuming should not cost re-reading from the start" persona requirement, solved at the output layer.
- **Conditional documents are framed as "If it applies," not as requirements to prove.** The status taxonomy reduces fog load rather than adding to it: a glance at the pill tells her whether a line is even hers to worry about.
- **Honest about its own limits.** "This is a guide, not the official list" (`:206-209`) and the per-program official links match persona requirement #7 (honest when something is genuinely complicated) without performing sympathy.

---

## Seal

⟦DISABILITY-REVIEWED⟧ tool="document-checklist" ticket="DOC-1" date="2026-06-22"

No Critical or High findings. Two Medium findings (1, 2) are copy-tone and scope-signpost refinements that require PM/brand decisions but do not block distribution; the tool as built does no harm to this user. Two Low findings (3, 4) are polish. Re-run this gate if the benefit-letter copy (Finding 1/3 strings) or the tool's program scope changes.
