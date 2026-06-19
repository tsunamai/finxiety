---
type: persona
project: finxiety
date: 2026-06-18
source: BACKLOG_STRATEGY.md strategic analysis; informed by research on community health worker roles, benefits counseling, workforce development
status: stub — for refinement with actual helpers before design work depends on it
---

# Helper Persona: The Caseworker / Benefits Counselor

_The highest-leverage distribution channel for Finxiety tools_

---

## Why This Persona Exists

Finxiety's primary end user is Dani — the ALICE user who needs the information. But Dani is often not the person who finds or deploys the tool. She arrives through a trusted human beside her.

This persona represents that human. For the purposes of product decisions, she is more important than she appears: she IS the distribution channel. Her trust in a tool determines whether Dani ever sees it.

---

## Who She Is

Her name is Rosa. She's 42. She works as a benefits counselor at a community health center in Oakland — part of a federally qualified health center (FQHC) network. Her official title is Patient Navigator.

She has a caseload of 60–80 active clients. Most are low-income families, recently released individuals, seniors on fixed incomes, undocumented residents navigating the edges of what they qualify for, and people in the ALICE band — working but not stable. Her job is to help them access every benefit they're entitled to, connect them with community resources, and catch what falls through the cracks.

She is not a licensed financial advisor. She is not a lawyer. She navigates systems the way a translator navigates a language — fluency earned through doing it constantly, for years.

---

## Her Relationship with Tools

Rosa uses tools constantly. She has a laminated sheet of income thresholds taped to her monitor. She bookmarks eligibility calculators. She has opinions about which county screener websites are broken and which work.

What she needs from a tool:

**Speed.** She has 20 minutes with a client. She cannot teach them a tool in that window — she uses it herself, in session, and walks them through the result.

**Accuracy that she trusts.** She will not send a client somewhere she doesn't personally believe. If a tool tells a client they don't qualify and they actually do, that's not just a bad user experience — it's a harm she's responsible for. She has seen enough bad tools that she's skeptical of new ones until proven otherwise.

**No data collection.** She will not send clients to tools that ask for email, name, or any identifying information. Not because of paranoia — because many of her clients have mixed-status households, past system involvement, or other reasons to be cautious about where their data goes.

**Plain language that works for her clients.** Her clients may have low health literacy, limited English proficiency, or cognitive differences. She reads the tool output and translates if needed — but the less translating required, the better.

**A result she can screenshot.** When a tool returns a clear output ("you may qualify for approximately $412/month in SNAP benefits"), she can screengrab it and text it to the client for reference. This is the whole point of a clarity engine.

---

## How She Evaluates a New Tool

First visit is judgment: does it load fast, does it ask for anything personal, does it feel like it was built for someone who respects her clients?

Second test: she runs a case she already knows the answer to. She knows what SNAP limit applies to a family of three at $2,400/month. If the tool gets it right, she'll use it again.

Third test: she texts it to a colleague and waits to see if they use it.

If it passes all three: it goes in her toolkit. She doesn't formally share it or "officially" endorse it — she just starts texting it to clients and mentioning it to coworkers. That's how good tools spread in her network.

---

## Her Constraints

**She doesn't have time to set up accounts or remember passwords.** Any tool requiring registration for the helper is dead on arrival.

**She works on her phone half the time.** She's doing intakes at a clinic, a food bank, a community center. Her laptop is at her desk. Everything has to work on mobile.

**She is not the decision-maker in her org.** She can't commit her organization to a formal partnership. What she can do is recommend tools to her supervisor, share them with colleagues, and incorporate them into her practice. Grassroots adoption is the path.

**She is emotionally invested.** Her clients are real people to her. A tool that causes embarrassment, confusion, or harm isn't just a bad product — it's something she feels responsible for. She will not use a tool she doesn't trust, and her trust has to be earned once, cleanly.

---

## What This Persona Changes About Design

Every tool in the Finxiety suite should be evaluated through Rosa's eyes, not just Dani's:

- Does it load in under 2 seconds on a mid-tier Android phone?
- Is the result immediately legible — something Rosa can read aloud or screenshot?
- Does it avoid asking for anything Rosa's clients would hesitate to share?
- Is the disclaimer clear enough that Rosa doesn't worry she's giving advice?
- Is there an official source URL so Rosa can point to verification without being the authority?

The tool Rosa trusts is the tool Dani eventually uses.

---

## Other Helper Types (Brief Profiles)

**Family Helper:** Dani's sister, her cousin, a friend who's more financially literate. Finds a tool via text or social share. Low context about eligibility rules; high trust from the sufferer. Tools must be self-explanatory — no caseworker to explain them. Best tools for this channel: BEN-1, EMG-1 (short, self-contained, clear output).

**Workforce Development Counselor:** Operates at job placement orgs, workforce boards, reentry programs. Focuses on the income transition moment — the raise offer, the new job, the benefits cliff. CLIFF-1 is the primary tool for this helper. TIP-1 and HOURS-1 are secondary.

**VITA Tax Prep Volunteer:** Seasonal (January–April). Helps low-income filers. Technically trained in tax rules, personally invested in finding credits. The primary channel for DEDUCT-1 and HOURS-1 (gig workers). VITA sites have a built-in event (the tax appointment) that creates a structured deployment moment.

**Financial Coach at Credit Union or CDFI:** More time per client than Rosa, more financially sophisticated. Can use the more complex tools (DEBT-VIZ-1, ALICE-1, CLIFF-1 in full). Serves the higher end of the ALICE band — people who have some stability and are trying to build.

---

_This persona is a stub. It should be refined by conversations with actual benefits counselors, patient navigators, and community health workers before any design work is scoped around it._
