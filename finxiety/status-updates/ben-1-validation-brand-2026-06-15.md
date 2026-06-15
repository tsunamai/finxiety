# BEN-1 — CA Benefits Screener: Brand & Copy Validation

**Gate:** Pre-release brand review
**Reviewer:** Brand & Marketing (Finxiety)
**Date:** 2026-06-15
**Scope:** All user-facing copy in `screener/+page.svelte`, the strings produced by `lib/eligibility/index.ts`, and the program config strings in `lib/data/snap-eligibility.ts`.

---

## Verdict: PASS

No blocking voice or Do No Harm violations. A small number of polish notes and one near-miss are documented below. None block ship. Recommendations are optional improvements, clearly labeled.

---

## Checklist Results

### 1. "May qualify" framing — PASS
The tool never says "you qualify," "you're eligible," or "you get."
- Headline: `You may qualify for {n} program(s).` (`+page.svelte:151`) — correct.
- Likely tag reads `May qualify` (`+page.svelte:172`), not "Qualified" or "Eligible." Correct.
- Unlikely tag reads `Above limit` (`+page.svelte:174`) — factual, non-verdict framing. Good. It describes the income relationship, not the person.
- The Medi-Cal child/pregnancy branch description: "Not all adults in the household may qualify at this income level." (`index.ts:89`) — correctly hedged.

### 2. Non-Advice Rule — PASS
No "you should apply," "you must," "we recommend," or "consider applying" anywhere.
- All application CTAs are navigation labels, not directives:
  - `Check eligibility on BenefitsCal` (`snap-eligibility.ts:60, 83`)
  - `Find a WIC office near you` (`snap-eligibility.ts:106`)
  - `Check Lifeline eligibility` (`snap-eligibility.ts:127`)
  - `Find a HEAP provider near you` (`snap-eligibility.ts:149`)
  - `Apply through your school district` (`snap-eligibility.ts:181`)
  - `Learn about CalEITC on the CA FTB site` (`snap-eligibility.ts:198`)
  - All describe where to go / what the destination is. None tell the user to do it. Correct.
- Tool description: "we will show you which programs to look into and where to apply." (`+page.svelte:73-74`) — "show you" and "where to apply" are descriptive, not directive. Passes.
- Bridge box and footer copy are purely informational.

### 3. Do No Harm — PASS
No urgency, no fear, no scarcity anywhere in user-facing copy.
- "More states coming soon" (`+page.svelte:217`) is a roadmap note, not scarcity. Fine.
- HEAP description "Enrollment typically opens in fall." (`snap-eligibility.ts:135`) is factual timing, not urgency. Fine.
- Near-limit note: "Worth checking again if your income or household changes." (`+page.svelte:195-196`) — gentle signpost, not a directive or fear lever. Passes.
- The no-match headline "These programs may not match your situation right now." (`+page.svelte:154`) avoids a verdict tone and avoids shame. Good. The bridge box reinforces that limits are externally set ("set by Congress and state agencies"), which removes the result from the user as a personal failing. Strong Do No Harm work.

### 4. Estimates labeled as estimates — PASS
- Results note: "These are estimates based on income only. Actual eligibility is determined by the administering agency." (`+page.svelte:157-159`) — explicit, well-placed at the top of results.
- CalFresh benefit: `up to {amount}/month` (`index.ts:65`) — "up to" hedge present.
- Lifeline: `up to $9.25/month off your phone or internet bill` (`index.ts:161`) — hedged.
- CalEITC: `up to {amount} at tax time (estimated)` (`index.ts:274`) — both "up to" and "(estimated)". Correct.
- `incomeVsLimit` strings present income relative to the limit factually (e.g. `{income} vs. {limit} limit`), and HEAP uses `~{limit}` (`index.ts:177`) to signal its limits are approximate, matching the data-file note that HEAP figures are approximate. Good.
- Footer states the basis and the freshness window: "Income limits are based on 2025 federal guidelines. They update annually each October." (`+page.svelte:219-220`). Correct.

### 5. No em dashes in user-facing strings — PASS
A full sweep of all three files found em dashes only in code comments (`snap-eligibility.ts` lines 1, 9, 29, 86, 109, 130, 152, 184). Zero em dashes in any rendered string, label, description, or benefit text.

### 6. Official source URLs present — PASS
Every program result links to an official government or official-program URL:
- CalFresh / Medi-Cal: `benefitscal.com` (official CA benefits portal) — `snap-eligibility.ts:59, 82`
- WIC: `cdph.ca.gov` — `snap-eligibility.ts:105`
- Lifeline: `lifelinesupport.org` (the official FCC/USAC Lifeline portal) — `snap-eligibility.ts:126`
- HEAP: `csd.ca.gov` — `snap-eligibility.ts:148`
- School Meals: `cde.ca.gov` — `snap-eligibility.ts:180`
- CalEITC: `ftb.ca.gov` — `snap-eligibility.ts:197`
- Links open with `rel="noopener noreferrer"` (`+page.svelte:186`). Good hygiene.

### 7. Voice match — PASS
Plain, direct, warm without cheerfulness. Short sentences. No jargon left unexplained (every program name carries a plain-language parenthetical, e.g. "CalFresh (food assistance)"). No academic transitions. No clichés. The income-estimation helper ("Use the gross amount on one paycheck... multiply by 2.17") treats complexity as the tool's problem, not the user's — exactly on-brand. The error message "Enter your gross monthly income. Use $0 if you have no income right now." (`+page.svelte:18`) is plain and non-judgmental.

---

## Voice Violations
None.

## Do No Harm Flags
None blocking.

**Near-miss (non-blocking), for awareness:**
- The no-match path renders both the per-program `Above limit` cards (`+page.svelte:174`) AND the bridge box (`+page.svelte:203-214`). The card-level `incomeVsLimit` line (e.g. "$5,000 vs. $1,632 limit") shows a stark gap for some users. This is factual and labeled, so it passes Do No Harm, but the visual stacking of "Above limit / Above limit / Above limit" tags reads slightly verdict-like. Not a copy fix — flag to design-ux for visual softening if the behavioral-science gate raises shame concerns. No copy change required.

---

## Strengths
- **The bridge box externalizes the limits.** "Income limits are set by Congress and state agencies" (`+page.svelte:207-208`) does real Do No Harm work: it tells a user who didn't match that the threshold is a policy line, not a judgment of them. This is the right instinct and well-executed.
- **CTA labels are model citizens for the Non-Advice Rule.** "Check eligibility on BenefitsCal" instead of "Apply now" is exactly the navigation-not-directive framing the brand requires.
- **Every program name is self-translating.** "Lifeline (phone or internet discount)," "HEAP (utility bill help)" — no acronym ships naked. Strong dignity-and-clarity alignment.
- **The "$0 income" handling is humane.** Both the input hint ("Enter $0 if you have no income right now.") and the CalEITC not-applicable branch ("With $0 income reported, this credit would not apply." — `index.ts:248`) handle the hardest case plainly, without alarm.

---

## Distribution Notes
- **Who finds this first:** This is not an organic-share tool. A SNAP/Medi-Cal eligibility result is private and rarely shareable. Primary discovery is via nonprofit and county-agency partners (food banks, WIC offices, 211 referrals) and SEO on terms like "California benefits I qualify for" / "CalFresh income limit." The plain-language program names in `<title>` and `<meta description>` (`+page.svelte:60-64`) support that SEO path well; the description lists all seven programs by name, which is good for long-tail matching.
- **Shareable moment:** Deliberately none, and that's correct for this tool. The shareable surface is the cross-link to the Myth-Check Quiz (`+page.svelte:210-212, 223-225`), which IS shareable. Routing curiosity from a private result into the public-facing quiz is the right handoff.
- **Cross-tool handoff quality:** The bridge to "Benefits Myth-Check Quiz" reads as a warm, relevant next step ("covers what these programs actually provide and why so many eligible families never enroll"), not an ad. It appears on both the no-match path and as a footer link, so every user gets the handoff. Good. One note: the footer link `Benefits Myth-Check Quiz →` (`+page.svelte:224`) and the bridge-box link point to the same place; on the no-match path a user sees the link twice within a short scroll. Not a problem, but design-ux may want to dedupe.

---

⟦BRAND-REVIEWED⟧
