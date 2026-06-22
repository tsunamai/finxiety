# Behavioral Science Review: RECERT-1 (Recertification Deadline Tracker)
**Ticket:** RECERT-1
**Route:** `/tools/recertification`
**Persona applied:** ALICE Primary User (`finxiety/research-findings/persona-alice-primary-user.md`)
**Date:** 2026-06-22
**Reviewer:** behavioral-science agent

Files reviewed:
- `finxiety/src/routes/tools/recertification/+page.svelte`
- `finxiety/src/lib/data/certification-periods-2026.json`
- `finxiety/src/lib/calculators/recert.ts`
- `finxiety/src/lib/ics-generator/index.ts`

---

## Scarcity Mindset

- **Cognitive steps required:** 3 (pick programs + state → enter last cert date → see result). Each step asks one category of thing. This is acceptable for a tool that genuinely needs two inputs to produce a real date. The wizard does not stack inputs onto a single overwhelming screen, and step 2 only asks for the programs chosen on step 1.
- **Tunneling risk:** Low. The result screen leads with the per-program date card, which is the one thing a tunneled, deadline-anxious user is looking for. The estimate disclaimer and the SAR-7 mid-cert note sit below, where they will not block the user from the answer.
- **Present-bias risk:** This is the tool's structural strength. Unlike EMG-1 (which asks a scarcity-bound user to think about a future emergency fund), RECERT-1 is *about* a future event the user is already activated around — she got a letter, or she fears she missed one. The tool meets her in the present tense of "when is this due / did I already miss it." It does not ask for future-oriented planning she can't access; it converts a vague future dread into a concrete date and an artifact (the .ics) that remembers for her. This is the correct cognitive offload for a bandwidth-taxed user.
- **One load-bearing concern:** The date input (step 2) asks the user to retrieve "the date the agency last approved or renewed your benefits." For ALICE, this is precisely the fact she does not have at hand — the persona explicitly describes the approval notice as something she received months ago and can't locate. The tool handles this well via the "I don't know" path (see below), so this is mitigated, not a failure.
- **Finding: PASS** — The flow completes in defensible cognitive steps, is present-tense by design, and offloads memory to a calendar artifact. This is one of the better-matched tools in the suite for the scarcity-state user.

## Financial Shame

- **Potential shame triggers reviewed, moment by moment:**
  - Tool description (line 263–265): *"Benefits don't end because people stop qualifying. They often end because a renewal date slipped by."* — This is the single most important sentence in the tool for shame. It is well-constructed: it externalizes the cause ("a renewal date slipped by" — passive, system-shaped, not "you forgot") and pre-emptively reframes benefit loss as administrative, not as the user failing to deserve benefits. This is the persona's principle #6 ("acknowledge the structural reality") executed correctly. **Keep this exactly as written.**
  - "I don't know this date" checkbox (line 366) and its guidance (line 345–348): *"No problem."* — Names her most likely state as normal, not as a deficiency. Strong.
  - Past-deadline result (line 411): *"The estimated date has already passed."* — Stated as a flat fact about a math result, no second person, no "you missed," no "you should have." Styled in muted gray (`.result-due--past`, line 744–747) rather than alarm red. This is the correct treatment: a weather report, not a verdict. (See Locus of Control for why this still needs one small adjustment.)
- **Result display (worst-case / past-deadline):** Reads as **information, not verdict.** The number is never bolded-and-alarming; the past state is deliberately de-emphasized in color weight. Good.
- **Implicit comparisons:** None found. No "most people," no "experts recommend," no benchmark the user is measured against. The estimate is framed against *her own* program's certification period, not a population norm.
- **Finding: PASS** — No shame triggers remain. The framing actively does anti-shame work. This is a model for how to write a deadline tool that doesn't punish the person who is already afraid of the deadline.

## Trust

- **Trust-building elements:**
  - No login, no email, no PII (privacy note line 471–474: *"Nothing here is saved or sent anywhere"*). For a user with calibrated distrust of financial systems, this is the 30-second trust win.
  - The tool repeatedly defers authority to her own approval notice and to 211, rather than positioning itself as the source of truth. A tool that says "I'm an estimate, the agency's letter is the real answer" is *more* trustworthy to a skeptical user than one that claims certainty.
  - State-honesty: when her state isn't supported (line 307–315), the tool says so plainly and still points her to her approval notice. It doesn't pretend to have data it lacks. This builds trust precisely because it admits a limit.
- **Trust-breaking risks:** Low. The one residual risk is over-trust (a different problem — see Estimate Disclosure in Critical Findings). A skeptical user is well served here; the more vulnerable case is the user who trusts the computed date *too much.*
- **Trust arc:** Starts with a no-cost, no-strings entry; earns trust by admitting what it doesn't know (state gaps, "this is an estimate"); ends with a privacy reassurance and a free artifact she keeps. She ends with **more** trust than she came in with.
- **Finding: PASS**

## Locus of Control

- **Does the output feel actionable or verdictive?** Actionable. Every result state routes forward: a date + a calendar download (happy path), or a 211 referral (don't-know and past-deadline paths). There is no dead-end mirror.
- **Path forward:**
  - Happy path → "Add reminders to my calendar" (a concrete, low-effort, one-tap action that does future-remembering *for* her).
  - Don't-know path → check your approval notice OR call 211 for a navigator (line 345–348).
  - Past-deadline path → 211 connects her to a navigator who can *check with the agency on her behalf* (line 412–418). This is the right move: it converts "I may have lost my benefit" from a closed verdict into an open question someone else can help her resolve.
- **One adjustment needed:** The past-deadline path is good but currently frames 211 as *contingent* — "If you're not sure where things stand" (line 415). For ALICE, who is in exactly this position, the conditional softens the one concrete next action she most needs. The path forward should not be hidden behind an "if." See High finding #1.
- **Finding: FLAG** — Strong overall; the past-deadline next action is phrased conditionally where it should be offered plainly. Adjustment specified below.

## Cross-Tool Bridge

- **Bridge to DOC-1 (Document Checklist):** Present and well-formed. It appears in three places: the footer "Related tools" list (line 485–487), and — notably — *inside the .ics description itself* (line 202: `Prepare your documents: ${docChecklistUrl()}`), using an absolute URL derived at download time so it survives outside the browser. This is a genuinely thoughtful bridge: when the 30-day reminder fires in her calendar weeks from now, the link to "what to bring" travels with it. That is a warm handoff across time, not just across pages.
- **Bridge to BEN-1 (Benefits Screener):** Present in the footer (line 488–490), framed non-directively ("check whether other programs may apply to you, too").
- **Character of the bridges:** Informational, not directive. "get one list of what to bring" / "check whether other programs may apply" — no "you should," no urgency. Correct per Do No Harm.
- **Both targets verified to exist** (`/tools/document-checklist`, `/tools/screener`).
- **Finding: PASS** — The DOC-1 bridge embedded in the calendar artifact is a standout. It is exactly the kind of compounding-value, non-salesy cross-link the persona calls for.

---

## Enabling Environment (Matuschak)

- **Changed capability:** Yes, materially. Before the tool, ALICE has a vague dread and a lost letter. After, she has (a) a concrete estimated date, (b) a calendar entry that will surface 30 and 7 days out whether or not she remembers this tool exists, and (c) the knowledge that her approval notice is the authoritative source. The capability change is real and durable because it is externalized into an artifact, not held in working memory she doesn't have.
- **After-the-tab question:** In 24 hours, *and in 30 days*, something is concretely different: a reminder will fire in her calendar app with a link to the document checklist attached. This is the rare Finxiety tool whose value does not evaporate when the tab closes — the .ics *is* the persistence layer. This is the correct design for a memory-taxed user.
- **Active vs. passive:** The tool requires active engagement — she must locate or choose to find her cert date, and she must take the download action. The download is a deliberate choice, not passive reception. Good.
- **Illusion-of-understanding risk:** This is the one place the tool's strength becomes its risk. The artifact is so concrete (a specific date, "Estimated next recertification: March 14, 2027") that a user may anchor on the estimated date as *fact* and skip checking her approval notice — exactly the over-trust failure mode the persona warns about ("ALICE may trust a number from a computer more than she should"). The clarity is real, but it can produce false confidence in the *specific date* rather than in the *habit of checking her notice.* The disclaimers are present and well-written; the concern is whether their salience matches the salience of the bolded date. See High finding #2.
- **Finding: FLAG** — Genuinely enabling (artifact persists, capability changes), but the very concreteness that makes it enabling also creates an over-trust risk that the current disclaimer placement only partially counters.

---

## Critical Findings

Ordered by severity. No Critical findings. Two High, one Medium, one Low.

### HIGH-1 — Past-deadline next action is gated behind a conditional
**File:** `finxiety/src/routes/tools/recertification/+page.svelte:412–418`
**What it is:** The past-deadline signpost reads: *"Your approval notice from the agency shows the actual deadline. **If you're not sure where things stand,** calling 211 connects you to a navigator..."* The 211 action — the single most useful door for a user who may have just lost a benefit — is offered conditionally ("if you're not sure").
**Why it matters for ALICE:** A user who reaches this state IS, almost by definition, not sure where things stand (she used the tool because she didn't know her date). But a scarcity-taxed reader scanning quickly may read the "if" as "this isn't for me / I'm probably fine" and skip the action. The persona is explicit that a result with no clearly-offered path forward "is just a mirror." The path exists here, but the conditional dims it.
**Prescribed fix:** Remove the conditional gate and offer 211 as a plain, available next step. Suggested copy:
> "Your approval notice from the agency shows the actual deadline — an estimate that's passed doesn't necessarily mean your benefits have lapsed. To find out exactly where things stand, calling **211** connects you to a navigator who can check with the agency on your behalf."

This keeps the de-shaming reframe (estimate ≠ actual loss) AND makes the action unconditional. The added clause "doesn't necessarily mean your benefits have lapsed" also directly addresses the panic risk: a passed estimate is not proof of loss.

### HIGH-2 — Estimate disclaimer salience does not match the bolded-date salience (over-trust risk)
**File:** `finxiety/src/routes/tools/recertification/+page.svelte:407–423`; reinforced by `recert.ts` producing a single precise date.
**What it is:** The estimated date is rendered bold and prominent (line 408, `<strong>{formatLong(r.nextCertDate)}</strong>`), while the "this is an estimate, your real deadline is on your approval notice" caveat is in `.result-detail` / `.result-note` muted small text (0.8125–0.9375rem, `--muted`). The visual hierarchy says "this date is the answer"; the caveat is a footnote.
**Why it matters for ALICE:** The persona warns specifically that "ALICE may trust a number from a computer more than she should." For SNAP in 6-month states (TX, FL, AZ), a wrong anchor of even a few weeks can mean she preps for the wrong month and still misses the real deadline — the catastrophic outcome this tool exists to prevent. An over-trusted estimate is arguably *worse* than no estimate, because it can displace the act of checking the real notice.
**Why this is High, not Critical:** The disclaimer copy itself is accurate and present in three locations, and the tool repeatedly defers to the approval notice. The failure mode is salience/anchoring, not omission. It does not rise to Critical because the correct information is there and the .ics description repeats it (line 200–201).
**Prescribed fix (low-cost, copy/markup only — no logic change):** Tie the caveat to the date *visually and grammatically*, so it cannot be scanned past. Render the estimate line as a single unit, e.g.:
> Estimated next recertification: **around March 14, 2027** — this is our estimate, not your official date. The exact deadline is printed on your approval notice from [agency].
Use the word "around" adjacent to the bold date (matching the existing `describeDue` "in about X months" softening, which is already good) so the precision of the bold date is itself hedged at the point of highest salience. Consider promoting the "your real deadline is on your approval notice" clause out of `--muted` footnote color into the result-card body text weight for the *date* caveat specifically.

### MEDIUM-1 — "Show my reminders" / result heading can read as a promise of certainty
**File:** `finxiety/src/routes/tools/recertification/+page.svelte:373, 388`
**What it is:** The step-2 CTA "Show my reminders" and step-3 heading "Your estimated recertification dates" are fine; the residual concern is consistency. The heading correctly says "estimated"; the CTA and the tool description ("we'll estimate the next date and build calendar reminders") are consistent. This is close to clean.
**Why it matters / why only Medium:** Minor reinforcement opportunity, not a defect. The word "estimate/estimated" appears in the heading and notes but the per-card title (line 406, just the program label) and the date line lead with the date. Ensuring "estimated" rides alongside the date everywhere it appears (covered partly by HIGH-2) closes the loop.
**Prescribed fix:** Folded into HIGH-2's fix (use "around [date]" + inline caveat). No separate action required if HIGH-2 is implemented.

### LOW-1 — Mid-cert (SAR-7) note adds a second deadline concept that could fragment attention
**File:** `finxiety/src/lib/data/certification-periods-2026.json:21`; rendered at `+page.svelte:426–430`
**What it is:** For CA SNAP, the result surfaces the SAR-7 mid-period report as an additional note. It is accurately and gently worded ("This is not a renewal — you stay enrolled — but turning it in keeps your benefits going without a pause").
**Why it matters for ALICE:** A scarcity-state user came for *one* date and now sees *two* deadline-like things. There's a small tunneling/overload risk. However: this is real, load-bearing information (missing the SAR-7 also pauses benefits), it's clearly labeled "Good to know," and it's positioned below the primary date. The note correctly does NOT generate a competing calendar event (verified in `buildEvents`, which only dates the recert reminders), which is the right call — it avoids cluttering her calendar with a date the tool can't reliably compute.
**Why only Low:** The information is genuinely useful and well-placed. Flagging for awareness, not for required change.
**Prescribed fix (optional):** None required. If future iteration adds SAR-7 to the calendar, gate it behind an explicit second opt-in so it doesn't surprise her calendar. No change needed for this gate.

---

## What the Tool Does Well for This User

An honest accounting — this tool gets a lot right:

1. **The opening reframe (line 263–265) is best-in-suite anti-shame writing.** "Benefits don't end because people stop qualifying. They often end because a renewal date slipped by." It externalizes cause and pre-empts the "I failed" reading before the user even starts.
2. **The "I don't know" path treats ALICE's most likely state as normal** ("No problem.") and gives a concrete dual next action (approval notice OR 211). This is exactly right for a user who received a letter months ago and can't find it.
3. **The past-deadline state is de-shamed by design** — muted color, no second-person blame, framed as a math result with a forward route. (HIGH-1 only refines the route's phrasing.)
4. **The .ics is a true enabling artifact.** It persists past the tab, fires reminders when she'll actually need them, and *carries the DOC-1 link with it* via an absolute URL. This is the rare Finxiety tool whose value doesn't evaporate when the tab closes.
5. **It defers authority to her own notice and to 211 repeatedly** — which both respects her agency and, paradoxically, makes a skeptical user trust it more.
6. **State-honesty** (admitting which states it lacks) builds trust by refusing to fake data.
7. **No PII, no login, no urgency, no fear levers.** Clean against Do No Harm.

The two High findings are refinements to an already-sound tool, not structural problems. Both are copy/markup-level and require no logic changes.

---

## Disposition

Two High findings remain (HIGH-1: conditional gating of the past-deadline 211 action; HIGH-2: estimate-vs-date salience / over-trust). Per the validation gate protocol, High findings withhold sign-off until addressed or accepted with deliberate rationale by the PM.

**To clear to ⟦BEHAVIORAL-REVIEWED⟧, address:**
- HIGH-1 — make the 211 next action unconditional on the past-deadline screen, and add the "doesn't necessarily mean your benefits have lapsed" reassurance.
- HIGH-2 — bind the estimate caveat to the bolded date at the point of highest salience ("around [date]" + inline "not your official date").

MEDIUM-1 is absorbed by the HIGH-2 fix. LOW-1 needs no action.

⟦BEHAVIORAL-BLOCKED⟧ tool="recertification" ticket="RECERT-1" date="2026-06-22"

---

## Re-verify — 2026-06-22 (orchestrator)

Both HIGH findings resolved in the working file:

- **HIGH-1 (211 gated by conditional framing):** RESOLVED. "If you're not sure where things stand, calling 211..." replaced with "Calling 211 connects you to a navigator who can check with the agency on your behalf." 211 is now offered unconditionally in the past-deadline state. Defusing sentence added to `result-due--past`: "a passed estimate doesn't necessarily mean your benefits have lapsed." Confirmed at lines 411-418.
- **HIGH-2 (estimate disclaimer salience):** RESOLVED. `result-date` paragraph now reads "Around **[date]** — check your approval notice for your actual deadline." Estimate caveat is inline with the bolded date at line 408. Redundant caveat removed from non-past `result-detail`.

MEDIUM-1 absorbed by HIGH-2 fix as expected.

⟦BEHAVIORAL-REVIEWED⟧ tool="recertification" ticket="RECERT-1" date="2026-06-22"
