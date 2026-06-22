# Brand Review: DEBT-VIZ-1 — Debt vs. Growth Compound Visualizer

**Date:** 2026-06-21  
**Reviewer:** Brand agent  
**Source file:** `finxiety/src/routes/tools/debt-growth/+page.svelte`  
**Brand source:** `tsunam_vault/finxiety/Finxiety — Brand & Mission.md`  
**QA status:** ⟦QA-VERIFIED⟧ (passed prior to this review)

---

## Voice Violations

None found.

The tool's copy is clean throughout. Specific callouts:

- H1 ("Debt vs. Growth Visualizer") and meta description are plain and accurate — they describe what the tool does without overpromising, inflating, or using prohibited vocabulary.
- Field hints are short, direct, and informative. "Leave at 0 to see what happens if the debt sits untouched." — exactly the right register.
- Submit CTA ("Show me both curves") is functional rather than motivational. It describes the action, not an outcome.
- Tool description paragraph avoids every prohibited word. It explains the mechanic once, plainly, then stops.

---

## Do No Harm Flags

None found.

Worked through each callout branch:

**debtPaidOff branch (line 398):**
> "At [amount]/month, this debt is paid off before [years] years are up — the curve reaches $0. Meanwhile [amount] invested at the same math could grow to about [amount]. Compound interest runs in both directions; here, paying the debt down stops it from running against you."

This describes what the model shows. It does not say "pay off your debt." The phrase "paying the debt down stops it from running against you" is a description of the mathematical relationship, not a directive. It passes.

**debtUntouched branch (line 404):**
> "Left untouched, in [years] years this debt could grow to about [amount]. [amount] invested at the same math could grow to about [amount] — compound interest runs in both directions."

Neutral framing. No implied verdict. No shame. Passes.

**default branch (line 412):**
> "In [years] years, after [amount]/month in payments, this debt could stand at about [amount]. [amount] invested at the same math could grow to about [amount] — compound interest runs in both directions."

Same pattern. Describes the model output only. Passes.

No branch tells the user what to do with the information. The Non-Advice Rule is intact.

---

## Check-by-Check Findings

**1. Voice: plain, direct, warm. No motivational language, no urgency.**
Pass. The tool description, labels, hints, callouts, and sources section are all written in the correct register. Nothing reads like a finance podcast or a nonprofit brochure.

**2. Do No Harm: No recommendations or financial strategy advice.**
Pass. Confirmed across all three callout branches above.

**3. Non-Advice Rule: The tool explains how compound interest works; it does not tell the user what to do.**
Pass. The tool description explicitly frames this as a "see both on one chart" exercise, not a decision prompt. The callout copy describes what the math shows. The user draws their own conclusions.

**4. Estimate labeling.**
Pass. Three mechanisms layer here: the results-note paragraph ("These are estimates based on the rates you entered... Real debt and real investments vary."), the tilde prefix on every summary value (~$X), and the inline "estimated" tag on each summary figure. This is thorough.

**5. Time horizon toggle: does the copy create false urgency?**
Pass. The toggle is labeled "Time horizon" with no surrounding copy. The horizon options are labeled "5 yr / 10 yr / 20 yr / 30 yr" — neutral, factual. No surrounding language implies that any horizon is more urgent or correct.

**6. Chart copy: does anything around the visualization shame the user for having debt?**
Pass. The legend reads "Debt balance" and "Same amount invested" — descriptive only. The chart heading is "Over [X] years." The results-note says "The point is the shape of the two curves, not an exact dollar prediction." This is the opposite of shaming — it actively redirects focus away from the user's specific numbers and toward the conceptual pattern.

**7. Official source URLs present?**
Pass. Two sources are linked in the sources section: Investor.gov compound interest calculator and the historical S&P 500 returns page. A third note ("Check your own statement for the exact terms") correctly points the user toward their own documentation for credit card specifics — appropriate because no single URL covers every card.

**8. Zero/small debt path: does $0 produce shame or broken copy?**
The submit button is disabled when `debtBalanceStr === ''` or `debtBalance <= 0` (line 50-52: `canSubmit` requires `debtBalance > 0`). A $0 entry never reaches the results section. The user sees the inline hint "Enter a debt balance and an amount to invest to continue." — neutral, non-shaming, accurate. No broken copy, no conditional callout that could misfire.

One edge note: a user with truly negligible debt (e.g., $1) can submit and will see a valid result. The math will show a near-flat debt curve and a growing investment curve. No copy in any branch is contingent on debt size, so this path produces no shame copy. It is handled gracefully.

**9. Tool name, H1, meta description: on-brand?**
Pass.
- Page title: "Debt vs. Growth Visualizer | Finxiety" — accurate, descriptive, no inflation.
- H1: "Debt vs. Growth Visualizer" — matches the page title, describes the tool.
- Meta description: "See compound interest run in both directions: a debt balance growing against you, and the same amount invested growing for you, on one chart. Free, nothing saved." — plain, accurate, no prohibited vocabulary. "Free, nothing saved" is a trust signal consistent with Finxiety's values (free + no PII). This is strong copy.

**10. Signpost links: do the related-tool links accurately describe where they lead?**
Pass. The signpost footer reads:
> "The same compound math shows up in everyday money decisions. The Emergency Fund Checker looks at the runway you have right now, and the Benefits Myth-Check Quiz covers other things financial systems work differently than most people assume."

Both descriptions are accurate. The Emergency Fund Checker does look at current runway. The Benefits Myth-Check Quiz does surface how financial systems differ from assumptions. The connective tissue ("The same compound math shows up...") is honest — compound interest is the shared conceptual thread. Neither link oversells the destination.

---

## Strengths

- **The meta description is the best copy on the page.** "Free, nothing saved." is four words of brand-consistent trust-building that also handles a real user concern (data privacy). Worth preserving exactly.
- **Results-note framing.** "The point is the shape of the two curves, not an exact dollar prediction" is doing important Do No Harm work. It preemptively reduces the weight the user might place on the specific figures — which is correct for a tool with inherently uncertain inputs.
- **Callout language is consistent across all three branches.** Every branch ends with "compound interest runs in both directions." This repeated phrase anchors the educational purpose of the tool and keeps all three states feel like parts of the same experience.
- **The "investment" field design.** The mirroring behavior (mirrors debt balance until touched) is framed accurately: "Mirrors your debt balance by default. Edit it to compare a different amount." This is clear, non-coercive, and explains the default without hiding it.
- **Zero debt guard.** Disabling submit rather than showing an error or edge-case copy is the right call. Neutral, quiet, non-shaming.
- **APR hint.** "Credit cards often run 20–29%." is factual context that helps a user fill in the field without implying they should know this or be embarrassed if they don't. Exactly right.

---

## Distribution Notes

**How this reaches the target user:**

The tool's SEO surface ("compound interest," "debt vs investing," "credit card interest calculator") is competitive but the framing is genuinely differentiated — most search results in this space are either personal finance blog posts pushing debt payoff strategies or investment calculators that ignore debt entirely. A tool that puts both curves on one chart with no agenda has a real content angle.

**Likely first-touch paths:**
1. Direct search: "credit card interest calculator" / "how fast does debt grow" / "compound interest debt"
2. Referral from EMG-1 or TIP-1 via signpost links (the footer correctly routes users here from adjacent tools)
3. Nonprofit partner distribution — financial literacy organizations, credit counseling nonprofits, community colleges

**Shareable moment:**
This tool has a moderate share potential. The chart output is visually concrete and the "two curves on one chart" insight is genuinely novel to most users. However, sharing a debt result carries social/disclosure risk for the target population — the chart is not labeled with the user's inputs anywhere in the result, which reduces that friction. Someone could screenshot the chart as a general illustration of how compound interest works on debt without it reading as "my debt." This is good design and good distribution thinking simultaneously.

The meta description ("Free, nothing saved") also lowers the social barrier to sharing a link — users don't have to worry about recommending a tool that stores data or requires signup.

**What's missing for distribution:**
No og:image or social card metadata is visible in this file (it may be in the layout). If it isn't present, an og:image showing the two-curve concept would improve link previews significantly for social sharing. This is not a brand violation — it's a distribution gap to flag for the release agent.

---

⟦BRAND-REVIEWED⟧
