// MYTH-1: Benefits Myth-Check Quiz content
//
// Source content spec: finxiety/research-findings/myth-1-quiz-content.md
// (last_updated 2026-06-14). On-screen copy below is taken verbatim from that
// spec. Research-only framing (the "myth label" lines, unverified aggregate
// figures, fear/urgency stats) is intentionally NOT included here. It must
// never render on screen.
//
// Data freshness: SNAP characteristics, WIC eligibility rates, and the figures
// in these reveals update annually each October (federal fiscal year). The
// release agent re-verifies every figure before ship and each October.
const LAST_UPDATED = '2026-06-14';

export type InputType = 'number' | 'percentage' | 'dollar' | 'range';

export interface Source {
	label: string;
	url: string;
}

export interface Question {
	/** Stable identifier, also used as the React/Svelte key. */
	id: string;
	/** On-screen question text. */
	prompt: string;
	/** Drives which estimate control renders. */
	inputType: InputType;
	/** Inclusive lower bound of the estimate control. */
	inputMin: number;
	/** Inclusive upper bound of the estimate control. */
	inputMax: number;
	/** Default starting value for the control (also the slider's resting point). */
	inputDefault: number;
	/** Step granularity for the control. */
	inputStep: number;
	/** Anchor labels for range/slider controls: [low end, high end]. */
	anchorLabels?: [string, string];
	/**
	 * The real figure, used for the "You guessed: X. The real number: Y." line.
	 * For questions whose honest answer is qualitative (Q2), realAnswer is the
	 * numeric midpoint used only for slider positioning; realAnswerDisplay
	 * carries the text actually shown.
	 */
	realAnswer: number;
	/** Unit suffix shown beside realAnswer, e.g. "states", "per day", "%". */
	realAnswerLabel: string;
	/**
	 * Optional override for the displayed real answer when a bare number would
	 * be misleading or unverified. When present, this string is shown instead
	 * of `realAnswer + realAnswerLabel`.
	 */
	realAnswerDisplay?: string;
	/** Reveal headline: blames the system or information gap, never the guesser. */
	revealHeadline: string;
	/** Reveal body paragraph. */
	revealBody: string;
	/** Optional caveat note rendered below revealBody — for scope limits or disability-specific exceptions. */
	revealNote?: string;
	/** Structural explanation paragraph: locates the gap in system design. */
	structuralExplanation: string;
	/** Warm, informational cross-tool signpost. Never imperative. */
	signpost: string;
	/** Optional path to a live tool the signpost references. Renders as a link button. */
	signpostUrl?: string;
	/** Official sources for the figures in this reveal. */
	sources: Source[];
}

export interface SynthesisPrompt {
	id: string;
	/** On-screen prompt text. */
	prompt: string;
	/** Optional helper line shown under the prompt. */
	helper?: string;
	/** 'select' renders the option list; 'text' renders a free-text field. */
	kind: 'select' | 'text';
	/** Options for a 'select' prompt. */
	options?: { id: string; label: string }[];
}

export const questions: Question[] = [
	{
		id: 'savings',
		prompt:
			'If a SNAP household saved $2,000, how many states would count that against their eligibility?',
		inputType: 'number',
		inputMin: 0,
		inputMax: 50,
		inputDefault: 25,
		inputStep: 1,
		realAnswer: 9,
		realAnswerLabel: 'states',
		revealHeadline:
			"Fewer than 10. In 41 states, that savings doesn't affect eligibility at all.",
		revealBody:
			'41 states have eliminated the SNAP asset test. Only 9 still cap it. The fear that saving costs you benefits is based on a rule most states quietly retired, without telling anyone.',
		revealNote:
			'One exception: SSI and some disability-linked Medi-Cal programs are still asset-tested separately from SNAP. People receiving SSI face a roughly $2,000 resource limit. ABLE accounts (calable.ca.gov in California) let eligible people save above that limit without it counting.',
		structuralExplanation:
			"It happened through a policy option called Broad-Based Categorical Eligibility (BBCE), which states can adopt without any public announcement. Most applicants have never heard of it. The fear was rational given the rule's history. The map just changed without anyone updating the signs.",
		signpost:
			'In California, the Benefits Screener checks eligibility for CalFresh, Medi-Cal, WIC, and more in one pass.',
		signpostUrl: '/tools/screener',
		sources: [
			{
				label: 'CBPP: SNAP Broad-Based Categorical Eligibility (March 2026)',
				url: 'https://www.cbpp.org/research/food-assistance/snaps-broad-based-categorical-eligibility-supports-working-families-and-0'
			},
			{
				label: 'Propel: SNAP asset limits by state',
				url: 'https://www.propel.app/snap/asset-limits-states/'
			}
		]
	},
	{
		id: 'cliff',
		prompt:
			'A $1/hour raise can sometimes leave a parent worse off, because of the benefits it triggers them to lose. How many families with children do you think face this?',
		inputType: 'range',
		inputMin: 0,
		inputMax: 100,
		inputDefault: 50,
		inputStep: 1,
		anchorLabels: ['A few thousand', 'Millions'],
		realAnswer: 100,
		realAnswerLabel: '',
		realAnswerDisplay: 'Millions',
		revealHeadline: "Millions. And it's a design flaw, not a personal failure.",
		revealBody:
			'One documented case: a $1/hour raise added $160/month in earnings but triggered $800/month in benefit reductions (a net loss of $640). In another, a $0.10/hour raise cost a family $9,000/year in childcare subsidies.',
		structuralExplanation:
			"Each program has its own income cutoff. When SNAP, Medicaid, housing assistance, and childcare subsidies all hit their limits near each other, accepting a raise can be financially irrational. That's a design flaw, not a reflection of how hard someone is working.",
		signpost:
			"A Benefits Cliff Calculator is in the works. In the meantime, the Benefits Screener can show you which programs you currently qualify for — knowing what you're enrolled in is the starting point for understanding what a raise might affect.",
		signpostUrl: '/tools/screener',
		sources: [
			{
				label: 'Atlanta Fed: What are benefits cliffs?',
				url: 'https://www.atlantafed.org/what-we-study/workforce-development/advancing-careers-for-low-income-families/what-are-benefits-cliffs'
			},
			{
				label: 'Federal Reserve Communities: The benefits cliff explained',
				url: 'https://fedcommunities.org/the-benefits-cliff-explained/'
			},
			{
				label: 'CBPP: Block-granting not a solution to benefit cliffs',
				url: 'https://www.cbpp.org/research/poverty-and-inequality/block-granting-not-a-solution-to-benefit-cliffs'
			}
		]
	},
	{
		id: 'daily-amount',
		prompt:
			'On average, SNAP gives each person how much money per day to spend on food?',
		inputType: 'dollar',
		inputMin: 1,
		inputMax: 30,
		inputDefault: 10,
		inputStep: 1,
		realAnswer: 6.16,
		realAnswerLabel: 'per day',
		revealHeadline: '$6.16, less than the cost of a minimum adequate diet.',
		revealBody:
			"The average SNAP benefit works out to $6.16 per person per day, below what the USDA's own Thrifty Food Plan estimates it costs to eat adequately. Running short at the end of the month is a structural consequence of that gap.",
		structuralExplanation:
			"Benefit levels are set by Congress and haven't kept pace with food costs. Families often front-load spending early in the month on shelf-stable staples, then run short when fresh food runs out. That pattern is structural, not impulsive spending.",
		signpost:
			'In California, CalFresh, Medi-Cal, and other programs are covered in the Benefits Screener.',
		signpostUrl: '/tools/screener',
		sources: [
			{
				label: 'CBPP: The Supplemental Nutrition Assistance Program (SNAP)',
				url: 'https://www.cbpp.org/research/food-assistance/the-supplemental-nutrition-assistance-program-snap'
			},
			{
				label: 'USDA ERS: Monthly timing of SNAP spending',
				url: 'https://www.ers.usda.gov/amber-waves/2018/december/monthly-timing-of-snap-spending-less-smooth-for-some-households'
			}
		]
	},
	{
		id: 'paperwork',
		prompt:
			'In a Massachusetts study, what share of SNAP families with young children lost benefits, not because they became ineligible but because of a missed deadline or paperwork?',
		inputType: 'percentage',
		inputMin: 0,
		inputMax: 100,
		inputDefault: 50,
		inputStep: 1,
		realAnswer: 41,
		realAnswerLabel: '%',
		revealHeadline: 'Nearly 41%: eligible families who lost benefits over paperwork.',
		revealBody:
			'In that study, 40.9% of SNAP families with young children lost benefits for purely administrative reasons: a missed recertification deadline, incomplete paperwork, or a missed phone interview. Researchers call these "procedural denials": benefits lost despite full financial eligibility.',
		structuralExplanation:
			"Recertification means new documents, a new interview, and a deadline set by the agency, on a schedule that doesn't account for your work shifts, available time, or English fluency. These are access barriers built into the process. The research is explicit: these are administrative failures, not personal ones.",
		signpost:
			'Missing a recertification deadline is the most common reason eligible families lose benefits they still qualify for. Knowing your deadline in advance is the fix.',
		sources: [
			{
				label: 'PMC / AJPH: Procedural denials among SNAP families',
				url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9449793/'
			},
			{
				label: 'CBPP, Improving SNAP and Medicaid access: SNAP renewals',
				url: 'https://www.cbpp.org/research/food-assistance/improving-snap-and-medicaid-access-snap-renewals'
			}
		]
	},
	{
		id: 'wic',
		prompt:
			'If a family is on SNAP with a child under 5, what percentage are also enrolled in WIC, the nutrition program for kids that age?',
		inputType: 'percentage',
		inputMin: 0,
		inputMax: 100,
		inputDefault: 50,
		inputStep: 1,
		realAnswer: 50,
		realAnswerLabel: '%',
		realAnswerDisplay: 'About half',
		revealHeadline:
			'About half. And nearly half are missing it, even with SNAP.',
		revealBody:
			"Nearly half of WIC-eligible people on SNAP or Medicaid don't enroll in WIC, even though SNAP enrollment can fast-track WIC eligibility. Overall, only 56% of eligible people were enrolled in 2023.",
		structuralExplanation:
			"WIC requires a separate application, an in-person visit for nutritional screening, and a nearby WIC clinic, all separate from SNAP and Medicaid. Being on SNAP with a young child and not having WIC is common. The programs don't connect automatically, and no one is required to tell you.",
		signpost:
			'In California, the Benefits Screener checks WIC eligibility alongside CalFresh and Medi-Cal in one pass.',
		signpostUrl: '/tools/screener',
		sources: [
			{
				label: 'USDA FNS: WIC Eligibility and Coverage Rates 2023',
				url: 'https://www.fns.usda.gov/research/wic/eer/2023'
			},
			{
				label: "CBPP: WIC's critical benefits reach more of those eligible",
				url: 'https://www.cbpp.org/research/food-assistance/wics-critical-benefits-reach-more-of-those-eligible-than-in-recent-years'
			}
		]
	}
];

export const synthesisPrompts: SynthesisPrompt[] = [
	{
		id: 'most-surprising',
		prompt: 'Which of these surprised you most?',
		kind: 'select',
		options: [
			{ id: 'savings', label: 'That saving money might not affect SNAP in your state' },
			{ id: 'cliff', label: 'That a raise can sometimes leave you with less' },
			{
				id: 'paperwork',
				label: 'That paperwork, not eligibility, is why most people lose benefits'
			},
			{ id: 'wic', label: 'That missing WIC while on SNAP is common' },
			{
				id: 'daily-amount',
				label: "That $6.16 a day is below what the USDA's own minimum diet costs"
			}
		]
	},
	{
		id: 'assume-cause',
		prompt:
			"If someone told you they'd lost their SNAP benefits last year, what would you assume happened?",
		helper: "A few words is fine. No right answer.",
		kind: 'text'
	}
];

export { LAST_UPDATED };
