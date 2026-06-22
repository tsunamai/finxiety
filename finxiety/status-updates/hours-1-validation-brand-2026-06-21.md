# Brand Review: HOURS-1 — Where Do Your Work Hours Actually Go?

**Date:** 2026-06-21
**Reviewer:** brand agent
**File reviewed:** `finxiety/src/routes/tools/work-hours/+page.svelte`
**Brand reference:** `../tsunam_vault/finxiety/Finxiety — Brand & Mission.md`

---

## Voice Violations

None found. Copy throughout is plain, direct, and warm. No inflation words, no urgency, no scarcity, no labor-activism framing. The tool describes what it shows and gets out of the way.

---

## Do No Harm Flags

None found. The tool presents tax math in time and dollars. No copy implies the user is underpaid, should negotiate, or should take any action. No verdict is rendered on whether the user's compensation is fair.

The one area that could drift toward harm in a naive implementation — the "days worked for taxes" framing — stays factual: "About X full 8-hour days of your working year fund federal tax, state tax, and FICA combined." This is arithmetic, not editorializing. The tool does not say those days are lost, stolen, wasted, or excessive. That line holds.

---

## Checklist Findings

### 1. Voice: plain, direct, warm — no activism, no shame, no urgency

PASS. The H1, tool description, field labels, result headings, and body copy are all plainspoken. No "you deserve more," no "see what's really happening to your hard-earned money," no urgency to act. The employer FICA toggle ("Show the hidden employer-side FICA match") uses "hidden" accurately — it literally doesn't appear on a pay stub — and the explanatory text immediately grounds it as factual: "It's part of what your work costs, even though you don't see it." That framing is neutral and informative.

### 2. Do No Harm: no verdict on fair pay

PASS. The tool never says "you're underpaid," "your employer keeps this," or anything that implies a judgment about compensation fairness. Results are framed as breakdowns of the user's own numbers, not comparisons to a standard.

### 3. Non-advice rule: shows data, does not recommend

PASS. No directive language anywhere in the copy. The empty-state prompt ("Enter your gross pay and hours worked to see where each hour of work goes") describes the tool's function. Results describe what the numbers show. No "you should ask for a raise," "consider a different tax withholding," or equivalent.

### 4. Effective wage calculation: is it labeled as an estimate?

PASS. There is no "effective hourly wage after taxes" display in the copy (the tool shows minutes per hour and time-until-yours rather than a computed effective wage figure). The per-period breakdown table and all derived outputs are each followed by: "This is an estimate based on the numbers you entered." That note appears three times: under the until-yours block, under the per-period breakdown, and under the annual rollup. The employer FICA section also carries it.

No copy implies the user should negotiate based on these figures.

### 5. Results framing when effective take-home is very low

PASS. The tool shows time and dollar amounts neutrally. There is no threshold below which different copy triggers, no red color, no warning language. A user whose take-home is very low sees the same descriptive framing as any other user. The tool treats the output as information, not as a problem to be solved.

### 6. Tax estimate labeling

PASS. Every calculated result block carries the note: "This is an estimate based on the numbers you entered." The sources section closes with an explicit scope statement: "Estimates use marginal tax brackets applied to your annualized pay. They don't include tax credits, local or city income tax, additional Medicare tax on high earners, or state-specific deductions, so your actual withholding and final tax may differ." That disclosure is clear and accurate.

### 7. Official source URLs for tax data

PASS. Three source URLs are present and attributed:
- IRS (federal brackets and standard deductions, tax year 2026)
- SSA (Social Security and Medicare rates and wage base, 2026)
- California FTB, New York DTF, Arizona DOR (state income tax)

Texas and Florida are noted as having no state income tax, which is accurate and accounts for why no source URL is needed for them. "Other / not listed" runs federal-only, which is disclosed to users in the state field hint. The IRS URL in the source code references the 2026 inflation adjustments including the One Big Beautiful Bill amendments — accurate as of the current date.

### 8. Tool name, H1, meta description

PASS.

- **`<title>`:** "Work Hours Breakdown | Finxiety" — plain and accurate.
- **`<h1>`:** "Where do your work hours actually go?" — matches the tool name (HOURS-1), plain, posed as a question not a value judgment.
- **Meta description:** "Where does each hour of work actually go? See your pay broken down by taxes, deductions, and take-home — in time, not just dollars." — accurate, describes what the tool shows, no inflation, no urgency.

One minor note: the meta description opens with a near-echo of the H1 ("Where does each hour of work actually go?" vs. "Where do your work hours actually go?"). This is not a brand violation — both are on-voice — but for SEO differentiation the meta description might benefit from leading with the output ("See your pay broken down by taxes...") rather than restating the question. Not a blocker.

### 9. Signpost link: accuracy and tone

FLAG (minor): The signpost footer reads: "Curious what a deduction is actually worth, or how a refund really works? The Tip Calculator breaks down another everyday number the same way."

The Tip Calculator is a restaurant-tip breakdown tool, not a tax deduction or refund tool. The framing ("curious what a deduction is actually worth, or how a refund really works?") raises a user expectation that is not met by the Tip Calculator's actual function. This is a copy accuracy issue, not a Do No Harm issue — no harm results from following the link — but a user arriving at the Tip Calculator looking for deduction or refund guidance will be confused.

Suggested revision: "See how another everyday number breaks down. The Tip Calculator does the same thing for a restaurant bill — who pays what, and how much." Or link to DEDUCT-1 when it is live, which would actually address the deduction/refund framing.

---

## Strengths

- The time-based framing (minutes per hour) is genuinely useful and genuinely novel. It does not editorialize — it translates an abstract percentage into something concrete without implying the user should feel any particular way about it.
- The "until yours" block names an 8-hour workday starting at 9:00 AM as the frame, which is explicit about its assumptions. This prevents a user from applying it to their actual irregular schedule without realizing the model doesn't match.
- Three estimate disclaimers in the results section — one per major result block — is appropriate given the tool's scope. They're placed at the end of each block rather than before the result, which means the user sees the number first. That ordering honors the brand rule: say the number, don't bury it.
- The employer FICA toggle is opt-in, which is correct. This information has the highest potential to read as "your employer is hiding something from you." Making it a toggle, with explanatory copy that frames it as "part of what your work costs," keeps it informational without making it feel like a revelation.
- Source citations are thorough and specific to the correct tax year (2026).
- The scope note for "Other / not listed" states clearly that federal-only estimation applies — this prevents a user in a high-tax state from getting a false sense of their take-home.
- The field hint for pre-tax deductions lists specific examples (401(k), health insurance, HSA) without suggesting the user should or shouldn't have them.

---

## Distribution Notes

- **Primary entry point:** Search ("how much of my paycheck goes to taxes," "what does my employer pay in taxes," "minutes per hour taxes"). The H1 and meta description are plain enough to rank for conversational queries. The "time not dollars" angle is distinct enough to earn clicks over generic paycheck calculators.
- **Shareable moment:** The "until yours" time (e.g., "you work until 2:43 PM before any of that day's pay is yours") is the most shareable single output from this tool. It's concrete, surprising, and personal. It does not imply a verdict, which means it shares without shaming. No specific share mechanism is present in V1, which is appropriate — do not add one until the behavioral-science agent reviews sharing UX for this tool.
- **Partner distribution:** Workforce development organizations, union halls, and worker centers are natural distribution partners. The tool's neutral framing makes it safe for organizations that serve workers across the political spectrum on labor issues. No advocacy angle is present to alienate any partner.
- **Related-tools footer:** As noted above, the current signpost link to the Tip Calculator uses copy that does not accurately describe where it leads. This should be revised before distribution. When DEDUCT-1 is live, it becomes the natural signpost from this tool.

---

## Summary

One flag to resolve before distribution: the signpost footer copy misrepresents the Tip Calculator as covering deductions and refunds. Everything else passes. Voice is clean, the Non-Advice Rule holds throughout, estimates are labeled appropriately, official source URLs are present, and no copy renders a verdict on compensation fairness.

⟦BRAND-REVIEWED⟧ pending correction of signpost footer copy (flagged above).
