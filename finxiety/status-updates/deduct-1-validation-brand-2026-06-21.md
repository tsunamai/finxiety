# Brand Review: DEDUCT-1 — Tax Clarity

**Date:** 2026-06-21
**Reviewer:** brand agent
**Files reviewed:**
- `finxiety/src/routes/tools/tax-clarity/+page.svelte`
- `../tsunam_vault/finxiety/Finxiety — Brand & Mission.md`
**QA status at time of review:** ⟦QA-VERIFIED⟧ (2026-06-21, two non-blocking findings)

---

## Voice Violations

None found. Every piece of copy reviewed against the five prohibited words (empower, journey, personalized insights, transformative, unlock) — zero matches. No urgency, scarcity, or fear language present. No IRS-speak. No financial-advisor register.

The register holds throughout. A few specific calls worth noting:

- "A rough number is fine." — exactly right. Treats complexity as the tool's problem.
- "We'll show you the plain-language math." — describes what the tool does, not what the user should achieve.
- "Neither is wrong — it's about what fits your life." — warm, direct, zero preachiness. This is the hardest thing to get right in a financial tool and they got it.
- "That's a simple-interest illustration, not a prediction." — precise without being clinical.

No revisions required on voice.

---

## Do No Harm Flags

None. This tool is the highest-risk surface in the current Finxiety suite for advice creep — and it holds the line cleanly on every mode.

**Deduction mode:** Shows the savings figure and explains the mechanism ("A deduction comes off your income, so it saves you your bracket's share of it."). Tells the user nothing about whether they should take any deduction. The comparison box explains the difference between deductions and credits as a conceptual matter, not a recommendation.

**Credit mode:** Shows the reduction dollar-for-dollar. The compare box explains why credits beat deductions at equivalent size — descriptive, not directive. The refundability caveat ("Some credits are refundable and some aren't, which changes what you actually receive") is accurate and appropriately scoped: it signals the limit of the tool's output without telling the user what to do about it.

**Refund mode:** The neutral-box treatment of the refund-size debate is the right call and the right execution. Both positions are presented with equal weight. No "you should adjust your W-4." No "consider changing your withholding." The disclaimer closes it: "This isn't advice about your withholding." Clean.

**Estimate labeling:** All three result blocks carry explicit disclaimers:
- Deduction: "illustrative estimates based on 2026 federal brackets…not to file your return."
- Credit: "illustrative comparison using 2026 federal brackets…not your full return."
- Refund: "illustrative…not a prediction" (compare box); "illustrative and uses a sample rate…This isn't advice about your withholding." (illustrative note)

No output presents itself as a filing recommendation or a complete tax picture. The scope limitation is honest and present every time.

**Official source:** The IRS URL pulls from `data.verify_at` in `federal-brackets-2026.json` and renders in the footer on every screen ("Verify against the official source: IRS tax inflation adjustments for 2026"). Linked, labeled, always visible.

No Do No Harm flags.

---

## Strengths

**Tool naming is accurate and plain.** "Tax Clarity" describes exactly what the tool delivers — not a tax calculator, not a tax estimator, not a tax planner. Clarity. The H1 matches. No overpromise anywhere in the name or top-of-page copy.

**The mode picker is brand-exemplary.** Three options with one-sentence plain-language descriptions ("Something that lowers the income you're taxed on." / "Something subtracted straight from the tax you owe." / "Money that came back to you after you filed.") — these are the definitions most people have never been given. Giving them here, before asking for any input, is the right move. It is doing the work.

**The meta description earns its space.** "What a deduction actually saves you, what a credit is worth, and what your refund really means. Three plain-language answers, federal numbers, nothing saved." This is the tool in three sentences. "Nothing saved" does double work — communicates the stateless privacy posture and signals that the tool is genuinely free of strings. That's an honest and useful signal to put in the description.

**The deduction compare-box is the best piece of explanatory copy in the tool.** "The same [amount] as a credit would lower your tax by the full [amount], dollar-for-dollar — about [difference] more than the deduction. That's the difference between the two." This is why someone comes to a tool like this. It says the thing the user actually wanted to know, directly, in their own words.

**The refund neutral-box is the Do No Harm principle in practice.** It presents a live debate in personal finance without taking a side, and it does it without making the user feel dumb for having gotten a refund. "Neither is wrong — it's about what fits your life." is a sentence that belongs in every financial literacy course ever written.

**Field hints are doing real work.** "A rough number is fine. This is your income after the standard deduction — roughly the taxable-income line on last year's return. We only use it to find your bracket." — this is a field hint that actually reduces user anxiety rather than increasing it. The "we only use it to find your bracket" line is especially good: it explains why you're being asked, which is exactly what a user who has been burned by financial forms before needs to hear.

---

## Distribution Notes

**Who finds this first:** Tax season is the obvious trigger, but this tool is useful year-round for anyone who encounters the deduction/credit/refund vocabulary and doesn't know what it means — which is most people. The mode picker design (pick the term you want to understand) is well-suited to someone who just heard one of these words and wants a quick answer. That's a search pattern: "what is a tax deduction," "what is a tax credit," "what does my refund mean."

**SEO signal:** The meta description is already strong for intent matching. The H2s in mode ("A tax deduction," "A tax credit," "A tax refund") are clean semantic targets for the same queries. No changes needed for organic reach.

**Shareable moment:** The deduction-vs-credit compare-box output is the shareable moment — it gives a user a concrete dollar differential they probably didn't know. "I thought a $2,000 deduction saved me $2,000 and it's actually $240" is the kind of thing someone texts to a sibling. However: the tool currently has no share affordance and no persistent URL for a result state (stateless by design, correct). That limits sharing to "go use this tool" rather than "look at my result." This is a product-level trade-off, not a brand problem, and it is consistent with the stateless/no-PII architecture.

**Related tools:** No related-tool footer links are present in this file. When those are added (HOURS-1, DEBT-VIZ-1, and possibly MYTH-1 are the natural neighbors for a user who just learned the deduction/credit distinction), they should be framed as warm handoffs in the Finxiety register — not CTAs. Example framing: "Wondering what your hourly wage actually looks like after taxes? That's a different tool." The current absence of these links is noted but is not a brand violation for this review.

**Distribution risk — none identified.** Unlike the SNAP screener (BEN-1), this tool carries no eligibility signal that could be misread. The outputs are explicitly illustrative. There is no scenario where a user acts on this tool's output in a way that harms them. This is the lowest-risk distribution profile in the current suite.

---

⟦BRAND-REVIEWED⟧ tool="tax-clarity" ticket="DEDUCT-1" date="2026-06-21" covers="voice register, prohibited vocabulary, Non-Advice Rule, Do No Harm (all three modes), estimate labeling, official source URL presence, tool name and H1, meta description, field hints, result copy, disclaimer adequacy, distribution and shareability." No violations found. No revisions required.
