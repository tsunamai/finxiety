# DOC-1 (Document Checklist Generator) — Behavioral Science Validation

**Tool:** DOC-1, `/tools/document-checklist`
**Persona applied:** ALICE Primary User (`finxiety/research-findings/persona-alice-primary-user.md`)
**Reviewer:** behavioral-science
**Date:** 2026-06-22
**Files reviewed:**
- `finxiety/src/routes/tools/document-checklist/+page.svelte`
- `finxiety/src/lib/data/doc-requirements.json`
- `finxiety/src/lib/calculators/doc-checklist.ts`

**Moment of use (per persona, lines 106–116):** Dani arrives here from "a bill she can't pay" or "a recertification deadline approaches." She is in focused, anxious problem-solving mode, on her phone, with a 5–10 minute window. She has a letter that says she has 30 days and does not fully understand what is required. This is the exact moment DOC-1 is built for — it is named in the persona's trigger calendar for this tool.

---

## Scarcity Mindset

- **Cognitive steps required:** 2 (pick programs, pick state). One screen, one submit, answer appears in place. This is at the floor of what is achievable for a multi-program tool. **Pass.**
- **Tunneling risk:** Low. The tool *uses* tunneling productively — it collapses the multi-program document burden into one list with each document stated once (`buildChecklist`, de-dup by `id`). A tunneled user who would otherwise track four separate agency lists in her head gets one. The "Needed for X and Y" tag (line 270) does the cross-program bookkeeping *for* her so she does not have to hold it in working memory.
- **Present-bias risk:** None. The tool asks for nothing future-oriented. It answers "what do I bring?" — a present, tactical question. No projection, no planning, no "six months from now."
- **Bandwidth tax:** The de-duplication and the "one bill covers all three" divergence notes (e.g. CA HEAP energy bill note, JSON line 307) actively *reduce* load — they prevent her from gathering the same document three times.
- **Finding: PASS.** This is one of the most scarcity-aware flows in the suite. The tool's core mechanic is bandwidth relief.

---

## Financial Shame

- **Potential shame triggers reviewed:**
  - Result heading "Documents commonly requested for…" (line 204) — frames the list as *what the program asks for*, not *what you are missing*. No checkboxes the user ticks against herself, no "you have / you don't have" framing, no completion percentage. This is correct: the list is a request from the agency, not an audit of Dani.
  - Status pills "Required / Choose one / If it applies" — describe the *document's* role in the application, not Dani's readiness. None reads as a grade.
  - No count of "X of Y documents ready." Nothing tallies her against a standard. **Good.**
- **Result display (worst-case = long list):** A long checklist is the natural output when many programs are selected. Because nothing in the UI asks "do you have this?" or marks items as missing, a long list reads as *thoroughness of the guide*, not *distance she has to travel*. The framing holds. **Pass.**
- **Implicit comparisons:** None found. No "most applicants," no "experts recommend," no benchmark. The "national baseline" banner (line 229) describes data coverage, not the user.
- **Finding: PASS.** The tool successfully renders a potentially anxiety-inducing artifact (a bureaucratic document list) as a planning aid rather than a verdict, primarily by never asking the user to self-assess against it.

---

## Trust

- **Trust-building elements:**
  - No login, no email, no PII. Starts working immediately. (Persona "What Would Make Her Trust This Tool" #1.)
  - "This is a guide, not the official list. Your county may ask for something different." (line 207–209) — this *under-claims*. For a user with calibrated distrust of financial systems, a tool that admits its own limits and points to the real authority is more trustworthy than one that asserts completeness. Strong trust move.
  - Every program links to its own official source (lines 287–302), and the copy/print artifacts carry those URLs out with the user. The tool positions itself as a bridge to the authority, not a replacement for it.
  - Plain-language document descriptions ("Recent mail with your name and address," JSON line 62) sound like a person, not an agency form.
- **Trust-breaking elements — one flag (see Critical Findings #1):** The `condition_note` strings render as second-person imperatives — e.g. "Bring this if anyone in your household is self-employed" (line 267 + JSON condition notes). The verb "Bring this" is mild, but several condition notes enumerate *household circumstances* ("if anyone in your household receives disability, unemployment, child support, or other benefits"). For a user who has been surveilled and means-tested by agencies, a checklist that recites her possible household conditions back to her can momentarily echo the interrogation posture of the application itself. This is a tone risk, not a verdict — graded Low.
- **Trust arc:** Starts neutral-to-cautious (a benefits-adjacent tool). Earns trust quickly via the no-ask entry and the "guide, not official list" humility. Ends *higher* than entry: she leaves with a portable artifact and the official links, with the tool having explicitly told her where the real authority lives.
- **Finding: PASS.**

---

## Locus of Control

- **Actionable vs. verdictive:** Strongly actionable. The output is a literal list of objects she can go gather. This is the rare Finxiety output that converts directly into a physical next action with no interpretation required. It hands her agency rather than measuring her.
- **Path forward:** The list *is* the path forward. Beyond that: official links (apply/verify), copy-to-text, print/save-PDF, and the screener bridge for the upstream "which programs?" question.
- **"Choose one" framing supports agency:** The `one_of` items with "Any one of these works" (line 257) plus the accepts list explicitly tell her she has options and does not need the one specific document she may not have (e.g. a Social Security *card* — the SSN accepts list includes W-2, pay stub, SSA letter). This is agency-preserving: it widens the set of things that count rather than naming one gate she might fail. Excellent.
- **Finding: PASS.**

---

## Cross-Tool Bridge

- **Bridge present and always-on:** Footer signpost (lines 323–328) links to the Benefits Screener for "Not sure which programs you may qualify for?" Target route `/tools/screener` confirmed live (`<h1>Benefits Screener`). The bridge is persistent, not gated behind a near-zero state.
- **Character:** Informational and non-directive. "can help you find out" — no "you should," no urgency. Matches Do No Harm. **Pass.**
- **Near-zero / empty result state:** When `buildChecklist` returns an empty array (a program/state combination with no data), the tool shows a "Good to know" signpost (lines 220–226) that points to the official links as the reliable source. It does **not** imply the user did anything wrong — the framing is "we could not build a list," locating the gap in the *tool*, not the user. This is the correct ownership of failure. See Finding #2 for a refinement.
- **Finding: PASS.**

---

## Enabling Environment (Matuschak)

- **Changed capability:** Yes — genuinely. Before: Dani has a 30-day letter and a vague dread about what to gather. After: she has a concrete, de-duplicated, portable list and knows that one energy bill can cover three programs' residency proof. That last fact is a *changed mental model*, not just a retained number. She now understands something about how these applications overlap that she did not before.
- **After-the-tab question:** This is DOC-1's strongest dimension. The copy-to-text and print/save-PDF mechanics (lines 311–317, `buildClipboardText`) produce a real artifact that survives the tab closing. The clipboard text includes statuses, accepts lists, condition notes, "needed for" tags, *and* the official source URLs. In 24 hours, Dani can be standing at her kitchen table with a printed list, gathering documents, with the official links to verify. The tool's value does not evaporate when she closes the browser — it walks out the door with her. This is a model enabling-environment mechanic for the suite.
- **Active vs. passive:** Moderately active. She makes choices (which programs, which "choose one" document she actually has). The artifact then anchors *repeated* engagement over the days she spends gathering — she returns to the list, not the website. That return-over-time pattern is exactly what Matuschak says durable understanding requires.
- **Illusion-of-understanding risk:** Low. The tool does not produce a false "I've got this" — it produces an actual to-do list with an explicit "confirm with the official link" caveat, so the clarity it creates is bounded and honest.
- **Finding: PASS.** Best-in-suite for portability of the artifact.

---

## Critical Findings

Ordered by severity. No Critical or High findings.

### 1. (LOW) Conditional notes recite household circumstances in a way that can echo means-testing
**Where:** Rendered conditional items, `+page.svelte:267`; source strings in `doc-requirements.json` (e.g. `income.benefit_income` condition_note, lines 81, 165, 226; `income.self_employment`, lines 72, 156).
**What:** "If it applies" items render as "Bring this if anyone in your household receives disability, unemployment, child support, or other benefits." The enumeration of household conditions, in the second person, can briefly read like the application's own surveillance posture rather than a neutral planning hint — a tone risk for a user with calibrated distrust of agencies (persona lines 86–90).
**Why it matters for this user:** Dani's distrust is rational and earned. The tool's overall posture is trust-building; this is the one place where the *agency's voice* leaks through the Finxiety voice.
**Solution space (for PM / brand):** Consider softening to a frame that locates the condition in the document rather than in her household — e.g. lead with "Only if this is you:" or "Skip this unless —". Brand agent owns the exact wording. Not a blocker.

### 2. (LOW) Empty-state is honest but offers no bridge to the screener at the point of failure
**Where:** `+page.svelte:220–226`.
**What:** When no list can be built, the signpost points only to the per-program official links. The screener bridge exists in the page footer but is not surfaced *in* the empty-state box. A user who hit an empty result may be exactly the user who is unsure she picked the right programs.
**Why it matters:** The persona's "no path forward = a verdict" principle is satisfied by the official links, so this is a refinement, not a gap. But the empty state is the highest-value moment to offer the "not sure which programs?" screener handoff.
**Solution space:** Optionally add the screener crosslink inside the empty-state signpost. Low priority; the footer bridge already covers it on the page.

### 3. (LOW / informational) "Required" pill in terracotta carries mild alarm weight
**Where:** `.status-required` styling, `+page.svelte:516`.
**What:** Terracotta (the brand's emphasis/alert-adjacent color) on the "Required" pill is the most visually assertive element on the results screen. It is text-labeled (accessible), and "Required" is factual, not shaming. No change recommended — noting only that "Required" reads as a property of the *application*, not a judgment of the user, and the current framing holds that line. Logged for awareness, no action.

---

## What the Tool Does Well for This User

- **It relieves bandwidth instead of taxing it.** The de-duplication and "one bill covers three programs" notes do the cross-program bookkeeping the user would otherwise carry in working memory. This is the scarcity-mindset lens applied correctly at the mechanic level, not just the copy level.
- **It hands over agency in physical form.** The result is a list she can act on with zero interpretation, and the copy/print artifact means the tool's value survives the closed tab. Best-in-suite for the after-the-tab question.
- **It under-claims and points to the real authority.** "A guide, not the official list" plus per-program official URLs is precisely the trust posture this user rewards.
- **The "Choose one / any of these works" pattern widens the gate.** Instead of naming the one document she might not have, it tells her how many different things count. This is agency-preserving design, and it directly addresses the "I don't have my Social Security card" panic.
- **It owns its own failure.** The empty state says "we could not build a list," not "no documents found for you." The gap is located in the tool, never in the user.

---

## Seal

No Critical or High findings. Three Low findings, all tone/refinement, none blocking; routed to PM/brand for disposition.

⟦BEHAVIORAL-REVIEWED⟧ tool="DOC-1" ticket="DOC-1" date="2026-06-22"
