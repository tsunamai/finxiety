---
type: strategy
project: finxiety
date: 2026-06-18
status: proposed — for Naomi review before applying to PRODUCT_BACKLOG.md
---

# Finxiety Backlog — Strategic Lens: Acute Moments and Helper Distribution

## Why This Exists

The core insight from a parallel research session: the target population (ALICE users like Dani) is largely **checked out**. Financial stress is near-universal but it doesn't translate into tool-seeking behavior. Checked-out people don't browse for "financial clarity tools." They do two things that can reach them:

1. **They search in acute painful moments** — the unexpected car repair, the missed bill, the job offer they're scared to take, the eviction notice. The crisis briefly breaks through the avoidance.
2. **They trust people beside them** — a caseworker, a family member, a community health worker. The person who hands them the link, or sits with them and runs the tool.

The current backlog is primarily framed as seek-me-out: tools organized by category (emergency fund, SNAP screener, document checklist) that require someone to already be looking. Most of the target population isn't looking. That's the funnel problem.

This document applies the strategic lens to every tool in the backlog and proposes a restructure.

---

## Part A + B: Tool-by-Tool Analysis

### Distribution classes:
- **seek-me-out** — requires the user to be looking (weak; risky for this population)
- **moment-triggered** — attaches to a specific acute event (stronger)
- **helper-facing** — a trusted human deploys it for someone (strongest)

---

### Track 1: Financial Inclusion

**MYTH-1 — Benefits Myth-Check Quiz**
| Field | Value |
|---|---|
| entry_moment | None strong as standalone. The myths ARE the barrier — but someone in avoidance isn't searching for "am I wrong about benefits?" |
| primary_user | Helper (caseworker, community org facilitator) > Sufferer |
| distribution | **seek-me-out (risky)** as a standalone tool |

Repositioning: Don't build MYTH-1 as a destination. Embed it as a 1-screen preamble inside BEN-1 or DOC-1 — "Before we check your eligibility, let's clear up one thing most people get wrong." The myth-busting becomes part of the application flow, not a separate page someone has to navigate to. Alternatively: helper-facing group tool (caseworker runs it in orientation with a group of clients).

---

**BEN-1 — SNAP Screener**
| Field | Value |
|---|---|
| entry_moment | "I can't afford groceries right now" / "I just lost my job" / "I don't know if I qualify for food help" |
| primary_user | Sufferer + Helper (caseworker showing a client, community org kiosk) |
| distribution | **moment-triggered → helper-facing** |

Strong both ways. The acute moment (food insecurity) is real and common. The helper channel (caseworker walking a client through it) is the strongest distribution path. Both should be first-class design considerations.

---

**DOC-1 — Benefits Application Document Checklist**
| Field | Value |
|---|---|
| entry_moment | "I'm applying for benefits tomorrow and I don't know what to bring" / "My caseworker said I need to gather documents" |
| primary_user | Helper (caseworker, community org) > Sufferer |
| distribution | **helper-facing (strongest)** |

This is the most naturally helper-facing tool in the suite. A caseworker sends the link; a clinic prints the QR code. The sufferer uses it but the helper is almost always the distribution channel. Already built — the fastest pilot candidate.

---

**ALICE-1 — ALICE Budget Assessment** _(planned)_
| Field | Value |
|---|---|
| entry_moment | "I work full-time but can never get ahead — why?" (more chronic than acute) |
| primary_user | Helper > Sufferer |
| distribution | **seek-me-out (risky)** as standalone; repositionable as helper-facing |

Repositioning: The moment of use is the helper's intake conversation — "Let me show you what a survival budget actually looks like for a household your size." The tool becomes a shared discovery moment between helper and client, not a solo self-assessment. Without that framing, it's too reflective to catch someone in crisis.

---

**RECERT-1 — Recertification Deadline Tracker**
| Field | Value |
|---|---|
| entry_moment | "I got a letter about recertifying my benefits and I'm panicking about the deadline" |
| primary_user | Sufferer + Helper (caseworker managing multiple client deadlines) |
| distribution | **moment-triggered** (the recertification notice is the trigger) |

The letter is the entry point. If Finxiety can be the resource printed on or referenced by that letter, or if a caseworker deploys it when the letter arrives, this is strongly moment-triggered. Already built.

---

**CLIFF-1 — Benefits Cliff Calculator**
| Field | Value |
|---|---|
| entry_moment | "I got offered a raise / better job and I'm scared I'll lose my benefits" |
| primary_user | Sufferer + Helper (workforce development counselor, caseworker) |
| distribution | **moment-triggered** (job change or raise is the trigger) |

This is the most emotionally loaded moment in the suite — the decision to take or decline a raise because of the cliff is high-stakes and time-bound. The fear is specific and named. Workforce development orgs live in this moment (job placement, negotiation coaching). Strong helper channel opportunity.

---

**Disability Benefits Tool** _(intake — not yet groomed)_
| Field | Value |
|---|---|
| entry_moment | "I just got diagnosed" / "I can't work the way I used to" / "I need to figure out SSI/SSDI" |
| primary_user | Sufferer + Helper (medical social worker, disability advocate, community health worker) |
| distribution | **moment-triggered → helper-facing** |

The diagnosis or functional change is a major acute moment. Medical social workers and disability advocates are the highest-trust distribution channel for this population. Should be groomed and built with those helpers as co-designers.

---

### Track 2: Personal Finance Myth-Busting

**EMG-1 — Emergency Fund Checker** _(built)_
| Field | Value |
|---|---|
| entry_moment | "Something just broke / unexpected bill landed / I need to know how bad it is" |
| primary_user | Sufferer |
| distribution | **moment-triggered** (but retrospective — by the time someone checks, the crisis has already hit) |

Reframe opportunity: the tool is currently backward-looking ("how many months of runway do I have?"). A forward-looking question would be moment-triggered in a more active way: "I need to pull $X out — what does that leave me?" or "A repair is coming — can I absorb it?" The acute question makes it a crisis tool, not a wellness tool.

---

**TIP-1 — Tip Calculator / Tipped Wage Guide**
| Field | Value |
|---|---|
| entry_moment | "I just started a tipped job and my paycheck looks wrong" / "I don't understand how tip wages work" |
| primary_user | Sufferer |
| distribution | **seek-me-out (risky)** as standalone |

Repositioning: The entry point is new employment, which is a real moment — but it requires the person to proactively search rather than encounter the tool naturally. Two channels that make this moment-triggered: (1) employer/HR handoff at onboarding ("here's what you need to know about your tip wages"), and (2) restaurant worker org or labor rights org distribution. Without a channel, this is a discover-me-first tool in a population that doesn't browse.

---

**DEBT-VIZ-1 — Debt vs. Growth Visualizer** _(planned)_
| Field | Value |
|---|---|
| entry_moment | "I have a bill I can't pay and I don't know what to do first" (weak — this is more strategic) |
| primary_user | Sufferer + Helper (credit counselor, financial coach at credit union) |
| distribution | **seek-me-out (risky)** as standalone |

Repositioning: This is a financial coach's tool. A credit union financial coach or NFCC counselor deploys it in a one-on-one session with a member. The tool becomes a shared visualization during a meeting — not a standalone destination. Without that context, it requires the user to be in strategic planning mode, which the checked-out ALICE user rarely is.

---

**DEDUCT-1 — Deduction/Credit/Refund Clarifier** _(planned)_
| Field | Value |
|---|---|
| entry_moment | "It's tax time and I don't know what I can claim" / "I just got my W-2 and I'm confused" |
| primary_user | Sufferer + Helper (VITA volunteer, free tax prep site) |
| distribution | **moment-triggered (seasonal)** — but only 3 months a year |

The strongest channel for this tool is VITA (Volunteer Income Tax Assistance) sites. VITA workers help exactly this population during exactly this moment. Deploying DEDUCT-1 as a VITA helper tool turns a once-a-year seek-me-out into a trusted-channel deployment. VITA volunteers are the helpers.

---

**HOURS-1 — Work Hours Calculator** _(planned)_
| Field | Value |
|---|---|
| entry_moment | "My paycheck doesn't look right" / "My employer cut my hours and I'm trying to understand my income" |
| primary_user | Sufferer + Helper (worker center, labor org, HR dept) |
| distribution | **moment-triggered** (paycheck problem is a real and recurring acute moment) |

The moment the paycheck arrives and looks wrong is visceral and specific. Worker centers and labor rights orgs are the helper channel — they already field these questions. Co-designing with a worker center partner could make this tool's distribution essentially instant.

---

**MYTH-2 — Extended Myth Quiz** _(planned)_
| Field | Value |
|---|---|
| entry_moment | None strong |
| primary_user | Sufferer / Helper |
| distribution | **seek-me-out (risky)** |

Repositioning: Like MYTH-1, this only makes sense embedded in another tool's flow or as a helper training resource. Standalone, it requires someone to be curious about myths they don't know they have. Deprioritize until a clear integration point or helper channel exists.

---

## Part C: Proposed Restructure

The current unit is 12 standalone tools organized by category. The strategic lens suggests two alternative organizing principles.

---

### Option A: Organized by Acute Moment

Rather than "what kind of tool is this?" the backlog is ordered by "when would someone reach for this?"

**Moment 1: "I can't afford something essential right now"**
- BEN-1 (SNAP Screener)
- EMG-1 (Emergency Fund Checker) — reframed as "how bad is it / can I absorb this?"
- DOC-1 (Document Checklist) — if applying for help is the path forward

**Moment 2: "Something just changed about my income or job"**
- CLIFF-1 (Benefits Cliff Calculator) — raise/new job offer
- TIP-1 (Tip Calculator) — new tipped job
- HOURS-1 (Work Hours Calculator) — paycheck discrepancy

**Moment 3: "I'm scared of losing what I have"**
- CLIFF-1 (Benefits Cliff Calculator)
- RECERT-1 (Recertification Deadline Tracker)
- DOC-1 (document prep for recert)

**Moment 4: "I'm trying to get help / navigate the system"**
- MYTH-1 (embedded preamble — dispel the myth blocking them)
- BEN-1 → DOC-1 → RECERT-1 (sequential application flow)
- Disability benefits tool

**Moment 5: "It's tax time and I'm confused"** _(seasonal)_
- DEDUCT-1 (Deduction/Credit/Refund Clarifier)
- HOURS-1 (for gig workers tracking income)

Tools without a natural acute moment (MYTH-1 standalone, MYTH-2, ALICE-1, DEBT-VIZ-1) get deprioritized or repositioned as helper-facing.

---

### Option B: Organized by Helper Persona

Rather than organizing around the sufferer, organize around the trusted humans who distribute the tools.

**Helper: Caseworker / Benefits Counselor** (community org, social services intake)
- BEN-1, DOC-1, CLIFF-1, RECERT-1, Disability benefits tool
- MYTH-1 as a group orientation screen
- This is the highest-volume, highest-trust channel for most Track 1 tools

**Helper: Workforce Development / Employment Counselor**
- CLIFF-1 (pre-job-offer conversation), TIP-1, HOURS-1
- MYTH-1 ("before you decide about this job, let's clear something up")

**Helper: VITA Tax Prep Volunteer**
- DEDUCT-1, HOURS-1 (gig workers)
- Seasonal deployment, January–April

**Helper: Trusted Personal Helper** (family member, friend who got a link)
- BEN-1, EMG-1, DOC-1
- These are the "text someone a link" tools — short, self-contained, no helper training required

**Helper: Financial Coach at Credit Union / CDFI**
- Full suite — EMG-1, DEBT-VIZ-1, CLIFF-1, ALICE-1
- Most capable of deploying the strategic tools (DEBT-VIZ-1, ALICE-1) that require reflection time

---

### Recommendation: Hybrid — Moments as the Frame, Helper Channels as the Distribution Model

Don't pick one. The tools should be designed with an acute moment as the entry point AND a helper channel as the primary distribution vector. Every tool spec should answer both questions:

- **What specific thing just happened** that would make someone reach for this?
- **Who is the helper** most likely to put this in their hands?

A tool without answers to both is a seek-me-out risk.

---

## Part D: Pilot Bets

### Bet 1 (fastest, cheapest): DOC-1 + Caseworker Channel

**What:** Deploy DOC-1 through 1–2 community orgs or clinics in the Bay Area.
**How:** A printed QR code or texted link. No new tech. No integration. The caseworker or intake worker says "use this before you come back."
**Why this:** DOC-1 is already built. The helper-facing design is already there. The test is purely about the distribution channel — do helpers actually use it? Do clients follow through? Can we get feedback without building anything?
**What it proves:** Whether the helper-facing distribution hypothesis is real.
**Partners to approach:** Alameda County food banks, community health centers, legal aid clinics, WIC offices.

### Bet 2 (highest impact): CLIFF-1 at a Workforce Development Org

**What:** Deploy CLIFF-1 as a standard step in job placement counseling — "before you take this job offer, let's run the numbers."
**How:** Caseworker deploys it in the placement meeting. Single-use, in-session, no account needed.
**Why this:** The benefits cliff moment is extremely high-stakes, time-bound, and served by no existing tool the population actually uses. Workforce development counselors already have this conversation — they just don't have a tool. CLIFF-1 makes the invisible visible at the exact right moment.
**What it proves:** Whether moment-triggered + helper-deployed works for a complex tool (not just a checklist).
**Partners to approach:** Workforce development boards, East Bay Works, HHSA employment services, Goodwill career centers.

---

## Part E: Positioning Implications

### The Problem with "Financial Clarity Tools"

The current positioning names the outcome (clarity) from the wellness-seeker's perspective. It is, by construction, seek-me-out positioning. It describes what you'll get after you've already decided to look — which the target population isn't doing.

### Two Alternative Framings

**Framing A — Moment-anchored (for direct user reach)**
"The answer you need when [specific thing happened]."
- "When the car breaks down."
- "When the raise feels risky."
- "When the letter says you have 30 days."

More visceral. Harder to communicate across all tools without fragmentation. Best for individual tool landing pages, not homepage positioning.

**Framing B — Helper-anchored (for professional distribution)**
"Free tools for the people who help people through money stress."
Positions Finxiety as a professional resource — for caseworkers, counselors, coaches — that happens to be directly accessible to anyone.

This is the counter-intuitive move: the homepage talks to the helper, even though the end user is the sufferer. Why? Because:
- Helpers are the distribution channel
- Helpers are actively looking (they have a job that requires tools)
- Trust passes through the helper to the sufferer ("my caseworker sent this to me")
- The anti-"suit in a dark office" stance is served: Finxiety is what a trusted person in your community uses, not something you found on Google

### On the Name "Finxiety"

"Finxiety" names the chronic state (financial anxiety) rather than the acute moment or the helper relationship. It's accurate but it's wellness positioning.

Changing the name has high switching costs now that brand work is underway. The more important move is to let the tagline and tool-level copy do the acute/helper work that the name doesn't do. The name is the container; the positioning lives in what's inside.

If a rename were on the table, the helper-facing direction would suggest something that connotes "something you hand to someone" or "the thing a caseworker gives you." But this is a much later decision.

---

## What This Document Is Not

This document does not modify PRODUCT_BACKLOG.md. It proposes a restructuring lens. Naomi reviews and decides which elements to apply, when, and in what form. The PM agent can groom individual tickets through this lens once the direction is confirmed.
