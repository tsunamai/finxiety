# Brand Validation Gate — Guide Tool ("What's going on?")

**Tool:** Guide (`/tools/guide`)
**Gate:** Brand
**Date:** 2026-06-21
**Source file reviewed:** `finxiety/src/routes/tools/guide/+page.svelte`
**Brand source:** `../tsunam_vault/finxiety/Finxiety — Brand & Mission.md`

---

## Findings

### Severity: Medium

**1. Subhead tells the user the tool will give them "the right tools" — mild overreach**

- What it is: The subhead reads "Pick the situation that fits — we'll show you the right tools."
- Where it is: `+page.svelte` line 193
- Issue: "The right tools" implies a correctness judgment that the tool cannot make. It doesn't know the user's full situation. It surfaces matching tools; it doesn't determine which ones are objectively correct for that person. The word "right" is a small but real overreach — it also edges toward the kind of confident direction-giving the Non-Advice Rule guards against.
- Prescribed fix: Change to "we'll show you the tools that fit" or "we'll show you what's available for that situation." Removes the implied authority without losing the warmth.

**2. Results section heading "Here's where to start" is a mild directive**

- What it is: The `<h2>` rendered after a situation is selected reads "Here's where to start."
- Where it is: `+page.svelte` line 215
- Issue: "Where to start" tells the user they should do something next — it is a nudge toward action rather than a neutral surface of what's available. For most users this is harmless, but the guide is the front door for people under financial stress; the language should describe what the tool is showing, not prescribe what they should do with it.
- Prescribed fix: Change to "Tools that match your situation" or "Here's what fits." Short, descriptive, still warm — but makes no claim about what the user should do next.

**3. `cliff-calculator` tool description edges toward advice in the "news" situation**

- What it is: The `cliff-calculator` tool card description reads "See what a higher income does to your benefits before you decide."
- Where it is: `+page.svelte` line 93
- Issue: "Before you decide" implies there is a decision to make and that the user should be making it after using this tool. That is a soft directive — the kind of forward pressure the Non-Advice Rule prohibits. The tool shows math; the user decides entirely on their own timeline and for their own reasons.
- Prescribed fix: Change to "See what a higher income does to your benefits." Drop "before you decide" entirely. The tool description is already clear enough without the nudge.

**4. `savings-commitment` tool description contains an embedded directive**

- What it is: The description reads "Write one specific savings commitment in your own words and get a calendar reminder."
- Where it is: `+page.svelte` line 127
- Issue: "Write one specific savings commitment" is an instruction — it tells the user what to do rather than describing what the tool does. Minor, but the pattern is inconsistent with how all other tool descriptions are written (they describe what the tool shows, not what the user does).
- Prescribed fix: Change to "Set one savings goal in your own words — the tool generates a calendar reminder." Describes the tool's behavior without instructing the user.

---

### Severity: Low

**5. Situation label for "news" conflates three genuinely different situations**

- What it is: "I got some financial news — a raise, a job change, or an unexpected bill"
- Where it is: `+page.svelte` line 41
- Issue: A raise, a job change, and an unexpected bill are materially different situations with different emotional registers. A user who just got an unexpected bill is not in the same place as someone who got a raise. The consolidation works logistically — these route to similar tools — but the label asks a stressed user to recognize their situation across a three-part disjunction, which adds cognitive load. Not a Do No Harm violation, but worth revisiting for the ALICE user.
- Prescribed fix: No single fix required; this is a tradeoff between coverage and specificity. Consider splitting into two cards if the routing logic allows it: "I got a raise or my income changed" and "I got a bill I wasn't expecting." If splitting creates too many cards, keep the current label but reorder: "an unexpected bill, a raise, or a job change" — leading with the most stressful scenario first acknowledges the widest range of users.

**6. Situation for "debt-savings" names debt before savings — consider the shame dynamic**

- What it is: "I'm trying to get on top of debt, or start saving"
- Where it is: `+page.svelte` line 52
- Issue: Naming debt first is accurate to where most ALICE users are, but the phrase "get on top of" combined with "debt" can carry a mild self-blame register. Not a violation; the label is plain and honest. Flag is for awareness: the behavioral-science agent should review this framing separately for scarcity mindset and shame dynamics.
- Prescribed fix: None required for brand pass. Consider "I'm dealing with debt, or I want to start saving" as an alternative — "dealing with" is more neutral than "get on top of."

**7. `learning` situation groups tip-calculator with benefits and tax content**

- What it is: The `learning` situation routes to `['myth-quiz', 'myth-quiz-2', 'tip-calculator', 'tax-clarity']`
- Where it is: `+page.svelte` line 57
- Issue: The tip calculator is a useful tool but is a different register than the myth quizzes and tax clarity — it is more transactional. A user who "just wants to understand how money works" is probably not looking for a tip split tool. No Do No Harm issue; this is a completeness/coherence note.
- Prescribed fix: Consider removing `tip-calculator` from the `learning` situation routing. It fits better as a standalone share-friendly tool rather than an educational resource. If removing it, no replacement needed — the remaining three tools are sufficient for this situation.

---

### Severity: None — Strengths

**Voice:** Every situation label is written in first-person present tense ("I'm trying to figure out...") — this is exactly right. Users recognize their own situation in the phrasing rather than being described at from the outside. The tone is plain and unhurried.

**Non-Advice Rule compliance (core flow):** The tool describes what it shows throughout. It surfaces tools; it does not tell the user which one to use, in what order, or what to do after. The architecture is correct.

**Do No Harm — situation framing:** None of the situation labels feel like a diagnosis. "I'm not sure if I qualify for benefits" is conspicuously absent as a standalone label (it is folded into the broader benefits label), but the label that is there — "I'm trying to figure out what programs or assistance I might be able to get" — is non-stigmatizing and accurate. No label uses words like "struggling," "in trouble," or "behind."

**Tool card copy pattern:** The tool `question` fields are strong across the board. "Got a raise — do you actually come out ahead?" and "Is your debt growing faster than your savings?" are excellent — they describe what the tool shows without telling the user what to decide or implying they should already know the answer.

**Fallback link:** "Not quite right? See all tools" is the right exit — warm, non-judgmental, no pressure.

**Meta description:** The `<meta name="description">` tag reads "Free. No account." — that is exactly the right trust signal for this user. Keep it.

---

### Distribution Notes

**Who finds this first:** The guide is the logical entry point for users who arrive via a nonprofit partner link or a general Finxiety share (e.g., "here's a site with financial tools"). It is less likely to be the SEO entry point — specific tools (SNAP screener, cliff calculator) will rank for intent keywords. The guide's discovery path is referral and warm handoff.

**Shareable moment:** The guide itself is not inherently shareable — there is no result to screenshot or share. The shareable moment is downstream: a specific tool result. The guide should be thought of as a navigation surface, not a destination.

**The path from guide to share:** The guide routes to tools that have shareable moments (myth quiz scores, cliff calculator results). The guide's job is to get the user to the right tool fast; the tool's job is to create the shareable moment. This architecture is correct.

**Referral context:** Nonprofit and benefits counselor partners will likely link directly to the guide as a "start here" resource. The page title "What's going on?" and the absence of any account requirement or data collection is correct for this context. Consider adding a one-line sentence to the page (above or below the subhead) for the partner-referral entry point: something like "No account. No data saved. Just the tools." This reinforces the trust contract at the moment a new user lands from a partner link. (Low priority — does not block this review.)

---

## Seal

All findings above severity Low are Medium — no Critical or High violations of Do No Harm or the Non-Advice Rule were found. The core routing architecture and situation label framing are sound. The Medium findings (lines 193, 215, 93, 127) are copy fixes, each one sentence or less.

⟦BRAND-REVIEWED⟧
