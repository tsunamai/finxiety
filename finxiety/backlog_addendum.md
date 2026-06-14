# Backlog Addendum — Proposed Architectural Shift: "Workflow Assistant" Engine

**Status:** NOT YET INTEGRATED. This is new since the original backlog.md was 
handed off. Please evaluate against the existing Track 1 / Track 2 tools and 
the "Cross-Tool Notes" section before treating this as additive — it may 
change how some existing tools should be built (see "Possible Architecture 
Impact" below).

---

## The new idea

A generalized **"Workflow Assistant"** — a single reusable engine with three 
layers:

1. **Engine (built once):** A form-based UI that takes user input, assembles 
   a prompt from a template (filling in placeholders with user input), calls 
   the Claude API, displays the output, AND displays the prompt that was used 
   — so users can learn the pattern over time.

2. **Template library (swappable JSON per audience):** Each template entry 
   contains: task name, short description, list of input fields (with labels/
   types), and a prompt template string with `{placeholder}` syntax matching 
   the input fields. Examples of tasks: "write a thank-you note," "draft a 
   reply to this email," "summarize this document," "check if this message 
   seems like a scam," "write a cover letter paragraph for this job posting."

3. **Audience pack (copy/branding layer only):** Same engine + a different 
   template library + different landing page copy. E.g., "AI Helper for 
   Seniors" (templates: messages to family, scam-checking, organizing lists), 
   "AI Job Search Coach" (templates: resume bullets, cover letters, interview 
   prep), "AI Toolkit for Small Nonprofits" (templates: donor thank-yous, 
   grant language, social post drafts, meeting summaries).

**Core principle:** the engine, input-handling, API call, and prompt-display 
logic are identical across all audience packs. Only the JSON template library 
and the landing-page copy differ. New audiences = new JSON file, not new code.

---

## Suggested build order if added

This would be its own track (Track 3) and would NOT block Track 1 or Track 2. 
Suggested first audience pack: senior tech help (testable in person, e.g. via 
a local senior center), since it's the most concrete near-term validation 
opportunity.

V1 scope: 5-8 templates in the first audience pack, engine with: input form → 
prompt assembly → API call → output display → "show me the prompt" toggle. 
No accounts, no storage of user inputs/outputs (consistent with existing 
no-PII constraint).

---

## Possible Architecture Impact — please flag if relevant

1. **Template-as-primitive:** If this engine is built, some existing Track 2 
   tools (e.g., Tool 7's "explain my deduction," Tool 6's "where do your work 
   hours go" framing/output text) could potentially be expressed as templates 
   in this engine rather than as fully separate calculators — OR they could 
   remain separate calculators that also get exposed as templates 
   (calculator does the math, template explains the result in plain language). 
   Decide whichever requires less duplication.

2. **Shared input model overlap:** The existing `/lib/input-model` (household 
   size, income, state, etc.) is for Track 1/2's financial calculators. The 
   Workflow Assistant's input fields are per-template and mostly free-text 
   (names, message content, job descriptions) — likely a SEPARATE input 
   model, not a replacement. Flag if you see a cleaner unification.

3. **API usage / cost consideration:** Unlike Tracks 1-2 (pure client-side 
   calculation, no API calls), this engine requires live Claude API calls per 
   use. This introduces: (a) an API cost per interaction, (b) a need for 
   rate-limiting or usage caps to control cost, (c) possibly an API key 
   management question (user's own key vs. a shared backend key — flag this 
   as a decision point, don't assume).

4. **This could become the "connective tissue" for the whole suite** — e.g., 
   a quiz result (Tool 4/11) could link to a Workflow Assistant template that 
   helps the user draft a follow-up action (a letter, an email, a question 
   for a caseworker), turning "here's information" into "here's a drafted 
   next step." Flag whether this changes how Tools 4/5/11 should structure 
   their "related tools" footers.

---

## Open questions for Claude Code to resolve or flag back

- Does this fit better as a new top-level track, or as a feature/page within 
  the existing app shell mentioned in Cross-Tool Notes?
- Given the no-PII / no-storage constraints elsewhere in the backlog, how 
  should API key handling work for a tool that requires live LLM calls?
- Is there meaningful code reuse between this engine and any existing Track 
  1/2 tool, or is it cleanly independent?
