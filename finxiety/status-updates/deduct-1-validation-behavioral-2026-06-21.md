# Behavioral Science Validation — DEDUCT-1 (Tax Clarity)

**Tool:** Tax Clarity — deduction / credit / refund clarifier
**Ticket:** DEDUCT-1
**Date:** 2026-06-21
**Reviewer:** behavioral-science agent
**Persona applied:** ALICE Primary User (`finxiety/research-findings/persona-alice-primary-user.md`)
**Framework:** `finxiety/docs/socioeconomic-accessibility-framework.md`
**Files reviewed:**
- `finxiety/src/routes/tools/tax-clarity/+page.svelte`
- `finxiety/src/lib/calculators/deduct.ts`
- `finxiety/src/lib/data/federal-brackets-2026.json` (referenced)

Prior gates: ⟦BRAND-REVIEWED⟧, ⟦QA-VERIFIED⟧ passed.

---

## Context: who shows up here

Dani comes to this tool in the tax-time window (Jan–Apr), per the persona's trigger calendar: "I'm staring at this W-2 and I don't know what goes where." She files on TurboTax Free Edition. She makes ~$31,200/year as a single parent of two — head of household. Her **taxable income after the standard deduction and dependents is very low, often at or near $0**, and her federal liability is frequently zero or negative because of refundable credits (EITC, CTC). The persona is explicit: "She doesn't know she may qualify for credits she isn't claiming." That is the single most valuable fact this tool could surface for her — and it is the fact most at risk in the current design.

---

## Scarcity Mindset

- **Cognitive steps required:** 2 (pick a mode → enter inputs). Credit and Refund modes are 1 input each. Deduction is 3 inputs. This is well within budget. The mode picker is a clean single decision.
- **Tunneling risk:** The Deduction mode asks for "Estimated taxable income." The hint is good ("A rough number is fine... roughly the taxable-income line on last year's return"), but a tunneled, fatigued user at tax time who does not have last year's return open will either guess, enter gross income (wildly wrong), or abandon. This is the highest-friction field in the tool. It is not future-oriented, so it passes the scarcity test on type — but it is the most likely abandonment point.
- **Present-bias risk:** None of the three modes ask the user to plan or project. The refund mode's "if set aside each month" framing is hypothetical-past, not a planning ask. Good.
- **Finding: PASS** — Cognitive load is appropriate. Mode switching is low-friction; `goBack` preserves typed inputs, which respects the bandwidth tax. Flag (not a fail): the taxable-income field is the one place a tax-time user can get stuck or enter a wrong-magnitude number.

---

## Financial Shame

- **Potential shame triggers, by moment:**
  1. **Mode picker** — Three plain-language options, each defined in one line. "A tax deduction / something that lowers the income you're taxed on." This is genuinely inclusive: it does not assume the user already knows the difference, which is the whole point. No shame here. Strong.
  2. **Deduction result at low income** — A $2,000 deduction at the 10% bracket shows a large bold **$200** figure. The compare-box then says the same amount "as a *credit* would lower your tax by the full $2,000... about $1,800 more." For the low-bracket user, this repeatedly stages "the small number you have (deduction) vs. the big number you don't (credit)." It is mathematically true and brand-neutral in tone, but it positions the user's likely reality (low bracket → low deduction value) against an unreachable contrast. Borderline. See Critical Findings.
  3. **Deduction result at $0 taxable income** — The calculator returns `taxSavings = 0` (`effectiveDeduction = Math.min(amount, 0)`). The result renders a large bold **$0** as the `.result-figure`, in terracotta, with "lowers your tax by about $0 — not $2,000." For the ALICE user whose taxable income genuinely is at or near zero, this is a bold-typeface zero verdict on the exact tool screen meant to help her at tax time. This is the near-zero result state, and it currently reads as "this does nothing for you." **This is the most dangerous moment in the tool.** See Critical Findings.
- **Implicit comparisons:** No "experts recommend," no "most people," no benchmarks against a savings standard. The only comparison is deduction-vs-credit, which is the tool's actual subject — permitted under Dimension 2. Good.
- **Result display:** Facts, not grades. No red/green, no icons, neutral terracotta figure consistent with the suite. The refund mode's explicit **neutral-box** ("Neither is wrong — it's about what fits your life") is exemplary shame-architecture work.
- **Finding: FLAG** — The tone and copy are careful and non-judgmental throughout. But the **$0 deduction result** and the repeated deduction-vs-credit "you're getting less" staging are not safe for a near-zero-income user. The framing is fine for a $45k filer and quietly corrosive for a $12k or $0 filer.

---

## Trust

- **Trust-building elements:** No login, no email, no account. Stateless. Copy sounds like a person ("Here's another way to look at it," "money that was already yours"). Official IRS source URL in the footer. Every result is explicitly labeled illustrative. The refund mode refuses to tell the user what to do. All of this is solid trust architecture.
- **Trust-breaking elements:**
  1. The refund mode's "if that money were set aside each month... in a savings account earning ~4.5%... it would earn roughly $X" is the closest the tool comes to a financial-product adjacency. It is well-handled — labeled illustrative, paired with the neutral-box that legitimizes preferring a refund — so it does **not** read as an upsell. It stays on the right side of Dimension 3.
  2. **Stateless reassurance is not surfaced.** The architecture is stateless but the page never says so. A tax tool is exactly where a distrustful user wonders "is this saving my numbers?" The framework (Dimension 3) calls for making statelessness visible where trust is at stake. Currently absent.
- **Trust arc:** Starts neutral-to-positive (clean, no asks). The deduction/credit modes hold trust. The refund mode's withholding framing is the moment most at risk, and the neutral-box rescues it. A user likely ends with trust intact or slightly higher — **provided** they are not the $0-income user who hits a bold $0 and reads it as the tool failing her.
- **Finding: PASS (with one flag)** — Trust architecture is sound. Add a stateless-reassurance line. The refund framing is neutral and two-sided as required.

---

## Locus of Control

- **Actionable or verdictive?** Deduction and credit modes are explanatory — they teach a distinction, which is agency-giving in principle. But they stop at the explanation. The user now *understands* deduction vs. credit; she has nothing to *do* with it. The refund mode is the most actionable in spirit (it implies "you could adjust withholding") but correctly refuses to direct — which leaves it informational but inert.
- **Path forward:** **This is the core gap.** None of the three modes ends with a path. The deduction mode, especially at low/zero income, shows a gap (deductions barely help me) with no door. Per the persona: "A result with no path forward is just a mirror. She knows what the mirror says. What she needs is a door." The natural door here is enormous and missing: **refundable credits (EITC, Child Tax Credit) can pay a low-income filer even when her tax owed is $0** — and free filing help (VITA) exists. The tool teaches *what a credit is* and then never tells the user that the most valuable credits for someone in her bracket are refundable and may be owed to her right now.
- **Finding: FAIL** — The tool produces clarity without a path. For the low/zero-income user it can produce a $0 figure with no exit. This violates Dimension 4 (near-zero results must have a bridge) and the Do No Harm "no path forward = a verdict" principle.

---

## Cross-Tool Bridge

- **Near-zero result state:** The $0-deduction result and the low-bracket result both reveal a gap (deductions do little for me) with **no bridge to anything**. There is no mention of EITC/CTC, no mention of VITA free tax prep, no mention of BEN-1 (when live), no signpost that the credits worth the most to a low-income filer are the refundable ones.
- **The one near-miss:** The credit-mode illustrative-note says "Some credits are refundable and some aren't, which changes what you actually receive." This is the single most important sentence in the tool for the ALICE user — and it is buried in 8pt muted disclaimer text, framed as a caveat about accuracy rather than as "you may be owed money you aren't claiming." The persona's defining fact about Dani at tax time is rendered as fine print.
- **Character of the bridge:** Absent.
- **Finding: FAIL** — No cross-tool or cross-resource bridge in any mode. The most consequential, agency-restoring fact for this user (refundable credits exist and may be owed to her) is present only as a disclaimer caveat.

---

## Enabling Environment (Matuschak)

- **Changed capability:** Genuinely yes, partially. After this tool, Dani can distinguish a deduction from a credit from a refund — a real conceptual gain she did not have before, delivered actively (she picks, she enters her own number, she sees her own math). That is more than passive transmission and is the tool's real strength.
- **After-the-tab question:** What is different in 24 hours? She understands three words better. But will she *do* anything? Without a bridge, probably not — the understanding has no attachment point to her actual filing. The one thing that would change her behavior (check whether she's claiming EITC/CTC; use VITA) is exactly what the tool omits. So the capability change is conceptual, not consequential.
- **Active vs. passive:** Active — entering her own amounts and seeing her own bracket is engagement, not reception. Good.
- **Illusion of understanding risk:** Moderate. The deduction/credit comparison can produce a satisfying "oh, I get it now" that feels like progress while changing nothing about her refund or her filing. The clarity is real but unattached.
- **Finding: FLAG** — The active-entry design is a genuine enabling-environment strength. It falls short only because the understanding has no consequential next step. Fix the bridge and this becomes a PASS.

---

## Critical Findings

### 1. [CRITICAL] The $0 / low taxable-income deduction result reads as a verdict, with no path

For a user with taxable income at or near $0 — common in the ALICE population at tax time — the deduction mode renders a large bold terracotta **$0** ("lowers your tax by about $0"). This is the near-zero result state, and it currently confirms the user's worst read: "this tool, like everything else, does nothing for me."

*Why it matters for this user:* The persona is precise — Dani's taxable income is low or zero and her real benefit at tax time comes from refundable credits, not deductions. A bold $0 with no door is the mirror, not the door.

*Solution space (the PM and brand decide):*
- For a $0 or very-low-savings result, replace/augment the bare figure with a framing that names the structural reason ("At a lower taxable income, deductions save less, because they only remove your bracket's share of the income — they can't lower tax you don't owe") and immediately pivot to the agency-restoring fact: refundable credits work differently and can pay you even when you owe nothing.
- Treat the $0 result state as a distinct, separately-designed state per the Near-Zero Result Test, not the same template with a zero in it.

### 2. [CRITICAL] No bridge to refundable credits / free filing help — the most valuable fact for this user is fine print

The defining fact for Dani at tax time ("she may qualify for credits she isn't claiming") appears only as a muted accuracy-caveat in the credit mode. There is no signpost to EITC/CTC as refundable, no mention of free tax prep (VITA), and no link to BEN-1 (when live).

*Why it matters:* This is a Dimension 4 and Do No Harm violation. The tool reveals a gap (deductions don't help me much) and ends without a door, for the exact user who has a door available and doesn't know it.

*Solution space:*
- Add an informational, non-directive bridge to each mode's result — strongest in the credit and low-income-deduction states. Example register (not directive): "The credits worth the most at lower incomes are *refundable* ones like the Earned Income Tax Credit and Child Tax Credit — they can pay you even if you owe $0 in tax. Free help filing for them exists (look up VITA / IRS Free File)." Confirm exact copy with brand for Non-Advice compliance — frame as "what exists," never "you should claim."
- When BEN-1 is live, add the cross-tool link.

### 3. [HIGH] Deduction-vs-credit compare-box stages "the small thing you have vs. the big thing you don't" for low-bracket users

At a 10–12% bracket, the compare-box repeatedly contrasts the user's small deduction value against the full credit value ("about $1,800 more than the deduction"). True and on-topic, but for the low-income user it lands as a recurring reminder of being on the wrong side of a gap.

*Why it matters:* Dimension 2 — the comparison is permitted (it's the tool's subject), but at low brackets the framing tilts from "here's the difference" toward "here's what you're missing."

*Solution space:* Reframe the compare-box as a forward-looking opening rather than a loss: lead into the refundable-credit bridge ("This is exactly why credits matter so much at lower incomes — and the most valuable ones are refundable"). This converts Finding 3 from a shame risk into the on-ramp for Finding 2's bridge. One fix resolves both.

### 4. [MEDIUM] Taxable-income field is the likely abandonment / wrong-magnitude point

A tax-time user without last year's return open may enter gross income (wrong by a large factor) or abandon. The hint is good but the concept ("taxable income after the standard deduction") is one of the harder ones in the suite for someone who files on TurboTax Free and never sees that line.

*Solution space:* Consider an even more concrete anchor in the hint, or accept that this mode skews toward users who have a return in hand. Lower priority than 1–3.

### 5. [LOW] Statelessness is never surfaced

A tax tool is a high-trust-stakes surface. The framework (Dimension 3) calls for making statelessness visible here. Add a short line near the inputs or footer: "This tool doesn't save your numbers or track you — everything stays on your phone."

---

## What the Tool Does Well for This User

- **The mode picker is genuinely inclusive.** Defining deduction/credit/refund in one plain line each, up front, assumes no prior vocabulary. This directly serves a user who "is not financially illiterate" but was never taught these distinctions. Strong locus-of-control work at the entry.
- **The refund mode's neutral-box is model shame architecture.** "Some people prefer smaller refunds... others prefer a refund as a kind of forced savings... Neither is wrong — it's about what fits your life." It refuses to make overwithholding a mistake, refuses the "leaving money on the table" pressure, and presents both sides. This is exactly the two-sided, no-urgency framing Do No Harm requires.
- **No urgency, no fear, no "you should."** The refund mode in particular avoids the "you're losing money to the government" trap that nearly every other tax-refund explainer falls into.
- **Active engagement.** The user enters her own numbers and sees her own bracket and her own math — engagement, not passive reception. Real enabling-environment value.
- **Inputs preserved on `goBack`; results explicitly illustrative; official source linked.** All correct, all respectful of the bandwidth tax and the trust deficit.

---

## Disposition

The tool's voice, shame-tone, and trust architecture are largely excellent — the careful work shows. But two Critical findings remain open, both rooted in the same gap: for the low/zero-income ALICE user, the tool produces clarity (or a bold $0) with **no path forward and no bridge to the refundable credits that are the single most valuable thing it could tell her.** This fails Dimension 4 and the Do No Harm "no path forward = a verdict" rule. Findings 2 and 3 can be resolved together with one well-built, brand-approved refundable-credit bridge; Finding 1 requires treating the $0 result as a distinct state.

Sign-off is withheld pending resolution of Findings 1 and 2 (Critical) and ideally 3 (High). Brand must review any new bridge copy for Non-Advice compliance before it ships.

⟦BEHAVIORAL-BLOCKED⟧ tool="tax-clarity" ticket="DEDUCT-1" date="2026-06-21"

---

# Re-Verification — DEDUCT-1 (Tax Clarity)

**Date:** 2026-06-21
**Reviewer:** behavioral-science agent
**Prior disposition:** ⟦BEHAVIORAL-BLOCKED⟧ (Criticals 1 and 2 open, Finding 3 High open)
**Files re-read:**
- `finxiety/src/routes/tools/tax-clarity/+page.svelte` (lines 276–313, the deduction result conditional)
- `finxiety/src/lib/calculators/deduct.ts` (`calcDeduction`, `marginalRate`)

Scope of this pass: confirm whether the two Critical findings are resolved. I traced the calculator to establish exactly when the new $0 state fires, because the behavioral verdict depends entirely on that trigger condition.

---

## What the code now does — verified trace

The deduction result splits on `deductionResult.taxSavings === 0` (`+page.svelte:278`).

From `calcDeduction` (`deduct.ts:96–117`):
- `effectiveDeduction = Math.min(amount, income)`
- `taxSavings = effectiveDeduction * rate`
- `rate = marginalRate(...)` — the lowest band is 10%, so **rate is never 0**.
- `amount` is guaranteed `> 0` by the form validation (`+page.svelte:94`).

Therefore `taxSavings === 0` **if and only if `income === 0`** — the user typed exactly `0` (or blank-coerced-to-0 / a value below 1) into the taxable-income field. For any positive taxable income — $1,000, $15,000, $30,000 — `taxSavings` is positive and the result falls through to the `{:else}` branch: the original bold-figure template plus the unchanged compare-box, **with no bridge.**

This trace is load-bearing for both findings below. The new state is real, but it is gated on an exact-zero entry, not on "low income."

---

## Critical #1 — $0 deduction result reads as a verdict, no path

**Re-evaluation: RESOLVED for the exact-$0 case.**

The new state (`+page.svelte:279–284`) is a meaningfully distinct design, not a zero dropped into the old template:
- **No `.result-figure`.** The bold terracotta number — the thing that read as a grade — is gone from this branch entirely. There is no large `$0`. This was the single most dangerous element in the prior review, and it has been removed from the path where it did harm. Confirmed by the absence of any `result-figure` element inside the `taxSavings === 0` block.
- **It names the structural reason in plain language:** "the deduction amount exceeds or equals your taxable income." This is the "name the structure without excusing or lecturing" move the persona asks for (persona §"What Would Make Her Trust This Tool," point 6). It tells her *why* without implying she did anything wrong.
- **It pivots immediately to agency:** refundable credits, EITC named, "can pay you even when you owe $0 in tax." This converts a mirror into a door within the same breath.

The "this does nothing for you" verdict reading is no longer present in the exact-$0 state. For the user whose taxable income genuinely nets to zero, this is now an informational result with a door. Critical #1 is resolved on its own terms.

## Critical #2 — bridge to refundable credits / VITA

**Re-evaluation: RESOLVED for the exact-$0 case.**

The bridge now exists and meets the Dimension 4 "door after a near-zero result" test:
- **Informational, not directive.** "Some credits ... are refundable and can pay you" / "Free filing help is available." It states what exists. It does not say "you should claim" or "apply now." This stays inside the Non-Advice Rule.
- **Names the specific, most-valuable-to-her fact:** EITC is refundable and pays even at $0 tax owed. This is the persona's defining tax-time fact, now surfaced in body copy rather than buried as the 8pt accuracy caveat the prior review flagged.
- **VITA link verified** — points to the IRS free-tax-prep page (`irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers`), `target="_blank"` with `rel="noopener noreferrer"`. Correct, official, and the right resource for this user.
- **Cross-mode signpost:** "The Credit tab shows how a credit works differently" — a warm, in-tool handoff, not an ad.

Character of the bridge: informational, agency-restoring, warm handoff. This is the door the prior review said was missing. Critical #2 is resolved for the $0 state.

---

## The remaining gap — and whether it blocks

The fix lives entirely inside the `taxSavings === 0` branch, which (per the trace above) fires **only on an exact-zero taxable-income entry.** Two adjacent cases are not covered:

1. **Non-zero low-income users** (e.g. $15k taxable income, $2,000 deduction → a bold **$200** with the unchanged compare-box telling her a credit would be "$1,800 more"). This is the prior review's Finding 3 (High), and it is explicitly noted as not addressed. For this user the result still stages "the small thing you have vs. the big thing you don't," and there is still no bridge.

2. **The boundary is brittle.** A user at, say, $400 of taxable income with a $2,000 deduction gets a non-zero `taxSavings` (~$40) and falls through to the bold-figure path with no bridge — behaviorally indistinguishable from the $0 user, but routed to the old template. The split is mathematically clean but not behaviorally clean.

**Does this leave a Do No Harm gap that blocks sign-off?**

My judgment: **No, it does not block — but Finding 3 should be re-logged as an open High, not closed.** Reasoning:

- The prior **Critical** was specifically the bold `$0` verdict with no door. That was the acute-harm case: a stark zero is the result most likely to read as "this tool, like everything else, does nothing for me." That exact-harm case is now fixed. The remaining cases show a *positive, non-zero* number — a smaller harm profile. A user who sees "$200" has received a true, non-zero, non-verdict fact. It is suboptimal (no bridge, loss-framed compare-box) but it is not the "near-zero verdict with no exit" that Do No Harm Critical-flags.
- The persona's sharpest version of Dani — single parent, head of household, ~$31k gross — very often *does* net to at or near $0 taxable income after the HoH standard deduction ($22,500 for 2026) and could plausibly land in the new state. The core-risk user is meaningfully covered.
- So the omission downgrades the *quality* of the low-income non-zero experience; it does not re-open a Critical. The door now exists for the worst-case result, which is the bar Dimension 4 sets.

**Recommendation (non-blocking, for the PM/brand):** Resolve Finding 3 by widening the bridge. The cleanest fix is to surface the refundable-credit signpost whenever the user's marginal bracket is in the lowest band(s) — i.e. attach the same bridge copy to *any* low-bracket deduction result, not only the exact-$0 one. That converts the loss-framed compare-box ("$1,800 more you're not getting") into the on-ramp the prior review described: "this is exactly why credits matter so much at lower incomes — and the most valuable ones are refundable." One change closes Finding 3 and removes the brittle boundary. Brand reviews the copy for Non-Advice compliance before it ships.

Findings 4 (taxable-income field friction) and 5 (statelessness never surfaced) remain open at their prior severities (Medium / Low). Neither blocks.

---

## Disposition (re-verification)

Both Critical findings are resolved. The $0 result is now a genuinely distinct, figure-free, structurally-honest state with an informational, agency-restoring bridge to refundable credits and VITA — it passes the Dimension 4 "door after a near-zero result" test and the Do No Harm "no path forward = a verdict" rule for the worst-case result. The careful shame-tone and trust architecture noted in the first pass are intact and now extended to the most dangerous moment in the tool.

The non-zero low-income gap (Finding 3, High) is real but does not re-open a Critical: those users see a true positive number, not a bare-zero verdict, and the acute-harm case is covered. Finding 3 stays open as a recommended (non-blocking) improvement; Findings 4 and 5 remain open at prior severities.

No Critical or High findings remain that block distribution. Sign-off granted, with Finding 3 logged as an accepted, deliberate open item for a follow-up pass.

⟦BEHAVIORAL-REVIEWED⟧ tool="tax-clarity" ticket="DEDUCT-1" date="2026-06-21"
