# Brand Validation Gate: RECERT-1 — Recertification Deadline Tracker

**Gate:** Brand (voice, Non-Advice Rule, Do No Harm)
**Date:** 2026-06-21
**Reviewer:** brand agent
**Files reviewed:**
- `/Users/naomipinto/Documents/tsunam/finxiety/src/routes/tools/recertification/+page.svelte`
- `/Users/naomipinto/Documents/tsunam/finxiety/src/lib/data/certification-periods-2026.json`

---

## Findings

### Critical
None.

### High
None.

### Medium

**M-1: ICS description carries implicit consequence language**

- What it is: The `buildDescription()` function (line 197) writes the `.ics` event description as: `"Recertifying means confirming you still qualify so your benefits keep going."` The phrase "so your benefits keep going" implies the inverse -- that not recertifying stops benefits. That implication is factually correct, but it introduces consequence framing that lives permanently in the user's calendar, outside the tool's carefully hedged UI context.
- Where it is: `+page.svelte` line 200-201
- Why it matters: The rest of the tool is meticulous about informational framing. The calendar file is the one artifact the user will see repeatedly, outside the tool's UI, stripped of surrounding context. A sentence that implies a negative consequence in the calendar lands differently than the same sentence inside the tool where hedges and signposts surround it.
- Prescribed fix: Rewrite to describe the action without implying the consequence. Suggested: `"Recertifying is how you confirm you still qualify and keep your enrollment current."` This stays informational -- it describes the process, not the stakes.

### Low

**L-1: Tool h1 uses the word "Deadline"**

- What it is: The `<h1>` on line 261 reads "Recertification Deadline Tracker." "Deadline" carries mild pressure -- it implies obligation and time running out. For a user who is already anxious about benefit continuity, the word can activate scarcity-adjacent stress before they have read a single line of copy.
- Where it is: `+page.svelte` line 261
- Why it matters: This is the first word the user reads after the breadcrumb. The brand register is calm and tool-oriented, not countdown-oriented. Every other label in this tool is framing-neutral ("Recertification Reminder Tracker," "Your estimated recertification dates," "Download reminders"). The h1 is the outlier.
- Prescribed fix: Rename to "Recertification Reminder Tracker" or "Recertification Date Tracker." Either removes the pressure word without losing meaning. The `<title>` tag (line 241) and the meta `description` (line 244) should be updated to match if the h1 changes.
- Note: This is also the ticket-level name (RECERT-1). If the name is changed in the h1, update the homepage card copy and the `<title>` to stay consistent. The URL slug `/tools/recertification` is unaffected and does not need to change.

**L-2: "Download reminders" button does not signal the file type**

- What it is: The download button (line 461) reads "Download reminders." The download hint below it (lines 464-466) explains it opens in calendar apps and generates a `.ics` file -- but the button label itself gives no indication that clicking will trigger a file download. A user unfamiliar with `.ics` files may be surprised.
- Where it is: `+page.svelte` line 461-462
- Why it matters: Not a Do No Harm issue, but a clarity issue. The brand rule is "treat complexity as our problem, not the user's." The download hint copy is doing corrective work that the button label could handle directly.
- Prescribed fix: "Download calendar reminders" or "Add reminders to my calendar" -- both signal the destination without requiring the user to read the hint first. The hint can stay as supporting detail.

---

## Strengths

**Tool description (line 263-266):** "Benefits don't end because people stop qualifying. They often end because a renewal date slipped by." This is the best opening copy in the Finxiety suite so far. It reframes the problem from user failure to system complexity -- exactly the dignity principle in action. No preaching, no warning, no urgency. Preserves as-is.

**Estimates are labeled at every layer:** The result note (lines 388-391), the `result-detail` text (lines 420-424), and the `.ics` `DESCRIPTION` field (line 203) all flag the estimate and point to the approval notice as the authoritative source. The estimate disclosure is genuinely thorough -- it appears in the UI and travels with the calendar file. This is the correct implementation of the Do No Harm estimates rule.

**Past-deadline signpost (lines 410-415):** When the estimated date has already passed, the tool does not warn or alarm. It routes the user to the approval notice and to 211 for a navigator. This is exactly the right response -- informational, calm, resourceful. No consequence language, no shame trigger.

**"I don't know" path (lines 343-349):** The guidance copy ("No problem. Check the approval notice letter you received from the agency, or call 211 to ask a navigator. When you have the date, come back and we'll build your reminders.") is warm, practical, and non-shaming. The "No problem" opener is doing real work here -- it preempts the financial shame response before it can land.

**CalFresh SAR-7 mid-cert note (data file, lines 21-24 of JSON):** "This is not a renewal -- you stay enrolled -- but turning it in keeps your benefits going without a pause." Positive framing throughout. The decision to frame this as what happens when you do act (benefits continue) rather than what happens if you don't (benefits pause) is the right call for this population.

**Non-Advice Rule: full compliance.** No "you should," "you must," "you need to," or directive language anywhere in the template. The tool shows; the user decides. The related tools footer ("get one list," "check whether other programs may apply") describes what the linked tool does -- it does not tell the user to go use it.

**Privacy note (lines 472-475):** "Nothing here is saved or sent anywhere. The dates stay on your device, and the calendar file is built right in your browser." Plain, complete, exactly what this user needs to hear. The trust deficit this population has with financial tools is real; this copy earns trust without overclaiming.

---

## Distribution Notes

**Who finds this first:** Most likely referral from DOC-1 (Document Checklist) and BEN-1 (Benefits Screener), both of which are natural upstream tools. The related-tools footer on those pages should include this tool. Secondary path: nonprofit partner organizations who manage benefit navigation for clients -- they are the natural distribution vector for a tool this specific.

**SEO term:** "when does SNAP recertification happen" / "Medicaid renewal date" / "how often do I have to renew SNAP" -- these are high-intent, low-competition long-tail terms. The meta description is already functional but could be sharpened to include the state names (CA, TX, FL, NY, AZ) for geo-targeted indexing, since those are the only supported states in v1.

**What is shareable:** The `.ics` download is the shareable moment -- but it shares privately (calendar file, not a result screen). This is correct for this tool. The result is not a score or a number; it is a personal date. Design does not need to force social sharing here. The shareable moment is word-of-mouth from a navigator or caseworker who recommends the tool to their clients.

**Related-tools footer adequacy:** The two links (Document Checklist, Benefits Screener) are the right handoffs. The description copy for each is accurate and warm. No changes needed.

---

## Summary

The tool passes on voice, Non-Advice Rule, and Do No Harm. No Critical or High issues found. Two Low findings (h1 word choice, button label specificity) and one Medium finding (ICS consequence language) are identified above with prescribed fixes. The Medium finding is addressable in a single line edit and should be resolved before distribution. The Low findings are recommended but not blocking.

⟦BRAND-REVIEWED⟧
