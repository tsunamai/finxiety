# Naomi OS — Personal Systems Backlog

_Experiment portfolio framework: 6 in-flight max · quarterly review · abandon freely_

---

## Active

_Nothing in flight yet._

---

## Seeds

### Health & Nutrition

| # | Name | Start here | Format | Notes |
|---|------|-----------|--------|-------|
| N1 | Nutrition Intelligence | Fiber + satiety scoring for current meals — the two metrics most likely to change what you actually eat; cost-per-serving second | Web app / local | Don't build 8 features. Start with the question: "What should I eat tonight that won't spike hunger at 2am?" |
| N2 | Recipe Intelligence | Reverse-engineer one favorite restaurant meal per month into a nutritionally improved home version; shopping list as output | Web app / local | Pairs with N1; start with one restaurant, one meal |

### Fitness

| # | Name | Start here | Format | Notes |
|---|------|-----------|--------|-------|
| F1 | Workout Intelligence | Gym workflow first — given today's time and energy, what's the sequence? Exercise database and video come later | Web app / local | Don't build the database first; build the daily decision engine first |
| F2 | Recovery Tracker | Mobility + energy scores daily; sleep data pulled from S1 (share schema — don't duplicate) | Web app / local | F2 and S1 overlap on sleep; S1 owns sleep data, F2 consumes it |

### Sleep

| # | Name | Start here | Format | Notes |
|---|------|-----------|--------|-------|
| S1 | Sleep Intelligence | Track sleep onset time + one variable per week (light, melatonin timing, temperature, screen cutoff) — DSPS context means generic advice actively misleads; this is a personal sleep study | Web app / local | Owns sleep data for the whole Naomi OS; F2 pulls from here |

### Mental & Spiritual

| # | Name | Start here | Format | Notes |
|---|------|-----------|--------|-------|
| M1 | Nervous System Dashboard | Log session type + mood before/after; let trends emerge — companion to Tsunam Labs tools (vagal toolkit, breathwork companion) | Web app / local | Personal tracking layer; Tsunam Labs seed 8 is the public-facing version |
| M2 | Psychedelic Integration Journal | Structured markdown templates first: intention, insights, themes, body sensations — no analysis layer until the journal has enough entries to be worth analyzing | Local only | "Local only" and "pattern recognition" are in tension; start as a structured journal, add a local analysis step later if needed. No cloud sync ever. |
| M3 | Ego / Soul Audit | Structured reflection on whether a thought, desire, or activity is serving the ego (social contract, image, aspirational identity) or the self (purpose, contribution, true joy) — a personal practice, not an app | Local journaling template | Start as a weekly markdown prompt, not a tool. Questions: "Who am I doing this for?" "Would I do this if no one could see?" "Is this temporary happiness or something that actually fills me?" Connects to M2 (integration themes) and the bias awareness work (see Tsunam Labs Seed 10). No analysis layer yet — the practice is the point. |

### Creative

| # | Name | Start here | Format | Notes |
|---|------|-----------|--------|-------|
| C3 | French Bulldog Universe | Name the dogs. That's the sign the project is real. Characters → comics → everything else follows | Mixed | Fun first, distribution second; the most likely to actually happen because it requires zero systems thinking |

---

## The Long Game: Naomi OS Dashboard

_A north star, not a seed. This is what the other systems graduate into when they're stable enough — not something to build directly._

- Health (N1, N2)
- Fitness (F1, F2)
- Sleep (S1)
- Nervous system (M1)
- Creativity (C3 + brand work in product folders)
- Daily recommendations synthesized across all layers

---

## Dormant

_Ideas that got cold or weren't the right fit._

| # | Name | Why dormant |
|---|------|-------------|
| C1 | Personal Brand Lab | Professional deliverable dressed as a hobby. Tsunam.ai and Mortalia work belongs in the product folders, not here. |
| C2 | Prompt Library | A resource, not an experiment — no hypothesis, no learning objective. Let it live as a flat folder in the vault instead. |

---

## Quarterly Review Prompts

- Which systems am I actually using? Which am I just building?
- What did I learn about myself from the data?
- What should be stopped or moved to Dormant?
- What's ready to connect into the Naomi OS dashboard?
- Is the portfolio still under 6 in-flight systems?
