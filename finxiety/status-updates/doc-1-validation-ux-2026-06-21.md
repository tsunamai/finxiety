# UX Validation Gate: Document Checklist Generator (DOC-1)

**Gate:** Post-build UX validation
**Reviewer:** design-ux agent
**Date:** 2026-06-21
**Files reviewed:**
- `finxiety/src/routes/tools/document-checklist/+page.svelte`
- `finxiety/src/lib/data/doc-requirements.json`
- `finxiety/src/lib/calculators/doc-checklist.ts`
- `finxiety/src/app.css`
- Prior gates: `doc-1-design-review-2026-06-17.md`, `doc-1-validation-brand-2026-06-21.md`, `doc-1-disability-2026-06-19.md`

**Scope:** Full post-build UX validation. The pre-build design review (2026-06-17) specified 11 required changes before build. This gate verifies those changes are present in the implementation, then runs the full four-lens review against the live code at phone-first (375px) target.

**WIC note:** The task brief lists WIC as one of the five programs. WIC is not present in `doc-requirements.json` or the template. This is not a defect from a UX standpoint — the data file is internally consistent with four programs (SNAP/CalFresh, Medicaid/Medi-Cal, LIHEAP/HEAP, EITC/CalEITC) — but the discrepancy between brief scope and live implementation is flagged for PM awareness.

---

## Pre-Build Required Changes: Verification

| # | Required change | Verified |
|---|---|---|
| 1 | Collapse three-screen wizard to single input screen + revealed list | PASS — one screen with both controls stacked, checklist appears on submit |
| 2 | Native checkboxes (screener pattern), full row as >=44px target | PASS — `min-height: 44px` on `.program-label`, full-width flex row, `accent-color: var(--terracotta)` |
| 3 | Stacked block per item (status pill, name, description, "needed for" tag) | PASS — `.doc-item-head` flex wrap, `.doc-description`, `.doc-needed-for` stack correctly |
| 4 | CHOOSE ONE as one bounded item with indented "Any one of these works" sub-list | PASS — `.one-of-wrap` cream inset, `.one-of-options` disc list, no status pills on sub-items |
| 5 | Divergence callouts inline, visible, olive signpost, never in expander, never warning color | PASS — `.signpost-box.divergence`, `role="note"`, olive left border, "Good to know:" text marker |
| 6 | Copy/Print as in-flow buttons after last category | PASS — `.result-actions` in flow, no sticky bar |
| 7 | National-baseline banner: neutral olive signpost, do not degrade list visual confidence | PASS — `.signpost-box.baseline-banner`, no grey/opacity on list |
| 8 | Empty/failure state: calm message + official source links | PASS — line 215-219 renders calm note with sources still visible |
| 9 | Print stylesheet: strip chrome, print source URLs via `::after attr(href)`, break-inside: avoid, tinted callouts to rules | PASS — full print block at line 672-739 addresses all specifics |
| 10 | WCAG: focus management on reveal, aria-live for copy confirmation, status labels by text not color, targets >=44px | PASS — `resultHeadingEl?.focus()` after tick, `role="status" aria-live="polite"` on copy status, `sr-only` span for pill text |
| 11 | Clipboard payload includes brand-required guide-not-official hedge AND per-program source URLs | PASS — `buildClipboardText()` lines 77-109: first line is the hedge, last section is "OFFICIAL SOURCES" with URLs |

All 11 pre-build required changes verified present in the implementation.

---

## UX Review: Document Checklist Generator — Full Flow

### Nielsen Checklist

| Heuristic | Verdict | Note |
|---|---|---|
| Visibility of system status | PASS | `aria-live="polite"` region announces "Your document checklist is ready below." on submit. Copy confirmation via `role="status"`. Disabled submit button + inline hint while inputs incomplete. |
| Match system / real world | PASS | "Which programs are you applying for?" not "Select applicable programs." CA labels used in CA context (CalFresh, Medi-Cal, HEAP, CalEITC). "Needed for" tags use the same program string the user just selected. |
| User control and freedom | PASS | Form inputs remain visible and editable above the result. User can change state or program selections and resubmit. "Show my list" re-runs without page reload. Breadcrumb back to Finxiety home. |
| Consistency and standards | PASS | Reuses `.program-label`, `.field`, `select`, `.btn`, `.signpost-box`, breadcrumb from established tools. No invented controls. |
| Error prevention | PASS | Submit disabled until >= 1 program AND a state selected. Inline hint explains the constraint. No free-text input anywhere. Static data cannot produce a bad number. |
| Recognition rather than recall | PASS | All inputs on one screen. Result appears below inputs; user never needs to remember what they picked. "Needed for CalFresh and Medi-Cal" tags repeat the selection context inside each item. |
| Flexibility and efficiency | PASS | Two inputs, one button. A returning user can change one field and resubmit immediately. No pagination. |
| Aesthetic and minimalist design | PASS w/ note | Category groupings, status pills, "needed for" tags, and divergence notes all earn their place. One issue: the EITC `program_note` field in the data explains EITC structural context ("a tax credit you claim on your return, not a separate application") but is never surfaced in the rendered UI. This is load-bearing context for a user who selected EITC without knowing what it is. See Finding #2. |
| Help users recognize, diagnose, recover from errors | PASS | No user-entry errors possible. Empty-state renders a calm message with official source links. Copy failure gives an explicit fallback message ("Could not copy automatically. You can still print or use the links below."). |
| Help and documentation | PASS | "This is a guide, not the official list" in result header; per-program source URLs always rendered; "last reviewed" date with "They can change" hedge. Self-explanatory for the task. |

### Norman Principles

- **Affordances:** Native checkboxes signal multi-select correctly. The full program-label row is the tap target (not just the 18px box). State `<select>` signals fillable. "Show my list" disabled until valid — the constraint is visible, not hidden. Source links use `→` arrow (aria-hidden) with terracotta color and `font-weight: 600` — readable as links on both color and weight signals.

- **Feedback:** Submit reveals the checklist with focus moving to the result `<h2>`. `aria-live` region announces "Your document checklist is ready below." Copy confirmation: `role="status" aria-live="polite"` updates with "Copied to your clipboard." or the fallback message. Copy status region has `min-height: 1.2rem` so layout does not shift when it populates. Print invokes the OS dialog (OS provides feedback). All action feedback paths are covered.

- **Constraints:** Disabled submit is the primary constraint and it is well-executed. The inline hint on line 191 ("Select at least one program and a state to continue.") is visible only when `!canSubmit` and uses `aria-live="polite"`, which means it surfaces to screen readers as inputs are changed. This is correct behavior.

- **Conceptual model:** The promise is "one folder that covers all your applications." The model is delivered by the "Needed for CalFresh and Medi-Cal" tag — the visible proof that de-duplication happened. At first scan a user might expect separate lists per program; the tag is the artifact that corrects that expectation. It must remain prominent; at 375px the tag is the smallest text in each item (`0.75rem`), which is within the legible range on a modern phone screen but is the most at-risk element if text scaling is applied. See Finding #3 (Medium).

### Ive Restraint Test

- **Elements that can be removed:** None. The print-header div (lines 196-201) is `display:none` in screen view and `display:block` in print — correctly invisible but present. The `aria-hidden="true"` on the arrow `→` in source links is correct (decorative). The `aria-live` announcement div is invisible and non-intrusive.
- **Elements that should be added:** The `program_note` content for EITC is authored in the data but never rendered. This is the one surface where a user picks a program and the tool silently knows something important about how that program works but does not say it. See Finding #2 (Medium).
- **Visual hierarchy:** Category heading (`0.8125rem`, uppercase, `--muted`) > document name (`1rem`, `font-weight: 700`, `--dark`) > status pill (pill, uppercase, fills with program color) > description (`0.9375rem`, `--text`) > "needed for" tag (`0.75rem`, `--muted`). The hierarchy is correct: the document name dominates, status informs, description elaborates, tag contextualizes.
- **Card density at 375px:** Each `.doc-item` has `border: 1px solid var(--border)`, `border-radius: var(--radius)`, `padding: var(--space-md)` (1.25rem). With `gap: var(--space-md)` between items in the list, a 4-program selection (SNAP + Medicaid + LIHEAP + EITC) produces 8-9 distinct items after de-duplication. At 375px this is approximately 12-15 viewport-heights of scrollable content. The card density is appropriate; the category groupings provide landmarks. Not a concern.

### Simon Memory Test

- **The one memorable output:** "One bill covered three applications." The LIHEAP energy bill divergence note in the CA state override reads: "This same energy or utility bill also works as proof of where you live for CalFresh and Medi-Cal applications, so one copy covers all three." This is the single most memorable insight the tool produces. It surfaces as an olive signpost under the energy bill item — visible, not hidden. It is the emotional payload of the de-duplication feature made concrete.
- **For a non-CA user:** the memorable output is "I now have one list instead of four." The "Needed for" tags carry that memory — "This document covers three of my four applications" — which is the same insight scoped down to each item.
- **Cognitive load assessment:** LOW. Two inputs (recognition tasks), one button, one result. Within the result, category headings (Identity, Income, Residency, Household, Program-specific) act as chunking scaffolds. The CHOOSE ONE sub-list pattern prevents the "I need all of these" misread. The "If it applies" conditional pill reduces the mandatory-document count in the user's mental inventory. The tool is structured to make the problem smaller, not just describe it.

### Financial Anxiety Overlay

- **Shame signals:** None found. No judgment language. The empty-state message ("We could not build a list") attributes absence of data to the tool, not the user. "Documents commonly requested" hedges without stigmatizing. The conditional "If it applies" pill is the most carefully handled moment — it names a situation (self-employment, disability income, a child) without framing those situations as disqualifying or unusual.
- **Trust signals:** Present and layered. "This is a guide, not the official list" in the result header. Per-program source URLs with "The most reliable list always comes from the program itself" framing. "Document requirements last reviewed [date]. They can change; the official links above are always current." The clipboard payload leads with the hedge so trust travels with the artifact. The copy-failure fallback routes to print and links — trust does not collapse if the clipboard API fails.
- **Cognitive load:** LOW. The behavioral gate and disability gate independently reached the same conclusion. The de-duplication mechanic relieves cognitive load rather than adding to it.
- **No urgency or scarcity signals:** Confirmed. No "apply now" language, no countdown framing, no "don't miss out" register anywhere.

---

## Findings

### Critical

None.

### High

**[HIGH-1] `program_note` for EITC is authored in the data file but never rendered in the UI.**
- File: `finxiety/src/lib/data/doc-requirements.json`, line 235
- Text: `"program_note": "EITC is a tax credit you claim on your tax return when you file, not a separate application. The documents below are what you bring to your tax preparer or use to file."`
- The `ProgramData` interface in `doc-checklist.ts` (line 29) defines `program_note?: string` as a typed field. The data populates it for EITC. The Svelte template never reads it.
- Why it matters: A user selecting EITC who does not know that EITC is a tax filing action (not a benefits-office appointment) will arrive at a document list that makes no sense in context. They may bring pay stubs and W-2s to a benefits office looking for an "EITC application," be turned away, and conclude the tool was wrong. The `program_note` exists precisely to prevent this. It is load-bearing user context, not decorative copy, and its absence from the rendered output is a Do No Harm adjacency: a user acts on the list in a context the tool knows about but does not communicate.
- Prescribed fix: Render `program_note` when present, directly below the result heading for the relevant program and above the first item in its category, or as a quiet signpost box at the top of the checklist when EITC is one of the selected programs. The brand-reviewed text in the data file is the correct copy; do not rewrite it at the template layer. A single `{#if data.programs[key].program_note}` block per selected program in the result header section is sufficient.

### Medium

**[MED-1] External links open in `target="_blank"` with no screen-reader announcement that they open in a new tab.**
- File: `finxiety/src/routes/tools/document-checklist/+page.svelte`, lines 285-293
- The six source-anchor links (`<a ... target="_blank" rel="noopener noreferrer">`) open in a new tab but carry no visual or accessible indication of that behavior. The `→` arrow is decorative (`aria-hidden="true"`). A keyboard or screen-reader user navigating the source links has no advance warning they are leaving the page context. WCAG 2.1 G201 (Giving users advanced warning when opening a new window) applies.
- Prescribed fix: Add `<span class="sr-only">(opens in a new tab)</span>` inside each source link after the visible program name, before the `→` span. Alternatively, add a visible "(new tab)" indicator in small muted text for sighted users who benefit from the same warning. The sr-only approach is the minimum; visible is preferred for ALICE users who may be less familiar with tab behavior.

**[MED-2] "Needed for" tag text size (0.75rem) does not survive a 200% text zoom test without potential truncation.**
- File: `finxiety/src/routes/tools/document-checklist/+page.svelte`, line 581
- The `.doc-needed-for` class uses `font-size: 0.75rem` — the smallest text in the tool. At 200% browser zoom (WCAG 1.4.4 Resize Text criterion), this becomes effectively 1.5rem rendered in a narrower conceptual viewport. The flex container for `.doc-item` has no `min-width` guard; at extreme zoom the "Needed for CalFresh, Medi-Cal, and HEAP" string could wrap awkwardly or get clipped in certain browser/zoom combinations. This is not confirmed broken, but the tag is the conceptual payload of the entire tool ("proof that de-duplication happened"), and it should be robust.
- Prescribed fix: Increase `.doc-needed-for` to `font-size: 0.8125rem` (the same size as `.result-note`) to give it a slightly larger baseline before zoom pressure. Also confirm at 200% zoom in a browser that the tag wraps gracefully within the card rather than overflowing. If the item is already `flex-wrap: wrap` in its parent, this may be resolved by inspection.

**[MED-3] The `submit-hint` paragraph (line 190-192) uses `aria-live="polite"` but is conditionally rendered via `{#if !canSubmit}`, which means it may not be announced when it first appears on page load.**
- File: `finxiety/src/routes/tools/document-checklist/+page.svelte`, lines 190-192
- `aria-live` regions must be present in the DOM before content is injected into them to be reliably announced by all screen readers. A region that is conditionally rendered and then populated simultaneously may be announced by some screen readers (Chrome/NVDA combination handles it) but silently missed by others (Safari/VoiceOver, which is the dominant mobile screen-reader combination for an iPhone-first user).
- The hint text "Select at least one program and a state to continue." is helpful for all users, so there is no reason to hide it conditionally. The low-information version (when the form is empty and both conditions are obviously unmet) is still helpful framing.
- Prescribed fix: Remove the `{#if !canSubmit}` wrapper from the hint paragraph and render it unconditionally. Style it as `visibility: hidden` rather than `display: none` when `canSubmit` is true, so the live region is always in the DOM. Or: keep it always rendered and suppress it when canSubmit is true by emptying the text content via a conditional expression rather than removing the element.

### Low

**[LOW-1] The breadcrumb link "← Finxiety" does not carry an `aria-label` that gives destination context.**
- File: `finxiety/src/routes/tools/document-checklist/+page.svelte`, lines 144-146
- The breadcrumb reads "← Finxiety" visually, which is clear in context. But a screen-reader user navigating links on the page will hear "← Finxiety" or potentially just "Finxiety" depending on how the arrow is handled. The `←` character is a Unicode arrow that some screen readers announce as "left arrow" or "backwards arrow." An `aria-label="Back to Finxiety home"` would give consistent, unambiguous context.
- Prescribed fix: Add `aria-label="Back to Finxiety home"` to the breadcrumb `<a>` element.

**[LOW-2] The `print-header` div (lines 196-201) is `aria-hidden="true"` in screen view, but when `display:block` in print it carries no structural heading level, which could affect a PDF accessibility tree if the user prints to PDF and opens it in a screen-reader-aware PDF viewer.**
- File: `finxiety/src/routes/tools/document-checklist/+page.svelte`, lines 196-201
- At screen rendering time, `aria-hidden="true"` is correct — this block is purely decorative and not part of the interactive experience. However, in a printed PDF the accessibility tree of the PDF document is derived from the HTML source. The `.print-title` ("Your document checklist") is a `<p>` styled to look like a heading, not an `<h1>`. A PDF reader navigating headings would skip it.
- This is a low-severity edge case: most users print at a library or on a phone and never open the PDF in a screen reader. But it is a real use case for Renee (disability persona) who may use a PDF reader for document management.
- Prescribed fix: Change `.print-title` from `<p class="print-title">` to `<h1 class="print-title">` and remove the `aria-hidden` attribute from the `print-header` div (since in print context it is the real heading). The `display:none` in screen view already hides it visually and from layout; removing `aria-hidden` still leaves it non-interactive in screen view because it has no interactive elements.

**[LOW-3] The WIC program referenced in the task brief is absent from the live implementation with no visible explanation.**
- This is a PM/data concern rather than a UX defect in the current implementation, since the tool is internally consistent. However, if any distribution materials, the page `<title>`, or meta description reference WIC as a supported program, a user arriving based on a WIC search query would find no WIC checkbox and receive no explanation. The page `<title>` currently reads "Document Checklist | Finxiety" (line 130) — no specific programs named — so this is not currently a discoverability mismatch. It is flagged for awareness when WIC is added or when distribution copy is written.
- No prescribed fix for current UX. Flag for PM to track WIC addition in the backlog.

---

## Required Changes Before Distribution

Ordered by severity:

1. **[HIGH-1] Render `program_note` for EITC (and any future programs with a `program_note`) in the checklist output.** The EITC structural context ("a tax credit you claim on your return, not a separate application") is load-bearing user guidance authored in the data file but never displayed. A user who misunderstands EITC as a benefits-office application will act on this list incorrectly. File: `+page.svelte` result section + `doc-checklist.ts` (add `program_note` to the exported `ProgramData` interface read by the template — it is already typed there, just not rendered). Severity: High.

2. **[MED-1] Add screen-reader announcement for external links opening in a new tab.** Source anchor links (lines 285-293) open `target="_blank"` with no advance warning. Add `<span class="sr-only">(opens in a new tab)</span>` inside each. WCAG G201. Severity: Medium.

3. **[MED-3] Make the submit hint `aria-live` region always present in the DOM.** Remove the conditional rendering of the hint paragraph (lines 190-192) and use CSS visibility or conditional text content instead. Ensures VoiceOver/Safari announces it. Severity: Medium.

4. **[MED-2] Increase `.doc-needed-for` font size from `0.75rem` to `0.8125rem` and verify the tag wraps gracefully at 200% zoom.** The "Needed for" tag is the tool's conceptual proof of de-duplication and must survive text scaling. Severity: Medium.

5. **[LOW-1] Add `aria-label="Back to Finxiety home"` to the breadcrumb link** (line 145) to prevent the `←` character from being announced inconsistently by screen readers. Severity: Low.

6. **[LOW-2] Change `.print-title` from `<p>` to `<h1>` and remove `aria-hidden` from the `print-header` div** so printed PDFs carry a heading structure accessible to PDF screen readers. Severity: Low.

---

## Strengths

The implementation delivers on every pre-build design requirement. Several decisions are worth preserving explicitly:

- **The "Needed for" tag is the right size and position.** It reads as metadata without competing with the document name for scanning priority. Any future design pass should not elevate it — it is correctly subordinate.

- **The CHOOSE ONE bounded sub-list pattern is the correct treatment.** `one-of-wrap` cream inset with disc list prevents the "I must collect all of these" misread. This is a real Do No Harm win.

- **Copy/Print in-flow placement is correct.** After the last category, where the reading motion ends. A user who has read the list is ready to act on it. No friction from a sticky bar competing with content.

- **The print stylesheet is thorough.** `break-inside: avoid` on items, print source URLs as `::after` content, tinted backgrounds converted to rules, sticky elements suppressed. This is the most complete print treatment in the Finxiety suite.

- **The `canSubmit` disabled state with inline hint is the right pattern.** The hint appears as soon as the user lands, sets expectations immediately, and resolves itself as inputs are completed. No error-message moment.

- **The clipboard payload carries its own trust context.** The hedge and official source URLs in `buildClipboardText()` mean the list is honest wherever it lands — texted to a family member, forwarded to a caseworker, pasted into a note. This is one of the most carefully executed trust details in the suite.

---

## Verdict

One High finding (EITC `program_note` not rendered) and three Medium findings. The High finding is a Do No Harm-adjacent gap: the tool knows something critical about how EITC works and silently does not tell the user. It is a template-only fix (the copy exists in the data file). The Medium findings are WCAG-compliance items addressable in a single focused pass.

The core design is sound. All 11 pre-build required changes are present. The tool meets its phone-first brief, delivers low cognitive load, and executes the de-duplication value proposition clearly.

Withholding sign-off pending resolution of the High finding and the three Medium findings.

⟦UX-BLOCKED⟧ tool="document-checklist" ticket="DOC-1" date="2026-06-21" blocker="HIGH-1 (EITC program_note not rendered) + MED-1 MED-2 MED-3 (WCAG)" reviewer="design-ux-agent"
