# Behavioral Science Review: GUIDE ("What's going on?")
**Route:** `/tools/guide`
**File reviewed:** `finxiety/src/routes/tools/guide/+page.svelte`
**Reviewer:** behavioral-science agent
**Persona applied:** ALICE Primary User — `finxiety/research-findings/persona-alice-primary-user.md`
**Date:** 2026-06-22
**Viewport scope:** 375px primary

---

## Context

GUIDE is the FRONT-DOOR made concrete: a situation-picker that routes a new user to 2–4 matched tools. For most users this is the *first* Finxiety surface they touch — arriving from a caseworker's text or a QR code in a waiting room (persona §"How She Finds Finxiety"). That makes the trust arc and the recognition-of-self moment more load-bearing here than in any single calculator. The review weights those two lenses heaviest.

The tool is structurally excellent for a scarcity user: no inputs, no math, one decision, instant result, no PII. The findings below are about *who is left out* and *what happens after the tap*, not about cognitive load — which is already near-optimal.

---

## Scarcity Mindset

- **Cognitive steps required: 1.** Read labels → tap one → see tools. This is the gold standard. No second screen, no compounding decision, no field to fill. Persona §"Cognitive State": "She cannot be asked to do complex calculations before she gets the answer." GUIDE asks for nothing.
- **Tunneling risk: LOW, with one note.** A tunneled user in crisis (Scenario B — "$47 and rent hits in 9 days") scans for *her* exact problem. The labels are circumstance-framed, which is right, but they are also *broad* ("I got some financial news — a raise, a job change, or an unexpected bill" bundles three very different acute moments). A user tunneling on "unexpected bill I can't pay" may not recognize that her moment lives inside a label that opens with "a raise." Tunneling narrows attention to the literal first words. See Critical Finding 2.
- **Present-bias risk: NONE.** No label asks her to think about the future. Every label names a present circumstance. "I'm trying to get on top of debt, or start saving" is the only future-leaning one, and it's framed as a present effort ("trying to"), not a future goal. Correct.
- **Finding: PASS.** Cognitive footprint is as low as a routing page can be. The scarcity concern is not load — it's whether the tunneled user finds her label in the first two words, which is a coverage/labeling issue handled below.

---

## Financial Shame

- **Potential shame triggers — walked label by label:**
  - "I'm trying to figure out what programs or assistance I might be able to get" — circumstance-framed, no deficit marker, no "poor," no "low-income," no "qualify for help because you're struggling." PASS. "might be able to get" is appropriately tentative and non-presumptuous.
  - "I got some financial news — a raise, a job change, or an unexpected bill" — neutral, event-framed. The raise is listed *first*, which quietly normalizes upward movement and avoids leading with crisis. PASS.
  - "I want to understand my paycheck or what my taxes actually mean" — frames confusion as normal, not as ignorance. PASS.
  - "I'm trying to get on top of debt, or start saving" — "trying to get on top of" honors effort and competence (persona §"What She Is Not": she is already powerful, already managing). It does not say "fix your debt" or "you should be saving." PASS.
  - "I just want to understand how money or benefits actually work" — "just want to understand" is curiosity-framed, low-stakes, no remediation tone. PASS.
- **Result display:** The matched-tool rows are question-framed ("Got a raise — do you actually come out ahead?", "How many months of runway do you actually have?"). These name an anxiety without delivering a verdict. No number, no grade, no score appears on this page. There is no near-zero result state on GUIDE — it routes, it doesn't measure — so the highest-shame-risk surface (a bad number) does not exist here. Correct for an entry point.
- **Implicit comparisons:** None. No "most people," no "experts recommend," no standard the user is measured against. The word "actually" recurs in tool questions ("what my taxes *actually* mean," "do you *actually* come out ahead") — this is well-judged: it validates her suspicion that she's been misled, rather than implying she's behind. It sides with her against the system, not against her.
- **Finding: PASS.** This is the strongest lens for this tool. The label set was clearly written in the user's voice and audited for deficit language. Nothing here confirms her worst fear about herself.

---

## Trust

- **Trust-building elements:**
  - "Free. No account. Nothing stored." (line 194) — present, immediately below the subhead, above the fold at 375px. This is the single most important trust marker for a first-touch surface and it is correctly placed. Persona §"What Would Make Her Trust": "It starts without asking for anything." GUIDE asks for nothing and *says so*.
  - No email field, no signup, no login. The whole interaction is a tap.
  - Labels "sound like a person, not a brochure" (persona trust criterion #2). They do. "I just want to understand how money or benefits actually work" is spoken English.
  - Tool descriptions are concrete and non-salesy ("Food, health coverage, phone, energy, school meals — see which California programs you may qualify for").
- **Trust-breaking elements:**
  - **The "Nothing stored" claim collides with the recertification tool it routes to.** The `recertification` tool's own description on this page says "Get a calendar reminder before your SNAP or Medicaid recertification deadline." A reminder implies persistence. A user who just read "Nothing stored" and then taps into a tool that promises to remember a date for her may experience a small trust fracture — *did they lie about nothing stored?* (The reminder is almost certainly a generated .ics file, client-side, nothing server-stored — but the user doesn't know that, and the juxtaposition on a single screen invites the doubt.) This is the most fragile point in the trust arc. See Critical Finding 1.
  - The arrow glyph and other items the UX review flagged are aesthetic, not trust-breaking.
- **Trust arc:** Strong start (asks for nothing, says so), strong middle (plain-voice labels she recognizes herself in), one fragile seam at the recertification hand-off. A user who has been failed by financial tools before would *stay* on this page. The question is whether one specific downstream promise reintroduces the doubt the page worked to dissolve.
- **Finding: FLAG.** The page itself earns trust cleanly. The "Nothing stored" + "calendar reminder" juxtaposition is the one place the trust the page builds could be spent downstream. Not a fail — the claim is presumably true — but the user can't tell, and on a trust-critical entry surface that ambiguity matters.

---

## Locus of Control

- **Does the output feel actionable or verdictive?** Actionable. GUIDE produces *options*, not assessments. There is no condition being diagnosed, so nothing to feel fated about. Each result row is a door, not a mirror (persona §"What Would Make Her Trust" #7: "A result with no path forward is just a mirror... What she needs is a door.").
- **Path forward:** Every situation surfaces 2–4 concrete next tools, each a live link. The `.fallback` row ("Not quite right? See all tools →") guarantees no dead end even when the match is imperfect — this preserves agency for the user whose situation didn't fit cleanly. She is never stuck on this page.
- **External-locus risk:** The one place this lens bites is the *benefits* situation. A user who taps "I'm trying to figure out what programs or assistance I might be able to get" is acting *against* external locus — she's reaching for resources. The tools she's routed to (screener, document-checklist, recertification, myth-quiz) reward that reach. Good. No label frames her situation as something happening *to* her with no recourse.
- **Finding: PASS.** GUIDE structurally increases agency: she arrives with a vague problem, she leaves with named, clickable paths. She ends with more options than she came in with.

---

## Cross-Tool Bridge

- **This tool IS the bridge.** GUIDE is the suite's connective tissue made into a surface — its entire job is non-directive routing. So the lens here inverts: instead of "does a near-zero result signal what else exists," the question is "does the routing itself stay informational, not directive?"
- **Character of the routing: informational, not directive.** Critically, the copy never says "you should." Subhead: "Pick the situation that fits — we'll show you the tools that match." That is a description of a mechanism, not an instruction. Result rows are questions, not commands. This satisfies Do No Harm #1 (no recommendations) at the routing layer. Strong.
- **Warm handoff vs. ad:** The tool descriptions read as warm handoffs — concrete, plain, no urgency, no "limited time," no "don't miss out." Persona §"What This Means for the Suite": "The suite's value compounds when tools reference each other without hard-selling the next one." GUIDE does exactly this.
- **One structural gap:** The *benefits* situation routes to screener, doc-checklist, recert, and myth-quiz — but a user who lands here in genuine crisis ("I can't feed my kids this week") is routed to a *screener* (which estimates eligibility) rather than to anything that names immediate food access. The bridge to "what can I do *right now*" vs. "what might I qualify for *eventually*" is missing. This is a coverage gap, not a routing-character gap. See Critical Finding 3.
- **Finding: PASS** on character (non-directive, warm). The coverage gap is logged separately below.

---

## Enabling Environment (Matuschak)

- **Changed capability:** After GUIDE, what can Dani *do* that she couldn't before? Honestly: she can now *name and locate* tools that match her situation. That is a real capability change for a user who didn't know the suite's contents — GUIDE converts "there's a website with some tools" (caseworker's vague referral) into "there are specific tools for *my exact problem* and here they are." That's a genuine reduction in the search cost of the whole suite. Not nothing.
- **The after-the-tab question — what is different in 24 hours?** This is where GUIDE is weakest, and it's inherent to its role. If Dani taps a situation, scans the four tool rows, gets interrupted (kid, work, bus), and closes the tab *before clicking through to a tool* — nothing is different tomorrow. GUIDE is a router; its value is entirely realized in the *next* click. It has no standalone takeaway. A user who bounces at the routing layer leaves with the same financial situation and possibly a slightly clearer sense that "there are tools for this" — which is real but fragile, and won't survive a week without a return path. GUIDE does not give her anything to *remember* or *act on* by itself. See Critical Finding 4.
- **Active vs. passive:** Selecting a situation is a genuine active choice — she has to locate herself in the label set, which is mild active engagement (better than passive reading). But the engagement ends at selection; the results are received passively. The tool asks one question of her and then talks.
- **Illusion of understanding risk: LOW.** GUIDE doesn't claim to teach her anything, so it can't produce false understanding. It claims to route, and it routes. The honesty of its scope protects it here. There's no "I finally get it" moment to be hollow.
- **Finding: FLAG.** GUIDE is *informative and modestly enabling at the suite level* (it changes the cost of finding the right tool) but has near-zero standalone after-the-tab value if the user bounces before clicking through. For an entry surface this is acceptable by design — but it raises the stakes on every downstream tool delivering, and it means GUIDE should never be the *only* thing a distribution partner hands out. Logged for the PM, not a build blocker.

---

## Critical Findings

### 1. HIGH — "Nothing stored" trust claim is undercut by the recertification "reminder" promise on the same screen
**File:** `finxiety/src/routes/tools/guide/+page.svelte`, line 194 (trust line) vs. lines 76–80 (recertification description)
**Why it matters for ALICE:** Trust is earned in the first 30 seconds and spent in an instant (persona §"What Would Make Her Trust"). This page makes a clean, absolute promise — "Nothing stored" — and then, three rows down inside a results set, offers to remember a deadline for her ("Get a calendar reminder before your SNAP or Medicaid recertification deadline"). To a user with calibrated distrust of financial systems, "you remember my renewal date" reads as *storage*. She cannot see that the reminder is a client-generated .ics with nothing held server-side. The apparent contradiction is exactly the kind of small inconsistency that confirms "this is like every other tool that wasn't straight with me."
**Solution space:** Either (a) make the recertification description self-evidently local ("Generate a calendar reminder you add to your own phone — we keep nothing"), or (b) soften the global claim to be precise about what "stored" means ("Free. No account. We never store your information."), so a user-side calendar file doesn't read as a contradiction. Option (a) is preferred — it resolves the doubt at the exact point it arises and reinforces the trust line rather than retreating from it. This is a copy change, not a logic change.

### 2. HIGH — The "financial news" label buries "an unexpected bill" behind "a raise," risking non-recognition by the tunneled crisis user
**File:** `finxiety/src/routes/tools/guide/+page.svelte`, line 41
**Why it matters for ALICE:** The persona's single most frequent acute trigger is "Unexpected expense hits (every 6 weeks or so)" and "A bill she can't pay arrives (several times a year)" — these are her *most common reachable moments* (persona §"Acute Trigger Calendar"). A user in Scenario B (tunneled, anxious, "$47 and rent hits in 9 days") scans labels for *her* word. The label "I got some financial news — a raise, a job change, or an unexpected bill" leads with "a raise" — an experience she is *not* having — and a tunneled scanner may pass it by before reaching "unexpected bill" at the end. The most common entry moment is the hardest to find. Also: bundling a *raise* (the CLIFF-1 moment, emotionally complex, upside) with *an unexpected bill she can't pay* (the EMG-1/BEN-1 moment, acute scarcity) under one card forces two opposite cognitive/emotional states to share a label.
**Solution space:** Consider splitting into two labels, or at minimum re-ordering so the high-frequency crisis moment leads: "Something expensive came up — a bill, a repair, a change in my hours or pay." Lead with the most common acute trigger, not the rarest (a raise). The persona is explicit that tools should "name its moment, not its category" — and the most-named moment should be findable in the first three words.

### 3. MEDIUM — No label maps to the acute "I can't afford X *right now*" moment; benefits routing assumes eligibility-estimation timeframe, not crisis timeframe
**File:** `finxiety/src/routes/tools/guide/+page.svelte`, lines 33–59 (situation set)
**Why it matters for ALICE:** Two of the persona's named search strings are "what to bring to snap application" and the implied "I can't afford groceries this week." The crisis-timeframe user ("my kid needs food today") and the planning-timeframe user ("I wonder what I qualify for") are both routed to the same `screener` — a tool that *estimates future eligibility*, not one that points to immediate access. A user in acute food crisis who taps the benefits label and lands on a multi-program eligibility estimator may experience it as too slow for her moment and bounce. The screener is the right tool for "what might help me"; it is not obviously the right tool for "I need help today."
**Solution space:** This is partly a suite-coverage question above GUIDE's pay grade — flag to PM. Within GUIDE, the `benefits` label could be split or its tool order reconsidered so the most immediately actionable tool leads. If/when a tool naming immediate resources (211, food bank locators, emergency assistance) exists, it should be the first row under the benefits situation. For now: log as a known coverage gap, not a GUIDE defect.

### 4. MEDIUM — GUIDE has near-zero standalone after-the-tab value if the user bounces before clicking through
**File:** conceptual — the tool as a whole
**Why it matters for ALICE:** Her window is "five to ten minutes... optimistic" and she is "managing multiple things at once" (persona §"Cognitive State"). A real fraction of users will select a situation, scan the rows, and get pulled away before clicking through. For those users, GUIDE delivered nothing durable — no number, no fact, no takeaway — because its entire value is in the *next* click. She won't bookmark and return (persona §"Acute Trigger Calendar": "She doesn't remember URLs... She will not bookmark and return unless the result was immediately valuable"). GUIDE's result is not *immediately valuable on its own* — it's a promise of value one tap away.
**Solution space:** Mostly accept-by-design — a router's job is to route. But two mitigations worth considering: (a) ensure GUIDE is never distributed as a *standalone* artifact by partners without a direct-tool fallback (PM/distribution note), and (b) consider whether the matched-tool rows could carry a one-line *fact* or *reassurance* that survives even an un-clicked visit (e.g., the benefits situation noting "Most people who qualify for these never apply" — a durable, myth-puncturing takeaway that lands even if she bounces). Low priority; flagged so the after-the-tab gap is conscious, not accidental.

### 5. LOW — `tip-calculator` under the "learning" situation is a weak intent match
**File:** `finxiety/src/routes/tools/guide/+page.svelte`, line 57
**Why it matters for ALICE:** Same finding the UX review logged (#6). A user who taps "I just want to understand how money or benefits actually work" and sees a tip *calculator* as a match may feel the tool slightly misread her — a small trust ding on an entry surface. The tip tool's *wage-context* framing ("What do servers in your state actually earn?") is genuinely educational, so the match is defensible, but it's the weakest of the four. Low priority; resolve when the situation set is next revised.

---

## What the Tool Does Well for This User

- **It asks for nothing and says so.** "Free. No account. Nothing stored." on a first-touch surface is exactly the trust contract the persona requires, placed exactly where she'll see it.
- **The label set is written in her voice and audited for shame.** Not one label uses a deficit marker, a status word, or a comparison. "Trying to get on top of debt" honors competence; "just want to understand" honors curiosity without remediation. This is hard to do and it's done.
- **The routing is genuinely non-directive.** No "you should." The whole interaction is "here's what matches," which satisfies Do No Harm at the connective-tissue layer of the entire suite.
- **One cognitive step, zero math, zero PII, no dead ends.** The `.fallback` escape hatch means even a misread situation leaves her with a path. She always ends with more options than she came in with.
- **The "actually" framing sides with her against the system.** "What your taxes actually mean," "do you actually come out ahead" — this validates her earned suspicion rather than implying she's behind. Subtle and right.

---

## Disposition

Two HIGH findings (the "Nothing stored" trust seam at the recertification hand-off, and the buried crisis label) remain unresolved. Both are copy-level changes, not logic or architecture changes, and both bear directly on the persona's two most load-bearing lenses for an entry surface: trust earned-then-spent, and the tunneled crisis user finding her own moment. Per the validation gate, sign-off is withheld until these are addressed or accepted with deliberate rationale by the PM.

The MEDIUM and LOW findings are flagged for the PM and the next situation-set revision; they do not block on their own.

⟦BEHAVIORAL-BLOCKED⟧ tool="guide" ticket="GUIDE" date="2026-06-22"
Resolve or consciously accept HIGH findings 1 and 2 before public distribution.

---

## Re-verify

**Date:** 2026-06-22
**Trigger:** Both HIGH findings addressed at the copy level. Re-walked at 375px against the ALICE persona.
**File re-read:** `finxiety/src/routes/tools/guide/+page.svelte` — situations array (lines 33–59), recertification `toolMeta` entry (lines 76–81), page trust line (line 194).

### HIGH-1 — "Nothing stored" trust seam at the recertification hand-off → RESOLVED

**Was (line 78):** "Get a calendar reminder before your SNAP or Medicaid recertification deadline."
**Now (line 78):** "Calculate your renewal date and add a reminder to your own phone calendar — nothing is stored."

The juxtaposition concern is resolved, and resolved at the exact point the doubt arose. Three things make this work for ALICE:

- **"your own phone calendar"** locates the artifact on her device, not on a server she has to trust. The reminder now lives where she already has trust (her phone), not in an account the tool keeps on her behalf. This is the move that dissolves the "did they lie about nothing stored?" reflex.
- **"nothing is stored"** restates the page-level trust line (line 194, "Nothing stored") at the moment of highest doubt, converting a potential contradiction into a second confirmation. A user who reads both lines now leaves with the claim reinforced twice rather than contradicted once.
- It stays **plain, not technical.** No ".ics," no "client-side" — language that would mean nothing to Dani and could itself read as evasive jargon. "Your own phone calendar" carries the same guarantee in words she owns.

This is exactly Solution Space option (a) from the original finding. The recertification row now reinforces the trust contract instead of spending it.

### HIGH-2 — buried crisis label → RESOLVED

**Was (line 41):** "I got some financial news — a raise, a job change, or an unexpected bill"
**Now (line 41):** "I got some financial news — an unexpected bill, a job change, or a raise"

The tunneled crisis user (Scenario B — "$47 and rent hits in 9 days") scans the first words after the dash for *her* word. The most frequent acute trigger on the persona's Trigger Calendar — "Unexpected expense hits (every 6 weeks or so)" — now leads. The rarest, highest-stakes, emotionally-complex trigger (a raise: "rare, but very high stakes") correctly moves last. The most-named moment is now findable in the first three words, satisfying the persona directive that a tool "name its moment, not its category."

The full label still umbrellas all three scenarios — bill, job change, raise — without reading as a forced enumeration, because "I got some financial news" is a natural container and the three items read as examples.

### New issues introduced — NONE

- HIGH-1: "nothing is stored" matches the page trust claim with no new persistence promise, no PII implication, no falsifiable technical claim.
- HIGH-2: Reorder is copy-only; routing (line 42 tools array) is unchanged. The secondary half of the original Finding 2 — a *raise* sharing one card with *a bill she can't pay* (two opposite emotional states under one label) — persists structurally, but the **primary, blocking** half (recognition by the tunneled scanner) is resolved by leading with the crisis trigger. Logged as a non-blocking note for the next situation-set revision, alongside the existing MEDIUM/LOW findings.

### Carry-forward (non-blocking, PM-owned)

- MEDIUM Finding 3 (no crisis-timeframe "I need help today" route; benefits label assumes eligibility-estimation timeframe) — suite-coverage, above GUIDE's layer.
- MEDIUM Finding 4 (near-zero standalone after-the-tab value if the user bounces before clicking through) — accept-by-design for a router; distribution note for the PM.
- LOW Finding 5 (`tip-calculator` weak match under the "learning" situation).
- New note: `savings-commitment` description (line 126) asserts "the tool generates a calendar reminder" without the local-ownership phrasing now used in recertification. Lower-stakes (no adjacent "Nothing stored" collision in its result set), but worth aligning to the same pattern on the next copy pass.

### Disposition

Both HIGH findings are resolved with no regressions. The two MEDIUM and one LOW carry-forward findings do not block. Sign-off granted.

⟦BEHAVIORAL-REVIEWED⟧ tool="guide" ticket="GUIDE" date="2026-06-22"
