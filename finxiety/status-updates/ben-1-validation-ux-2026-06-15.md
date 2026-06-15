# UX Review: BEN-1 CA Benefits Screener — Form (Step 1) + Results (Step 2)

**Reviewer:** design-ux agent
**Date:** 2026-06-15
**Gate:** Pre-release validation
**Files reviewed:** `finxiety/src/routes/tools/screener/+page.svelte`, `finxiety/src/app.css`
**Verdict:** ⟦UX-BLOCKED⟧ — color-contrast failures and missing focus management block release. Detail below.

---

## Summary

The screener is well-structured and shows real discipline: one memorable output ("You may qualify for N programs"), neutral framing of non-matches, fieldset/legend on the checkbox group, `role="alert"` on the error, official-source language in the results note. It is close. Three blocking issues stand between it and ship, all fixable in a focused pass:

1. **Color contrast** — multiple `--muted` text pairings fall below WCAG 2.1 AA 4.5:1, including the "Above limit" tag and the income-vs-limit lines that carry the actual eligibility reasoning.
2. **Focus management** — `{#key step}` tears down and rebuilds the DOM on step change; keyboard and screen-reader focus is dropped to the top of the document with no announcement.
3. **`aria-live` placement** — the live region wraps content that is created at the same moment the region mounts, so the result is not reliably announced.

---

## Nielsen Checklist

| Heuristic | Verdict | Note |
|---|---|---|
| Visibility of system status | PASS* | Step 2 renders results, but the transition is not announced to AT (see Focus + aria-live findings). Asterisk = passes visually, fails for screen readers. |
| Match between system and real world | PASS | "People in your household," "before taxes," "May qualify," "Above limit." Plain language, not program jargon. |
| User control and freedom | PASS | "Check another household" resets cleanly. No destructive traps. |
| Consistency and standards | PASS | Reuses `.btn`, `.field`, `.error-msg`, token palette. Consistent with EMG-1. |
| Error prevention | PARTIAL | `min/max/step` on inputs is good. But `bind:value={householdSize}` with `$state(1)` typed as number: clearing the field yields an empty/NaN state the `< 1` guard catches at submit — acceptable, but the constraint is reactive-fragile (see Norman: Constraints). |
| Recognition rather than recall | PASS | Paycheck conversion math is shown inline, not recalled. Results restate the program name + reasoning. |
| Flexibility and efficiency | PASS | Optional checkboxes don't gate the core path. Fast for a repeat user. |
| Aesthetic and minimalist design | PASS | No decoration that fails to earn its place. |
| Help users recognize/diagnose/recover from errors | PASS | "Enter your gross monthly income. Use $0 if you have no income right now." Plain English, tells them what to do. |
| Help and documentation | PASS | Inline hints carry the load; no separate docs needed. |

---

## Norman Principles

- **Affordances:** Inputs look fillable, the `$` prefix signals currency, buttons read as tappable. The apply link is styled as a primary button, which correctly signals "this is the action." Good. One soft note: `.btn-ghost` ("Check another household") is text-only with an underline and `min-height: auto`, so on mobile its tap target is the text-line height only — under 44px. See Required Change 4.
- **Feedback:** Submit transitions to results. Visually clear. For AT users the feedback is effectively silent (Required Changes 2 and 3).
- **Constraints:** `min="1" max="20"` on household size and `min="0"` on income are correct HTML constraints. But `novalidate` disables native enforcement, so the real guard is the JS at submit. `householdSize` is bound to a number input initialized to `1`; if the user clears it the bound value becomes `null`/empty and the `!householdSize || householdSize < 1` check correctly recovers. Functionally safe. Consider clamping on blur so the user sees the correction rather than discovering it at submit. Non-blocking.
- **Conceptual model:** The tool says "screener" and behaves like a screener — enter a little, see what's available. Model matches. The results screen reads as a results screen without needing a "Your Results" heading. Good Ive-aligned restraint.

---

## Ive Restraint Test

- **Elements that can be removed:** Step 2 ends with both a `.cross-tool-link` to the Myth Quiz AND, when `likelyCount === 0`, a `.bridge-box` that also links to the Myth Quiz. When zero programs match, the same destination is offered twice within one viewport. Collapse to one. (Non-blocking, but it dilutes the single next step.)
- **Visual hierarchy:** On the results screen the headline (`h2`, 1.375rem, `--dark`) correctly dominates. Program cards are well differentiated: likely cards are white with a terracotta border, unlikely cards recede into `--surface`. This is the right emotional move — what you qualify for is foregrounded, what you don't recedes without a red "X." Keep this.
- **The `→` arrows** in the apply link and cross-tool link are `aria-hidden` — correct, decorative only.

---

## Simon Memory Test

- **The one memorable output:** "You may qualify for N programs." Singular, numeric, emotionally positive, and it survives the 24-hour test — a user will remember "there were a few things I could apply for and one was CalFresh." This is exactly right.
- **The zero-state output** is handled with care: "These programs may not match your situation right now." It describes the situation, not the person, and points to the Myth Quiz as a forward path rather than ending on a dead end. Good.
- **Cognitive load assessment:** LOW for the form. The form is genuinely one cognitive step: two required inputs, two optional checkboxes. The results screen is MEDIUM — see the paycheck-hint evaluation and the program-count scannability note below.

---

## Financial Anxiety Overlay

- **Shame signals:** None of the hard ones. No red X, no "you failed to qualify," no "you've struggled." "Above limit" is borderline — it is neutral-ish, but it frames the user against a ceiling. Acceptable as written because it is paired with the empathetic `near-limit-note` and the neutral results-note. Watch it; if user testing shows it reads as a verdict, soften to "Income limit not met right now."
- **Trust signals:** PRESENT and strong. "These are estimates based on income only. Actual eligibility is determined by the administering agency." Plus "Income limits are based on 2025 federal guidelines. They update annually each October." This is the trust-in-30-seconds bar from `finxiety/CLAUDE.md`, met. One gap: each likely program links out to apply, but the results note doesn't restate that the linked agency is the official source — the link label carries it, which is enough. Non-blocking.
- **Cognitive load:** LOW–MEDIUM. The form respects scarcity bandwidth. The results screen risks creeping up if many programs render (see scannability).

---

## Targeted Findings From the Review Brief

### Mobile-first (375px)

- **Program card header at 375px:** `.program-card-header` is `flex; justify-content: space-between; gap: var(--space-sm); align-items: flex-start`. The tag has `white-space: nowrap; flex-shrink: 0`, and the `h3` is the flex item that absorbs remaining width. So the name wraps and the tag stays pinned top-right on its own line — this is correct behavior, not a bad wrap. The longest realistic program name ("CalFresh (food assistance)" / "School Meals (free & reduced-price)") wraps to 2 lines beside a non-shrinking "MAY QUALIFY" / "ABOVE LIMIT" pill. Acceptable. `align-items: flex-start` keeps the pill aligned to the first line of the heading, which is the right choice. PASS.
- **Checkbox labels:** `.checkbox-label` is `flex; align-items: flex-start; gap`, checkbox has `margin-top: 0.2rem; flex-shrink: 0`. Multi-line label text aligns to the left and the box sits at the top-left, not vertically centered against a 2-line label. Correct. PASS.
- **Paycheck hint at 375px:** `font-size: 0.8125rem; line-height: 1.6`. The hardcoded `<br />` after "Twice a month: multiply by 2." plus the `&middot;` separators produce predictable line breaks. At 375px (with main padding `--space-md` = 1.25rem each side, ~315px content), the middle line "Paid every 2 weeks: multiply by 2.17 · Weekly: multiply by 4.3" will itself wrap, producing a ragged 3–4 line block. Readable, not overflowing — no horizontal scroll. But see the dedicated evaluation below; the contrast on this text is the real problem.
- **Apply buttons (`.program-link`):** `display: inline-block` with `.btn` base (`min-height: 48px`, `padding: 0.875rem 1.5rem`). Because `.btn-primary` sets `width: 100%`, the link is full-width on mobile. Touch target ≥48px tall, full-width — exceeds the 44px minimum. PASS.
- **"Check programs" button:** `.btn .btn-primary`, `min-height: 48px`, full-width. PASS.

### ARIA and keyboard navigation

- **`aria-live="polite"` on the Step 2 `<section>`:** INSUFFICIENT as implemented. The live region and its content are inserted into the DOM in the same render (the section *is* step 2, gated by `{#if step === 2}` inside `{#key step}`). Screen readers reliably announce changes to the *contents* of a live region that already exists in the DOM; a region that is itself newly inserted is announced inconsistently across SR/browser pairs (notably VoiceOver/Safari, the dominant combo for this mobile-first audience). The headline may not be read. BLOCKING — see Required Change 3.
- **`role="list"` on the `<ul>`:** Correct and necessary. `list-style: none` strips list semantics in Safari/VoiceOver; `role="list"` restores them. Good. PASS.
- **`<li>` with `<h3>` program name:** Heading hierarchy is h1 (page) → h2 (results headline) → h3 (program name). No skipped levels. Correct. PASS.
- **Apply links `target="_blank"`:** They have `rel="noopener noreferrer"` (good, security) but no programmatic "opens in new tab" signal. The visible label (e.g., "Apply on BenefitsCal") plus a bare `→` does not tell a screen-reader or low-vision user the link leaves the site in a new tab. Recommended: add an `aria-label` like `"{program.applicationLabel}, opens official site in a new tab"`, or a visually-hidden "(opens in new tab)" span. WCAG-adjacent best practice; given the trust-deficit audience, knowing a new tab is opening matters. Non-blocking but strongly recommended — Required Change 5.
- **Eligibility tag announced with the heading:** The tag `<span>` is a sibling of the `<h3>`, not part of it. A screen reader navigating by heading will read "CalFresh (food assistance)" and will NOT hear "May qualify" / "Above limit" unless the user reads linearly past the heading. The eligibility status — the single most important fact per card — is detached from the program name in the accessibility tree. BLOCKING-adjacent. Fix: include the status in an `aria-label` on the heading or the `<li>`, e.g. `<li aria-label="{program.name}: {statusText}">`, OR add a visually-hidden phrase inside the `h3`. See Required Change 6.
- **Error `role="alert"`:** Correct. Assertive announcement on submit-time validation error. PASS.
- **Fieldset + legend:** Correct grouping for the two related checkboxes; `.checkbox-group-legend` is a real `<legend>`. PASS.
- **`{#key step}` + focus management:** BLOCKING. `{#key step}` destroys the entire block and rebuilds it on step change. Keyboard focus was on the "Check programs" button, which no longer exists after submit — focus falls back to `<body>`/document start. A keyboard user must Tab from the top of the page through the breadcrumb, h1, and description to reach the results. A screen-reader user gets no cue that anything changed (compounding the aria-live issue). On reset, focus is likewise dropped. Fix: after the step flips, move focus to the results headline (give the `h2` or the `<section>` `tabindex="-1"` and `.focus()` it in a tick/`$effect`), and on reset move focus back to the first field. See Required Change 2.

### Color and contrast (WCAG 2.1 AA, 4.5:1 normal text)

Computed against the exact tokens in `app.css`. Relative-luminance + contrast per WCAG formula:

| Pair | Where used | Ratio | AA 4.5:1 |
|---|---|---|---|
| white on `--terracotta` #c1674c | `eligibility-tag--likely`, `.btn-primary` label | ~4.66:1 | PASS |
| `--muted` #7a7268 on `--border` #d9cfc4 | `eligibility-tag--unlikely` ("Above limit") | ~2.9:1 | **FAIL** |
| `--muted` on `--surface` #f0e9dc | unlikely card body, `near-limit-note`, `income-vs-limit` on unlikely cards, `bridge-box`, `results-note` over surface | ~3.5:1 | **FAIL** |
| `--muted` on `--cream` #faf3e8 (page bg) | `paycheck-hint`, `field-hint`, `tool-description`, breadcrumb, `results-note`, `results-footer` | ~3.9:1 | **FAIL** |
| `--muted` on white | `income-vs-limit` inside likely (white) cards | ~4.4:1 | **FAIL (marginal)** |
| `--text` #2d2a26 on `--surface` / white | program-description | >10:1 | PASS |
| `--terracotta` link on `--cream` | breadcrumb hover, in-text links | ~4.1:1 | **FAIL** for text (underlined, but text contrast still applies) |

This is the core blocker. `--muted` is used pervasively for genuinely informative content, not decoration: the "Above limit" tag (the status verdict for a non-matching program), the `income-vs-limit` line (the actual reasoning: "Your income is above the $X limit"), and the trust-critical `results-note`/`results-footer` estimate disclaimers. None of these clear 4.5:1 against any of the three backgrounds they appear on. `finxiety/CLAUDE.md` states "color contrast ≥4.5:1 ... No exceptions." This fails the stated bar. BLOCKING — Required Change 1.

Note: `eligibility-tag--unlikely` is also `text-transform: uppercase` at 0.6875rem (11px) and bold. It is small text by WCAG sizing, so 4.5:1 applies (not the 3:1 large-text allowance). 2.9:1 is a clear fail.

The error red `#c0392b` on `--cream` is ~5.8:1 — PASS.

### Norman/Nielsen heuristics (brief items)

- **Does the tool tell the user what they can/cannot do clearly?** Mostly. The "optional, but helpful" legend is honest about what's required. The results headline states the count plainly. Good.
- **Is the number of programs on step 2 scannable?** The screener checks 7 programs (CalFresh, Medi-Cal, WIC, Lifeline, HEAP, school meals, CalEITC). `visibleResults` filters out `not_applicable` but shows both `likely` and `unlikely`. A user with moderate income could see 6–7 cards, several "Above limit." That is a long scroll on a 375px screen and risks burying the empowering "you qualify for these" cards beneath a stack of "Above limit" cards depending on result order. Recommend: sort likely-first (if not already guaranteed by `checkAllPrograms`), and consider collapsing the unlikely set under a single "Programs above your income limit (N)" disclosure so the matched programs own the first viewport. Non-blocking but materially affects the Simon memory outcome — Required Change 7.
- **Is "Check another household" clearly secondary to the apply actions?** Yes — `.btn-ghost` (text link style) vs. the filled terracotta apply buttons. Correct hierarchy. The only issue is its tap-target height (Required Change 4), not its visual weight.

### Specific concern: always-visible paycheck conversion hint

**Verdict: keep it visible. Do not move it behind a "?" tooltip.** For the ALICE user this is the right call, with one caveat.

Reasoning through the lenses:
- **Scarcity/recall (Simon + the scarcity-mindset foundation):** The single hardest input here is "gross monthly income" — most hourly and gig workers know their paycheck amount and pay cadence, not a monthly total. Hiding the conversion math behind a tooltip forces a recall + discovery step exactly when bandwidth is lowest, and tooltips are notoriously poor on touch (no hover; tap-to-reveal is an undiscoverable affordance). Keeping it inline is correct.
- **Norman:** A "?" disclosure adds a hidden affordance the user must find. Inline text has zero discovery cost.
- **The caveat (cognitive load):** As written it is a dense 3–4 line block at 13px in failing-contrast muted text. The load problem is not that it's visible — it's that it's a wall of small low-contrast text. Fix the contrast (Required Change 1) and consider light formatting (the three cadences as a short stacked list rather than middot-separated inline) so it scans as a quick reference, not a paragraph. With contrast fixed and formatting eased, always-visible is the better design.

---

## Required Changes Before Build

Ordered by severity. Items 1–3 are blocking.

1. **[BLOCKING] Fix `--muted` contrast failures.** Every place `--muted` carries informative text it must reach 4.5:1 against its background. Affected: `eligibility-tag--unlikely` (2.9:1 on `--border`), `income-vs-limit`, `near-limit-note`, `bridge-box`, `results-note`, `results-footer`, `paycheck-hint`, `field-hint`, `tool-description`, breadcrumb. Options: (a) darken `--muted` to ~#5f574d or darker (verify ≥4.5:1 against cream, surface, white, and border before merge), or (b) for the unlikely tag specifically, use a darker text color on a lighter chip. Re-run contrast on all four backgrounds after the change. This is a token-level fix and likely resolves most rows at once. Coordinate with the architect since `--muted` is shared.
2. **[BLOCKING] Add focus management on step change.** `{#key step}` drops focus to document start and gives keyboard/SR users no anchor. After flipping to step 2, move focus to the results headline (add `tabindex="-1"` to the `h2` or `section` and `.focus()` it via `$effect`/tick). On `startOver()`, move focus to the first field. Without this, keyboard users re-traverse the page header to reach results.
3. **[BLOCKING] Make the results announcement reliable.** The newly-inserted `aria-live` section is announced inconsistently (esp. VoiceOver/Safari). Either (a) render the live region as a persistent element that exists in both steps and only its *contents* change, or (b) pair the focus move from Change 2 with the headline being the first thing focus lands on so it is read on focus. Confirm the headline is actually spoken on a real iOS VoiceOver pass before sign-off.
4. **[Recommended] Enlarge the "Check another household" tap target.** `.btn-ghost` has `min-height: auto` and `padding: 0`, so its hit area is one text line (~20px) — under the 44px minimum. Give it vertical padding or a `min-height` for the touch target while keeping its visual text-link styling.
5. **[Recommended] Signal new-tab on apply links.** Add `aria-label="{applicationLabel}, opens the official site in a new tab"` (or a visually-hidden span) to each `program-link`. The trust-deficit audience benefits from knowing they are leaving for an official agency site.
6. **[Recommended] Attach eligibility status to the program name in the a11y tree.** The "May qualify" / "Above limit" span is a detached sibling of the `h3`; heading-navigation skips it. Add `aria-label="{program.name}, {statusText}"` to the `<li>` or fold a visually-hidden status phrase into the `h3` so the status is heard with the program name.
7. **[Recommended] Improve results scannability.** Ensure likely programs render before unlikely; consider collapsing the "Above limit" set under one disclosure so matched programs own the first viewport. Protects the Simon memorable-output ("you qualify for N") from being buried.
8. **[Minor] De-duplicate the Myth Quiz link** in the zero-state (`bridge-box` and `cross-tool-link` both point there in one viewport). Keep one.
9. **[Minor] Ease paycheck-hint formatting** — stack the three pay cadences as a short list rather than a middot-separated run-on, once contrast (Change 1) is fixed.

---

Blocking issues found (contrast, focus management, live-region reliability). Re-review required after fixes; verify on a real iOS VoiceOver/Safari pass.

⟦UX-BLOCKED⟧
