---
type: persona
project: finxiety
date: 2026-06-14
source: behavioral economics research (Mullainathan & Shafir 2013), ALICE framework (United Way), financial shame research, trauma-informed design literature
status: draft — for review and refinement with community input before final
---

# Primary User Persona: The ALICE User

_Asset Limited, Income Constrained, Employed_

This is not a demographic sketch. Demographics can tell you who is in the room. This portrait tells you what state they're in when they get there — cognitively, emotionally, and practically. That state is what design decisions must respond to.

---

## Who She Is

Her name is Dani. She's 34. She works as a medical records coordinator for a clinic network — $19.50/hr, 32 hours a week (not 40, because full-time would mean benefits they'd have to pay, so they keep her part-time). She's been there three years. She's good at her job.

She has two kids: a 7-year-old and a 10-year-old. Her older one has asthma. She's a single parent. The kids' father is inconsistently in the picture, inconsistently paying support.

She lives in a two-bedroom apartment in the East Bay. Rent is $2,050/month. After rent, childcare, food, utilities, the minimum payment on a $4,000 medical bill from her son's ER visit two years ago, and her phone — her phone is not optional, it's how she works and manages everything — she ends the month with about $60 to $140 left, depending on whether anything unexpected happened.

Unexpected things happen about every six weeks.

She makes approximately $31,200/year. The ALICE threshold for a single parent of two in Alameda County is around $73,000. She is not poor in the stereotyped sense — she is not sleeping in a shelter, she is not skipping meals. She is working. She is managing. And she is one car repair, one ER visit, one hours-reduction away from not managing.

---

## Her Financial Reality

She has one bank account. It's a checking account at a big regional bank. The account has, on average, between $120 and $380 in it. When she gets paid, it goes up. When rent hits, it craters. She has overdrafted twice this year. The bank charged her $35 each time. She didn't dispute it because she was too tired, and she didn't know if she could.

She has no savings account. She tried to open one once. She moved $100 into it. Three weeks later, her car battery died and she moved it back.

She knows, in the abstract, that she's "supposed to" have an emergency fund. She heard it on a financial wellness webinar her employer required her to attend. She also knows, concretely, that she cannot make that math work right now. These two facts coexist without resolution.

She does not have a 401k through work because her employer doesn't offer one for part-time staff. She has $0 in retirement savings.

She qualifies for SNAP but doesn't know it. She tried to apply for Medi-Cal two years ago and was denied at that income level; the rules changed and she'd likely qualify now, but she doesn't know that either.

---

## Her Relationship with Financial Tools

She's tried things. She tried Mint three years ago. She connected her accounts and saw her spending categorized in bright graphs and immediately felt sick. The biggest categories were GROCERIES, RENT, and FAST FOOD (the fast food was always near the end of the pay period when there wasn't time to cook). She closed the app and didn't open it again. It felt like a report card she didn't study for.

She's been to a financial literacy workshop once — through her church, a good-faith effort to help people in her situation. It covered budgeting, the 50/30/20 rule, the importance of having 3-6 months of expenses saved. She sat in the back. She did the math. 3-6 months of her expenses would be between $18,000 and $36,000. She makes $31,200 a year. The math was not unclear; the math was the problem. She didn't go back.

She's used CreditKarma to check her credit score before applying for apartments. She uses the calculator on her phone constantly. She is not financially illiterate. She is financially stressed — those are not the same thing.

What she's looking for from a financial tool: she wants to understand something clearly. Not be fixed. Not be taught. Not be compared to a standard she can't reach. She wants a clear picture of her situation, in plain English, with no judgment attached.

What will make her close a tab within ten seconds: anything that makes her feel like the tool was built for someone else. A stock image of a smiling couple. Language that says "your financial goals." A paywall. A signup form. An email field. The assumption that she has more than one account.

---

## Cognitive State at the Moment of Use

Dani comes to a Finxiety tool one of two ways:

**Scenario A — The Referral:** A caseworker at the food pantry she occasionally uses mentioned that there's a website with free tools for people in her situation. Or a friend texted her a link. She opens it on her phone, possibly while waiting to pick up her kids, possibly during a ten-minute break at work.

**Scenario B — The Crisis:** She just got a bill. Or she just checked her balance and it's $47 and rent hits in 9 days. She's in a focused, anxious, problem-solving state — high urgency, narrow attention, looking for something that will make the situation clearer or give her a path.

In either scenario: she is on her phone. She has a short window — a few minutes, maybe ten if she's lucky. Her cognitive bandwidth is not at its highest. She's managing multiple things at once, mentally.

Mullainathan and Shafir's research on scarcity applies here directly: when people are in financial shortage, the shortage occupies their mental bandwidth involuntarily. They become very good at the immediate, tactical problem (how to make this work right now) and less available for the strategic, future-oriented problem (what would help six months from now). This is not a flaw. It's how the brain allocates resources under constraint.

**What this means for tool design:**
- She cannot be asked to do complex calculations before she gets the answer
- She cannot be asked to think about the future; she is in the present
- She cannot tolerate condescension or surprise judgment
- She will not scroll for the answer; the answer must be in the first place she looks
- The tool must work in the time she has, not the time a planner has

---

## Her Emotional State Around Money

Money is, for Dani, a topic that carries significant emotional weight. It is a place of frequent disappointment and occasional shame.

The shame is not logical — she is managing an objectively difficult situation competently — but it is present. She has absorbed the cultural message (from media, from financial advice culture, from those workshop slides with the 50/30/20 rule) that financial struggle is a result of poor decisions. She knows this isn't true in her case. She doesn't fully believe that knowledge when she's looking at her account balance at 10pm.

This shame has specific design consequences:
- She is unlikely to share her real numbers with anyone (privacy matters even in anonymous tools)
- If a tool shows a "bad" result, the design must prevent that result from reading as a verdict about her
- Any language that implies comparison to a standard ("most people have," "financial experts recommend") will feel like a comparison she's losing
- She needs to feel that the tool understands the constraints she's operating under — not that it's measuring her against a world where those constraints don't exist

---

## The Acute Trigger Calendar — When She's Actually Reachable

Dani's background state is **avoidance**. She doesn't browse financial tools in her downtime. She doesn't wake up curious about her benefits eligibility. Financial topics carry enough weight that disengagement is protective.

But avoidance has gaps. Specific events break through it and create a brief window — usually minutes to hours — where she is activated, searching, and willing to engage. These are the entry points.

**The acute moments, in rough frequency order:**

**Unexpected expense hits** (every 6 weeks or so)
The car makes a noise. The water heater dies. The kid's shoe size jumped two sizes before anyone noticed. She looks at her balance and does the math. This is when she types something into her phone. The moment is: "how do I make this work?"
→ Tools reachable: EMG-1 (cash runway), BEN-1 (do I qualify for help?)

**A bill she can't pay arrives** (several times a year)
The medical bill. The utility shutoff notice. The rent increase letter. These are more alarming than an unexpected expense — they come with stakes and deadlines. She's in focused, anxious problem-solving mode.
→ Tools reachable: BEN-1, DOC-1, RECERT-1

**She gets a raise or a better job offer** (rare, but very high stakes)
This is the most emotionally complex moment in the suite. She knows, or suspects, that earning more could mean losing SNAP, Medi-Cal, childcare subsidies. She can't fully run those numbers. She may decline the raise without asking anyone, or take it without understanding the tradeoff. The window is the moment she's deciding.
→ Tools reachable: CLIFF-1 (this is the tool's entire reason for existing)

**A recertification deadline approaches** (2–3 times a year per benefit)
She got a letter. It says she has 30 days. She doesn't fully understand what's required. Missing it means losing a benefit she depends on. She might ask a caseworker; she might search online; she might panic and do nothing.
→ Tools reachable: RECERT-1, DOC-1

**She's confused about her paycheck** (irregular, but recurring)
Tip wages, gig income, overtime miscalculations — the paycheck doesn't match her expectation and she doesn't know if that's normal. This moment is especially common after a job change.
→ Tools reachable: TIP-1, HOURS-1

**Tax time, January–April** (annual)
She files her own taxes on TurboTax Free Edition and hopes she's doing it right. She doesn't know she may qualify for credits she isn't claiming. The moment of "I'm staring at this W-2 and I don't know what goes where" is predictable, annual, and shared with most of the ALICE population at the same time.
→ Tools reachable: DEDUCT-1, HOURS-1

---

**What this means for design:**
- Every tool needs a hook that names its moment, not its category. Not "emergency fund" — "what happens when something expensive breaks?"
- The window is short. Five to ten minutes is optimistic. The tool must return something useful before she runs out of time.
- She doesn't remember URLs. She arrives from a link someone sent or a search result. She will not bookmark and return unless the result was immediately valuable.
- She won't share her location, email, income, or household size unless she understands exactly what it's for. Every field that isn't obviously necessary for the answer is a leak in the funnel.

---

## How She Finds Finxiety

She doesn't search "free financial tools." She searches the problem:
- "do i qualify for snap if i work"
- "will i lose medi-cal if i get a raise"
- "what to bring to snap application"
- "benefits cliff calculator"

Or she doesn't search at all — she gets the link from someone:
- A caseworker at the food pantry texts it to her
- Her sister sends it via iMessage
- The community health center has a printed QR code in the waiting room

The second path is the more reliable one. Dani-in-crisis does search; Dani-in-chronic-avoidance does not. The distribution model that reaches the most Danis is one where a trusted human deploys the tool, not one that depends on Dani finding it herself.

---

## What Would Make Her Trust This Tool

1. **It starts without asking for anything.** No email, no account, no "tell us who you are first."
2. **The language sounds like a person, not a brochure.** She can tell the difference immediately.
3. **It doesn't assume she has savings.** If the first question assumes she has a designated savings account, she'll feel that the tool was built for someone else.
4. **It doesn't tell her what to do.** She knows what she needs. She doesn't need a stranger on a website to make it explicit. What she needs is to understand her situation more clearly.
5. **The result is a fact, not a grade.** "You have 0.08 months of runway" should read like a weather report, not a test score.
6. **It acknowledges the structural reality.** The reason she doesn't have an emergency fund is not ignorance or laziness. It's the interaction of stagnant wages, housing costs, and the specific mechanics of how irregular expenses consume cash before savings can accumulate. If the tool names this — without excusing it or explaining it at length — she'll feel seen.
7. **There's somewhere to go next.** A result with no path forward is just a mirror. She knows what the mirror says. What she needs is a door.

---

## What This Means for the Suite

This persona shapes every tool in the Finxiety suite, not just EMG-1.

- **MYTH-1 (Benefits Myth-Check Quiz):** Dani probably believes at least one myth that's costing her access to programs she qualifies for. The quiz must be a revelation, not a lesson.
- **BEN-1 (SNAP Screener):** She qualifies. She doesn't know. This tool's job is to tell her that, clearly, without bureaucratic jargon, and point her to where to actually apply.
- **EMG-1 (Emergency Fund Checker):** She has $0 in designated savings and $150 in checking. The tool must be useful to her, not just to someone who has some savings and wants to understand them better.
- **All tools:** The cross-tool bridge matters enormously for this user. She might come in through EMG-1 and need BEN-1. She might come in through MYTH-1 and need DOC-1. The suite's value compounds when tools reference each other without hard-selling the next one.

---

## What She Is Not

She is not a passive victim of her circumstances. She is managing a genuinely difficult situation with significant competence. She makes deliberate decisions. She prioritizes ruthlessly. She finds ways through problems that would stump people with more resources and less experience.

The design must hold this. A tool that treats her as fragile gets it wrong. A tool that treats her as a capable person who has been failed by systems, and who deserves accurate information to navigate those systems, gets it right.

She doesn't need to be empowered. She is already powerful. She needs the information.

---

## Research Grounding

- **Mullainathan, S. & Shafir, E. (2013).** *Scarcity: Why Having Too Little Means So Much.* Cognitive bandwidth, tunneling, present bias under financial constraint.
- **United Way ALICE Project.** Framework for understanding working households below the ALICE threshold. Survival budget methodology.
- **Brown, B. (2010).** *The Gifts of Imperfection.* Shame as a cognitive inhibitor; distinction between shame ("I am bad") and guilt ("I did something bad").
- **Financial therapy research** (Klontz, Britt, et al.). Financial shame as distinct from other forms of shame; specific triggers in financial advice contexts.
- **Trauma-informed design principles.** Safety, trustworthiness, peer support, collaboration, empowerment as design dimensions (adapted from SAMHSA framework).
- **Bertrand, M. et al. (2006).** "Behavioral economics and marketing in aid of financial literacy." Defaults, framing, and salience effects in financial decision-making among low-income populations.

---

_This persona is a first draft. It should be refined with input from Finxiety's community partners, direct user research, and the community of people it represents. It is a starting point, not a final authority._
