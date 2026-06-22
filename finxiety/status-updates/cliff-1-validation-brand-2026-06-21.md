## Brand Review: Benefits Cliff Calculator — CLIFF-1

**Date:** 2026-06-21
**Reviewer:** Brand agent
**Files reviewed:**
- `finxiety/src/routes/tools/cliff-calculator/+page.svelte`
- `../tsunam_vault/finxiety/Finxiety — Brand & Mission.md`
**Gate sequence:** QA passed (⟦QA-VERIFIED⟧ 2026-06-21). This is gate 2 of 4.

---

### Voice Violations

None found. The register is clean throughout. A few notes on why specific choices work:

- "Getting a raise or a new job offer?" (line 224) — colloquial entry point, no inflation. Correct.
- "Show me what changes" (line 374) — tool describes what it shows; the label is first-person but belongs to the user's action, not our promise. Passes.
- "Right now" / "At the new income" (lines 395, 431) — plain, context-setting, no spin. Correct.
- "This is the benefits cliff." (line 496) — factual naming, not fear framing. The term is descriptive, not alarming.

No instances of: "empower," "journey," "personalized," "insights," "transformative," "unlock," urgency language, scarcity language, or fear language.

---

### Do No Harm Flags

**B-1 — `medi-cal-warning` copy reads as a directive (MINOR)**

Line 527:
> "This calculator does not estimate the cost of Covered California coverage. Factor health insurance into your decision separately."

"Factor health insurance into your decision separately" is an instruction — it tells the user what to do. The first sentence is fine (accurate scope disclaimer). The second crosses the line from describing what the tool shows into telling the user how to think about their decision.

Suggested revision:
> "This calculator does not estimate Covered California premium costs. Covered California's shop-and-compare tool lets you see actual plan prices for your income and household size."

This replaces the instruction with a description of what the linked tool does, which is consistent with the Non-Advice Rule and keeps the source URL doing more work.

**Severity:** Minor. The directive is soft and well-intentioned, but it is still a directive. Fix before distribution.

---

**B-2 — Net delta row in verdict table carries no estimate label (NOTED, NOT A BLOCK)**

QA flagged this as "marginal, not a FAIL" (QA report line 88). Brand concurs: the net delta row is arithmetic over rows that are individually labeled "estimated." Adding a second "estimated" tag to the total could read as double-hedging. The verdict-summary text immediately below uses "estimated benefit changes" throughout, which provides the necessary qualification in prose. No revision needed, but the team should be aware that if the verdict-summary text ever gets shortened, an estimate label on the net delta row would become necessary.

---

### Non-Advice Rule

**Employer questions section (lines 622-638): passes cleanly.**

- Section heading: "Questions some people ask their employer in this situation" — third person, not directed at the user.
- Each item is a genuine interrogative: "Does the job include employer-sponsored health insurance? If so, at what cost?" — no imperative, no "you should ask."
- Explicit sign-off: "These are questions, not recommendations. What matters depends on your specific situation." (line 635-636) — textbook Non-Advice Rule execution.

This section is a model for how to present contextually useful information without prescribing action.

**Results framing:** All verdict text describes what the numbers show. "The raise adds X/month to your paycheck, but estimated benefit changes subtract roughly Y/month. You'd have about Z less per month in total resources than you do now. This is the benefits cliff." — informational, not prescriptive. No "you should," "consider," or "we recommend" anywhere in the file.

**Medi-Cal note (lines 511-528):** "At [income]/month, you would likely no longer qualify for free Medi-Cal coverage. You would become eligible for subsidized plans on Covered California." — describes the situation, names what becomes available, links to the tool. Passes, subject to B-1 fix.

---

### Results Copy

**"This raise would leave you ahead / behind" framing:** The tool does not use this exact phrasing. The actual verdict-summary text is:

- Cliff scenario: "You'd have about [X] less per month in total resources than you do now. This is the benefits cliff."
- Near-neutral: "The income gain and estimated benefit changes roughly cancel out. Your total monthly resources would stay about the same."
- Net gain with benefit reduction: "Net gain: roughly [X]/month."
- No benefit change: "Your income would increase and your benefits would stay the same. Total resources: up about [X]/month."

All four variants are factual and non-directive. The cliff scenario names what is happening without editorializing about what the user should do with that information. Pass.

---

### Disclaimer / Estimate Labeling

All calculated outputs carry estimate markers:

- CalFresh benefit rows: "~$XXX/month estimated" — the tilde and the word "estimated" both appear inline.
- Verdict table: CalFresh delta row carries "estimated" tag.
- Results section note (line 388-390): "California programs only. Estimates based on published income thresholds. Your exact benefit depends on your specific situation and what your county processes." — visible, plain, immediate.
- Chart note (line 593-595): explicitly flags that Medi-Cal is excluded because its value varies.
- Sources section (line 649): "Thresholds last verified October 2025. Limits update annually."

The "estimated" qualification is pervasive, correctly placed, and never buried. No output tells a user they qualify or don't qualify without adjacent qualification language. Pass.

---

### Official Source URLs

All four official sources are present and linked:

- USDA FNS: `https://www.fns.usda.gov/snap/recipient/eligibility`
- CA DHCS: `https://www.dhcs.ca.gov/services/medi-cal`
- Lifeline: `https://www.lifelinesupport.org/`
- Covered California: `https://apply.coveredca.com/lw-shopandcompare/`

All are inline in the sources section at the bottom of the results. The Covered California link also appears in the Medi-Cal note (line 521), which is correct — that is the action-adjacent link placement that matters most for the user who is looking at a Medi-Cal cliff. Pass.

---

### Tool Name and Description

**Page title:** "Benefits Cliff Calculator | Finxiety" — accurate, literal, findable. No inflation.

**Meta description (line 207-209):**
> "See how your CalFresh, Medi-Cal, and other benefits change when your income changes. Free, California-focused, nothing saved."

Clean. "Nothing saved" is a trust signal that belongs in the meta. "Free, California-focused" does double work for discovery and expectation-setting. "See how" is the correct register — it describes what the tool does, not what the user should do. Pass.

**H1:** "Benefits Cliff Calculator" — literal, findable, no promises.

**Tool description paragraph (lines 223-227):**
> "Getting a raise or a new job offer? Enter your current and proposed income to see how CalFresh, Medi-Cal, and other California programs would change — and whether the raise leaves you better off in total."

"Whether the raise leaves you better off in total" — this is a slight deviation from strict Non-Advice framing. It implies a judgment (better/worse off), but it is correctly positioned as a description of what the tool shows, not a directive. It names the user's actual question ("is this raise actually good for me?") and promises to answer it. This works. It does not cross into telling the user what to decide. Pass.

---

### Related-Tools Signpost Footer

Lines 654-660:
> "Not sure which programs you currently qualify for? The Benefits Screener can check your eligibility. Need to know what documents to bring? The Document Checklist has one de-duplicated list."

Two warm, question-led handoffs. Both name what the linked tool does; neither sells it. "One de-duplicated list" is a Finxiety-voice detail — specific and useful, not promotional. Both links are contextually appropriate to a user who just learned about their benefits picture. Pass.

---

### Strengths

- The employer questions section is the strongest Non-Advice execution in the Finxiety tool suite so far. The third-person framing ("Questions some people ask") plus the explicit disclaimer at the bottom is a pattern worth replicating across all future tools that need to surface contextual options.
- The four-branch verdict-summary text (cliff / near-neutral / net gain with reduction / gain only) is calibrated. Each says only what the math shows. None editorializes.
- "This is the benefits cliff." (used in the cliff scenario text) is the right move — it names the concept at the moment of maximum relevance, which helps the user understand what they're seeing without adding emotional weight.
- The Medi-Cal exclusion explanation (both in the chart note and in the dedicated chart footnote) is handled with exactly the right transparency: acknowledges the gap, explains why, and tells the user where to go. This is hard to do well and the copy does it.
- "Nothing saved" in the meta description is a small trust signal that earns attention from the right user. Worth carrying forward to all tool meta descriptions.

---

### Distribution Notes

**Who finds this first:**
- Organic search on "benefits cliff calculator California" — the tool name and meta are optimized for this. "CalFresh Medi-Cal income raise" is a plausible long-tail query that will match the description copy.
- Nonprofit and social services referral — the Finxiety tool suite as a whole is likely to be distributed via 211 orgs, SNAP outreach workers, and Covered California enrollment assisters. This tool is a natural fit for case workers who need a quick comparison to explain the cliff to clients.
- Social share — moderate shareability. The cliff visualization (the chart showing the dip) is the obvious shareable moment. Unlike a SNAP eligibility result, a cliff visualization communicates a concept rather than personal data. Worth a callout in the related marketing materials: the chart is the share unit.

**Shareable moment:**
The visual chart is shareable in screenshots and social posts in a way a personal eligibility result is not — it illustrates the systemic problem, not an individual's situation. Finxiety should consider a static preview image of the cliff chart (without personal data) for social sharing / Open Graph purposes.

**Cross-tool bridge:**
The signpost footer is appropriately minimal. After reviewing, the only missing bridge is to a future "What to do if you're near a cliff" resource or benefit navigation aid — but that is a content gap, not a copy failure. The current links (screener + document checklist) are the right ones for this tool's place in the user journey.

---

### Findings Summary

| ID | Severity | Description | Action required |
|---|---|---|---|
| B-1 | Minor | `medi-cal-warning`: "Factor health insurance into your decision separately" is a soft directive | Replace with description of what Covered California's tool shows |
| B-2 | Noted | Net delta row carries no estimate label | No action needed; verdict-summary prose provides qualification. Flag if summary text is shortened in future. |

---

### Sign-Off Decision

B-1 is a minor voice violation — a soft directive in the Medi-Cal warning copy. It is not a Do No Harm failure of the magnitude that would cause financial harm, but it does cross the Non-Advice Rule. It requires a one-line revision.

B-1 revision is tracked. All other copy passes voice, Do No Harm, Non-Advice Rule, disclaimer labeling, and source URL requirements.

The tool does not ship to distribution until B-1 is fixed.

⟦BRAND-BLOCKED⟧ tool="benefits-cliff-calculator" ticket="CLIFF-1" date="2026-06-21" blocker="B-1 (soft directive in medi-cal-warning copy: 'Factor health insurance into your decision separately')"

---

## Re-Verification — 2026-06-21

**B-1 fixed.** `cliff-calculator/+page.svelte` line 524-527: replaced "Factor health insurance into your decision separately." with "Covered California's shop-and-compare tool lets you see actual plan prices for your income and household size." Directive removed; replaced with a description of what the linked resource does.

⟦BRAND-REVIEWED⟧ tool="benefits-cliff-calculator" ticket="CLIFF-1" date="2026-06-21"
