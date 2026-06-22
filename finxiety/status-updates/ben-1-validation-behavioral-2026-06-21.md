# BEN-1 — CA Benefits Screener: Behavioral Science Re-Validation

**Gate:** Pre-release behavioral review (re-run of the 2026-06-15 blocked gate)
**Reviewer:** Behavioral Science (Finxiety)
**Date:** 2026-06-21
**Persona applied:** ALICE Primary User — Dani (`finxiety/research-findings/persona-alice-primary-user.md`)
**Scope:** `src/routes/tools/screener/+page.svelte`, `src/lib/eligibility/index.ts`, `src/lib/data/snap-eligibility.ts`
**Fix under review:** commit `a26de5c`
**Prior review:** `finxiety/status-updates/ben-1-validation-behavioral-2026-06-15.md` (⟦BEHAVIORAL-BLOCKED⟧, 1 blocking + 4 advisory)

---

## Verdict: CLEARED — blocking finding resolved, advisories addressed except one accepted-as-advisory

The single blocking finding (#1, the context-free far-over "Above limit" card) is resolved. Three of four advisories were also addressed in the same commit, beyond what was strictly required to clear the block. The remaining advisory (CalEITC "at tax time" framing) is unchanged and remains non-blocking. Sign-off is granted.

---

## Finding #1 (BLOCKING in prior review) — RESOLVED

**Prior issue:** When a program was unlikely AND not near-limit, the card rendered only the program name and the "Above limit" badge — no note, no gap line, no context. The `{:else if program.nearLimit}` block had no trailing `{:else}`, so the far-over case was a dead-silent card. For a no-match user, the results page was a stack of bare rejection badges — reproducing the exact institutional failure (a "no" with no "why") that the persona carries forward from her prior Medi-Cal denial.

**Current state (`+page.svelte:327-332`):** The `{:else}` branch now exists and renders an `above-limit-note`:

> "Income limits for this program are set by Congress and state agencies. They update annually each October."

**Assessment against the persona:**

- **Shame:** The note attributes the threshold to institutional design ("set by Congress and state agencies"), not to the user. The comparison object is a policy line, never a peer benchmark or a deficiency statement. This satisfies persona requirement #6 ("it acknowledges the structural reality") at the *card* level, where the prior version satisfied it only at the page level via the bridge box. No card now presents a rejection badge with zero surrounding context — the explicit requirement from the prior review's solution space is met.
- **Trust:** The card no longer reads like "every other system that told her 'no' without explanation." The "why" travels with the verdict instead of being stranded at the bottom of the page where a scanning user might never reach it.
- **Locus of control:** "They update annually each October" is a soft, externalizing signpost — it tells her the line can move and is not a fixed judgment of her, without manufacturing urgency or telling her what to do. This converts the card from a verdict into information, which is exactly the conversion the prior review required.
- **Register consistency:** The note mirrors the near-limit note's tone and the bridge box's externalizing language, so the three explanatory surfaces now read as one coherent voice rather than one informative path and one silent one.

The solution chosen is the first option from the prior review's solution space (a single line of externalizing context). It clears the block cleanly. **Finding #1: RESOLVED.**

---

## Advisory status

### Advisory 2 — Paycheck hint density — RESOLVED (beyond requirement)
**Prior issue:** An always-visible three-line conversion hint (pay-frequency multipliers) taxed bandwidth-loaded users who already knew their monthly figure.
**Current state:** The dense always-on hint is gone. The income field now shows a single hint line ("Enter $0 if you have no income right now.", `+page.svelte:180`) plus a collapsed "Calculate from paycheck" expander (`showPaycheckCalc` defaults `false`, lines 18, 181-192). The conversion arithmetic is now progressive disclosure — invisible to the user who knows her number (Dani), one tap away for the user who doesn't. This is precisely the progressive-disclosure remedy the advisory proposed, and it preserves the scarcity-mindset win (the default view is one clean field). The expander also has correct `aria-expanded`/`aria-controls` wiring and managed focus, so it does not introduce an accessibility regression. **Resolved.**

### Advisory 3 — CalEITC "at tax time" framing — UNCHANGED (remains advisory, non-blocking)
**Prior issue:** The benefit string "up to $X at tax time (estimated)" and the description "Claimed when you file state taxes, not monthly" risk a present-biased, this-month-tunneled user filing the largest single dollar figure on the page (up to $3,529) under "not for me right now."
**Current state:** Unchanged. `index.ts:274` still reads `up to ${fmt(maxCredit)} at tax time (estimated)`; `snap-eligibility.ts:191` description unchanged.
**Re-assessment:** This was advisory in the prior review and remains so. It is not a Do No Harm issue — the framing is accurate and honestly hedged, and the correct instinct (no urgency, no "you should") is preserved. The salience concern stands: a present-biased reader may discount the magnitude. But this does not rise to blocking, and there is real tension with Do No Harm rule #2 (no urgency) in any attempt to make the number "pop." I am explicitly **accepting this as a future-iteration advisory**, not a release blocker. If iterated, the safest direction is to anchor the magnitude as a once-a-year lump sum (a factual frame) without adding any temporal pressure. **Open advisory, accepted.**

### Advisory 4 — Duplicate Myth-Check Quiz link on the no-match path — RESOLVED
**Prior issue:** The quiz link appeared twice within one scroll (bridge box + footer cross-tool link), creating a small "are these the same?" bandwidth tax.
**Current state:** The bridge box (`+page.svelte:337-348`) no longer contains the quiz link. It now externalizes the cause and points to **211** ("calling 211 connects you to a community navigator who knows what is available in your area") — a warm, human, informational handoff that is arguably a stronger door for a true no-match user than a second link to an educational quiz. The Myth-Check Quiz link now appears exactly once, in the cross-tool footer (line 361). The duplication is gone. **Resolved.**

---

## Enabling Environment (Matuschak) — re-assessment

The prior review rated the likely path PASS and the no-match path FLAG, because a bare far-over card "changes nothing except possibly reinforcing 'the system is closed to me,' which is the anti-enabling outcome." That specific failure mode is now closed.

- **Changed capability (no-match path):** After the fix, the no-match user does not just receive a verdict — she receives a *model*: income limits are policy lines, set institutionally, that move every October, and a human navigator (211) exists for what is not listed. That is a genuine, if modest, capability change: she leaves knowing the door is a moving line and that there is a person to call, rather than leaving with confirmation that systems are closed to her.
- **After-the-tab question:** For the likely path, unchanged and strong (revised belief: "I qualify for things"; a possible BenefitsCal application started). For the no-match path, something is now different in 24 hours that was not before: she has a concrete next contact (211) and an externalized frame that makes "check again if my income or household changes" a live possibility rather than a closed file. The prior version left her with a false sense of closure; this version does not.
- **Active vs. passive:** Unchanged — mostly receptive, with the two optional checkboxes doing real work on results. The new paycheck expander adds a small active-engagement affordance for users who need it without taxing those who don't. Acceptable for a screener whose enabled action correctly happens downstream (on BenefitsCal / via 211).
- **Illusion of understanding risk:** The inverse risk flagged previously (a false *feeling of closure* on the no-match path) is materially reduced. The far-over note plus the "check again" framing now give every card a reason the line could move, so "I checked, I don't qualify, done" is no longer the unchallenged takeaway.
- **Finding:** PASS for both the likely and no-match paths.

---

## What the Tool Does Well for This User (still true, plus the fix)

- One cognitive step to the answer; present-tense input; no future-projection demand. The paycheck expander now makes the default view *cleaner* than before.
- No gate of any kind — no login, email, or PII. Trust earned in the first 30 seconds.
- The comparison object is always a policy line, never other people. This shame-protective choice is now extended to the far-over card, which previously had no comparison framing at all.
- Every "no" now carries its "why." The institutional-externalization voice is consistent across near-limit, far-over, and no-match surfaces.
- The no-match bridge now offers a *human* (211), which for a denied-before user is a warmer and more actionable door than a second educational link.

---

## Disposition

The single blocking finding is resolved. Three of four advisories were addressed in the same commit; the fourth (CalEITC "at tax time") is unchanged, remains non-blocking, and is accepted as a future-iteration advisory with deliberate rationale (any fix must not violate Do No Harm rule #2 on urgency). No Critical or High findings remain.

Sign-off granted.

⟦BEHAVIORAL-REVIEWED⟧ tool="screener" ticket="BEN-1" date="2026-06-21"
