---
type: validation
agent: brand
tool: MYTH-1 (Benefits Myth-Check Quiz)
date: 2026-06-21
status: reviewed
sign-off: ⟦BRAND-REVIEWED⟧
---

## Brand Review: MYTH-1 — Benefits Myth-Check Quiz

Files reviewed:
- `/Users/naomipinto/Documents/tsunam/finxiety/src/routes/tools/myth-quiz/+page.svelte`
- `/Users/naomipinto/Documents/tsunam/finxiety/src/lib/data/myth-quiz.ts`
- Brand source: `/Users/naomipinto/Documents/tsunam_vault/finxiety/Finxiety — Brand & Mission.md`
- Persona: `/Users/naomipinto/Documents/tsunam/finxiety/research-findings/persona-alice-primary-user.md`

---

### Voice Violations

None that require blocking changes. Two items worth a second look:

- `"No grades, no right answers."` (welcome screen, `estimate-note`)
  The line is fine functionally but slightly pat — it sounds like it's reassuring someone who hasn't yet felt anxious. Consider cutting it entirely and letting the quiz speak for itself. The format already communicates "no grades" by not showing one. That said, this is a preference call, not a violation; the line does no harm and uses plain language.

- `"One more thing (optional, no right answers)."` (synthesis screen, `tool-description`)
  "One more thing" is a mild tech-culture idiom (Steve Jobs register). Not a hard violation, but it reads slightly off-brand for a civic financial tool aimed at Dani. Consider: "Two optional questions. No right answers." — same message, less borrowed register.

- `"A few words is fine."` (synthesis textarea helper text for `assume-cause` prompt)
  Grammatically this is "A few words are fine," but "A few words is fine" reads like natural speech, which is exactly the brand register. Keep as-is. Not a violation.

---

### Do No Harm Flags

None blocking. Two notes for the record:

- **Q2 (benefits cliff) signpost:** "A Benefits Cliff Calculator is in the works. In the meantime, the Benefits Screener can show you which programs you currently qualify for — knowing what you're enrolled in is the starting point for understanding what a raise might affect."
  The phrase "knowing what you're enrolled in is the starting point for understanding what a raise might affect" is informational, not prescriptive. It passes the Non-Advice Rule cleanly. No flag.

- **Score screen reveal body:** "Knowing that changes how you move."
  This is the only line in the entire tool that gestures toward behavioral consequence. It is not a directive — it is an observation about the state of knowing something. Barely a flag; flagging only for completeness. If future copy ever builds on this toward "and here's what you should do," that would need a harder look.

- **No urgency, fear, or scarcity language found anywhere in the data file or the Svelte template.** The data file header comment explicitly notes that "fear/urgency stats" from the research spec were intentionally excluded. That discipline is visible and correct.

---

### Non-Advice Rule Assessment

Clean pass. Every signpost in the data file is framed as "here is what this tool shows" or "here is what exists." Examples:

- "In California, the Benefits Screener checks eligibility for CalFresh, Medi-Cal, WIC, and more in one pass." — describes the tool, makes no recommendation to use it.
- "Missing a recertification deadline is the most common reason eligible families lose benefits they still qualify for. Knowing your deadline in advance is the fix." — the word "fix" is the closest thing to a directive in the dataset, but it frames the informational action (knowing a deadline), not a behavioral instruction (apply now, don't miss it). Passes.

The score screen closes with: "These figures come from public research, linked on each reveal. Programs change. The official sources are the place to confirm what applies to you." This is exactly right: it names official sources, labels the tool's figures as figures (not verdicts), and steps back.

---

### Question Framing — Neutrality Check

All five questions are neutrally framed. None prime toward shame. Specifically:

- Q1 (savings/asset test): frames the question around a system rule, not the user's behavior. No shame vector.
- Q2 (benefits cliff): "sometimes leave a parent worse off" frames the cliff as something that happens to families, not something families cause. Correct.
- Q3 (daily SNAP amount): a pure factual estimate. Zero shame risk.
- Q4 (paperwork/procedural denials): "not because they became ineligible but because of a missed deadline or paperwork" — this framing is important and it is right. The question itself pre-signals that the cause is procedural, not eligibility, before the reveal confirms it. This is an intentional structural move that protects the user from a shame read.
- Q5 (WIC enrollment gap): "what percentage are also enrolled" asks for a number, not a judgment. Clean.

The synthesis Q2 — "If someone told you they'd lost their SNAP benefits last year, what would you assume happened?" — is the most exposure-adjacent question in the set. It asks the user to surface their own assumption about benefit loss, which could activate shame if the user assumes the cause was personal failure. The question is about "someone told you" (third-person framing), which creates distance. That distance is load-bearing. Keep the third-person framing; do not rephrase to first-person under any circumstances.

---

### Reveal Copy Assessment

Strong throughout. The reveals follow a consistent and correct structure: state the real number, explain what it means, locate the gap in system design (not in user behavior). Three reveals deserve explicit praise for system-blaming precision:

- Q1 reveal: "The fear that saving costs you benefits is based on a rule most states quietly retired, without telling anyone." — attributes the gap to absent communication, not user ignorance.
- Q4 structural explanation: "These are access barriers built into the process. The research is explicit: these are administrative failures, not personal ones." — source-backed, direct, does not hedge.
- Q2 structural explanation: "That's a design flaw, not a reflection of how hard someone is working." — clean.

One reveal to tighten on a future pass (low priority):

- Q3 (daily amount) reveal body: "Running short at the end of the month is a structural consequence of that gap." This sentence is doing important work naming the structural cause of end-of-month food stress. It is correct. On a future pass, consider whether the prior sentence ("below what the USDA's own Thrifty Food Plan estimates it costs to eat adequately") could stand alone and let "Running short" open a second sentence rather than following immediately — the rhythm is slightly rushed. Not a violation.

---

### Tool Name and Meta Description

- **Tool name:** "Benefits Myth-Check Quiz" — accurate, plain, no inflation. "Myth-Check" does real work: it signals both that myths exist and that the quiz checks them rather than propagating them. On brand.

- **H1:** "Benefits Myth-Check Quiz" — same as title. Consistent. Fine.

- **Meta description:** "Five things most people believe about benefits programs, and what the data actually shows. Guess first, then see the real number." — this is very good. It names the format (guess/reveal), positions the tool accurately, uses no inflation, and contains the actual CTA-equivalent ("Guess first, then see the real number") in plain language. No violations.

- **Welcome screen description:** "Five questions about how benefits programs work. Guess first, then see the real number." — clean, consistent with meta description, appropriately brief.

---

### Cross-Tool Bridge Copy Assessment

Four of the five questions include a signpost linking to `/tools/screener` (BEN-1). One (Q4/paperwork) has a signpost with no link — it names the category of tool (knowing your recertification deadline) without linking to an existing tool. This is correct behavior: the RECERT-1 tool is not yet live, so there is nothing to link to.

All five signposts pass the "warm handoff, not an ad" test:
- They describe what the linked tool shows, not why the user should go there.
- None use CTAs like "Find out now," "Check your eligibility," or "Don't miss out."
- The California-specific signposts ("In California, the Benefits Screener checks...") accurately scope their geographic claim without implying the user is in California.

The signpost for Q2 is the most complex: it references a not-yet-built tool (CLIFF-1) before redirecting to BEN-1. The framing "A Benefits Cliff Calculator is in the works" is honest and low-key. It does not overpromise or create urgency. This is a considered choice that serves transparency without generating false expectation. Keep.

The signpost-link CTA label is "Open the Benefits Screener →" — descriptive, not imperative. Passes.

---

### Strengths

- **System-blaming reveals throughout.** Every structural explanation locates the gap in policy design, information access, or administrative process — never in the user. This is the hardest discipline to maintain and it holds across all five questions.

- **The data file comment on excluded content** ("Research-only framing, the 'myth label' lines, unverified aggregate figures, fear/urgency stats... It must never render on screen.") shows that the team already applied the Do No Harm filter before the copy reached the template. This is the right architecture — the guard is in the data layer, not just in design review.

- **Score screen is not a grade.** "5 of 5 reveals seen" is not a score; it is a count of what the user did. There is no comparison to a standard, no "well done," no "try again to improve." The framing treats the quiz as an experience, not an assessment.

- **Synthesis prompts are ungraded and optional.** The `estimate-note` ("optional, no right answers") matches the design. The free-text field has a placeholder that normalizes brevity ("A few words...") without making it feel truncated.

- **Source discipline is excellent.** Every question has at least two sourced citations, linked to CBPP, USDA, Federal Reserve, PMC/AJPH — authoritative, verifiable. The sources are collapsed by default (no cognitive load) but fully accessible.

- **Progress bar starts at 0%, not 20%.** The bar fills only after a question is completed, not in anticipation of it. This avoids a false sense of earned progress that could feel manipulative.

- **The input field hint for dollar amounts** reads "A dollar amount from $1 to $30 per day" — it preserves the units from the question (per day) rather than stripping them, which means the user is never confused about what scale they're estimating on. Small but right.

---

### Distribution Notes

- **Primary discovery path:** Not search-led. The ALICE persona finds Finxiety through trusted referral (caseworker, friend, community health center QR code), not through search. MYTH-1 is unlikely to be someone's entry point via organic search because the search behavior that precedes it ("do I qualify for SNAP," "benefits cliff calculator") maps to specific tools, not quizzes.

- **Secondary discovery path:** MYTH-1 is likely to be a warm-up tool — someone lands on BEN-1, gets a result, sees a "Related" or "Also on Finxiety" link to MYTH-1, and takes the quiz as a follow-on. This means the quiz's most reliable distribution channel is the cross-tool bridge, not direct discovery.

- **Shareable moment:** The quiz has a genuine shareable moment — the score/results screen. "I just took this quiz and found out only 9 states still count savings against SNAP eligibility" is share-worthy in a way that a benefits eligibility result is not (privacy). The tool does not currently include a share affordance. For the launch milestone, this is fine; a share feature is a distribution optimization, not a brand concern. Worth flagging to PM for the distribution sprint.

- **The synthesis Q2 framing** ("If someone told you they'd lost their SNAP benefits last year, what would you assume happened?") is also interesting from a distribution angle: it surfaces the user's prior mental model before correcting it. If the tool ever collects aggregate, anonymized responses, that data has genuine policy research value and could be shared with community partners as a distribution unlock. Not a copy issue — flagging for PM.

- **California scope of signposts:** All signpost links point to `/tools/screener` which is presented as California-specific. If MYTH-1 is eventually distributed nationally, the signpost copy will need a conditional or a national benefits tool to link to. No action needed now — MYTH-1 is launching in a California-first context — but worth noting in the ticket for MYTH-2 or the national expansion milestone.

---

⟦BRAND-REVIEWED⟧
