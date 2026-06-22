# QA Validation: Guide Tool ("What's going on?") — 2026-06-22

**Tool:** `/tools/guide`
**Source:** `finxiety/src/routes/tools/guide/+page.svelte`
**QA Agent:** qa
**Date:** 2026-06-22

---

## Test Plan: Guide Tool — GUIDE-1

### Functional Test Cases

| Input | Expected Output | Pass/Fail |
|---|---|---|
| Select "benefits" situation | Shows: screener, document-checklist, recertification, myth-quiz | PASS |
| Select "news" situation | Shows: cliff-calculator, emergency-fund, work-hours | PASS |
| Select "paycheck" situation | Shows: work-hours, tax-clarity | PASS |
| Select "debt-savings" situation | Shows: debt-growth, compound-interest, emergency-fund, savings-commitment | PASS |
| Select "learning" situation | Shows: myth-quiz, myth-quiz-2, tip-calculator, tax-clarity | PASS |
| No situation selected | Results section not rendered | PASS — `{#if selected}` gates the section |
| Any situation selected | Fallback link "Not quite right? See all tools →" rendered | PASS — line 228 |

**Routing spot-checks:**

- "I'm not sure if I qualify for benefits" maps to `benefits` → includes `screener` (`/tools/screener`). PASS — screener is first in the tools array (line 37).
- "I want to understand my paycheck" maps to `paycheck` → includes `work-hours` (`/tools/work-hours`). PASS — line 47.
- "I got a raise" maps to `news` → includes `cliff-calculator`. PASS — line 43.
- "I'm trying to get on top of debt" maps to `debt-savings` → includes `debt-growth` and `compound-interest`. PASS — line 52.

### toolMeta href Validation

All 13 `toolMeta` hrefs verified against `finxiety/src/routes/tools/` directory contents:

| Tool key | href | Route exists | Pass/Fail |
|---|---|---|---|
| screener | /tools/screener | Yes | PASS |
| document-checklist | /tools/document-checklist | Yes | PASS |
| recertification | /tools/recertification | Yes | PASS |
| myth-quiz | /tools/myth-quiz | Yes | PASS |
| cliff-calculator | /tools/cliff-calculator | Yes | PASS |
| emergency-fund | /tools/emergency-fund | Yes | PASS |
| work-hours | /tools/work-hours | Yes | PASS |
| tax-clarity | /tools/tax-clarity | Yes | PASS |
| debt-growth | /tools/debt-growth | Yes | PASS |
| compound-interest | /tools/compound-interest | Yes | PASS |
| savings-commitment | /tools/savings-commitment | Yes | PASS |
| myth-quiz-2 | /tools/myth-quiz-2 | Yes | PASS |
| tip-calculator | /tools/tip-calculator | Yes | PASS |

All 13 routes have corresponding `+page.svelte` files. No broken hrefs.

---

### Do No Harm Cases

This tool is a routing/navigation surface — it does not display eligibility determinations or calculated estimates. Do No Harm checks scoped accordingly.

| Scenario | Check | Pass/Fail |
|---|---|---|
| No false positive eligibility | Tool shows tool links only, makes no eligibility claims | PASS |
| Estimate labels | No calculated numbers displayed; N/A | N/A |
| No recommendation language | No "you should," "consider applying," "we recommend" in any copy | PASS |
| Official source URLs | N/A — routing tool, no result claims | N/A |

**Recommendation language grep result (manual review of lines 180–230):**
- H1: "What's going on?" — neutral. PASS.
- Subhead: "Pick the situation that fits — we'll show you the right tools." — neutral. PASS.
- Results h2: "Here's where to start" — borderline. This is directional framing, not a recommendation to take a specific action. Acceptable under Do No Harm. PASS.
- Fallback: "Not quite right? See all tools →" — neutral. PASS.

---

### WCAG 2.1 AA Checklist

| Check | Status | Notes |
|---|---|---|
| All interactive elements reachable via keyboard | PASS | Cards use `role="radio"` + roving tabindex. Tab into group, arrow keys navigate within. |
| Tab order logical | PASS | Breadcrumb → h1 → radiogroup → (results section on selection). Matches visual order. |
| Form inputs have associated `<label>` | N/A | No `<input>` elements. Radio group uses `aria-labelledby="guide-q"` pointing to h1. |
| H1 as radiogroup label | PASS | `<h1 id="guide-q">` + `<div role="radiogroup" aria-labelledby="guide-q">`. Line 192, 195. |
| `role="radiogroup"` on container | PASS | Line 195. |
| `role="radio"` on each card | PASS | Line 199. |
| `aria-checked` on each card | PASS | Line 202. Reflects `selected === s.id`. |
| Roving tabindex — first card tabindex=0 initially | PASS | Line 203: `tabindex={selected === s.id || (selected === null && i === 0) ? 0 : -1}` |
| Roving tabindex — selected card gets tabindex=0 | PASS | Same expression: `selected === s.id` case. |
| Arrow key navigation | PASS | `onKeydown` handler (lines 163–177): ArrowDown/ArrowRight advance, ArrowUp/ArrowLeft retreat, Space/Enter select. Wraps at boundaries. |
| Space/Enter activates card | PASS | Lines 173–176. |
| Focus moves to results on selection | PASS | `$effect` at lines 152–157: sets `tabindex="-1"` on results section and calls `.focus()`. |
| `aria-live="polite"` on results section | PASS | Line 214. |
| `aria-label="Matched tools"` on results section | **FAIL** | Line 214: `<section class="results" aria-live="polite" bind:this={resultsEl}>` — `aria-label` is absent. The task brief listed this as a fix that was applied; it was NOT applied. |
| No `<h2>` inside aria-live region | **FAIL** | Line 215: `<h2>Here's where to start</h2>` is inside the `{#if selected}` block that wraps the aria-live section. Inserting heading content into an aria-live region causes screen readers to announce the heading text on every situational change, which is noisy. The task brief listed this as a fix that was applied; it was NOT applied. |
| Tool links are descriptive | PASS | Each `<a>` wraps `<span class="tool-name">` containing a full question string. E.g., "What programs might help you?" — unambiguous. |
| `.tool-arrow` aria-hidden | PASS | `aria-hidden="true"` on line 225. Arrow decorative character excluded from AT. |
| Tool icons aria-hidden | PASS | `aria-hidden="true"` on line 220. |
| Color contrast — body text (`--ink #1E2B25` on white) | PASS | ~15.1:1. |
| Color contrast — `.tool-desc` (`--muted #506258` on white) | PASS | ~6.5:1. |
| Color contrast — `.tool-arrow` (`--sage #6B8A78` on white) | **FAIL** | ~3.79:1. Fails 4.5:1 normal text threshold. The "→" character is 1.125rem (18px) on `.tool-arrow` (line 384). At 18px/400 weight it is not "large text" (requires 18.66px normal or 14px bold). Threshold: 4.5:1 required. |
| Color contrast — `.subhead` (`--ink-soft #54534C` on white) | NOTE | ~5.74:1. PASS. (Computed: R=84,G=83,B=76; L≈0.092; CR≈(1.05/0.142)≈7.4:1 — PASS.) |
| Color contrast — `.fallback` (`--ink-mute #6B6A62` on white) | NOTE | R=107,G=106,B=98; L≈0.163; CR≈(1.05/0.213)≈4.93:1. PASS for normal text. |
| Selected card uses non-color indicator | **FAIL** | `.card.selected` applies `border-color: var(--forest)` and `background: rgba(60,74,58,0.06)` (line 289–293). The task brief listed `font-weight: 600` and `border-left-width: 5px` as applied fixes. Neither is present. The base `.card` has `border-left: 3px solid var(--border)` (line 275); `.card.selected` does not override `border-left-width` to 5px. No `font-weight` override exists on `.card.selected`. Selection is communicated by color change only (border color + faint background). `aria-checked` covers AT, but sighted users relying on non-color cues have no visual affordance beyond color. |
| Error messages identify field and describe issue | N/A | No form validation errors in this tool. |
| No content relies on color alone to convey meaning | **FAIL (same as above)** | Selected card state communicated by color alone in the visual layer. See finding above. |
| Images have alt text | N/A | No `<img>` elements. |
| Dynamic content updates announced via ARIA live region | PASS | `aria-live="polite"` is present. Focus also moves to results section on selection. |
| `prefers-reduced-motion` respected | PASS | Lines 408–418: card/tool-row/tool-arrow transitions set to `none`, results animation removed. |

---

### Mobile Behavior (375px)

| Check | Status | Notes |
|---|---|---|
| Tested at 375px viewport width | Assessed via source — static layout | |
| Touch targets ≥44x44px | PASS | `.card` has `min-height: 48px` (line 266) and `width: 100%`. Meets 44px minimum. |
| No horizontal scroll | PASS | `max-width: var(--max-width)` (640px) on `main`, `width: 100%` on `.card`. No fixed-width elements observed. |
| Text readable without pinch-zoom | PASS | Base font 16px; `.card` text 0.9375rem (15px). No viewport lock preventing zoom. |
| Trust-line visible at 375px | **FAIL** | `.trust-line` CSS class does not exist anywhere in the file. The trust copy ("Free. No account. Nothing stored.") appears only in the `<meta name="description">` tag (line 184) — invisible to sighted users. The task brief listed this as a fix that was applied; it was NOT applied. |

---

### Edge Cases

| Condition | Behavior | Pass/Fail |
|---|---|---|
| No situation selected | Results section not rendered (`{#if selected}` gate) | PASS |
| ArrowDown on last card | Wraps to first card (index + 1) % situations.length | PASS |
| ArrowUp on first card | Wraps to last card (index - 1 + length) % length | PASS |
| Situation re-selected (already selected) | `select()` sets same value; `$effect` re-fires focus | PASS |
| `toolMeta` key referenced in situations but absent in toolMeta | Would throw at `toolMeta[toolId]` dereference — not a current risk (all 13 keys present) | PASS |

---

## Findings

### Critical

None.

### High

**H-1: `<h2>` inside `aria-live` region**
- File: `finxiety/src/routes/tools/guide/+page.svelte`, line 215
- The `<h2>Here's where to start</h2>` is a direct child of the `aria-live="polite"` section. Screen readers (NVDA, JAWS, VoiceOver) will announce the heading text on every situation change, even when only the tool list changes. This creates noisy, repetitive announcements.
- Listed as a resolved fix in the task brief. Not applied.
- Prescribed fix: Remove `<h2>` from inside the live region. Move the heading above the `{#if selected}` block (rendered statically after first selection) or replace with a visually-styled `<p>` or a `<span>` above the live region. Alternatively, use a `<p class="results-heading">` styled to match h2 but outside the live boundary.

**H-2: `aria-label="Matched tools"` missing on results section**
- File: `finxiety/src/routes/tools/guide/+page.svelte`, line 214
- `<section class="results" aria-live="polite">` has no accessible name. Screen readers navigate by landmarks; an unnamed section is announced as "section" with no context. Without `aria-label`, a user navigating by landmarks cannot identify this region.
- Listed as a resolved fix in the task brief. Not applied.
- Prescribed fix: Add `aria-label="Matched tools"` to the section element on line 214.

**H-3: Trust line not rendered — `.trust-line` class missing from page**
- File: `finxiety/src/routes/tools/guide/+page.svelte`
- The trust copy ("Free. No account. Nothing stored.") exists only in the `<meta name="description">` (line 184). It is invisible to sighted users. No `.trust-line` element or CSS class exists anywhere in the file.
- Listed as a resolved fix in the task brief. Not applied.
- Prescribed fix: Add a `<p class="trust-line">Free. No account. Nothing stored.</p>` between the subhead and the card group. Add CSS: small muted text, visually subordinate to the subhead, sufficient contrast (use `--muted #506258` at 6.5:1 or better).

### Medium

**M-1: `.card.selected` missing `font-weight: 600` and `border-left-width: 5px`**
- File: `finxiety/src/routes/tools/guide/+page.svelte`, lines 289–293
- Selected card state is communicated by color change only (`border-color: var(--forest)` + faint background). No weight or width change distinguishes selected from unselected for users who cannot distinguish the color shift.
- Listed as resolved fixes in the task brief. Not applied.
- WCAG 2.1 AA 1.4.1 (Use of Color) violation: information conveyed by color alone.
- Prescribed fix: Add to `.card.selected`:
  ```css
  font-weight: 600;
  border-left-width: 5px;
  ```

**M-2: `.tool-arrow` color fails WCAG AA contrast**
- File: `finxiety/src/routes/tools/guide/+page.svelte`, line 385
- `.tool-arrow { color: var(--sage); }` — `--sage: #6B8A78` on `--paper: #F4F6F2` background.
  - `--sage` on white: ~3.79:1. Fails 4.5:1 for normal text.
  - On `--paper #F4F6F2`: slightly lower ratio. Also FAIL.
- The "→" character at 1.125rem/400 weight does not meet the large-text threshold (18.66px regular or 14px bold). 1.125rem = 18px at default scale, 0.66px short of the large-text threshold.
- Listed as a resolved fix in the task brief (changed from `var(--sage)` to `var(--muted)`). Not applied — still reads `var(--sage)` at line 385.
- Prescribed fix: Change line 385 to `color: var(--muted);`. `--muted #506258` on white is ~6.5:1 (PASS).

### Low

**L-1: `resultsEl` focus management — `tabindex="-1"` set unconditionally, never removed**
- File: `finxiety/src/routes/tools/guide/+page.svelte`, lines 152–157
- The `$effect` sets `tabindex="-1"` on the results section each time `selected` changes. This is correct for programmatic focus. However, the attribute is never removed when `selected` returns to null (though the section is unmounted via `{#if selected}`, so this is functionally harmless). Low risk; no user impact.

---

## Summary of UX Fix Verification

| Fix listed in brief | Applied | Finding |
|---|---|---|
| `.card.selected` font-weight: 600 | NO | M-1 |
| `.card.selected` border-left-width: 5px | NO | M-1 |
| Trust line ("Free. No account. Nothing stored.") with `.trust-line` class | NO | H-3 |
| `<h2>` removed from inside aria-live section | NO | H-1 |
| `aria-label="Matched tools"` added to results section | NO | H-2 |
| `.tool-arrow` color changed from `var(--sage)` to `var(--muted)` | NO | M-2 |

All six listed UX fixes are absent from the source file. The file at `finxiety/src/routes/tools/guide/+page.svelte` does not reflect any of the described changes.

---

## Sign-Off

Four High/Medium findings are open. The six fixes described as "recently applied" are absent from the source. This gate cannot be sealed until those fixes are applied and re-validated.

⟦QA-BLOCKED⟧ tool="guide" date="2026-06-22" blockers="H-1 (h2 in aria-live), H-2 (missing aria-label on results section), H-3 (trust-line not rendered), M-1 (card.selected missing font-weight and border-left-width), M-2 (tool-arrow still var(--sage) not var(--muted))"

---

## Re-verify — 2026-06-22 (orchestrator)

QA agent ran in a worktree against pre-fix code. All findings verified against the working file at `finxiety/src/routes/tools/guide/+page.svelte`:

- **H-1 (High — h2 inside aria-live):** RESOLVED. `<h2>` removed from the results section. Section now uses `aria-label="Matched tools"` at line 215. Confirmed.
- **H-2 (High — aria-label missing):** RESOLVED. Same line — `aria-label="Matched tools"` present. Confirmed.
- **H-3 (High — trust-line not rendered):** RESOLVED. `<p class="trust-line">Free. No account. Nothing stored.</p>` at line 194. CSS class at lines 259-262. Confirmed.
- **M-1 (Medium — card.selected color-only):** RESOLVED. `.card.selected` has `border-left-width: 5px` at line 298 and `font-weight: 600` at line 300. Confirmed.
- **M-2 (Medium — tool-arrow contrast):** RESOLVED. `.tool-arrow` uses `color: var(--muted)` at line 387. Confirmed.

All findings resolved. Build passes (confirmed `npm run build` exit 0).

⟦QA-VERIFIED⟧ tool="guide" date="2026-06-22"
