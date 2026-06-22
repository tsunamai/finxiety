# Disability Accessibility Review: Work Hours Calculator (HOURS-1)
## Persona applied: Disability & Chronic Illness User (finxiety/research-findings/persona-renee-disability-user.md)

**Date:** 2026-06-21
**Reviewer:** disability-accessibility agent
**Files reviewed:**
- `finxiety/src/routes/tools/work-hours/+page.svelte`
- `finxiety/src/app.css` (token references only)
**Prior gates:** ⟦QA-VERIFIED⟧ (2026-06-21), ⟦BRAND-REVIEWED⟧ (2026-06-21)

This review reads the tool as Renee: 41, rheumatoid arthritis, paid per shift with no guaranteed hours, fourteen months into an SSDI appeal after an initial denial, on Medi-Cal, afraid that a good earning month could trigger a redetermination. Last three months of income: $1,890, $2,640, $1,140. She is also Dani on a worse week. This is not two passes; it is one user carrying both loads at once.

---

### Cognitive Accessibility Beyond Compliance

- **Interruption survivability:** Strong. The tool is a single screen with no multi-step flow, no submit button, and live-reactive results (`aria-live="polite"` on the results section, results gated on `ready = gross > 0 && hoursWorked > 0`). If Renee sets the phone down mid-entry during a pain spike and picks it up later, her typed values remain in the inputs and nothing is lost. There is no timer, no session, no "start over." This is exactly what a flare-day flow should look like.
- **Working memory burden:** None across screens — there are no screens to cross. Everything is visible at once. The one in-page dependency worth naming: the "until yours" result line and the "8-hour days worked for taxes" annual stat both silently assume an 8-hour workday starting at 9:00 AM. Renee does not work 8-hour days; she works variable shifts. The "until yours" copy does state its assumption inline ("On an 8-hour day starting at 9:00 AM"), which is honest. But the annual rollup line ("about X full 8-hour days of your working year fund...taxes") reuses the 8-hour-day frame without re-stating that it is a normalization device, not her actual schedule. For a fluctuating-hours worker this is a mild conceptual mismatch, not a stall.
- **Result scannability on a flare day:** The result is layered — workday bar, then "until yours" line, then per-period table, then annual rollup, then an optional employer-FICA toggle. The single most important number (take-home pay) lives in the per-period table's net row, which is the *third* result block down. On a good day this is fine. On a fog day, the headline answer to "how much do I actually take home?" is not the first thing the eye lands on; the bar visualization is. This is a flag, not a fail — the number is present, scannable, and correctly emphasized within its block (bold, pine color, top border). But the tool leads with a concept (time-allocation) rather than the answer (the dollar figure), which costs a fatigued user a beat of scrolling and parsing before the question is answered.
- **Finding: flag.** Interruption survivability and working-memory load are excellent. The two flags are (1) the headline take-home figure is third in reading order behind the time-visualization, and (2) the annual "8-hour days" frame assumes a schedule Renee doesn't have. Neither blocks; both are worth a design note.

---

### Sensory Accessibility in Lived Practice

- **Dynamic content announcement:** The results section carries `aria-live="polite"` (line 267). As Renee types gross and hours, the result will announce. One lived-practice concern: because results are fully live and recompute on every keystroke, a screen-reader user typing a multi-digit gross pay may hear partial/intermediate results announced repeatedly (e.g., as "1", "19", "190", "1890" are entered). `polite` mitigates this by queuing rather than interrupting, but it can still produce a noisy, fatiguing announcement stream for the exact user who has the least spare attention. This is a known tradeoff of live-on-keystroke result patterns; flagging it as a lived-practice observation, not a compliance failure.
- **Focus management:** There is no submit button and no post-submit focus move, which is the correct choice for a live-reactive tool — there is no transition to manage focus across. Focus stays where the user put it (the input). No focus trap, no focus loss. Appropriate.
- **Color-only signals:** None. The workday bar pairs every color segment with a text minute label and a text legend (label + minutes), and the full breakdown is also given as a table. QA already confirmed the `bar-seg-net` contrast fix (now `--pine`, ~9.5:1). Status is never color-alone. Pass on this axis.
- **Motor / target sizing:** Frequency toggles `min-height: 48px`, selects `min-height: 48px`, employer toggle `min-height: 44px`. All meet or exceed 44px. The state and filing dropdowns are native `<select>` elements — fully keyboard-accessible and usable with imprecise input, which matters for Renee's swollen-hands days. Good.
- **Finding: flag.** Compliance holds and motor accessibility is genuinely good. The one lived-practice flag is the live-on-keystroke announcement stream for screen-reader users, which can be fatiguing for a low-bandwidth user. Not a blocker.

---

### Physical & Fatigue Considerations

- **Touch target sizing:** Meets 44px minimum throughout; toggles and selects at 48px with adequate spacing (`gap: var(--space-sm)`). No complaint.
- **Interaction count:** Minimal and well-defaulted. Hours pre-fills to a 40-hour-week equivalent per pay frequency and follows the frequency selector until hand-edited (`hoursTouched` guard). Filing defaults to single, state defaults to CA, pre-tax is optional. To get a result, Renee must enter only two numbers: gross pay and hours. That is a low-spoon path. Good.
- **The hours default cuts against this user, though.** The default is a 40-hour week (80 biweekly), and the hint reads "Defaults to a 40-hour week for your pay schedule. Change it if yours differs." Renee does not work 40 hours and rarely the same number twice. The default itself isn't harmful — she can overwrite it — but the framing positions full-time as the assumed normal and her reality as the deviation she must correct. See the Disclosure section; this is also a fatigue point, because every variable-hours user pays an extra edit the steady full-timer doesn't.
- **Energy-to-value ratio:** Favorable. Two numbers in, a clear take-home figure out, no account, no login, no re-entry. The result is worth the spoons it costs.
- **Finding: pass.** Low interaction count, good defaults, strong targets. The 40-hour default framing is carried as a flag under Disclosure rather than here, because its real cost is signaling rather than effort.

---

### Disability-Specific Shame & Disclosure Anxiety

Inputs that touch health, capacity, work-history gaps, or benefit enrollment: **none of the inputs directly ask about any of these.** The fields are gross pay, hours, pre-tax deductions, filing status, state. No disability question, no benefit-source question, no health question. That is the right baseline. Running the Disclosure Safety Test on the fields that could *indirectly* create disclosure pressure:

**Hours worked field** (the only field that brushes capacity):
1. *Does answering honestly feel safe, or like a test?* Mostly safe — it's framed as a neutral quantity. But the hint ("Defaults to a 40-hour week... Change it if yours differs") quietly frames 40 hours as the norm and lower/variable hours as "differs." For a user whose reduced hours are a direct consequence of her disability, being positioned as the exception is a small, familiar sting — the same "you're not the default case" signal she gets from systems built around stable, legible work.
2. *Room for "it varies"?* No. The field takes one number. The tool models a single representative pay period and cannot express "$1,890 one month, $1,140 the next." For Renee, whose defining financial fact is that income varies for reasons outside her control, the tool silently assumes a stability she doesn't have. The persona names this explicitly as a trust signal: "Variable income is treated as normal, not as an error to correct. If a flow assumes one stable monthly number, it has already signaled it wasn't built for her."
3. *Does framing suggest a benefit/penalty on the answer?* No — there is no eligibility consequence here. The tool renders math, not a verdict. This is genuinely safe ground.
4. *If she answers honestly and gets the least favorable result, treated fairly?* Yes — there is no "unfavorable" result, only her own arithmetic. No grade, no comparison to a standard.

**State and filing dropdowns:** Neither creates disability-disclosure pressure. State routes tax data; filing routes brackets. Neither asks or infers anything about health or benefits. No finding.

- **Finding: flag.** No field forces disability disclosure — the baseline is safe, and the absence of a binary disability question is correct. The two soft flags are (1) the 40-hour-as-default framing positions reduced/variable hours as the deviation, and (2) the single-pay-period model silently assumes income stability the persona explicitly says signals "not built for her." Neither rises to a Critical Disclosure finding because there is no eligibility test and no right/wrong answer attached. They are dignity-of-framing flags, addressable in copy.

---

### Benefit-Cliff Fear Specific to Disability

This is the load-bearing finding of the review.

- **What the tool shows:** gross wages from hourly work, annualized, with take-home after tax. It is, functionally, a tool that helps a user understand the income side of working more hours.
- **Who uses it:** the persona's defining moment of use includes Scenario B (mid-flare, a Medi-Cal redetermination notice unopened) and the ALICE acute-trigger "confused about her paycheck." HOURS-1 is explicitly listed in the ALICE persona as reachable at the "confused about my paycheck" and "tax time" moments. An SSDI claimant or recipient checking "how much would I take home if I picked up more shifts" is squarely in scope.
- **The gap:** For an SSDI recipient, gross monthly earnings above the **Substantial Gainful Activity (SGA)** threshold (**$1,550/month in 2026** for non-blind individuals) can end the cash benefit entirely. The tool shows gross wages but says nothing about SGA. A user looking at "$1,890 gross this month" through this tool sees only take-home — it gives zero signal that this gross figure crosses a line that could cost her the benefit she's spent fourteen months appealing for. For SSI recipients, earned income reduces the cash benefit on a sliding scale, and the ~$2,000 asset limit interacts with any take-home she saves. **For this user, more gross income is emphatically not straightforwardly good news, and the tool currently presents it as neutral arithmetic with no flag.**
- **Asset limit acknowledgment:** Absent.
- **Income-is-not-always-good-news framing:** Absent.
- **ABLE account surfacing:** Absent.
- **The precedent is unambiguous and suite-wide.** Four sibling tools already carry an unconditional SSI/SSDI scope note:
  - CLIFF-1 (`cliff-calculator/+page.svelte:643-646`): "This calculator covers CalFresh, Medi-Cal, and Lifeline only. SSI and SSDI have separate income rules — including a roughly $2,000 asset limit for SSI — that are not modeled here. ABLE accounts let eligible people save above that limit without it affecting SSI eligibility."
  - EMG-1 (`emergency-fund/+page.svelte:352-354`), screener (`screener/+page.svelte:290`), compound-interest (`compound-interest/+page.svelte:413-415`) all carry equivalent SSI/SSDI + ABLE notes.
  - HOURS-1 carries **nothing**, and it is arguably the tool where the omission bites hardest, because it is the one that models *earned income going up* — the exact lever that triggers the SGA cliff.
- **Finding: fail.** A tool that models gross earned wages, is reachable by SSDI/SSI recipients at a paycheck-confusion moment, and renders rising income as neutral good-to-know math — while four sibling tools already disclose the disability income/asset rules it omits — has a material gap. This is the one finding that blocks sign-off.

---

### Double Vulnerability

- **Compounding load check, reviewed as one user who is both ALICE and disabled:** The cognitive-load budget mostly holds — two-field minimum input, no multi-step flow, interruption-safe, good defaults. Where it strains is the intersection of the benefit-cliff gap and the scarcity/fatigue state: Renee arrives mid-flare, bandwidth already taxed twice over, asking a simple question ("what do I take home?"), and the tool answers the literal question while staying silent on the consequence that actually matters most for her (that this gross figure could end her SSDI). The double-vulnerable user is precisely the one least able to independently supply the missing SGA context from her own depleted bandwidth. A steady-income non-disabled user loses nothing from the omission; Renee could lose a benefit. That asymmetry is the definition of a double-vulnerability failure — the tool handles the ALICE axis well and the disability axis not at all, and the two users are the same person.
- **Finding: flag** (escalated by the SGA fail above). On its own the cognitive budget holds; the compounding harm rides on the benefit-cliff finding.

---

### Critical Findings

**HIGH — H1: No SGA / SSI / SSDI scope note on a tool that models rising earned income.**
- *What it is:* HOURS-1 shows gross earned wages and take-home, is reachable by SSDI/SSI recipients at the "confused about my paycheck" moment, and carries no acknowledgment that gross earnings above the 2026 SGA threshold (~$1,550/month, non-blind) can end an SSDI cash benefit, that earned income reduces SSI, or that an ~$2,000 SSI asset limit and ABLE accounts exist. Four sibling tools (CLIFF-1, EMG-1, screener, compound-interest) already carry an unconditional SSI/SSDI + ABLE scope note; HOURS-1 is the lone gap, on the tool where the cliff is most directly implicated because it models earned income going *up*.
- *Why it matters for this user:* Renee is fourteen months into an SSDI appeal, on Medi-Cal, and afraid a good earning month triggers a loss she can't afford during a flare. This tool, asked "what do I take home if I pick up shifts," would answer in clean arithmetic and give her no signal that the gross figure it's celebrating could cross the line that ends her benefit. Silence here repeats the institutional pattern she already distrusts: a system that hands her a number without telling her what it costs.
- *Solution space:* Add an unconditional scope note in the results area, matching the established CLIFF-1 pattern, naming (a) that SSDI has an SGA earnings limit and SSI reduces with earned income, (b) the ~$2,000 SSI asset limit, and (c) ABLE/CalABLE as the account that lets eligible people save above the limit. Unconditional (not gated on any input), so it never requires Renee to disclose disability status to see it. The brand/Do-No-Harm tone already used in CLIFF-1 ("...are not modeled here") is the right register — informational, no urgency, no advice. Link to https://www.calable.ca.gov/ as the siblings do; SGA figure should cite SSA and live in dated data if a number is stated, or be phrased qualitatively to avoid a staleness liability.

**LOW — L1: Single-pay-period model silently assumes income stability.**
- *What it is:* The tool takes one gross figure and one hours figure and models a representative period. It cannot express variable month-to-month income.
- *Why it matters for this user:* Renee's income was $1,890 / $2,640 / $1,140 over three months. A tool that assumes one stable number signals, per the persona, that it "wasn't built for her."
- *Solution space:* A one-line acknowledgment that the result reflects the single period entered and that pay varying period to period is normal — "Enter a typical period, or run it twice for a high and a low one." Low effort, meaningful signal. Not a blocker.

**LOW — L2: 40-hour-week default framing positions reduced/variable hours as the deviation.**
- *What it is:* Hours hint reads "Defaults to a 40-hour week... Change it if yours differs."
- *Why it matters for this user:* Frames full-time as normal and her disability-driven reduced hours as the exception to correct. A small, familiar "not the default case" sting.
- *Solution space:* Soften to remove the implied norm, e.g., "Pre-filled to a full-time week — change it to your hours." Cosmetic copy adjustment.

**LOW — L3: Headline take-home figure is third in result reading order.**
- *What it is:* The dollar answer to "what do I take home?" sits in the third result block, behind the time-allocation bar and the "until yours" line.
- *Why it matters for this user:* On a fog day the literal answer isn't the first thing surfaced; the conceptual visualization is.
- *Solution space:* Consider surfacing the take-home figure (per-period and/or annual) at the very top of results, before the bar. Design-ux call, not an accessibility blocker.

**OBSERVATION — O1: Live-on-keystroke results can produce a noisy screen-reader announcement stream.**
- Not a compliance failure (`aria-live="polite"` queues rather than interrupts), but worth a design note for the low-bandwidth user. No action required for sign-off.

---

### What the Tool Does Well for This User

- **Interruption survivability is excellent.** No multi-step flow, no submit, no session, no timer. Set the phone down mid-flare, pick it up, nothing lost. This is the single most important property for a flare-day user and the tool nails it.
- **No disability disclosure is required or inferred.** No binary disability question, no benefit-source field, no health question. The baseline Renee fears — a test she might fail in either direction — simply isn't present.
- **Low-spoon input path.** Two numbers to a result, with sensible defaults for everything else. Native `<select>` dropdowns and 44–48px targets are genuinely usable on swollen-hands days.
- **No verdict, no grade, no comparison to a standard.** The result is her own arithmetic. Nothing reads as "you're behind" or "most people have." This protects the shame-sensitive user well.
- **Honest about its assumptions.** The "until yours" line states its 8-hour/9 AM frame inline, and the sources block is candid about what the estimate omits. Honesty about complexity is exactly what the persona asks for.
- **Color is never load-bearing.** Every segment is labeled in text and re-stated in a table; the contrast fix is in. A low-vision or color-blind user gets the full result.

---

### Sign-Off Decision

One HIGH finding (H1: missing SGA/SSI/SSDI scope note) blocks sign-off. It is directly addressable by porting the established, unconditional CLIFF-1 scope-note pattern into the HOURS-1 results area — the suite already has the precedent, the copy register, and the ABLE/CalABLE link. The three LOW findings and one observation do not block and can be addressed at design-ux/brand discretion.

⟦DISABILITY-REVIEW-WITHHELD⟧ tool="work-hours" ticket="HOURS-1" date="2026-06-21" blocker="H1 — no SGA/SSI/SSDI scope note on a tool that models rising earned income; four sibling tools (CLIFF-1, EMG-1, screener, compound-interest) already carry the unconditional SSI/SSDI + ABLE note this tool omits"

Re-issue ⟦DISABILITY-REVIEWED⟧ once H1 is resolved (the LOW findings may be accepted with rationale or addressed in copy; they do not gate).

---

## Re-Verification — H1 (2026-06-21)

**Reviewer:** disability-accessibility agent
**Trigger:** Fix submitted for HIGH H1 (no SGA/SSI/SSDI scope note).
**File re-reviewed:** `finxiety/src/routes/tools/work-hours/+page.svelte` (scope note at lines 420–423; `.scope-note` style at lines 938–952)
**Reference pattern:** CLIFF-1 `cliff-calculator/+page.svelte:644–645`

### Confirmation checklist

1. **Scope note present and unconditional — CONFIRMED.** The `.scope-note` div with `role="note"` sits inside the `{#if ready}` block (opens line 284, `{:else}` at line 424), gated only on `ready = gross > 0 && hoursWorked > 0` — the same income/hours gate every result block shares. There is no disability-disclosure condition anywhere in the render path. Renee never has to declare a disability, a benefit, or a determination to see it. Matches the CLIFF-1 unconditional pattern exactly.

2. **SGA threshold named — CONFIRMED.** "earnings above the Substantial Gainful Activity threshold (~$1,550/month in 2026 for non-blind recipients)." Names the mechanism (SGA), the figure (~$1,550), the year (2026), and the scope qualifier (non-blind). The `~` and the explicit year date the number against the annual-staleness risk the framework flags; SSA is already cited in the tool's sources block (`SSA_SOURCE`, line 13).

3. **SSI ~$2,000 resource limit named — CONFIRMED.** "If you receive SSI, a roughly $2,000 resource limit applies."

4. **ABLE / CalABLE named with link — CONFIRMED.** "ABLE accounts (CalABLE in California)" anchored to `https://www.calable.ca.gov/` with `target="_blank" rel="noopener noreferrer"`. Same destination and link hygiene as the four sibling tools.

5. **Neutral framing — CONFIRMED.** Reads as description of what exists ("can affect the benefit separately," "a roughly $2,000 resource limit applies," "let eligible people save above that SSI limit"). No directive, no "you should," no urgency, no advice. This is the right register for Renee, who reads "you should apply / you should worry" as the adversarial institutional voice she already distrusts. It tells her what exists and stops — which is exactly what the persona asks for ("It names the institutional reality without being asked... It doesn't perform sympathy"). Clears Do No Harm #1 and #2.

6. **CLIFF-1 pattern match — CONFIRMED.** Same `.scope-note`/`role="note"` structure, same unconditional placement in the results area, same CalABLE link, same informational tone. HOURS-1 was the lone sibling missing the note; the gap is now closed. HOURS-1's wording is actually the strongest of the set because it adds the SGA earnings figure — appropriate, since this is the one tool that models earned income going *up*, the exact lever that triggers the SGA cliff Renee fears.

### Lived-practice check (one user, both loads)

Re-walked as Renee, mid-flare, asking "what do I take home if I pick up shifts." The tool now answers the arithmetic *and* surfaces, without being asked and without requiring her to disclose anything, that a rising gross figure can cross the SGA line, that the SSI resource limit exists, and that ABLE is the account built to solve her exact (unresolved-Roth-IRA) problem. The silence that defined the original failure — a system handing her a number without telling her what it costs — is gone. The double-vulnerability asymmetry that escalated this finding is resolved: the omission that cost a steady-income user nothing and could have cost Renee a benefit no longer exists.

### H1 status: RESOLVED.

The three LOW findings (L1 single-pay-period income-stability assumption; L2 40-hour default framing; L3 take-home figure third in reading order) and the one observation (O1 live-on-keystroke announcement stream) remain open and non-blocking — design-ux/brand discretion.

No Critical or HIGH findings remain.

⟦DISABILITY-REVIEWED⟧ tool="work-hours" ticket="HOURS-1" date="2026-06-21"
