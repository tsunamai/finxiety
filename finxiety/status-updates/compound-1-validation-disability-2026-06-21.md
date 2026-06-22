## Disability Accessibility Review: COMPOUND-1 (The Compounding Effect)
## Persona applied: Disability & Chronic Illness User (finxiety/research-findings/persona-renee-disability-user.md)

**Ticket:** COMPOUND-1
**Date:** 2026-06-21
**Reviewer:** disability-accessibility
**Prior gates:** ⟦BRAND-REVIEWED⟧, ⟦QA-VERIFIED⟧ (per request)
**Files reviewed:**
- `/Users/naomipinto/Documents/tsunam/finxiety/src/routes/tools/compound-interest/+page.svelte`
- `/Users/naomipinto/Documents/tsunam/finxiety/src/lib/calculators/compound.ts`

---

### Cognitive Accessibility Beyond Compliance

- **Interruption survivability:** Strong. The tool is a single, reactive screen. There is no submit button, no multi-step wizard, no progress that can be lost. Renee can set the phone down mid-flare, come back an hour later, and every value she typed is still in its field with the chart still rendered. Nothing resets, nothing times out. This is close to the ideal shape for a flare-day user.
- **Working memory burden:** Effectively none. All four inputs (starting amount, monthly addition, rate, horizon) are visible at once, directly above the result. The result restates the inputs back to her ("Estimated value after 20 years", "At 7%, money roughly doubles..."), so she never has to hold a number in her head from one screen to the next. The defaults (rate = 7, horizon = 20) mean she can produce a meaningful result by touching a single field, which is exactly what a depleted-spoon user needs.
- **Plain-language-under-stress check:** The framing copy is genuinely plain. "Money earning interest, and then that interest earning interest too" survives a fogged read. The "you put in" vs. "interest added" split is the rare educational device that works on a bad-symptom day because it's concrete and labeled, not inferred.
- **Finding: pass.** This is one of the more flare-resilient flows in the suite. No cross-screen dependency, no destructible progress, no timed interaction.

---

### Sensory Accessibility in Lived Practice

- **Dynamic content announcement:** Handled deliberately and well. The results section carries a visually-hidden `aria-live="polite"` `aria-atomic="true"` region (lines 257-259) that announces "After {years} years, the estimated future value is {dollars}." A screen reader user changing the rate or horizon hears the headline figure update without having to hunt for it. This is the single most important sensory affordance in a results-on-the-same-page tool, and it's present.
- **Focus management:** No focus is yanked on result render, which is correct here. Because the result appears inline below the controls (not on a new screen), moving focus would actually disorient a keyboard/SR user mid-input. The aria-live region carries the announcement instead. Appropriate choice.
- **Color-only signals:** No status is conveyed by color alone. The two-part breakdown ("You put in" / "Interest added") is labeled in text in the breakdown cells AND in the chart legend, with the chart itself marked `aria-hidden="true"` and a descriptive `aria-label` on the SVG. A user who cannot distinguish copper from olive still gets every number from the text cells. The chart is decorative-redundant, not load-bearing. Good.
- **Touch/SR note:** The horizon control is a proper `role="radiogroup"` with `aria-checked` radios (lines 231-244), so it announces as a selectable set rather than four loose buttons.
- **Finding: pass.** Walking it as a screen reader user, the experience holds up beyond the automated scan: the live region delivers the headline, the chart is correctly hidden, and every figure exists in text.

---

### Physical & Fatigue Considerations

- **Touch target sizing:** Horizon toggle buttons are `min-height: 48px`, `min-width: 64px` (lines 502-503), exceeding the 44px minimum with comfortable spacing (`gap: var(--space-sm)`). Number inputs are standard full-width fields. Imprecise-tap tolerant.
- **Interaction count:** Minimal. With defaults pre-filled, a single numeric entry produces a full result. Renee does not have to make four decisions to see anything; she can type one number and the chart appears. The "can be 0" hints on both dollar fields (lines 174, 192) explicitly relieve her of needing to fill everything.
- **Energy-to-value ratio:** Favorable. The result (a clear future-value figure plus the put-in/interest split) is reached for very little cost. No scrolling is required to see the headline once inputs exist.
- **Finding: pass.** Low spoon cost, high informational return. Nothing here forces precision or repetition.

---

### Disability-Specific Shame & Disclosure Anxiety

- **Disclosure Safety Test:** The tool asks for four things: starting amount, monthly addition, annual return rate, time horizon. **None** of these touch health, capacity, employment status, income source, ability to work, work-history gaps, or benefit-program enrollment. There is no question that could reveal disability status directly or by inference. Renee can use this tool without disclosing anything about her body, her work, or her benefits to it. The four-question Disclosure Safety Test does not apply because there is no qualifying question to run it against.
- One quiet thing the tool gets right: it never asks "how much do you make" or assumes a stable monthly income. The monthly-addition field is framed as an optional thing you *might* add, explicitly allowed to be 0, not a representation of her income. For a variable-income user this is the correct framing.
- **Finding: pass.** No disclosure surface. Nothing here reads as a test with a right answer.

---

### Benefit-Cliff Fear Specific to Disability

This is where a pure-math tool quietly becomes a disability-context tool, and where COMPOUND-1's only real findings live.

- **Asset limit acknowledgment:** Absent. The tool's entire emotional pitch is "watch your savings grow," shown as an ever-rising curve climbing toward a large number. For Renee, who has $1,800 in a Roth IRA and a live, unresolved fear about whether savings could disqualify her from SSI or jeopardize Medi-Cal once her SSDI appeal resolves, an uncritical "your money grows to ~$X" can land as *false hope built on a trap she half-knows about.* SSI's $2,000 countable-asset limit is exactly the wall she's worried about. The tool models growth straight through that wall with no acknowledgment it exists.
- **Income-is-not-always-good-news framing:** Not applicable in the income sense (no income input), but the *savings* analogue applies: more saved is not straightforwardly good news for an asset-tested user. The tool currently treats more-is-better as self-evident.
- **ABLE account surfacing:** Absent. This is the sharpest miss. An ABLE account is the one savings vehicle that lets an SSI/Medi-Cal-eligible person hold growing balances (up to the annual contribution limit, with a much higher total cap before SSI is affected) *without* the growth counting against the asset limit. It is the literal solution to Renee's exact, named, unresolved confusion in the persona. A compound-growth tool that shows a balance climbing past $2,000 and never mentions ABLE is showing an asset-tested user a cliff and not the bridge that exists right beside it. Per framework lens 5, "most users navigating SSI or Medi-Cal asset limits have never heard of an ABLE account, which exists specifically to solve their problem" — that is Renee verbatim.
- **Do No Harm tension:** Surfacing ABLE must be done as a signpost, not a recommendation ("If you receive or are applying for SSI or Medi-Cal, savings held in an ordinary account can count toward an asset limit. ABLE accounts exist so eligible people can save without that happening — here's where to learn more"), never "you should open an ABLE account." A neutral scope note satisfies both the framework and the Do No Harm rule.
- **Finding: flag.** No asset-limit awareness and no ABLE mention in a tool whose core message is "savings grow." For the stable-income user this is harmless. For Renee it risks building hope on a foundation she's specifically afraid of, while withholding the one fact that would actually help her.

---

### Double Vulnerability

- **Compounding load check:** Reviewed as one person who is both ALICE and disabled on the same day. The cognitive-load budget holds well: single screen, defaults filled, nothing to remember, fully interruptible. On the fatigue axis the tool passes cleanly. The compounding *risk* is not cognitive here — it's informational. The double-vulnerable user is precisely the one for whom "your savings will grow to $X" is simultaneously aspirational (the ALICE side, who has $0 saved and is being shown that small amounts matter) and hazardous (the disability side, whose growing balance could cost her Medi-Cal mid-flare). The same screen that motivates Dani can mislead Renee. A single scope note resolves the tension for both: it doesn't dampen the motivational message, it just adds the one caveat the asset-tested half of the user needs.
- **Finding: flag.** The fatigue dimension is fully met; the benefit-interaction dimension is where the two personas pull apart and the tool currently only serves one of them.

---

### Critical Findings

1. **[High] No ABLE account signpost in a savings-growth tool.**
   *What it is:* The tool shows a balance compounding upward with no mention that ABLE accounts exist as a means-tested-benefit-safe place to hold that growth.
   *Why it matters for this user:* Renee has ~$1,800 in savings, an unresolved fear that savings could cost her SSI/Medi-Cal, and has never heard of the one account designed to solve exactly this. The framework names ABLE surfacing as a specific obligation when a tool's scope touches asset-tested savings. A growth curve climbing past the SSI asset limit is squarely in that scope.
   *Solution space:* A short, neutral scope note near the results or sources, surfaced for everyone (it can't be conditional — the tool never asks about benefits, by design): e.g. "If you get SSI or Medi-Cal, money in an ordinary savings or investment account can count toward an asset limit. ABLE accounts let eligible people save and grow money without that — [CalABLE / ablenrc.org link]." Signpost framing only, no "you should." Pairs naturally with the existing "Sources and notes" block.

2. **[High] No asset-limit acknowledgment; "watch it grow" can read as false hope for an asset-tested user.**
   *What it is:* The tool presents unbounded growth as unambiguously good, with no acknowledgment that for some users a rising balance carries a benefit-eligibility cost.
   *Why it matters for this user:* This is the 2am scenario from the persona — losing coverage during a flare. A tool that cheerfully shows her savings crossing $2,000 with no caveat is, from her seat, naive at best and a setup for a nasty surprise at worst. It repeats the pattern she distrusts: a system that didn't tell her the rule that mattered.
   *Solution space:* The same scope note in Finding 1 largely resolves this. The note doesn't need to model any cliff math (out of scope for a pure compound tool, and the tool correctly stays simple) — it only needs to name that more-saved is not automatically good news for asset-tested users, and point them somewhere. Findings 1 and 2 can be satisfied by one well-written sentence pair.

3. **[Low] Crosslink footer omits a benefit-cliff bridge.**
   *What it is:* The signpost footer (lines 389-395) links to Emergency Fund and the Myth Quiz but not to CLIFF-1, despite CLIFF-1 being the suite's home for "more money isn't straightforwardly good news."
   *Why it matters for this user:* Renee arriving via this tool and starting to think about her growing balance is exactly the user CLIFF-1 exists for. A bridge there is the "somewhere to go next" the persona asks for (point 6 in her trust list). Low severity because it's an enhancement, not a harm.
   *Solution space:* Consider adding CLIFF-1 to the crosslink footer once it ships. PM/UX call.

---

### What the Tool Does Well for This User

- **Genuinely flare-resilient.** Single screen, no destructible progress, no timeout, no working-memory burden. This is among the best-shaped flows in the suite for a fluctuating-capacity user.
- **The aria-live headline is done right.** A screen reader user gets the future-value figure announced on every change, and the decorative chart is correctly `aria-hidden` with text-redundant breakdown cells.
- **Zero disclosure surface.** Nothing about health, work, income source, or benefits. Renee can use this without revealing anything, which is the trust posture the persona rewards.
- **Variable income is respected by omission.** No "your monthly income" field, no stable-paycheck assumption. The monthly-addition field is optional and explicitly allowed to be 0.
- **Defaults lower the spoon cost.** Pre-filled rate and horizon mean a result appears after a single tap. The "can be 0" hints actively relieve the user of completeness pressure.
- **Estimates are labeled honestly.** "~", "estimated" tags, and the "this shows how the math works, not a prediction" note avoid overpromising — which matters extra for a user primed to distrust institutions that oversell.

---

### Sign-off

Two High findings remain (ABLE signpost absent; asset-limit acknowledgment absent), both resolvable with a single neutral scope note. Per the gate rule, sign-off is withheld until at least the two High findings are addressed or accepted with deliberate rationale by the PM. The accessibility and fatigue dimensions of the tool are excellent and are not blocking anything; the block is purely the disability-benefit-interaction gap from lens 5.

⟦DISABILITY-REVIEW-WITHHELD⟧ tool="compound-interest" ticket="COMPOUND-1" date="2026-06-21"

Needs before sign-off:
1. [High] Add a neutral, Do-No-Harm-compliant ABLE account signpost surfaced to all users.
2. [High] Acknowledge that a growing balance is not automatically good news for SSI/Medi-Cal asset-tested users (the scope note in #1 can carry this).
3. [Low, non-blocking] Consider a CLIFF-1 crosslink once it ships.

---

## Re-verification — 2026-06-21

**Reviewer:** disability-accessibility
**Trigger:** Fix applied for the two High findings above; re-verification requested.
**File re-read:** `/Users/naomipinto/Documents/tsunam/finxiety/src/routes/tools/compound-interest/+page.svelte` (lines 413–416)

### Fix as shipped

A `.scope-note` div with `role="note"` now renders inside the results `<section>`, after the Sources block and before the closing `</section>` tag (line 417). It renders unconditionally whenever results are visible:

> "This tool shows how any savings grow. If you receive SSI, a roughly $2,000 resource limit applies separately — saving above that limit in a regular account can affect SSI eligibility. ABLE accounts (CalABLE in California) let eligible people save above that limit without it counting toward SSI."

The "ABLE accounts" text links to https://www.calable.ca.gov/ with `target="_blank" rel="noopener noreferrer"`.

### Finding 1 — [High] ABLE account signpost absent → RESOLVED

ABLE accounts are named explicitly, with a working link to CalABLE (the California instance), and correctly framed as a thing that exists for eligible people — not a recommendation. This directly addresses the framework lens-5 obligation and the persona's named, unresolved confusion (she "has never heard of an ABLE account... It would solve her exact problem. She doesn't know it exists.").

### Finding 2 — [High] Asset-limit acknowledgment absent → RESOLVED

The note states the roughly $2,000 SSI resource limit and that saving above it in a regular account can affect eligibility. This supplies the "more-saved is not automatically good news for an asset-tested user" caveat the growth curve was missing. The growth message remains intact for the ALICE half of the user; the caveat is additive, not dampening.

### Framing / Do No Harm — PASS

Neutral throughout. Describes what exists ("a roughly $2,000 resource limit applies," "ABLE accounts ... let eligible people save above that limit") with zero directives — no "you should," no "consider," no urgency. The note is conditional in language ("If you receive SSI") but unconditional in render, which is the correct choice given the tool never asks about benefit status by design.

### Disclosure safety — PASS

The note adds no new question and no disclosure surface. It is purely informational routing. A user mid-appeal, undiagnosed, or self-identifying without a determination reads it as "here is what exists," not as a test with a right answer. No regression to the tool's clean zero-disclosure posture.

### Residual non-blocking observations

- The note scopes to SSI only; the persona's 2am fear also includes Medi-Cal redetermination. Defensible as-is — the flat $2,000 SSI statement is cleaner and more universally accurate than reaching into Medi-Cal specifics, where over-stating risks inaccuracy. Low, non-blocking; raise with PM only if a future revision wants to broaden scope.
- The Low CLIFF-1 crosslink (#3 above) remains open and remains non-blocking; CLIFF-1 has not shipped.

### Disposition

Both High findings are resolved. No Critical or High findings remain. Accessibility and fatigue dimensions were already passing and are unaffected by this change.

⟦DISABILITY-REVIEWED⟧ tool="compound-interest" ticket="COMPOUND-1" date="2026-06-21"
