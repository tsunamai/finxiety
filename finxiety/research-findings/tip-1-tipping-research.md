---
type: research
project: finxiety
tool: TIP-1
date: 2026-06-17
source: WebSearch across DOL, EPI, One Fair Wage, Cornell hospitality research, CBPP, NELP, IWPR, NYC DCWP, US Census Bureau
status: draft, verify tipped-wage data-layer figures at build time (state laws change)
---

# Tipping in the United States: Research Findings

This document covers the full landscape of tipping: history, labor economics, behavioral science, and debates. Not all of it belongs in TIP-1. The final section maps what goes in the calculator vs. what is saved for future myth quizzes and articles.

---

## Section 1: History of Tipping in the United States

Tipping arrived in the US from Europe in the mid-1800s, adopted by wealthy Americans returning from travel who wanted to signal cosmopolitan status. It met immediate resistance. The practice was widely seen as anti-democratic: a plutocratic gesture that created a class of workers dependent on the discretion of strangers.

Between 1909 and 1926, six states banned tipping: Georgia, Mississippi, Arkansas, Iowa, South Carolina, and Tennessee. Enforcement was weak. Restaurant and hotel lobbying eventually overturned all six bans. By Prohibition (1920-1933), the economics of restaurants had shifted enough that tips as a wage substitute were structurally entrenched. William Scott's 1916 book "The Itching Palm" made the anti-tipping case in full and sold widely. The movement died anyway.

**The racial architecture.** The most important and least-told part of this history is specific. After emancipation, industries that employed large numbers of Black workers, most prominently the Pullman Palace Car Company (which staffed its trains almost entirely with formerly enslaved men), built their wage models around tips. The company openly paid below-living wages on the assumption that passengers' tips would make up the difference. Racist passengers routinely withheld tips. Workers were unpaid and had no legal recourse. The same structure applied to Black restaurant workers, hotel workers, and domestic workers throughout the post-Civil War South and increasingly the North. Tipping was not incidental to this system. It was the mechanism that allowed employers to externalize wages to customers who could discriminate freely.

Sources: [Time: History of tipping and race](https://time.com/5404475/history-tipping-american-restaurants-civil-war/); [EPI: Rooted in Racism and Economic Exploitation](https://www.epi.org/publication/rooted-racism-tipping/)

**The federal tipped minimum wage.** The $2.13/hr federal tipped minimum wage has been unchanged since 1991 — 35 years. The 1996 Small Business Job Protection Act amended the FLSA to de-link the tipped wage from any future minimum wage increases, effectively freezing it. The National Restaurant Association lobbied heavily for that provision. The federal minimum wage has increased seven times since then. The tipped wage has not moved once.

Sources: [CEPR: Tipped Minimum Wage Has Been $2.13 Since 1991](https://cepr.net/publications/tipped-minimum-wage/); [DOL Fact Sheet 15](https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa); [Richmond Fed Economic History: Tipping](https://www.richmondfed.org/publications/research/econ_focus/2024/q1_q2_economic_history)

**Relevant to:** TIP-1 contextual note; future myth quiz question on the $2.13 wage; future article on tipping history and race.

---

## Section 2: The Tipped Wage System Today

**How the tip credit works.** The "tip credit" is the mechanism that allows employers to pay tipped workers below minimum wage. An employer can pay $2.13/hr federally if the employee's tips bring their total hourly earnings up to the full minimum wage ($7.25 federal). If tips fall short in any given week, the employer is legally required to make up the difference. In practice, this "make-whole" obligation is frequently violated and difficult for workers to track and enforce.

**One Fair Wage states.** Seven states and several cities have eliminated the subminimum tipped wage entirely: Alaska, California, Minnesota, Montana, Nevada, Oregon, and Washington, plus Washington D.C., Michigan, Chicago, and Flagstaff. In these jurisdictions, tipped workers receive the full state minimum wage before tips. Tips are additional income, not a wage substitute.

The poverty rate difference is substantial: tipped workers in states still using the $2.13 federal floor have a poverty rate of 20.8%. In One Fair Wage states, the tipped worker poverty rate is 13.2%. (Source: IWPR Tipped Minimum Wage Fact Sheet 2024.)

**Verify at build time:** State tipped wage laws change. The One Fair Wage state list above reflects 2025-2026. Check DOL Wage and Hour Division or One Fair Wage (onefairwage.org) before shipping.

**Wage theft.** In the foodservice industry, wage theft is the most common labor violation. An estimated 35% of tipped workers reported wage theft in the past year. 12% reported tips stolen directly by a manager or owner. Employers sometimes misclassify workers to avoid tip credit rules, fail to pay the make-whole when tips fall short, or require workers to tip out to non-tipped employees (illegal in tip-credit states unless the employer raises wages).

**Back-of-house workers.** Cooks, prep cooks, and dishwashers typically receive no tips at all. Until 2018, federal law prohibited employers from sharing tip pools with non-tipped employees. The 2018 Consolidated Appropriations Act changed this: employers who pay all employees full minimum wage (no tip credit) may include back-of-house workers in a tip pool. Employers who still use the tip credit cannot share tips with non-tipped employees. In practice, most restaurants that use the tip credit do not include kitchen workers in pooling. The median wage for cooks is lower than for servers in most markets despite comparable or greater physical demands.

Sources: [DOL Fact Sheet 15](https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa); [Davis Wright Tremaine: Tip Pooling With Back-Of-House](https://www.dwt.com/blogs/employment-labor-and-benefits/2018/04/tip-pooling-with-backofhouse-is-in-in-most-states); [IWPR Tipped Minimum Wage Fact Sheet 2024](https://iwpr.org/wp-content/uploads/2024/12/Tipped-Minimum-Wage-Fact-Sheet-2024-1.pdf)

**Relevant to:** TIP-1 contextual note on wage structure; future myth quiz question on tip credit; future article on back-of-house workers.

---

## Section 3: Who Receives Tips and Who Doesn't

**Front-of-house vs. back-of-house.** This is the most significant gap in the tipping system that customers rarely see. The server brings the food; the cook prepared it; the prep cook chopped the vegetables at 7am; the dishwasher will wash the plate. In a restaurant using the tip credit, the server's effective wage depends heavily on tips. The dishwasher earns a fixed hourly wage, often at or just above state minimum. A full dining room on a Friday night means a high-tip night for servers. The dishwasher's pay is unchanged regardless of how busy it was.

**Platform delivery workers.** The DoorDash and Uber Eats tip structure is more opaque than dine-in tipping and has been actively manipulated by the platforms. In December 2023, DoorDash and Uber Eats redesigned their apps to move the tip prompt to after delivery is completed (rather than before ordering). A January 2026 New York City Department of Consumer and Worker Protection report documented the result: average tips per delivery dropped from $2.17 to $0.76, a decline of approximately $550 million per year for NYC delivery workers alone. The redesign exploited the fact that customers who see the tip prompt before ordering, and before any service has occurred, tend to leave more than customers prompted after the fact.

Source: [NYC DCWP: Delivery Worker Tipping Report](https://www.nyc.gov/assets/dca/downloads/pdf/workers/Delivery-Worker-Tipping-Report.pdf)

**Agricultural workers.** The people who grow, harvest, and pick the food that arrives at the restaurant receive no tips, by definition. They are also excluded from many of the federal labor protections that apply to restaurant workers. The FLSA exempts agricultural workers from overtime pay requirements. In operations with fewer than 500 "person-days" of labor per quarter, farm workers are exempt from the federal minimum wage entirely. The H-2A guestworker program adds a further layer of vulnerability: workers tied to specific employers with limited ability to leave. None of this is visible at the table.

**Food supply chain workers.** Truck drivers who deliver food to restaurants, warehouse workers at distribution centers, and food processing plant workers are not in the tipping economy. They are part of every meal and invisible in the tip calculation.

Sources: [DOL Agricultural Exemptions FLSA](https://www.dol.gov/agencies/whd/agriculture); [NELP: Wait Staff and Bartenders Depend on Tips](https://www.nelp.org/insights-research/wait-staff-and-bartenders-depend-on-tips-for-more-than-half-of-their-earnings/)

**Relevant to:** TIP-1 optional contextual callout on back-of-house; future myth quiz on supply chain labor; future article on platform tip manipulation.

---

## Section 4: Tipping Debates

**Should you tip on the pre-tax subtotal or the post-tax total?**
Etiquette authorities historically said tip on the pre-tax subtotal. POS screens nearly universally default to the post-tax total. In a 10% sales tax jurisdiction, tipping 20% on the post-tax total means you are tipping 22% of the actual food cost. In high-tax cities (8-10% sales tax), regular diners in the habit of tipping on the total pay roughly $200-$400 more per year than those who tip on the subtotal. There is no standard rule that benefits the server differently — the math produces the same dollar amount either way. The debate is about what the "right" base is.

**Drinks at a restaurant.** A common practice is to tip $1 per drink at a bar, regardless of percentage. This often produces a lower tip rate than 20% on expensive cocktails, which can disadvantage bartenders relative to servers. In restaurants where the server handles drinks, the percentage tip on the total bill typically covers both. When a separate bartender is involved, standard etiquette says 15-20% of the bar tab independently.

**Counter service and POS tip screen creep.** Tip prompts at counter-service establishments (coffee shops, fast-casual restaurants, bakeries, juice bars) are a recent and contested development. The technology (Square, Toast, Clover) made the screens cheap; the platforms defaulted to suggesting 18/20/25% in contexts where no tipping culture existed before 2015. As of 2025, consumer spending on what surveys call "guilt tipping" (tip given primarily because of social pressure from the POS screen, not from desire to tip) declined 38% year-over-year. The backlash is measurable.

**The 15% to 20% to 25% inflation.** Standard restaurant tip expectations in the US were 10-15% through the 1980s and most of the 1990s. They rose to 15-20% by the mid-2000s, and the modal POS screen suggestion is now 20-25% (with some screens suggesting 25/30/35%). This is partly driven by the anchoring effect of suggested amounts (see Section 5), and partly by the stagnation of tipped wages: if the wage has not changed since 1991, customers are effectively being asked to cover inflation.

**Relevant to:** TIP-1 pre-tax/post-tax toggle; future myth quiz on counter-service tipping expectations; future article on tip percentage inflation.

---

## Section 5: Behavioral Biases in Tipping

**Anchoring.** The most powerful effect in tip behavior is anchoring. When a POS screen suggests 18/20/25%, customers implicitly treat 18% as the low end rather than a reasonable tip. When receipts printed suggested amounts in the early 2000s, tip averages rose. The size of the suggestion matters: screens that suggest 25/30/35% produce higher tips than those suggesting 15/18/20%, even when customers consciously disagree with the framing. The "skip" or "no tip" option is almost always the smallest button, placed inconveniently, sometimes below the fold.

**Visibility and social pressure ("guilt screen" effect).** Tipping more when the worker is watching you enter the amount is a documented, robust effect. Counter-service POS screens typically face both the customer and the worker simultaneously. The worker's presence during tip entry is not accidental. Experimental studies show customers tip significantly more when they believe the worker can see their entry vs. when they believe the screen is private.

**Racial bias.** Research by Brewster and Lynn (published in Sociological Inquiry) found that Black servers receive lower tips than white servers for equivalent service, with unconscious bias as the identified mechanism. Michael Lynn at Cornell's School of Hotel Administration has published over 50 papers on tipping and has documented racial disparities across multiple geographic and demographic contexts. The bias is not explained by differences in service quality, restaurant type, or order size. It is a direct cost of racial bias borne by Black tipped workers.

Source: [Cornell eCommons: Black-White Differences in Tipping](https://ecommons.cornell.edu/server/api/core/bitstreams/c4ded1f5-049c-4a1d-9c9c-3cba71030e6c/content)

**Other documented effects (Cornell hospitality research, Michael Lynn).** Server behaviors that increase tips independently of service quality include: introducing themselves by name, crouching to eye level when speaking to customers, touching the customer's hand or shoulder briefly, drawing a smiley face or writing "thank you" on the check, returning with mints, and repeating the order back verbatim. None of these correlate with service quality. They are social performance variables that exploit warmth and reciprocity cues.

**Payment method.** People tip more with credit cards than with cash. The pain of payment is lower with cards; the dollar amount feels less concrete.

**Appearance.** Physical attractiveness of the server correlates with higher tips, independent of service quality. This effect is documented across multiple studies and adds an appearance-based income premium to tipped work.

**Relevant to:** Future myth quiz questions on anchoring and racial bias in tipping; future article on POS screen design and guilt tipping.

---

## Section 6: Does Tipping Improve Service?

The economic rationale for tipping is that it creates performance incentives: good service earns more money, so workers try harder. The empirical evidence does not support this.

Multiple studies, including work by Michael Lynn and a March 2026 study confirming prior findings, show that tip amounts correlate more with:

- Server race and gender
- Server appearance (attractiveness)
- Diner demographics (income, race, age, gender)
- Social behaviors (name-dropping, touching, smiley faces) that are unrelated to service quality
- Time of day and day of week (higher tips on weekends, lower at lunch)

...than with actual service quality ratings given by the same diners.

The mechanism proposed by economists (worker effort increases because tips are tied to performance) is blunted by the fact that most tipping is driven by social conformity and norm compliance, not reward. Customers tip because not tipping feels bad, not because service was excellent. The variation in tips does not track the variation in service quality that would be required for an effective incentive system.

Restaurants that have experimented with fixed service charges or no-tipping models (Danny Meyer's Union Square Hospitality Group tried a full no-tip model in 2015) have documented better pay equity between front and back of house, reduced racial disparities, and more stable worker income. Most reverted due to competitive pressure and customer resistance, not because the experiment failed on its own terms.

Source: [EurekAlert: Tipping is not an effective incentive for good service](https://www.eurekalert.org/news-releases/1103794)

**Relevant to:** Future myth quiz question on whether tipping rewards service; future article on no-tipping models.

---

## Section 7: Key Numbers

- **$2.13/hr:** Federal tipped minimum wage, unchanged since 1991.
- **$7.25/hr:** Federal full minimum wage (also unchanged since 2009, but separately legislated).
- **20.8% vs. 13.2%:** Tipped worker poverty rate in $2.13 states vs. One Fair Wage states (IWPR, 2024).
- **58.5%:** Share of wait staff earnings that come from tips (median). For bartenders: 54%. (NELP.)
- **2.5 million:** Workers earning the $2.13 federal tipped wage.
- **70%:** Share of the tipped workforce that is women.
- **40%+:** Share of tipped workforce that is Black, Latino, or Asian.
- **2.3x:** How much higher the tipped worker poverty rate is compared to non-tipped workers.
- **$24.2 billion:** Reported tips in US restaurants annually (Census Bureau, 2005-2018 average). Estimated $8 billion additional unreported.
- **$550 million:** Estimated annual loss to NYC delivery workers from DoorDash and Uber Eats moving the tip prompt to post-delivery (NYC DCWP, January 2026).
- **38%:** Decline in consumer "guilt tipping" spending at counter service establishments, 2024 to 2025.

Sources: [NELP: Wait Staff and Bartenders Depend on Tips](https://www.nelp.org/insights-research/wait-staff-and-bartenders-depend-on-tips-for-more-than-half-of-their-earnings/); [US Census Bureau: Tip Reporting at US Restaurants 2005-2018](https://www.census.gov/library/working-papers/2024/adrm/CES-WP-24-68.html); [IWPR Tipped Minimum Wage Fact Sheet 2024](https://iwpr.org/wp-content/uploads/2024/12/Tipped-Minimum-Wage-Fact-Sheet-2024-1.pdf)

**Relevant to:** All of the above. These numbers are the citation layer for every claim in this doc.

---

## What Goes Into TIP-1 (This Calculator)

**In scope for TIP-1 v1:**

- Tip amount calculator: bill input, tip percentage (slider + presets), per-person split
- Pre-tax vs. post-tax toggle with a one-line note explaining the difference
- State selector that determines: is this a One Fair Wage state or a tipped-wage state?
- Contextual note that varies by state:
  - Tipped-wage state: server's base wage may be as low as $2.13/hr federally; tips function as their primary income, not a bonus
  - One Fair Wage state: server receives full state minimum wage regardless of tips; a tip here is additional income, not a wage substitute
- Optional one-line historical note: "$2.13/hr has been the federal tipped wage since 1991"

**Out of scope for TIP-1 v1 (saved for future tools or content):**

- Racial bias research (myth quiz question: "Do you think servers who receive lower tips are giving worse service?")
- Back-of-house wage gap (future article or myth quiz on who does and doesn't receive tips)
- Platform tip manipulation / DoorDash restructuring (future myth quiz or article on delivery worker wages)
- Agricultural worker exemptions (future article on supply chain labor)
- Tipping-does-not-improve-service research (myth quiz question: "What do you think tips reward?")
- Counter-service tipping debate (future article or brief explainer)
- POS screen anchoring and guilt-screen design (future behavioral science article)
- No-tipping restaurant models (future article)
