# Behavioral Science Review: DEBT-VIZ-1 — Debt vs. Growth Visualizer

**Date:** 2026-06-21
**Reviewer:** behavioral-science agent
**Persona applied:** ALICE Primary User (`finxiety/research-findings/persona-alice-primary-user.md`)
**Framework:** `finxiety/docs/socioeconomic-accessibility-framework.md`
**Prior gates:** ⟦QA-VERIFIED⟧ (2026-06-21), ⟦BRAND-REVIEWED⟧ (2026-06-21)

**Files reviewed:**
- `finxiety/src/routes/tools/debt-growth/+page.svelte`
- `finxiety/src/lib/calculators/debt-growth.ts`
- `finxiety/src/app.css` (color tokens)

---

## Framing Note: Who Is Dani Here?

A caution before the dimension-by-dimension review. The ALICE persona was written primarily around tools where Dani is the direct subject of the result (EMG-1 runway, BEN-1 eligibility). DEBT-VIZ-1 is a different shape: it is a **concept tool**, not a personal-status tool. Its stated purpose is to show that "compound interest runs in both directions," using the user's own numbers as a worked example.

This matters because Dani's relationship to this tool is more ambivalent than to a runway checker. She is carrying a $4,000 medical bill at a minimum payment. She is not in market for an investment account; she has $0 in retirement and tried-and-failed to keep $100 in savings. The tool's core comparison — "the same amount invested could grow to $X" — risks presenting her with a counterfactual she cannot act on (investing money she does not have) while quantifying the cost of a debt she already cannot escape. The review below holds this tension throughout: the tool is well-built and the copy is genuinely careful, but the *premise* carries a shame and locus-of-control load that the persona demands we examine directly.

---

## Scarcity Mindset

- **Cognitive steps required:** Effectively one flow, but with **six inputs** (debt balance, APR, monthly payment, investment amount, expected return, time horizon) before a result. The framework's hard ceiling is **three inputs maximum for a first result** (Dimension 1). DEBT-VIZ-1 doubles that. Mitigations are real but partial: APR pre-fills to 24, payment to 0, return to 7, horizon to 10, and the investment field mirrors the debt balance until touched. So the *required* user action is plausibly just one field (debt balance) plus pressing the button. But the *visible* field count is six, and under scarcity the bandwidth tax is paid on what the eye must process and decide whether to trust, not only on what the finger must type.
- **Tunneling risk:** The defaulted fields (APR 24%, return 7%) are silently doing heavy lifting in the result. A tunneled user accepts them without registering that the entire gap between the two curves is an artifact of "24% growing against me vs. 7% growing for me." She may read the output as a fact about her life rather than a consequence of two assumptions she never consciously chose. This is the central scarcity risk in the tool.
- **Present-bias risk:** **This is the tool's structural problem against this persona.** The tool's entire output is future-oriented: 5, 10, 20, 30-year horizons. The minimum horizon is 5 years; the default is 10. Mullainathan & Shafir's finding is explicit — under scarcity, forward planning is the *first* cognitive function to drop out. Dani is managing a 9-day window to rent. A tool whose smallest unit of insight is "in 5 years" is asking for the exact cognitive resource scarcity has already taxed away. The persona states plainly: "She cannot be asked to think about the future; she is in the present."
- **Finding: FLAG** — Input count exceeds the framework ceiling (mitigated by defaults but not eliminated), and the tool is inherently future-framed in a way that sits against the persona's present-tense cognitive state. Neither is a build defect; both are reasons this tool serves a *secondary* user better than it serves Dani-in-crisis. See Critical Findings #2 and #3.

---

## Financial Shame

- **Color architecture — a genuine strength.** I verified the tokens in `app.css`: `--terracotta` is aliased to `--pine` (#2C4A3B) and `--olive` to `--sage` (#6B8A78). The debt curve and the debt summary value are **dark green**, not red. The investment curve is **lighter green**. There is no red-box / frowning-icon verdict signaling anywhere. The framework (Dimension 2) names "a number in a red box" as the canonical shame trigger; this tool deliberately refuses it. The two curves are differentiated by shade within one calm color family. This is the single best shame-architecture decision in the tool and should be preserved exactly. (Note: this also raises a contrast question — see disability/QA handoff below — but as a *shame* decision it is correct.)
- **No benchmarks.** There is no "experts recommend paying off debt in X" anywhere. The 7% return is sourced and labeled as historical S&P average, not held up as a standard Dani is failing to meet. Pass against the "no benchmark unless it's the point" rule.
- **The result-note redirect — a strength.** "The point is the shape of the two curves, not an exact dollar prediction" actively pulls weight off Dani's specific numbers and toward the concept. This is good shame-protective design; it gives her permission to not internalize the dollar figure as a verdict on her.
- **Residual shame risk in the comparison itself.** Here is the unavoidable tension. Even with perfect copy and calm colors, the tool's output for Dani's real inputs is a chart where *her* line (the debt) climbs against her while a *hypothetical* line (money she doesn't have, invested) climbs for someone else. The Mint experience in the persona is the precedent: "It felt like a report card she didn't study for." A two-curve chart where the gap between "what is happening to me" and "what could happen for a person with capital" widens over 30 years is a structurally comparative image, even when no word on the page is comparative. The callout for the untouched-debt branch — "this debt could grow to about $X ... $Y invested at the same math could grow to about $Z" — is the moment of highest shame risk. It is factually neutral and copy-clean (Brand confirmed this), but the *juxtaposition* is the thing, and the juxtaposition is the point of the tool.
- **No structural-reality context note.** Dimension 2 asks: "When context is needed after a low result, the framing should attribute the pattern to structural mechanics, not to the user's behavior." The tool explains the *math* (monthly compounding, daily-compounding caveat) thoroughly. It never explains the *structure* — that high-APR debt is itself a product of having no buffer, that the gap is a feature of who has access to capital and who pays for the lack of it. Without that note, the most natural read of the widening gap is "I made a worse choice than the invested person," which is precisely the cultural message the persona has absorbed and the framework exists to interrupt.
- **Finding: FLAG** — Color and copy are strong and pass cleanly. The residual risk is in the premise (the comparison is inherently evaluative) and in the *absence* of a structural-reality note to catch a tunneled, shame-primed reader. See Critical Finding #1.

---

## Trust

- **Trust-building elements:** No login, no email, no account — confirmed, fully stateless. "Free, nothing saved" in the meta description is a strong trust signal. Copy reads like a person ("Leave at 0 to see what happens if the debt sits untouched"). Sources are linked and the credit-card caveat ("your actual balance may grow faster than this estimate") is honest in a way that *builds* trust by admitting the estimate understates real-world cost. The chart carries none of the user's input labels, so a screenshot doesn't disclose "my debt" — good for a shame-sensitive sharer.
- **Trust-breaking elements:** The 7% expected-return default is the one place trust is quietly at stake. To a user with rational distrust of financial systems, a tool that pre-fills "you could earn 7%" can read, for a beat, like the on-ramp to an investment pitch — the exact pattern (a calculator that ends in "talk to an advisor") the persona has been burned by. The tool does *not* do this — there is no product, no advisor, no upsell, and the signpost goes only to other free Finxiety tools. But the investment framing is the nearest thing in the tool to a "this looks like it leads to a product" signal, and it deserves to be watched.
- **Trust arc:** Dani arrives (if she arrives — see locus of control) curious or alarmed about her debt. The no-account, nothing-saved opening earns trust in the first 30 seconds. The result is honest and unsold. She likely ends with trust intact or slightly higher *in the tool*. Whether she ends with more agency is a separate question (below).
- **Finding: PASS** — Trust architecture is sound. The investment default is a minor watch-item, not a violation.

---

## Locus of Control

- **Does the output feel actionable or verdictive?** For Dani specifically, it leans verdictive. The tool quantifies how much her debt will cost her over 5–30 years and contrasts it with a gain she has no capital to capture. The "so what?" the framework requires (Dimension 4) is thin. The debt-paid-off branch *does* contain a genuine, earned insight — "paying the debt down stops it from running against you" — which is the one place the tool hands Dani something she can locate herself in: she has a monthly payment field, she can move it, she can watch the curve bend. That is the tool's strongest locus-of-control moment, and it only appears when she enters a payment large enough to retire the debt within the horizon.
- **The untouched / under-water branches are the problem.** If Dani enters her real minimum payment on a 24% balance — a payment that may be *below* the monthly interest — the debt curve grows despite her payments. The tool will faithfully show her a line climbing against her with no path drawn out of it. That is the framework's named failure mode: "The user sees a gap they cannot close, has nowhere to go next, and is worse off for knowing." The math is correct (QA confirmed the payment-below-interest case). The behavioral question is what the tool does *for her* at that moment, and the answer is currently: nothing beyond the number.
- **Path forward:** The only forward signal is the signpost footer (EMG-1, MYTH-1). Neither addresses debt. There is no bridge to debt-specific help.
- **Finding: FLAG** — The happy path (debt retired within horizon) leaves agency intact and even teaches something usable. The likely-for-Dani path (high APR, sub-interest payment, debt growing) leaves her with a verdict and no door. See Critical Finding #2.

---

## Cross-Tool Bridge

- **Near-equivalent result state:** When debt growth and investment growth are similar (similar rate, no payment), the two green curves nearly overlap. There is no special copy for this; the callout still reports both figures. This state is benign — it produces no shame and no alarm — but it also produces no insight ("they're about the same"), and the tool offers nothing for it. Low concern.
- **The state that matters — "debt is winning badly":** When the debt curve climbs steeply (high APR, low/no payment), the tool currently routes the user to the same generic signpost it shows everyone: Emergency Fund Checker and Myth Quiz. **Neither tool helps someone whose debt is compounding faster than they can pay it.** A person who just learned, concretely, that their $4,000 ER bill at 24% is structurally outrunning them needs a signal that *debt-relief options exist* — nonprofit credit counseling (NFCC), medical-bill negotiation/charity care, statute-of-limitations and validation rights, hardship programs. The framework is explicit (Dimension 4): "When the result is near-zero or reveals a significant gap, the tool surfaces relevant programs ... Not 'you should apply for X.' Rather: 'Programs that help in situations like this include X.'" The tool reveals exactly such a gap and does not bridge it.
- **Character of the current bridge:** Informational in tone (good — not directive), but **mis-targeted**. It bridges to adjacent *concept* tools, not to *help for the problem the tool just surfaced*.
- **Finding: FLAG** — The bridge exists and is correctly non-directive, but it does not connect the worst-case user to anything relevant to their actual situation. See Critical Finding #2.

---

## Enabling Environment (Matuschak)

- **Changed capability:** The tool can genuinely change one mental model — "compound interest isn't just a savings thing; it runs on debt the same way." For a user who has only ever heard compounding framed as a savings superpower, seeing the debt curve bend upward is a real conceptual revision. That is the tool's legitimate enabling claim, and it is not nothing.
- **The after-the-tab question:** What is different for Dani in 24 hours? Honestly assessed: she may look at her credit-card statement's APR with new attention. That is a plausible, modest, real change. But she cannot *act* differently — she can't invest money she doesn't have, and she can't pay down a debt faster than her budget allows. The risk is that the "aha" of the two curves produces the *feeling* of having learned something financially important without changing what she can do. The framework calls this the illusion of understanding, and it is a live risk here precisely because the insight is vivid and the action space is empty.
- **Active vs. passive:** The tool is more active than a static explainer — she enters numbers, she can drag the payment field and watch the debt curve bend. That payment-field interactivity is the one genuinely enabling element: it lets her *use* the idea, not just receive it. The tool would be meaningfully more enabling if it pointed her attention there ("change the monthly payment to see the curve bend").
- **Finding: FLAG** — Real conceptual gain, undercut for this user by an empty action space. The enabling potential is concentrated in the payment-field interaction, which the tool does not currently foreground.

---

## The Near-Zero / Worst-Case Result Test

Filled with Dani's plausible numbers — $4,000 debt, 24% APR, ~$60/month payment (below the ~$80/month interest), $0 she can realistically invest, default horizon:

1. **Information or verdict?** Verdict-leaning. A debt line climbing against her despite payments; an investment line she cannot author.
2. **Path forward?** No debt-relevant path. Signpost goes to unrelated tools.
3. **Structural reality or personal failure?** The tool explains the math, not the structure. Default read tilts toward personal failure.
4. **More informed and more capable, or less?** More informed about the *concept*; not more capable about *her situation*, and at some risk of feeling worse.

Per the framework: "If the answer to #4 is 'less' — the tool is not ready for distribution." My read is "informed but not more capable, with a real worse-off risk on the sub-interest-payment path." That is not a clean pass. It is the basis for the blocking finding below.

---

## Critical Findings

### HIGH — #1: No structural-reality note to catch the shame-primed reader on the debt-climbing result

**What it is:** The tool thoroughly explains the *math* of why the debt grows but never the *structure*. For a tunneled, shame-primed user (the persona's defined state), a widening gap between "my debt" and "money invested" reads as a personal-failure verdict by default. Dimension 2 requires that contextual notes after an adverse result attribute the pattern to structural mechanics, not behavior.
**Why it matters for this user:** Dani has absorbed the message that financial struggle is a personal failing and "doesn't fully believe" the counter-knowledge at 10pm looking at her balance. A two-curve chart is structurally comparative; without an explicit structural frame, it confirms her worst fear.
**Solution space (not prescriptive):** A brief, non-advice context line available on the debt-growing branches that names the mechanic structurally — e.g., something to the effect that high-interest debt grows this way *because* of the rate, that this is how these products are built, not a measure of the person. No "you should." No reassurance theater. One honest structural sentence. Brand and PM to wordsmith.

### HIGH — #2: Worst-case user (debt outrunning payments) has no relevant bridge

**What it is:** When the tool surfaces that a user's debt is compounding faster than they can pay it, the only forward signal is a signpost to EMG-1 and MYTH-1 — neither relevant to debt distress. The framework requires that a revealed gap be bridged to relevant programs informationally.
**Why it matters for this user:** This is the persona's actual situation (a medical bill at minimum payment). The tool draws a vivid picture of a problem and then points away from any help for it. "A result with no path forward is just a mirror. She knows what the mirror says. What she needs is a door."
**Solution space:** An informational (not directive) bridge surfaced on the debt-growing branches naming categories of help that exist — e.g., nonprofit credit counseling (NFCC), medical-bill charity care / financial assistance, hardship and validation rights. Framed as "help in situations like this includes…," never "you should." If a future Finxiety debt-relief or benefits tool (BEN-1) is in scope, route there. PM to scope; this need not block on a tool that doesn't exist yet, but *some* relevant door must exist before distribution.

### MEDIUM — #3: Present-bias / horizon floor sits against the persona's cognitive state

**What it is:** Minimum horizon is 5 years, default 10. The tool's smallest unit of insight is multi-year. Under scarcity, forward planning is the first cognitive function to drop.
**Why it matters:** Dani-in-crisis (the more reachable Dani, per the trigger calendar) is in a present-tense, tactical state. A 5-year-floor tool may simply not land for her. This is more an audience-fit observation than a defect: DEBT-VIZ-1 likely serves the *curious / stabilizing* user better than the *crisis* user, and that's acceptable if the suite as a whole catches the crisis user elsewhere. Flag for PM positioning, not necessarily a copy change.
**Solution space:** Consider whether a shorter horizon (1 yr) communicates the "debt is growing now" reality in present-tense terms. Optional; PM call.

### MEDIUM — #4: Six visible inputs exceed the three-input framework ceiling

**What it is:** Dimension 1 caps a first result at three inputs; the form shows six. Defaults mitigate the *required* action to roughly one field, but the visible decision surface is double the ceiling.
**Why it matters:** Each visible field is a bandwidth cost and a "is this for me?" judgment for a distrustful, taxed user. The mitigation (smart defaults + investment mirroring) is genuinely good and probably keeps abandonment acceptable, but the gap from the framework standard should be acknowledged rather than waved through.
**Solution space:** Consider progressive disclosure — debt balance + APR visible first; payment, investment, return, horizon behind a "refine" affordance. Optional; the current defaults are a defensible alternative. PM/UX call.

### LOW — #5: Enabling interaction (payment field) is not foregrounded

The payment field is the one element that lets the user *use* the idea (drag it, watch the curve bend). Nothing directs attention to it. A light cue ("change the monthly payment to see the curve bend") would convert a passive reveal into an active manipulation. Optional enhancement.

---

## What the Tool Does Well for This User

- **The color decision is exemplary.** Debt and investment are two shades of the *same* calm green, not red-vs-green. This is the most important shame-architecture choice a debt tool can make, and it was made correctly. Preserve it.
- **No verdict signaling anywhere** — no red boxes, no icons, no grades, no benchmark the user is failing.
- **The result-note redirect** ("the point is the shape, not an exact dollar prediction") actively defuses the report-card reflex that closed Mint for Dani.
- **Estimate labeling is thorough and honest** — including the credit-card caveat that admits the estimate *understates* real cost, which builds trust by under-promising.
- **Fully stateless, no account, "Free, nothing saved"** — earns trust in the first 30 seconds exactly as the persona requires.
- **Chart carries no input labels**, so a screenshot doesn't disclose "my debt" — quietly protects a shame-sensitive sharer.
- **The payment field is genuinely enabling** — it lets the user manipulate the idea, not just receive it. It is the tool's best Matuschak-aligned feature.
- **The debt-paid-off branch** teaches a real, usable, self-locatable insight without ever saying "you should."

---

## Sign-Off Status

The build is clean, the copy is careful, and the color and trust architecture are strong. The blockers are not defects — they are gaps between what the tool *shows* this specific user and what it *gives* her. Two HIGH findings touch the core Do No Harm / locus-of-control obligation for the worst-case (and most common, for Dani) result state: a debt-climbing chart with no structural framing and no relevant door. Per the Near-Zero Result Test, that combination does not clear the bar for distribution.

⟦BEHAVIORAL-BLOCKED⟧ tool="debt-growth" ticket="DEBT-VIZ-1" date="2026-06-21"

**Blockers (must resolve before ⟦BEHAVIORAL-REVIEWED⟧):**
1. **HIGH** — Add a structural-reality context note on the debt-growing result branches (non-advice, attributes the pattern to the mechanics of high-interest debt, not to the user). Finding #1.
2. **HIGH** — Add a relevant, informational forward bridge for the worst-case (debt-outrunning-payments) state — categories of debt help that exist, framed as "help in situations like this includes…," never "you should." Finding #2.

**Non-blocking flags for PM/UX/Brand:** #3 (horizon floor / present-bias positioning), #4 (input count vs. framework ceiling — accept-with-rationale is viable given the defaults), #5 (foreground the payment-field interaction).

Re-run this gate after the two HIGH findings are addressed. The math, color architecture, trust signals, and estimate labeling all pass and do not need re-review — only the two added copy/bridge elements require re-verification.

---

## Re-Verification — 2026-06-21

**Reviewer:** behavioral-science agent
**Scope:** Only the two HIGH blockers. Math, color architecture, trust signals, and estimate labeling were passed on the prior run and are not re-reviewed.
**File re-read:** `finxiety/src/routes/tools/debt-growth/+page.svelte`

### Conditional gating — verified

Both new elements are wrapped in a single `{#if debtWinning && !debtPaidOff}` block (line 450), rendered below the winner row:
- `debtWinning` is `debtEnd > investmentEnd` (line 111) — true only when the debt curve ends above the investment curve.
- `debtPaidOff` is `submitted && debtEnd === 0` (line 114).

This gives the correct three-way behavior:
- **Debt winning, not paid off** → both the structural note and the debt-distress bridge render. Correct.
- **Investment ahead** (`debtWinning` false) → neither renders. Correct — a user who is "ahead" is not shown debt-distress framing or a credit-counseling bridge.
- **Debt paid off** (`debtEnd === 0`) → neither renders; the callout and winner row switch to the paid-off branch ("paying the debt down stops it from running against you"). Correct — the structural/distress framing does not appear for the success case.

No leakage into the benign or happy-path states. This was the specific risk to check, and it is clean.

### HIGH #1 — Structural-reality note — RESOLVED

Rendered text (lines 451–453):
> "When a payment falls below the monthly interest charge, the balance grows regardless of payments made — that's a math constraint, not a reflection of effort. High-APR debt can put payments in this position quickly."

This resolves Finding #1 on every axis the blocker named:
- **Attributes the pattern to structure, not behavior.** "A math constraint, not a reflection of effort" is the exact structural-vs-personal reframe Dimension 2 requires. It names the mechanic (payment below the interest charge) as the cause, and explicitly disclaims effort/character as the cause. For the shame-primed reader described in the persona — who "doesn't fully believe" the counter-knowledge at 10pm — this is the sentence that interrupts the default "I made a worse choice than the invested person" read.
- **Do No Harm compliant.** No "you should," no directive, no urgency. It is a structural fact stated plainly. "High-APR debt can put payments in this position quickly" describes how the product behaves, not what the user did wrong.
- **Placement is correct.** It sits directly under the winner row, in the visual zone where a tunneled user lands after reading "Debt ahead by ~$X." It catches the reader at the moment of highest shame risk — the exact moment the prior review flagged.

Minor note (non-blocking): the note is keyed to the sub-interest-payment mechanic specifically. In the `debtUntouched` case (payment = 0), the debt also climbs and the note still fires correctly via `debtWinning`, and the "a payment falls below the monthly interest charge" phrasing still reads sensibly as the general principle ($0 is below any interest charge). No change needed.

### HIGH #2 — Debt-distress bridge — RESOLVED

Rendered text (lines 454–456):
> "If the debt curve is climbing faster than payments are holding it down, a nonprofit credit counselor can look at the full picture. The National Foundation for Credit Counseling (nfcc.org) offers free or low-cost help. The Benefits Screener can also check whether programs are available that free up monthly cash."

Links verified in source: NFCC → `https://www.nfcc.org` (external, `rel="noopener noreferrer"`, new tab); Benefits Screener → `/tools/screener` (route confirmed to exist on disk).

This resolves Finding #2:
- **Relevant to the surfaced problem.** This is the core fix. The prior bridge sent a debt-distressed user to EMG-1 / MYTH-1, neither of which touches debt. The new bridge names debt-specific help that actually exists: nonprofit credit counseling (NFCC), and a second door (the Benefits Screener) framed around the real mechanism that helps — freeing up monthly cash. For Dani carrying a $4,000 medical bill at minimum payment, these are doors that fit the problem the chart just drew.
- **Informational, not directive.** "A nonprofit credit counselor can look at the full picture" and "offers free or low-cost help" describe what exists. The Screener line is "can also check whether programs are available" — capability, not instruction. There is no "you should call," no "apply now," no urgency. Do No Harm compliant.
- **Warm handoff, not an ad.** NFCC is a nonprofit, free/low-cost, named honestly. The Screener is an internal free tool. Nothing routes to a product, an advisor upsell, or a lead-capture form — preserving the trust architecture the prior review praised.
- **Generic signpost-footer is untouched and still present.** The original EMG-1 / MYTH-1 footer remains at the page bottom for all users. That is fine: it is no longer the *only* door for the debt-distress user, which was the defect. The debt-distress user now gets a targeted, relevant bridge *plus* the general footer. The blocker was the absence of a relevant door; that absence is resolved.

### Re-scored dimensions

- **Financial Shame:** prior FLAG → now substantively addressed. The structural note supplies the missing structural-reality frame that was the residual risk. The juxtaposition of the two curves remains inherently comparative (a property of the tool's premise, not a defect), but the note now catches the shame-primed reader at the point of impact. No HIGH/Critical residue.
- **Locus of Control:** prior FLAG → improved. The worst-case branch now ends with a path forward (NFCC + Screener) rather than a bare verdict. "What she needs is a door" — there is now a relevant door.
- **Cross-Tool Bridge:** prior FLAG → resolved. The bridge is now both non-directive *and* correctly targeted to the surfaced problem.

### Remaining non-blocking flags (unchanged, for PM/UX/Brand)

#3 (horizon floor / present-bias positioning), #4 (six visible inputs vs. three-input ceiling — accept-with-rationale viable given defaults), #5 (foreground the payment-field interaction). None block distribution; all are PM/UX positioning calls.

### Sign-Off

Both HIGH blockers are resolved. Both new elements are correctly gated to the debt-winning, not-paid-off state and do not leak into the investment-ahead or paid-off states. The structural note attributes the climbing-debt pattern to math/structure rather than effort, and the bridge provides a relevant, informational, non-directive door out. Framing is Do No Harm compliant throughout.

⟦BEHAVIORAL-REVIEWED⟧ tool="debt-growth" ticket="DEBT-VIZ-1" date="2026-06-21"
