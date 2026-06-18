# DOC-1 — Document Checklist Generator

**Status:** Built, build + unit tests green, pushed for validation gate.
**Branch:** `DOC-1-document-checklist`
**Date:** 2026-06-17

---

## What was built

A client-side tool that takes a multi-select of programs plus a state and returns
ONE de-duplicated checklist of the documents commonly requested across all selected
programs. The point: a parent applying to CalFresh and Medi-Cal sees "Recent proof of
income" listed once, tagged "Needed for CalFresh and Medi-Cal," instead of two
separate paperwork hunts.

**Files created:**
- `src/lib/data/doc-requirements.json` — program document data for SNAP, Medicaid,
  LIHEAP, EITC, with `last_updated`, `verify_at` source map, federal + `ca_label`
  per program, and `state_overrides.CA`. Compiled from the public sources named in
  the brief. No immigration/citizenship status items (deliberately excluded).
- `src/lib/calculators/doc-checklist.ts` — pure TypeScript merge/de-dup engine. Zero
  imports; `buildChecklist(programs, state, data)` takes data as an argument so it is
  trivially testable and never reaches for a loader.
- `src/lib/calculators/doc-checklist.test.ts` — 9 tests via `node:test`.
- `src/routes/tools/document-checklist/+page.svelte` — the tool (Svelte 5 runes).

**Files changed:**
- `src/routes/+page.svelte` — homepage card added after the Benefits Screener card.
- `tsconfig.json` — added an `exclude` for `src/**/*.test.ts` (superset of the base
  svelte-kit exclude list) so test files do not enter the `svelte-check` program.
  The project has no test runner installed and no `@types/node`; the test runs under
  Node's native runner and would otherwise add spurious type-check noise.

---

## De-duplication behavior (the core logic)

1. Items merge by `id`. `needed_for` accumulates every program's label; `resolved_status`
   takes the strictest (required > one_of > conditional).
2. `one_of` items in the same `one_of_group` merge their `accepts` lists by INTERSECTION
   (documents every program accepts). If the intersection is empty, the merge is rolled
   back and each program's group is surfaced separately with its own `needed_for` tag.
3. Program-specific unique ids (e.g. HEAP's energy bill) pass through tagged with their
   one program.
4. State overrides are applied per-item BEFORE the merge, and may add a `divergence_note`
   or replace a `description`. Source data is never mutated (verified by test).

Categories emit in fixed order (identity, income, residency, household, program_specific);
within each, required first, then one_of, then conditional (stable within a status rank).

---

## Key decisions (not fully pinned by the brief)

- **Category placement of self-employment records and benefit award letters: `income`.**
  These are income documentation; grouping them with income keeps the checklist legible
  and matches the brief's "group by document type" intent. Birth certificate / qualifying
  child items go under `household`.
- **One_of intersection labels are authored as full document phrases** ("A utility bill",
  "A lease or rental agreement", "Recent mail with your name and address") so the strings
  match identically across SNAP and Medicaid and therefore intersect cleanly.
- **`needed_for` holds resolved (state-contextual) labels**, so `formatNeededFor` consumes
  it directly. Per-program source links iterate the data file's program keys, so CA users
  get CalFresh/Medi-Cal/HEAP/CalEITC labels and CA official URLs.
- **Clipboard payload** leads with the required hedge line, lists every item with an
  uppercased status marker, "Any one of these works" sub-lists, condition notes, the
  "Needed for ..." tag, "Good to know:" divergence notes, and an OFFICIAL SOURCES block
  with per-program URLs.

---

## Accessibility / brand conformance

- Single input screen (checkboxes + state) then in-place reveal; no wizard.
- Native `<fieldset>/<legend>` + checkbox rows, full row is a >=44px touch target,
  `accent-color: var(--terracotta)`.
- Status pills authored normal-case, uppercased in CSS; a visually-hidden prefix makes
  screen readers announce e.g. "Required: Government-issued photo ID".
- Result heading is `tabindex="-1"` and receives focus after `tick()`; a persistent
  `aria-live="polite"` region announces readiness (screener pattern).
- Divergence notes render inline with the olive `.signpost-box` and a "Good to know:"
  text marker; never `<details>`.
- National baseline banner for non-CA states; empty/failure state is informational
  (never red) and always shows the official links.
- Only `app.css` CSS variables used; no hardcoded hex (the two `#000` values are inside
  `@media print` for ink economy, not screen color). Print stylesheet hides chrome,
  exposes URLs via `::after`, and sets `break-inside: avoid` on item blocks.

---

## Verification

- `npm run build` — passes (route prerenders to `build/tools/document-checklist.html`;
  all 4 program checkboxes, legend, state selector, and submit button present in output).
- `npm run check` — back to the pre-existing baseline (1 error in
  `src/lib/eligibility/index.ts`, 1 `@types/node` warning); both predate DOC-1 and are
  in files DOC-1 did not touch. Zero issues in any DOC-1 file.
- `node --test src/lib/calculators/doc-checklist.test.ts` — 9/9 pass. Covers: shared-id
  merge, one_of intersection merge, one_of disjoint (no-merge) split, program-specific
  passthrough, CA override + CA labels, no-override-outside-CA, category ordering,
  empty/unknown-program negative case, and source-data immutability.

**Browser spot-check at 375px was blocked** — the Playwright MCP Chrome profile was
locked by another session for the whole run, so I could not drive the live page. The
interactive layer reuses the exact checkbox-binding, focus-on-reveal, and clipboard
patterns already shipped in the screener and tip-calculator, and the prerendered DOM
is correct. Recommend the QA gate run the live 375px / keyboard / VoiceOver pass.

---

## Follow-ups for the validation gate

- Live mobile (375px) + keyboard + screen-reader pass (could not run locally; see above).
- The brief scopes V1 to CA detail with a national baseline; backlog mentions TX/FL/NY/AZ
  state notes as future. `state_overrides` is keyed by state, so adding them is data-only.
- `link-checker` should validate the 8 program URLs (4 federal in `verify_at`/`official_url`
  + 4 `ca_official_url`).
