# RECERT-1 — Recertification Deadline Tracker

**Status:** Built, build green, browser-verified at 375px. Ready for the validation gate (brand, design-ux, qa, behavioral-science, disability-accessibility).

**Branch:** `RECERT-1-recertification-deadline-tracker`

---

## What shipped

A new client-side tool at `/tools/recertification` that:

1. Asks which benefits the user is enrolled in (SNAP, Medicaid) and their state (CA, TX, FL, NY, AZ only).
2. Asks for the last certification/renewal date per program, with an "I don't know" path that surfaces guidance (check the approval notice, call 211) and excludes that program from the calendar.
3. Estimates the next recertification date per program, frames the time remaining in plain language ("in about 6 months" / "in about 30 days"), surfaces the CalFresh SAR-7 mid-cert note as a non-alarming "Good to know," and generates a downloadable RFC 5545 `.ics` with two reminders per program (30 days and 7 days before the deadline).

Everything is client-side. No dates are stored or transmitted. The `.ics` is built in-browser with `Blob` + `URL.createObjectURL`.

### Files

- `src/lib/data/certification-periods-2026.json` — certification periods + official verify URLs for 5 states × 2 programs. `last_updated: 2026-06-18`.
- `src/lib/ics-generator/index.ts` — dependency-free RFC 5545 generator (`generateIcs`, `downloadIcs`) with TEXT escaping and 75-octet line folding measured in UTF-8 bytes.
- `src/lib/calculators/recert.ts` — pure `calcRecert` + `addMonths` (clamps short months) + `isSupported`.
- `src/routes/tools/recertification/+page.svelte` — 3-step flow.
- `src/lib/calculators/recert.test.ts`, `src/lib/ics-generator/index.test.ts` — 13 node:test cases, all passing.
- `src/routes/+page.svelte` — homepage card added.

---

## Certification-period data (web-verified 2026-06-18)

| State | SNAP default | Medicaid | Notes |
|---|---|---|---|
| CA | 12 mo (CalFresh) | 12 mo (Medi-Cal) | SAR-7 mid-cert at 6 mo surfaced as "Good to know," not a deadline |
| TX | 6 mo | 12 mo | SNAP variable; 36 mo for all-elderly/disabled no earned income |
| FL | 6 mo | 12 mo | SNAP 24 mo for all-elderly/disabled |
| NY | 12 mo | 12 mo | SNAP up to 24–36 mo for elderly/disabled |
| AZ | 6 mo | 12 mo | SNAP 36 mo for all-60+ no earned income |

Per the ticket, the `months` field holds the most common household period; household-type exceptions are recorded in each entry's `notes`. Sources are in `verify_at` and each period's `source`. SNAP default of 6 months for TX/FL/AZ reflects how those agencies assign standard non-elderly/non-disabled households.

---

## Key decisions

- **DOC-1 link in the `.ics` is derived from `window.location.origin` at download time**, not a hardcoded `finxiety.com`. No production/canonical domain is set anywhere in the repo yet, so a hardcoded domain risked shipping a dead link inside the calendar file (a Do No Harm / "official source" violation). Deriving the origin makes the link correct on whatever domain serves the tool. Revisit if a canonical domain is later enforced.
- **State dropdown is filtered to the 5 supported states** (per ticket). The "we don't have data for your state" note still exists in the markup and the calc is still guarded by `isSupported`, so the unsupported-state AC holds by construction even though the UI never offers an unsupported option.
- **All-day events** use `DTSTART;VALUE=DATE` with an exclusive `DTEND` (reminder date + 1 day), which is the correct RFC 5545 representation and what Apple/Google Calendar expect.
- **Date parsing builds a local Date from parts** rather than `new Date("YYYY-MM-DD")` (which parses as UTC and can shift a day in negative timezones).
- **Stayed on the established house voice** (em dashes in UI copy) to match DOC-1/TIP-1. The data file's `mid_cert_note` was lightly reworded from the ticket draft to drop the "missing it can pause your benefits" phrasing in favor of the gentler "turning it in keeps your benefits going without a pause."

---

## Test results

- **Unit:** `node --test` on both test files — 13/13 pass (date math incl. month-end clamping, mid-cert pass-through, supported-state guard, negative throw, ICS envelope, all-day formatting, TEXT escaping, 75-octet folding with round-trip, 2-events-per-program).
- **Build:** `npm run build` from `finxiety/` exits 0; the recertification route is in the output.
- **Type check:** `npm run check` — the only error is pre-existing in `src/lib/eligibility/index.ts` (BEN-1, not touched here); the only warning is a missing `@types/node` (unrelated). My files are clean.
- **Browser (Playwright, 375px):**
  - AC1: SNAP + CA + last cert 6 months ago → next cert Dec 18 2026, "in about 6 months," SAR-7 note present. ✓
  - AC2: Medicaid + CA + last cert 11 months ago → next cert Jul 18 2026, "in about 30 days," no mid-cert note, no urgency. ✓
  - "I don't know" for Medi-Cal → date input replaced with 211/agency guidance; program excluded from results with an explanatory, non-shaming note. ✓
  - Captured `.ics`: valid RFC 5545, 2 VEVENTs per program (4 total), all-day dates, DESCRIPTION carries program name + plain-language recertification meaning + the DOC-1 link, commas escaped, lines folded ≤75 octets, em-dash survives folding intact. ✓
  - State dropdown offers only CA/TX/FL/NY/AZ. ✓
  - No horizontal overflow at narrow width; all buttons ≥44px tall.

---

## Follow-ups / open items

- Full validation gate (5 agents) not yet run — this is the engineer hand-off, gate is next.
- Annual data refresh: certification periods and FPL-adjacent tables update each October. `certification-periods-2026.json` carries `last_updated` for the release agent's staleness audit.
- A canonical production domain is still unset repo-wide. The origin-derived `.ics` link sidesteps this for now, but if/when a domain + canonical tags are added, re-confirm the calendar link resolves.
