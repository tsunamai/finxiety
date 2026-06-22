# Behavioral Science Review: HOURS-1 — Work Hours Calculator

**Date:** 2026-06-21
**Reviewer:** behavioral-science agent
**Persona applied:** ALICE Primary User (`finxiety/research-findings/persona-alice-primary-user.md`)
**Framework:** `finxiety/docs/socioeconomic-accessibility-framework.md`
**Files reviewed:**
- `finxiety/src/routes/tools/work-hours/+page.svelte`
- `finxiety/src/lib/calculators/hours.ts`
- `finxiety/src/app.css` (tokens referenced)
**Prior gates:** ⟦QA-VERIFIED⟧ (2026-06-21), ⟦BRAND-REVIEWED⟧ pending signpost correction (now applied in current tree, lines 434–438)

---

## Summary up front

This is a careful, well-built tool. Voice is plain, estimates are labeled four times, no recommendation language, no urgency, no verdict on pay fairness. The QA and brand gates did their jobs. The time-based reframe ("minutes of each hour") is genuinely novel and, for most inputs, lands without shaming.

But this tool was conceived for a different cognitive frame than the one the ALICE user arrives in. Its emotional center of gravity is "how much of your work is taken from you" — taxes, FICA, the time before "any of that day's pay is yours to keep," the "days worked for taxes." That framing is built to produce a particular feeling: a mild, shareable sense of grievance about withholding. For a salaried worker with discretionary attention, that feeling is harmless and even engaging. For Dani — in scarcity, on a ten-minute window, already carrying an external locus of control about money — the same framing risks landing as one more confirmation that forces outside her control are eating what little she has.

I am issuing **⟦BEHAVIORAL-BLOCKED⟧** on two findings: one structural-accuracy issue that produces a materially wrong and potentially shame-inducing number for the exact user this tool is for (no dependents/credits input — H1), and one framing concern about the near-zero / low-income locus-of-control state and the absent benefits bridge (H2). Neither requires a rebuild. Both are addressable in copy and one optional input.

---

## Scarcity Mindset

- **Cognitive steps required:** Effectively two. Enter gross + hours (the two required fields) → read the result. Frequency defaults to biweekly with a sensible 40-hour default, filing and state default to Single/CA. A user can get a result by touching two fields. Good.
- **Inputs:** Two required, four optional/defaulted. Within the three-input ceiling for a first result. Pass.
- **Tunneling risk:** Moderate. The result page is long — workday bar, until-yours block, per-period table, annual rollup, employer-FICA toggle, sources, signpost. A tunneled user reads the first thing (the bar + the "until yours" sentence) and stops. That first thing is the most emotionally loaded part of the page (see Shame). The calmer, more accurate per-period table comes *after* the grievance-shaped framing. Order matters under scarcity: the user keeps the first impression, not the last.
- **Present-bias risk:** Low-moderate. The "Over a full year" rollup ("X full 8-hour days of your working year fund taxes") asks the user to hold an annualized, abstract frame. For a scarcity-state user managing this paycheck, the annual frame is cognitively expensive and emotionally heavier than the per-period reality. It is not future-*planning* (which would be worse), but it is future-*projection*, which is still taxed under scarcity. Not a blocker; flagged.
- **Finding: PASS (with note)** — The path to a first answer is genuinely short. The concern is not load to *complete*; it's that the highest-load, highest-affect content (annual "days worked for taxes") is presented as a headline result rather than an optional deeper layer.

---

## Financial Shame

- **Potential shame triggers — inventoried:**
  1. **"before any of that day's pay is yours to keep"** (line 300). This is the emotional core of the tool. It frames the workday as a period of dispossession with a moment of release. For most ALICE incomes the time is small (see near-zero trace below), so it reads mild. The risk is not the number; it's the *frame* — it teaches the user to see their work as something taken before it is given.
  2. **"days worked for taxes"** (lines 360–366). Counting days of one's life that "fund" taxes is a grievance frame. It is factual, as brand noted, but factual framing still carries affect. For a user who already feels that systems take from her, this is congruent with — and reinforces — that feeling.
  3. **No green/red, no icons, no benchmark.** Correctly absent. There is no "experts say," no comparison, no grade coloring. This is well done and is the main reason the tool clears the shame bar at all.
- **Result display — verdict or information?** Information. The breakdown table is neutral and the net row is the pine/take-home color, not red. No threshold triggers different copy when take-home is low (brand confirmed this; I confirm it in the calculator — there is no branch on income level). This is the single best shame-safety property of the tool.
- **Implicit comparisons:** None to an external standard. The only implicit comparison is internal: gross vs. net, which is the tool's legitimate purpose.
- **Finding: FLAG** — No shaming language, no benchmark, no verdict coloring: those gates pass. The residual concern is the *cumulative affect of the dispossession frame* (1 and 2 above) for a user predisposed to read money events as things done to her. This is a framing choice, not a copy error. It does not block on its own, but it compounds with H2 (locus of control) below.

---

## Trust

- **Trust-building elements:** No login, no email, no account. Four explicit estimate labels. Official IRS/SSA/FTB/DTF/DOR source URLs. Plain first-person-adjacent voice ("Where do your work hours actually go?"). The employer-FICA reveal is opt-in via toggle rather than pushed, which correctly avoids the "your employer is hiding money from you" conspiratorial register. All strong.
- **Trust-breaking elements:** Two soft ones.
  1. **No stateless/privacy reassurance.** The framework (Dimension 3) calls for making the no-storage property *visible* where trust is at stake: "This tool doesn't save your numbers or track you." A user typing their real wage into a financial site has a privacy reflex; nothing on the page answers it. EMG-1's pattern should be matched here.
  2. **The annual extrapolation may quietly mislead a variable-income worker** (see Variable Income below), which is a trust risk: if Dani's hours swing and the annual "days worked for taxes" assumes this period repeats 26 times, a worker who knows her hours are irregular may sense the number doesn't fit her and distrust the whole tool.
- **Trust arc:** Starts neutral-to-positive (clean, no signup). Holds through the inputs. The risk point is the result: if the annual number feels wrong for her actual life, or the framing feels like it's stoking a feeling rather than informing her, a calibrated-distrust user disengages. Most likely she ends roughly where she started — neither won nor lost — which for this user is an acceptable but not ideal outcome.
- **Finding: FLAG** — Add the stateless reassurance (cheap, high-value) and address the variable-income framing. No hard trust-breaker present.

---

## Locus of Control

- **Does the output feel actionable or verdictive?** Neither, fully. It is *descriptive*. It tells Dani where her money goes but offers no door. For most tools that would be fine; for this one the descriptive content is specifically about money leaving her, which makes the absence of any path forward more consequential. The framework is explicit: "A result with no path forward is a verdict... a tool that shows a gap they cannot close alone — and then ends — may reinforce the sense that nothing can be done." The "gap" here is the wedge between gross and net. Dani cannot change her withholding meaningfully, cannot change FICA, cannot change tax law. The tool shows her a thing she cannot act on and, in its current form, ends.
- **Path forward:** The signpost footer (lines 434–438) routes to Tax Clarity and the Tip Calculator. Tax Clarity is a *genuine* path forward — it is the one place where withholding/refund knowledge could change a future decision (e.g., understanding she may be over- or under-withheld, or that credits exist that she isn't capturing). That is the right bridge and it is present. Good. But it is positioned as a footer afterthought ("Wondering what a deduction is actually worth..."), below the sources block, where a tunneled scarcity-state user will never reach it.
- **Finding: FLAG** — A real path forward exists (Tax Clarity) but is buried beneath the fold and beneath the sources. For the highest-affect result content (the annual rollup), there is no proximate next step. The bridge needs to be where the feeling is created, not 80 lines below it.

---

## Cross-Tool Bridge

- **Near-zero / low-income result state:** The tool has no distinct near-zero state and no branch to a benefits bridge. The signpost (Tax Clarity, Tip Calculator) is static and identical regardless of income.
- **Character of the bridge:** Informational and on-voice ("Wondering what a deduction is actually worth..."). Not directive. Tone is correct. But it is *tax-clarity-shaped*, not *survival-shaped*.
- **The missing bridge:** This is the crux of the prompt's question, and my answer is: **the Tax Clarity / Tip bridge is sufficient for the tool's stated purpose but insufficient for its actual user.** When Dani enters her numbers and sees an annual take-home around $30,000 as a single worker (the tool has no household-size context, so it cannot know she supports three people), the most useful thing the tool could tell her is not "here's how a refund works." It's that programs exist for households at her income, and that a tool is coming (BEN-1) that can tell her if she qualifies for SNAP, Medi-Cal, or childcare subsidies. The persona is explicit: "She qualifies for SNAP but doesn't know it." HOURS-1 is one of the listed reachable tools for the "confused about her paycheck" acute moment. A take-home figure is a natural, non-shaming entry point to "here's what else exists for a household living on this."
- **Finding: FLAG** — Tax Clarity bridge present and correct in character. A benefits signpost for low-take-home users is absent and should be added as an informational (not directive) line. Because BEN-1 is not yet live, this can be a soft, non-linked "when it's ready" note or a link to MYTH-1 / the benefits section of the homepage, at the PM's discretion. The point is that the most economically vulnerable user should not leave this tool with only a tax-refund explainer as her door.

---

## Enabling Environment (Matuschak)

- **Changed capability:** Partial. The genuine durable insight this tool can create is the *distinction between gross and net in time* — a mental model that could change how Dani reads her next pay stub or evaluates a "$20/hour" job offer against a "$22/hour" one. That is real changed capability and it is the tool's best claim to enabling status.
- **After-the-tab question:** If Dani closes the tab now, what is different in 24 hours? Honestly: she has had a feeling (mild grievance / mild clarity) and seen a number. Whether anything is *different* depends entirely on whether the gross-vs-net-in-time model stuck. The tool is passive — it shows her the breakdown; it does not ask her to engage with it, predict it, or apply it. Passive transmission rarely revises a model. She is somewhat more likely to remember the "until 9:53 AM" image (it's concrete and surprising) than the table.
- **Active vs. passive:** Fully passive. The user enters numbers and receives a display. No moment of active engagement (no "guess first," no "now try a different rate"), which is where durable understanding forms.
- **Illusion-of-understanding risk:** Moderate. The vivid "until yours" clock time produces a strong *feeling* of insight ("oh, that's how much goes to taxes") that may exceed the actual change in capability. The danger specific to this tool: the feeling it produces most reliably is affective (grievance/surprise), not instrumental (I can now make a better decision). A user can leave feeling they "learned something" while nothing about their financial navigation has changed.
- **Finding: FLAG** — The tool has a real enabling kernel (gross-vs-net in time as a transferable model) but does not activate it. It transmits; it does not engage. Not a blocker, but the highest-leverage future improvement would be a small active element (e.g., "try a different wage to compare").

---

## The Near-Zero Result Test (run explicitly)

Filled with Dani's numbers: $19.50/hr × 32 hrs/week → biweekly gross **$1,248**, biweekly, 64 hours, $0 pre-tax, **Single**, CA (the tool offers HoH, which she should pick, but many users default through Single — see H1).

Traced result (Single, no dependents):
- Annual gross ≈ $32,448; federal taxable ≈ $16,348 → federal ≈ $1,635/yr ≈ $63/period
- FICA 7.65% ≈ $95/period; CA ≈ $13/period
- Net ≈ **$1,077/period**, take-home ≈ 86%, "until yours" ≈ **10:07 AM**

1. **Information or verdict?** Information. No verdict coloring, no benchmark. PASS.
2. **Path forward?** Tax Clarity exists but is buried; no benefits bridge. PARTIAL.
3. **Structural vs. personal framing?** The tool attributes the deductions to tax/FICA mechanics, not to Dani. It never implies the low take-home is her doing. PASS — this is genuinely good.
4. **Does she leave more capable or less?** Roughly neutral, tilting slightly negative *if* she defaulted to Single and saw an overstated federal bite, or *if* the dispossession framing landed on an already-external locus of control with no door out. The framework's bar is "if the answer is 'less,' the tool is not ready." My read: it is on the line, and the two fixes below move it clearly to "more."

**Critically:** the more dangerous near-zero scenario is not low take-home — it's the **wrong** take-home. See H1.

---

## Critical Findings

### H1 (High) — No dependents/credits input produces a materially overstated, shame-adjacent federal number for the primary user

The tool computes federal income tax from gross minus the standard deduction only. It models **no credits** — explicitly excluding EITC and the Child Tax Credit (calculator header, lines 25–27; sources fine print, line 428). For a childless mid-income filer this is a reasonable V1 simplification. For **Dani** — single parent of two, the literal primary persona — it is not a rounding error. At ~$32,000 of earned income with two qualifying children, the **Child Tax Credit alone ($2,000/child) plus the EITC can zero out her federal income tax entirely and, in reality, often produces a net federal refund.** The tool will instead show her ~$1,600/year (~$63/period) of federal "income tax" funding the "Federal tax" segment of every hour — a deduction she very likely does not actually bear.

Why this matters for *this* user specifically:
- It overstates the share of her hour that is "taken," directly amplifying the dispossession frame on the user least able to absorb it.
- It is the opposite of Do No Harm's accuracy bar ("If we can't be confident the tool helps, we don't ship it"). The fine-print disclaimer that credits are excluded is present and honest, but a scarcity-state user reading at a glance will see the bold "Federal income tax −$63" line in the table and the federal segment in the bar, not the line-428 footnote.
- It interacts with H2: the tool routes her toward a *tax* explainer while showing her an inflated *tax* burden, when the truer story for her household is the reverse (she may be *owed* money via credits she isn't claiming — which is exactly the persona's "gig workers who don't know they're owed a tax credit" case).

**Solution space (any one of these clears it):**
- (a) Add an optional "number of qualifying children" input that applies a first-order CTC offset to the federal figure, with an estimate label. This is the most honest fix and converts the tool's biggest liability for this user into its biggest service.
- (b) If credits stay out of V1 scope, add a *prominent, in-result* (not fine-print) note attached to the federal row/segment: "This estimate doesn't include tax credits like the Child Tax Credit or EITC, which can lower or erase federal income tax for families and lower-income workers — so your real federal tax may be much less than shown." Plain, in the result, where the federal number is.
- (c) Bridge to a credits tool (DEDUCT-1 when live) specifically from the federal row, not just the footer.

I consider an in-result version of (b) the minimum bar. (a) is the right long answer.

### H2 (High) — Low-take-home users hit a descriptive dead-end: dispossession framing + external locus of control + no proximate, survival-relevant door

Individually the shame, locus-of-control, and bridge findings above are flags. Together, for the near-zero user, they compound into a High. The tool's most prominent content frames work as something taken ("before any of that day's pay is yours," "days worked for taxes"); the user most likely to see it already experiences money as governed by forces outside her control; and the only door (Tax Clarity) sits below the sources where a tunneled reader won't reach it, while the door she most needs (benefits / "what else exists for a household at this income") is absent entirely. The result is a vivid, affect-heavy mirror with the exit hidden.

**Solution space:**
- Move a path-forward element *up*, adjacent to the annual rollup (the highest-affect block), not only in the footer.
- Add an informational, non-directive benefits signpost for the low-take-home case: something like "Take-home of about $X a year supports a lot of households that also qualify for help they don't know about. [When live: BEN-1 can check.]" Non-directive, no "you should." Tie to the homepage benefits section or MYTH-1 until BEN-1 ships.
- Consider softening the two dispossession phrasings (H2-adjacent, not required): "before any of that day's pay is yours to keep" → could become "before your take-home pay starts adding up," which keeps the concrete clock-time without the dispossession register. This is a brand/behavioral judgment call for the PM; I flag it, I don't mandate it.

### M1 (Medium) — Variable/gig income is annualized as if this period repeats, which can misfit the persona's reality and dent trust

The annual rollup ("Over a full year," "days worked for taxes") multiplies this single period by the periods-per-year constant. Dani works 32 hours "not 40, because full-time would mean benefits they'd have to pay" — and her hours and her ex's support are both irregular; the persona's whole financial reality is variability. A tool that confidently projects this one period across a full year implicitly assumes steady employment. For a user who knows her hours swing, the annual figure may feel wrong and undermine trust in the per-period numbers, which are correct. The per-period framing treats hourly/variable pay as normal and is fine; the *annual extrapolation* is where the steady-employment assumption sneaks in.

**Solution space:** A one-line caveat on the annual block: "This assumes this paycheck repeats all year. If your hours change, your real yearly numbers will too." Cheap, honest, and it signals the tool understands variable income.

### M2 (Medium) — No visible stateless/privacy reassurance

Framework Dimension 3 calls for making the no-storage property visible where trust is at stake. The user is typing a real wage. Add the standard line (match EMG-1): "This tool doesn't save your numbers or track you. Everything stays on your phone."

### L1 (Low) — Highest-affect content is ordered ahead of the calmest content

The until-yours sentence and (for some) the annual rollup carry the most affect; the neutral per-period table is the most grounding. Under scarcity the user keeps the first impression. Consider whether the plain breakdown table should precede the time-grievance framing, or whether the until-yours line can be made the optional deeper layer rather than the headline. Not a blocker; a sequencing note for design-ux.

### L2 (Low) — Tool is fully passive (enabling-environment ceiling)

No active engagement element. The transferable model (gross-vs-net in time) would stick far better with a "try another wage" comparison affordance. Future enhancement, not a gate.

---

## What the Tool Does Well for This User

- **No verdict architecture.** No red/green, no icons, no benchmark, no "experts recommend," no income threshold that triggers harsher copy. The low-take-home user sees the same calm framing as anyone. This is the hardest thing to get right and it is right.
- **Structural, not personal, attribution.** Every deduction is attributed to tax/FICA mechanics. Nothing implies the user's situation is her doing. This directly satisfies the framework's structural-framing requirement.
- **Two-field path to an answer.** Sensible defaults mean a scarcity-state user can get a result fast, within the cognitive window the persona describes.
- **Four honest estimate labels and full source attribution.** Do No Harm's labeling and verifiability bars are met thoroughly.
- **Employer-FICA reveal is opt-in, not pushed** — correctly avoids a conspiratorial register that would break trust and stoke grievance.
- **Tax Clarity is a genuine (if buried) path forward** — the bridge that exists is the right one in character and tone.
- **The concrete clock-time image is a real, memorable insight** — the one piece most likely to survive the closed tab, which is rare and valuable.

---

## Sign-Off Decision

⟦BEHAVIORAL-BLOCKED⟧ tool="work-hours" ticket="HOURS-1" date="2026-06-21"

**Blockers (must address before ⟦BEHAVIORAL-REVIEWED⟧):**
- **H1** — Add an in-result (not fine-print) credits caveat on the federal figure at minimum; ideally an optional dependents input. The tool currently overstates federal tax for the exact household it is built for.
- **H2** — Give the low-take-home user a proximate path forward: surface a path element near the high-affect result blocks, and add an informational (non-directive) benefits signpost. Tax Clarity alone, buried in the footer, is not sufficient for the most vulnerable user.

**Strongly recommended (address or accept with rationale):**
- M1 — variable-income caveat on the annual rollup
- M2 — visible stateless/privacy reassurance

**Carry-forward (non-blocking):** L1 sequencing, L2 passive-tool ceiling, and the optional softening of the two dispossession phrasings noted under H2.

After H1 and H2 are addressed, re-run this gate on the changed copy and the new signpost only; all PASS findings carry forward. The math, the no-verdict architecture, and the estimate/source discipline do not need re-review.

---

# Re-Verification — 2026-06-21

**Reviewer:** behavioral-science agent
**Scope:** H1 and H2 only, per the carry-forward instruction. PASS findings from the prior gate carry forward unreviewed. Verified the two HIGH fixes in `finxiety/src/routes/tools/work-hours/+page.svelte` and confirmed both linked routes are live.

## HIGH #1 — Federal tax overstated for the ALICE household (EITC/CTC not modeled)

**Status: RESOLVED.**

The `credits-caveat-row` is present at lines 344–348, placed inside the breakdown table immediately after the Social Security row and before the Medicare row — i.e. directly under the federal income tax line (line 337) where the overstated number lives. This satisfies the prior review's minimum bar: solution (b), an *in-result* (not fine-print) caveat attached to the federal figure.

Checked against each requirement:

- **Appears near the federal tax row?** Yes. It sits two rows below the "Federal income tax −$X" line, within the same table, above the fold of the table itself. A tunneled scarcity-state user reading the breakdown encounters it in the same visual unit as the federal number, not 80 lines down in the sources fine print. This is the structural change that mattered.
- **Names EITC specifically?** Yes, by full name: "the Earned Income Tax Credit and Child Tax Credit." Both of the credits that zero out federal income tax for Dani's exact household (single parent, two qualifying children, ~$32k earned) are named explicitly, not gestured at as "credits."
- **Informational, not directive?** Yes. The phrasing — "can reduce the federal tax line or produce a refund — they're not modeled here" — describes a mechanic and a scope limitation. It does not say "you should claim" or "apply for." The IRS link is framed as "to see if one applies to you," which is a check-for-yourself door, not an instruction. Clears the Do No Harm No-Recommendations rule.
- **Does it mitigate the "wrong number, no exit" problem for Dani-with-dependents?** Yes, materially. The prior failure mode was: she sees a bold −$63/period federal line she very likely does not bear, the dispossession bar widens by that amount, and the only correction is a line-428 footnote she will not reach. Now the correction is adjacent to the number, names the two credits that apply to her, and offers two real exits: an internal one (Tax Clarity, which I confirmed exists at `src/routes/tools/tax-clarity/+page.svelte`) and an external authoritative one (the IRS EITC page). The number is still computed without credits — this is a caveat, not a recalculation, so the bar segment and the table figure remain overstated for her on first read — but she is now told, in-place and in plain language, that the figure may be much lower or reverse into a refund. For a V1 that explicitly scopes credits out, this is the honest fix. The optional dependents input (solution (a)) remains the right long answer and is carried forward as a future enhancement, not a blocker.

One note for the record, non-blocking: because the caveat corrects rather than recomputes, the "8-hour days worked for taxes" annual rollup and the workday bar still visually embed the overstated federal share. The caveat covers the table; it does not annotate the bar or the annual block. The plain-language correction is present in the result and a user who reads the breakdown will see it, so this does not re-open the blocker — but if a dependents input is ever added, it would resolve the bar/rollup overstatement that the caveat cannot reach. Logged as carry-forward.

## HIGH #2 — Low-take-home dead-end; benefits bridge absent

**Status: RESOLVED.**

The `benefits-signpost` div with `role="note"` is present at lines 415–418, rendered inside the `{#if ready}` block — so it shows in every result, including the near-zero / low-take-home state that is the user this finding is about. It sits after the employer-FICA toggle block and before the SSI/SSDI scope note.

Checked against each requirement:

- **Renders in the results?** Yes, unconditionally within `{#if ready}`. No income threshold gates it, which is correct: gating a benefits signpost on a "low" income would itself be a verdict ("you're poor enough to need this"). Showing it to everyone keeps it informational and removes any implicit means-test shame trigger. Good call.
- **Non-directive?** Yes. "Looking at take-home pay alongside what programs might be available is often useful together" describes a pairing, not an instruction. "The Benefits Screener checks programs like SNAP and Medi-Cal based on income and household size — no account needed" describes what the tool *does*, not what the user *should do*. No "you may qualify," no "apply," no "you should." Clears Do No Harm cleanly.
- **A genuine door out, not a repeat of the footer?** Yes — and this is the key distinction the prompt asked about. The `signpost-footer` (lines 465–469) routes to Tax Clarity and the Tip Calculator: both *tax-shaped* tools. The new benefits-signpost routes to `/tools/screener`, a *survival-shaped* tool. I confirmed the screener route is live (`src/routes/tools/screener/+page.svelte`) and is a real working SNAP/Medi-Cal/CalFresh eligibility screener keyed on household size and income — not a placeholder, not a "coming soon" stub. So the description in the signpost is accurate and the link lands on a functioning door. This is a different door than the footer offers, pointed at a different need, and it is the one the persona most needs ("She qualifies for SNAP but doesn't know it"). It is the warm handoff the prior review found absent.
- **Proximity / tunneling?** The signpost sits above the sources block and above the footer, inside the results section, where a scarcity-state reader who stops partway down still reaches it. It is meaningfully higher than the buried Tax Clarity footer that triggered the original flag. The highest-affect blocks (until-yours, annual rollup) still precede it, so it is not directly adjacent to the moment of highest affect — but it is within the results unit and well above the fold of the page tail. Sufficient to clear the blocker. The L1 sequencing note (consider moving a path-forward element up beside the annual rollup) carries forward as non-blocking.

## Carry-forward (non-blocking, unchanged from prior gate)

- M1 — variable-income caveat on the annual rollup
- M2 — visible stateless/privacy reassurance
- L1 — highest-affect content ordered ahead of calmest content; consider a path-forward element beside the annual rollup
- L2 — fully passive tool; a "try another wage" affordance would activate the enabling kernel
- Future enhancement: optional dependents input (prior solution (a)) to recompute the federal figure and resolve the bar/rollup overstatement the caveat cannot reach
- Optional softening of the two dispossession phrasings (brand/PM judgment call)

## Re-Verification Decision

Both HIGH blockers are resolved. The credits caveat is in-result, names EITC and CTC by name, is informational, and gives Dani-with-dependents two real exits adjacent to the overstated federal number. The benefits signpost renders in every result, is non-directive, and is a genuine survival-shaped door to a live screener — distinct from the tax-shaped footer. No Critical or High findings remain. Medium and Low items are non-blocking and carried forward.

⟦BEHAVIORAL-REVIEWED⟧ tool="work-hours" ticket="HOURS-1" date="2026-06-21"
