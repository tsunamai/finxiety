# Tsunam Labs — Experiment Sketchbook

_Portfolio framework: 6 experiments max per quarter · quarterly review · no experiment lives forever_

---

## Active

_Nothing in flight yet. Pick from Seeds when the mood strikes._

---

## Priority Seeds

Higher confidence, clearer revenue path, or stronger portfolio fit than general Seeds.

_Reviewed 2026-06-18: brand, legal, and engineering feasibility assessed for all four ideas below._

| # | Name | One-liner | Format | Hypothesis / notes | Legal / build notes |
|---|------|-----------|--------|--------------------|---------------------|
| P-1 | Access Gap Navigator | Give people the system-navigation knowledge that wealthy people's advisors, lawyers, and brokers carry — healthcare appeals, bill negotiation, tenant rights | Browser tool (static, stateless) | Same user and mission as Finxiety, adjacent domain. Start with one module: insurance denial appeals (180-day window, internal vs. external review, template letter). Content/editorial problem, not an engineering problem — knowledge is public but scattered. Uses the exact Finxiety production model. **Brand:** most natural portfolio fit, could live inside Finxiety or as a sibling property. | **Legal:** safe lane is literacy/education only — general process information, never ingesting user's specific documents or facts to render a conclusion. Lease "upload your lease" = UPL; insurance "here's how appeals generally work" = safe. Disclaimers per vertical (legal/medical/financial). **Build:** 2-month MVP for one module. No new tech infrastructure needed. |
| P-2 | Divorce/Separation Navigation | Consumer-facing guide through the administrative maze of CA separation — for people who can't afford a lawyer and can't navigate LegalZoom alone | Browser tool (static, stateless, CA-first) | Strong mission fit — same "system designed to exclude you" pattern as Finxiety. HelloDivorce charges $2,500+; the gap is people who need to understand the process and self-file. CA courts already publish self-help materials (selfhelp.courts.ca.gov); the value is making them navigable, not replacing them. Needs its own property (not inside Finxiety — different domain, higher stakes). **Brand:** extends the civic cluster into legal-administrative navigation. Tagline territory: "The information that should have been free." | **Legal: GATING — do not build any public surface until a CA family law / UPL attorney reviews the product shape.** Safe lane is narrow: general process steps, form names and official links, timelines — never applying rules to user's specific facts. Any "based on your situation" output = UPL. Mandatory click-through disclaimer before use. **Build:** 2-month CA-only MVP once legal green-light. Content research (form compilation, process mapping) is the long pole, not engineering. |

---

## Seeds

| # | Name | One-liner | Format | Hypothesis / notes | Vault research |
|---|------|-----------|--------|--------------------|----------------|
| 1 | EMDR Pong | Bouncing ball for bilateral stimulation; the speed dial IS the experiment — does frequency (0.5–1 Hz) change the felt sense of calm? | Browser tool | Let the user tune it. The UX is the data. | `naomi_vault/.../ChatGPT/2025-06/2025-06-07 - Simulating EMDR Safely.md` |
| 2 | Generated Meditation | Audio meditation with a cloned voice — hypothesis: does a voice you already trust change the depth of the experience vs. a stranger's voice? | Audio / web player | ElevenLabs voice clone is the starting point; the question is worth testing | — |
| 3 | Focus Frequency | Ambient tones for deep focus; cinematic, runway-minimal aesthetic — no headphones required (ambient, not binaural) | Audio / web player | Binaural beats need headphones and are a different product; this one is atmospheric | — |
| 4 | Interactive Vagal Toolkit | Guided, timed vagal exercises with visual cues — cold-splash cue, humming, extended exhale, vibration prompts; interactive instead of a slide deck | Browser tool | — | `naomi_vault/.../2025-06-11 - Orgasm and Polyvagal Theory.md` · `2025-05-31 - Cold Shower for Nervous System.md` · `2025-06-13 - Vibration Plate and LDT.md` |
| 5 | Presence Feed | System for generating grounding Shorts / Reels quickly — the experiment is the production pipeline, not the content itself; distribution channel TBD | Video generation pipeline | Inspired by older YouTube wellness formats; vertical short-form; build the machine first | — |
| 6 | Butterfly Hug Timer | Minimal self-havening guide: bilateral tapping cues, timer, no words; safe-place visualization variant | Browser tool | — | `naomi_vault/.../ChatGPT/2025-06/2025-06-07 - Simulating EMDR Safely.md` |
| 7 | Breathwork Companion | Trauma-informed breathwork guide; Huberman-grounded, physiologically anchored — no breakthrough-ceremony framing; includes gratitude and mood check-in before/after | Audio + visual | — | `naomi_vault/.../Day One/2026-05/2026-05-16 - Breathwork.md` |
| 8 | Nervous System Session Log | Log a session (vagal, breathwork, meditation, gratitude) + mood before/after; if community data accumulates: show aggregate trends ("today 400 people did breathwork, avg mood lift: +1.8") — the social proof layer is what makes this distinct from personal tracking | Browser tool | Public-facing version of naomi-os/M1; the differentiator is aggregated community signal, not personal history | — |
| 9 | Culture as Data | Analyze TV/film themes at scale as leading indicators of societal shifts | Python notebook (POC only) | **Labs experiment, not a Tsunam.ai portfolio product.** B2B buyers (VCs, hedge funds) are the opposite of Finxiety's user — this doesn't carry the mission thread. Worth a 2-week POC: Wikipedia dumps + batch LLM theme extraction (~$5 in API costs) + overlay against BLS / Google Trends. If the signal is interesting, it belongs to a separate entity. Legal: stay with synopses/metadata, not full scripts (IP risk); keep output impersonal to stay inside the securities-law publisher's exclusion. | `tsunam-ai/another interesting idea which is probably done, but analyzing themes….md` |
| 10 | Bias Mirror | "I'm thinking X — here are the cognitive biases that might be shaping that thought" | Browser tool | Enter a belief, plan, or impulse; the tool surfaces the cognitive biases most likely at play and a short honest reframe. Steve Jobs worship = survivorship bias + aspirational identity marketing + halo effect. Financial: "I should keep holding this stock" = loss aversion + sunk cost. The vault already has a 7-lever behavioral framework in NUDGES.md — this is the UI for it. No legal risk (pure education). Shareable by design: "I ran my Steve Jobs obsession through the bias mirror." Public-facing companion to naomi-os M3 (Ego/Soul Audit). | `tsunam-ai/NUDGES.md` |

---

## Dormant

_Ideas that need a prerequisite before they're worth picking up._

| # | Name | Why dormant | Resume when |
|---|------|-------------|-------------|
| D-1 | Place Intelligence | Niche.com and AreaVibes already built the quantitative version. The differentiated layer (qualitative "what's it actually like") has no good free data source. Fair Housing Act creates algorithmic steering liability if the tool ranks neighborhoods — not fixable with disclaimers, requires design audit. Brand fit is conditional on who the user is. | User defined (Finxiety user navigating housing scarcity vs. lifestyle optimizer) AND fair-housing attorney reviews ranking design. |

---

## Quarterly Review Prompts

- Which experiments gave energy? Which drained it?
- What did I learn?
- What should be stopped or moved to Dormant?
- What's ready to graduate from Seeds to Active?
- Is the portfolio still under 6 in-flight experiments?
