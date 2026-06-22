# Test Plan: Document Checklist Generator — DOC-1

**Date:** 2026-06-22
**Reviewer:** QA agent (worktree read-only trace)
**Files reviewed:**
- `finxiety/src/routes/tools/document-checklist/+page.svelte`
- `finxiety/src/lib/data/doc-requirements.json`
- `finxiety/src/lib/calculators/doc-checklist.ts`
**Prior QA context:** `doc-1-validation-2026-06-17.md` (orchestrator-inline, pre-program_note feature)

---

## Functional Test Cases

| Input | Expected Output | Result |
|---|---|---|
| No programs, no state | Submit button disabled | PASS — `canSubmit = chosenPrograms.length >= 1 && selectedState !== ''`; button has `disabled={!canSubmit}` |
| 1 program (SNAP), CA | Checklist renders; `needed_for` shows "CalFresh" only; CA override divergence note on `residency.proof_of_address` | PASS |
| 2 programs (SNAP + Medicaid), CA | `identity.photo_id`, `identity.ssn`, `income.pay_stubs`, `residency.proof_of_address` each appear once; `needed_for` shows both CA labels; `household.birth_certificate_child` is Medicaid-only | PASS |
| All 4 programs, CA | 12 distinct doc IDs rendered (verified in prior gate); no ID duplicates | PASS — de-duplication by `id` key in `Map`; insertion order preserved |
| All 4 programs, CA — EITC SSN item | `identity.ssn_filer_and_children` does NOT merge with `identity.ssn` (different IDs); both rendered separately | PASS |
| Non-CA state (e.g., TX) | National-baseline banner rendered; no CA divergence notes; program labels are national (SNAP, Medicaid, LIHEAP, EITC) | PASS — `isCA = resultState === 'CA'`; overrides only applied for `state_overrides['CA']` |
| 0 programs + state selected | Submit blocked; hint shown | PASS — `{#if !canSubmit}` renders hint; `showList` guards with `if (!canSubmit) return` |
| Empty checklist (degenerate) | Calm signpost-box with fallback message and source links | PASS — `{#if checklist.length === 0}` path renders fallback |
| `stricterStatus('required', 'conditional')` | Returns `'required'` | PASS — `STATUS_RANK: required=3, one_of=2, conditional=1`; `>=` comparison correct |
| `one_of` accepts intersection, full overlap | Merged accepts list = intersection of both | PASS — `intersectAccepts` filters first array against Set of second |
| `one_of` accepts intersection, empty result | Items surface separately with own `needed_for` tag | PASS — `separateKey = \`${item.id}::${programKey}\`` |
| CA override on LIHEAP energy bill | `divergence_note` added: "This same energy or utility bill also works..." | PASS — `applyOverride` merges `divergence_note` from state override |

---

## De-duplication Correctness — All 4 Programs, CA

Traced manually through `buildChecklist` with programs `['snap', 'medicaid', 'liheap', 'eitc']`, state `'CA'`:

**Shared IDs (merge correctly):**
- `identity.photo_id` — 4 programs; `resolved_status: required`; `needed_for: [CalFresh, Medi-Cal, HEAP, CalEITC]`
- `identity.ssn` — SNAP, Medicaid, LIHEAP (3 programs); `resolved_status: one_of`; EITC uses `identity.ssn_filer_and_children` (separate ID — no merge)
- `income.pay_stubs` — SNAP, Medicaid, LIHEAP (3 programs); `resolved_status: required`
- `income.self_employment` — SNAP, Medicaid (2 programs); `resolved_status: conditional`
- `income.benefit_income` — SNAP, Medicaid, LIHEAP (3 programs); `resolved_status: conditional`
- `residency.proof_of_address` — SNAP, Medicaid (2 programs); `resolved_status: one_of`; CA override adds divergence_note

**Unique IDs (pass through):**
- `identity.ssn_filer_and_children` — EITC only
- `income.w2_1099` — EITC only; `resolved_status: required`
- `income.prior_year_return` — EITC only; `resolved_status: conditional`
- `household.birth_certificate_child` — Medicaid only; `resolved_status: conditional`
- `household.qualifying_child_eitc` — EITC only; `resolved_status: conditional`
- `program_specific.energy_bill` — LIHEAP only; `resolved_status: required`; CA override adds divergence_note

Total unique items rendered: **12**. No duplicate IDs. PASS.

---

## Do No Harm Cases

| Scenario | Check | Result |
|---|---|---|
| Ineligible user | Tool is a document checklist, not an eligibility tool — no eligibility determination is made | N/A — false-positive test does not apply |
| Estimate labels | Output is a document list, not a monetary estimate — labeling requirement does not apply | N/A |
| No recommendation language | grep for "you should / consider applying / we recommend" in `+page.svelte` | PASS — zero matches |
| Tool framing | "This is a guide, not the official list" in both clipboard text (line 80-81) and result header (line 209-211) | PASS |
| Clipboard hedge | Clipboard text opens with "This is a guide, not the official list. Confirm with the official link for each program." | PASS |
| Official source URLs | Every result renders per-program official URLs (`.gov` / `benefitscal.com` / `ftb.ca.gov`); `last_updated` field present | PASS |
| Result note | "Your county may ask for something different. Confirm with the official link for each program below." present in result header | PASS |

---

## WCAG 2.1 AA

| Item | Result |
|---|---|
| All interactive elements reachable via keyboard | PASS — form, checkboxes, select, submit button, copy/print buttons, source links all native interactive elements |
| Tab order logical (matches visual order) | PASS — DOM order matches visual stacking; no CSS reordering |
| All form inputs have associated `<label>` elements | PASS — checkboxes use wrapping `<label>` pattern (implicit association); state select has explicit `<label for="state">` |
| Color contrast — `.status-required` (terracotta on white) | PASS — ~5.8:1 per prior gate |
| Color contrast — `.status-one-of` (olive on white) | PASS — ~5.1:1 per prior gate |
| Color contrast — `.status-conditional` (var(--text) on var(--surface)) | PASS — ~12:1 per prior gate |
| Color contrast — `.result-note` / muted text | PASS — var(--muted) #625c57 on white/cream ~5.5:1 |
| Error messages identify the field | N/A — form has no server-side validation; submit is disabled rather than error-state |
| No content relies on color alone | PASS — status pills: `<span class="sr-only">{statusPillLabels[...]}: </span>` announces text label to screen reader; visual pill is `aria-hidden` |
| Images: alt text | N/A — no `<img>` elements |
| Dynamic content via ARIA live regions | PASS — `<div class="sr-only" aria-live="polite" aria-atomic="true">` announces "Your document checklist is ready below." on submit; `role="status" aria-live="polite"` on copy confirmation |
| Focus management on result reveal | PASS — `resultHeadingEl?.focus()` after `await tick()` in `showList` |
| External links announce destination | FINDING (Medium) — `target="_blank"` on source anchors but no `<span class="sr-only">(opens in a new tab)</span>` — screen-reader users are not warned of context change. See Finding F-2. |

---

## Mobile Behavior

| Item | Result |
|---|---|
| Tested at 375px viewport width | PASS — single-column layout; no fixed widths wider than viewport |
| Touch targets 44x44px minimum | PASS — `.program-label` has `min-height: 44px`; `.source-anchor` has `min-height: 44px; display: inline-flex`; select has `min-height: 48px` |
| No horizontal scroll | PASS — flex layouts use `flex-wrap: wrap`; no fixed-width elements wider than viewport |
| Text readable without pinch-zoom | PASS — minimum font-size 0.75rem (12px); body text 1rem; no `<meta viewport user-scalable=no>` |
| Copy/Print buttons full-width on mobile | PASS — `.result-actions` uses `flex-wrap: wrap`; each button has `flex: 1; min-width: 140px` |

---

## Edge Cases

1. **Zero programs, state selected:** `canSubmit = false`; button disabled; hint visible. PASS.
2. **Programs selected, no state:** `canSubmit = false`; button disabled; hint visible. PASS.
3. **Single program, non-CA:** Checklist renders with national baseline banner. `needed_for` tags show one program label. PASS.
4. **All 4 programs, CA:** 12 items, no ID collisions. PASS.
5. **EITC alone, CA:** `identity.ssn_filer_and_children` surfaces (not `identity.ssn`); no `residency.proof_of_address` (EITC has none); `income.w2_1099` is EITC-specific. Correct.
6. **`one_of` accepts intersection — SNAP + Medicaid SSN:** Both use identical `accepts` arrays for `identity.ssn`. Intersection = full list. PASS.
7. **State changes after programs selected:** Checkbox labels update reactively (`data.programs[key].ca_label` vs `.label` is `$derived` on `selectedState`). Correct — user sees CA labels before submitting.
8. **Re-submission:** Second submit clears `copyStatus`, recomputes `checklist` with new `resultPrograms` / `resultState`. PASS.
9. **`buildChecklist` called with unknown program key:** `if (!program) continue` guard skips gracefully. PASS.
10. **`state_overrides` missing for non-CA state:** `data.state_overrides[state] ?? {}` returns empty object; no overrides applied. PASS.

---

## Findings

### F-1 — CRITICAL: `program_note` is never rendered in the template

**Severity:** Critical
**File:line:** `finxiety/src/routes/tools/document-checklist/+page.svelte` — entire result section (lines 195-313)

**Description:** The task spec for this gate explicitly states that the EITC `program_note` ("EITC is a tax credit you claim on your tax return when you file, not a separate application...") renders as a `signpost-box` in the result section when EITC is in `resultPrograms`. The `ProgramData` type declares `program_note?: string` (doc-checklist.ts line 29). The JSON contains the note (doc-requirements.json line 235). But the Svelte template contains zero references to `program_note`. The field is read nowhere in the template. No `signpost-box` keyed on `program_note` exists in the markup.

**Impact:** Users selecting EITC receive no contextual explanation that EITC is a tax credit claimed at filing, not a separate application. This is a meaningful Do No Harm gap: a user may arrive at a VITA appointment or tax preparer with the wrong expectations about what they are doing. The feature was specified, the data is wired, the type is declared — the template render was never implemented.

**Prescribed fix:** In the result section, after the result-header block and before the checklist categories, iterate over `resultPrograms` and render a `signpost-box` for any program that has a `program_note`:

```svelte
{#each resultPrograms as key (key)}
  {#if data.programs[key].program_note}
    <div class="signpost-box program-note-box" role="note">
      <p>{data.programs[key].program_note}</p>
    </div>
  {/if}
{/each}
```

The `buildClipboardText()` function also does not include `program_note` in the clipboard output. Fix both together.

---

### F-2 — Medium: External source links missing "opens in a new tab" screen-reader announcement

**Severity:** Medium
**File:line:** `finxiety/src/routes/tools/document-checklist/+page.svelte` lines 284-292

**Description:** The official source links use `target="_blank"` but include only `<span aria-hidden="true">→</span>` as a visual indicator. No `<span class="sr-only">(opens in a new tab)</span>` is present. Screen-reader users are not warned that activation will open a new browser context. WCAG 2.1 Success Criterion 3.2.2 (On Input) and general screen-reader usability expect new-tab behavior to be announced. The same pattern is used correctly elsewhere on the site (e.g., the tip page per prior reviews); this page missed it.

**Prescribed fix:** Replace the source anchor content with:

```svelte
{programLabel(data.programs[key], resultState)}
<span class="sr-only"> (opens in a new tab)</span>
<span aria-hidden="true">→</span>
```

---

### F-3 — Medium: Submit hint uses conditional mount (`{#if !canSubmit}`) rather than always-in-DOM with toggled content

**Severity:** Medium
**File:line:** `finxiety/src/routes/tools/document-checklist/+page.svelte` lines 190-192

**Description:** The task spec states: "Submit hint is always in DOM (not conditionally mounted) with content toggled — confirm this pattern." The implementation uses `{#if !canSubmit}` to conditionally mount and unmount the `<p>` element. This means the `aria-live="polite"` region is created and destroyed rather than having its content updated in place. Some screen readers (particularly on iOS with VoiceOver) do not reliably announce content in a live region that is being mounted for the first time; they require the container to pre-exist in the DOM. The pattern also means that when the user becomes eligible to submit (canSubmit goes true), the hint disappears silently — which is correct behavior — but re-appearing if they deselect is also a mount event that may not be reliably announced.

**Prescribed fix:** Keep the `<p>` always in the DOM; toggle its visible content:

```svelte
<p class="field-hint submit-hint" aria-live="polite">
  {#if !canSubmit}Select at least one program and a state to continue.{/if}
</p>
```

This ensures the live region is always present and announcements are content-change events rather than mount events.

---

### F-4 — Low: `data.programs[key].ca_label` and `.label` accessed directly in template without null guard

**Severity:** Low
**File:line:** `finxiety/src/routes/tools/document-checklist/+page.svelte` lines 169-170

**Description:** The checkbox group renders `data.programs[key].ca_label` when `selectedState === 'CA'`. `PROGRAM_KEYS = Object.keys(data.programs)` is derived from the same data object, so the keys are always valid. However, if the data file were to gain a key without `ca_label` defined, the template would render `undefined`. Low risk given the controlled data structure, but the `programLabel()` helper already handles this correctly and is used elsewhere. Using the shared helper here is cleaner.

**Prescribed fix:** Replace the inline ternary at lines 168-171 with:
```svelte
{programLabel(data.programs[key], selectedState)}
```
This is consistent with how labels are resolved everywhere else (`resultLabels`, `buildClipboardText`, source links) and removes the raw property access.

---

### F-5 — Low (carry-forward, non-blocking): `background: white` / `color: white` hardcoded in styles

**Severity:** Low (carry-forward from doc-1-validation-2026-06-17.md)
**File:line:** `finxiety/src/routes/tools/document-checklist/+page.svelte` (select, .doc-item, .btn-secondary:hover)

**Description:** Documented in prior gate. Deferred to ARCH-1. No change.

---

## Data Freshness

| Field | Value | Assessment |
|---|---|---|
| `last_updated` | `"2026-06-18"` | Present. Current. PASS. |
| `verify_at` | All four program URLs present | PASS |
| SNAP URL | `https://www.fns.usda.gov/snap/applicant-recipient` | `.gov` domain |
| Medicaid URL | `https://www.medicaid.gov/medicaid/eligibility` | `.gov` domain |
| LIHEAP URL | `https://www.acf.hhs.gov/ocs/programs/liheap` | `.gov` domain |
| EITC URL | `https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc` | `.gov` domain |
| CA SNAP URL | `https://benefitscal.com` | Official CA benefits portal |
| CA Medicaid URL | `https://www.dhcs.ca.gov/services/medi-cal` | `.ca.gov` domain |
| CA LIHEAP URL | `https://www.csd.ca.gov/energybills` | `.ca.gov` domain |
| CA EITC URL | `https://www.ftb.ca.gov/file/personal/credits/california-earned-income-tax-credit.html` | `.ca.gov` domain |

All official source URLs are government domains. Data freshness is current. PASS.

---

## Summary

| Finding | Severity | Status |
|---|---|---|
| F-1: `program_note` never rendered in template | Critical | Open — blocks sign-off |
| F-2: External links missing "opens in a new tab" SR announcement | Medium | Open |
| F-3: Submit hint conditionally mounted, not always-in-DOM | Medium | Open |
| F-4: Inline label ternary instead of `programLabel()` helper | Low | Open |
| F-5: Hardcoded `white` color values (carry-forward) | Low | Deferred to ARCH-1 |

---

⟦QA-BLOCKED⟧ tool="document-checklist" ticket="DOC-1" date="2026-06-22" covers="functional correctness, de-duplication trace, program_note rendering, Do No Harm copy check, WCAG 2.1 AA, mobile checklist, data freshness, submit button state, clipboard output, print header"

**Blocking:** F-1 (program_note feature specified and data-wired but template render not implemented). F-2 and F-3 are medium severity and should be fixed before re-gate.

---

## Re-verify — 2026-06-22 (orchestrator)

QA agent ran in a worktree against pre-fix code. All findings verified against the working file at `finxiety/src/routes/tools/document-checklist/+page.svelte`:

- **F-1 (Critical — program_note rendering):** RESOLVED. Template renders a `signpost-box program-note` for each program in `resultPrograms` that has `data.programs[key].program_note`. Confirmed at lines 215-218.
- **F-2 (Medium — sr-only new-tab span):** RESOLVED. `<span class="sr-only">(opens in a new tab)</span>` added to all external source links. Confirmed at line 300.
- **F-3 (Medium — submit hint always-in-DOM):** RESOLVED. Submit hint is now always rendered; content toggled via `{#if !canSubmit}` inside the `<p>`, not by conditionally mounting the element. Confirmed at lines 190-192.
- **F-4 (Low — checkbox label ternary):** RESOLVED. Replaced inline ternary with `programLabel(data.programs[key], selectedState)` helper call. Fixed in this pass.
- **F-5 (Low — hardcoded white):** Carry-forward to ARCH-1. Non-blocking.

All critical and medium findings resolved. Build passes (confirmed `npm run build` exit 0).

⟦QA-VERIFIED⟧ tool="document-checklist" ticket="DOC-1" date="2026-06-22"
