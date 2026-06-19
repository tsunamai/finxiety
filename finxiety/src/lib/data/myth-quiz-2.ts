// MYTH-2: Personal Finance Myth Quiz content (Personal Finance Track)
//
// Sibling of myth-quiz.ts (MYTH-1, Benefits track). Same schema. On-screen copy
// is written to the Finxiety Do No Harm standard: information, not grades; the
// reveal locates the gap in system design and information access, never in the
// guesser.
//
// Data freshness: tipped-wage figures, platform-tip studies, and tax/credit
// vocabulary update on their own cadences. Several reveals cite specific dated
// studies (NYC DCWP Jan 2026; federal tipped minimum frozen since 1991). The
// release agent re-verifies every figure before ship.
const LAST_UPDATED = '2026-06-19';

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
	 * For questions whose honest answer is qualitative, realAnswer is the numeric
	 * value used only for slider positioning; realAnswerDisplay carries the text
	 * actually shown.
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
		id: 'tipping-service',
		prompt: 'Tips mostly reward good service. How much of the research actually supports that?',
		inputType: 'percentage',
		inputMin: 0,
		inputMax: 100,
		inputDefault: 60,
		inputStep: 5,
		anchorLabels: ['None of it', 'All of it'],
		realAnswer: 10,
		realAnswerLabel: '',
		realAnswerDisplay:
			'Less than 10% — tip amounts correlate mostly with server appearance and social behaviors, not service quality.',
		revealHeadline: 'Decades of research say otherwise.',
		revealBody:
			'Michael Lynn at Cornell has published over 50 studies on tipping. The consistent finding: tips correlate with the server’s race, gender, physical appearance, and social touch (touching the customer lightly, writing a smiley face on the check) more than with any measure of service quality.',
		structuralExplanation:
			'The incentive mechanism most people assume tipping creates — pay more for better service — doesn’t have strong empirical support. The system persists not because it works as designed, but because it transferred the cost of server wages from employers to customers in a way employers found preferable.',
		signpost:
			'TIP-1 shows what tipped workers in your state actually earn before tips — the picture behind the tip screen.',
		signpostUrl: '/tools/tip-calculator',
		sources: [
			{
				label: 'Lynn & McCall (2000), Journal of Applied Social Psychology',
				url: 'https://doi.org/10.1111/j.1559-1816.2000.tb02498.x'
			},
			{
				label: 'Cornell Hospitality Research Summary: Tipping Research',
				url: 'https://scholarship.sha.cornell.edu/cgi/viewcontent.cgi?article=1045&context=chrpubs'
			}
		]
	},
	{
		id: 'tipped-minimum',
		prompt:
			'The federal tipped minimum wage is $2.13/hr. Since what year has it been frozen at that amount?',
		inputType: 'number',
		inputMin: 1950,
		inputMax: 2024,
		inputDefault: 2010,
		inputStep: 1,
		realAnswer: 1991,
		realAnswerLabel: '',
		realAnswerDisplay: '1991 — 35 years and counting.',
		revealHeadline: 'Since 1991. Congress has not changed it once.',
		revealBody:
			'The federal tipped minimum wage of $2.13/hr was set in 1991 and has not been raised by Congress in over three decades. During that same period, the general federal minimum wage has been raised multiple times. Some states set their own higher floors; others follow the federal rate.',
		structuralExplanation:
			'This is a policy choice, not an oversight. The 1996 FLSA amendment that froze it was heavily lobbied by the National Restaurant Association. Tipped workers in states that follow the federal floor earn $2.13 before tips regardless of how much the cost of living has changed since Reagan was president.',
		signpost: 'The Tip Calculator shows what the tip-credit minimum is in your state.',
		signpostUrl: '/tools/tip-calculator',
		sources: [
			{
				label: 'FLSA tipped minimum wage history, U.S. Department of Labor',
				url: 'https://www.dol.gov/agencies/whd/minimum-wage/history/chart'
			},
			{
				label: 'Economic Policy Institute: Tipped minimum wage',
				url: 'https://www.epi.org/publication/states-can-choose-a-better-path-on-tipped-minimum-wages/'
			}
		]
	},
	{
		id: 'platform-tips',
		prompt:
			'DoorDash moved the tip prompt from before ordering to after delivery. NYC delivery tips fell by about how much?',
		inputType: 'percentage',
		inputMin: 0,
		inputMax: 100,
		inputDefault: 25,
		inputStep: 5,
		anchorLabels: ['Not much', 'A lot'],
		realAnswer: 65,
		realAnswerLabel: '',
		realAnswerDisplay: 'About 65% — from $2.17 to $0.76 per order.',
		revealHeadline:
			'To $0.76. That one design decision cost NYC delivery workers roughly $550 million per year.',
		revealBody:
			'A January 2026 NYC Department of Consumer and Worker Protection report documented the effect: moving the tip prompt after delivery dropped average tips from $2.17 to $0.76 per order in New York City. The platform changed when you see the screen; workers absorbed the result.',
		structuralExplanation:
			'App designers know that tip prompts before delivery trigger anticipated guilt; prompts after delivery are easier to dismiss. This is documented behavioral design used against workers. The intervention here wasn’t the user’s psychology — it was the company’s product decision.',
		signpost:
			'The Tip Calculator shows what’s behind the tip screen — state minimums, wage credits, and who actually depends on tips.',
		signpostUrl: '/tools/tip-calculator',
		sources: [
			{
				label: 'NYC DCWP: Impact of App-Based Tips on Worker Pay (Jan 2026)',
				url: 'https://www.nyc.gov/site/dca/workers/workersrights/app-based-delivery.page'
			}
		]
	},
	{
		id: 'tax-refund',
		prompt: 'A big tax refund means you did your taxes right. Is that true?',
		inputType: 'percentage',
		inputMin: 0,
		inputMax: 100,
		inputDefault: 70,
		inputStep: 5,
		anchorLabels: ['Definitely false', 'Definitely true'],
		realAnswer: 0,
		realAnswerLabel: '',
		realAnswerDisplay: 'False. A large refund means you overpaid throughout the year — interest-free.',
		revealHeadline:
			'A refund is your own money coming back — it earned no interest while the IRS held it.',
		revealBody:
			'A tax refund means you had more withheld from your paychecks than you owed. The IRS returns the excess, but not with interest. Many people prefer a refund as forced savings; others prefer to adjust withholding so the money arrives in each paycheck. Neither is wrong — but a big refund isn’t evidence of doing taxes “right.”',
		structuralExplanation:
			'The “big refund = success” frame is reinforced by tax prep marketing that celebrates large refund amounts. The actual measure of accuracy is whether your liability was calculated correctly — not whether you overpaid.',
		signpost:
			'Tax Clarity breaks down what a deduction actually saves you versus what a credit is worth.',
		signpostUrl: '/tools/tax-clarity',
		sources: [
			{
				label: 'IRS: Tax Withholding Estimator',
				url: 'https://www.irs.gov/individuals/tax-withholding-estimator'
			},
			{
				label: 'IRS: Understanding Your Refund',
				url: 'https://www.irs.gov/refunds/understanding-your-refund'
			}
		]
	},
	{
		id: 'deduction-vs-credit',
		prompt: 'A $1,000 tax deduction and a $1,000 tax credit save you the same amount. True or false?',
		inputType: 'percentage',
		inputMin: 0,
		inputMax: 100,
		inputDefault: 65,
		inputStep: 5,
		anchorLabels: ['False', 'True'],
		realAnswer: 0,
		realAnswerLabel: '',
		realAnswerDisplay:
			'False. A credit saves $1,000. A deduction saves $1,000 × your marginal tax rate — typically $100–$370.',
		revealHeadline: 'A credit is worth dollar-for-dollar. A deduction is worth a fraction of that.',
		revealBody:
			'A tax deduction reduces the income that gets taxed. If your marginal rate is 22%, a $1,000 deduction saves you $220. A tax credit reduces your tax bill directly — a $1,000 credit saves $1,000, regardless of your income level. Credits are usually more valuable, especially refundable ones.',
		structuralExplanation:
			'The same vocabulary — “tax benefit” — covers both. Financial media uses them interchangeably in headlines. The math works very differently.',
		signpost: 'Tax Clarity lets you enter a deduction or credit and see what it actually saves you.',
		signpostUrl: '/tools/tax-clarity',
		sources: [
			{
				label: 'IRS: Deductions vs. Credits',
				url: 'https://www.irs.gov/credits-deductions-for-individuals'
			}
		]
	},
	{
		id: 'emergency-fund',
		prompt: 'Having money in a checking account means you have an emergency fund. True or false?',
		inputType: 'percentage',
		inputMin: 0,
		inputMax: 100,
		inputDefault: 70,
		inputStep: 5,
		anchorLabels: ['False', 'True'],
		realAnswer: 0,
		realAnswerLabel: '',
		realAnswerDisplay:
			'False — checking money serves bills, groceries, and daily spending. An emergency fund is a separate, intentional reserve.',
		revealHeadline:
			'Checking money is spoken for. An emergency fund is money with a specific job.',
		revealBody:
			'The distinction is purpose, not location. Money in checking covers regular expenses — it’s already allocated before an emergency happens. An emergency fund is money set aside specifically for unplanned events (job loss, medical cost, car repair) so that covering them doesn’t mean going into debt or missing another bill.',
		structuralExplanation:
			'The conflation happens because the money occupies the same account. But “available balance” and “emergency fund” aren’t the same category — one is a running total, the other is a committed reserve. Knowing the difference changes how you evaluate financial stability.',
		signpost:
			'Emergency Fund Checker estimates how many months of expenses your current savings would cover.',
		signpostUrl: '/tools/emergency-fund',
		sources: [
			{
				label: 'Consumer Financial Protection Bureau: Emergency savings',
				url: 'https://www.consumerfinance.gov/consumer-tools/educator-tools/youth-financial-education/glossary/emergency-fund-definition/'
			}
		]
	},
	{
		id: 'compound-direction',
		prompt: 'Compound interest only works in your favor when you’re investing. True or false?',
		inputType: 'percentage',
		inputMin: 0,
		inputMax: 100,
		inputDefault: 75,
		inputStep: 5,
		anchorLabels: ['False', 'True'],
		realAnswer: 0,
		realAnswerLabel: '',
		realAnswerDisplay: 'False — the same math runs in both directions.',
		revealHeadline: 'Debt compounds too. The formula doesn’t care which side you’re on.',
		revealBody:
			'The compound interest formula applies equally to a savings account growing for you and a credit card balance growing against you. At 24% APR, a $2,000 balance left untouched for five years grows to over $5,700 — not because of fees, but because of compounding. The math runs the same direction regardless of who benefits.',
		structuralExplanation:
			'Investment content presents compounding as a wealth-building phenomenon. Lending products rarely show you the compound growth curve on what you owe. The asymmetry in how it’s presented creates a gap in how people understand their own debt.',
		signpost: 'The Debt vs. Growth Visualizer puts both curves on one chart.',
		signpostUrl: '/tools/debt-growth',
		sources: [
			{
				label: 'Consumer Financial Protection Bureau: How credit card interest works',
				url: 'https://www.consumerfinance.gov/ask-cfpb/how-is-credit-card-interest-calculated-en-1667/'
			}
		]
	},
	{
		id: 'credit-score',
		prompt: 'A high credit score means you’re financially healthy. True or false?',
		inputType: 'percentage',
		inputMin: 0,
		inputMax: 100,
		inputDefault: 75,
		inputStep: 5,
		anchorLabels: ['False', 'True'],
		realAnswer: 0,
		realAnswerLabel: '',
		realAnswerDisplay:
			'False — credit scores measure debt-repayment behavior, not savings, net worth, or financial stability.',
		revealHeadline:
			'Credit scores measure one thing: whether you pay back borrowed money on time.',
		revealBody:
			'A credit score captures your repayment history, credit utilization, and length of credit history. Someone with a 780 score could have zero savings and $30,000 in car and credit card debt. Someone with a 620 score might be debt-free with six months of expenses saved. The score doesn’t know which is which.',
		structuralExplanation:
			'Credit scores are designed for lenders, not for individuals to assess their own financial health. They became a default proxy for financial wellness because lenders use them, and because consumer credit reporting is heavily marketed. They are useful data — just not a complete picture.',
		signpost:
			'The Emergency Fund Checker looks at runway — what your savings would actually cover in a disruption.',
		signpostUrl: '/tools/emergency-fund',
		sources: [
			{
				label: 'CFPB: What is a credit score?',
				url: 'https://www.consumerfinance.gov/ask-cfpb/what-is-a-credit-score-en-315/'
			},
			{
				label: 'CFPB: Credit reports and scores',
				url: 'https://www.consumerfinance.gov/consumer-tools/credit-reports-and-scores/'
			}
		]
	},
	{
		id: 'rewards-myth',
		prompt:
			'Credit card rewards programs — cashback, miles, points — are free money for cardholders. True or false?',
		inputType: 'percentage',
		inputMin: 0,
		inputMax: 100,
		inputDefault: 70,
		inputStep: 5,
		anchorLabels: ['False', 'True'],
		realAnswer: 0,
		realAnswerLabel: '',
		realAnswerDisplay:
			'False — they’re funded by interchange fees paid by merchants and passed to non-card consumers through higher prices.',
		revealHeadline:
			'Rewards are funded by fees — including fees paid by people who don’t use rewards cards.',
		revealBody:
			'Every credit card swipe triggers an interchange fee (typically 1.5–3.5% of the transaction) paid by the merchant to the card issuer. Merchants generally pass this cost to all customers through slightly higher prices — whether they paid with cash, debit, or a no-rewards card. Rewards cardholders get the points funded partly by consumers who have no card at all.',
		structuralExplanation:
			'A 2010 Federal Reserve Bank of Boston study estimated that cash users pay more for goods to subsidize rewards card users, with the transfer running roughly $149/year from low-income to high-income households. The mechanism is invisible by design.',
		signpost:
			'No specific Finxiety tool covers rewards math yet — but understanding what interest actually costs is a start.',
		signpostUrl: '/tools/debt-growth',
		sources: [
			{
				label:
					'Federal Reserve Bank of Boston: Who Gains and Who Loses from Credit Card Payments? (2010)',
				url: 'https://www.bostonfed.org/publications/public-policy-discussion-paper/2010/who-gains-and-who-loses-from-credit-card-payments.aspx'
			},
			{
				label: 'CFPB: Credit card rewards',
				url: 'https://www.consumerfinance.gov/about-us/blog/what-you-need-to-know-about-credit-card-rewards/'
			}
		]
	},
	{
		id: 'big-changes',
		prompt:
			'Making meaningful financial progress requires big, dramatic changes — like getting a major raise or paying off a large debt at once. True or false?',
		inputType: 'percentage',
		inputMin: 0,
		inputMax: 100,
		inputDefault: 70,
		inputStep: 5,
		anchorLabels: ['False', 'True'],
		realAnswer: 0,
		realAnswerLabel: '',
		realAnswerDisplay:
			'False — small, repeatable actions compound over time the same way interest does.',
		revealHeadline:
			'Small changes that happen automatically tend to outperform large intentions that don’t.',
		revealBody:
			'Behavioral economics research consistently finds that small, automatic, and specific actions (transferring $5 weekly, rounding up purchases to savings) outperform large aspirational goals that rely on willpower or memory. The barrier to progress is rarely knowledge of the right action — it’s structure. Automation and commitment devices, not big moments, drive most of the measurable change.',
		structuralExplanation:
			'The “big change” frame sets a high bar that deters starting. Research on savings behavior shows that small early actions, maintained consistently, produce compounding effects that dwarf a delayed large action. The compound interest math applies to behavior as much as money.',
		signpost:
			'The Compounding Effect calculator shows how a small starting amount plus a monthly contribution adds up over time.',
		signpostUrl: '/tools/compound-interest',
		sources: [
			{
				label: 'Thaler & Benartzi (2004): Save More Tomorrow (SMarT program)',
				url: 'https://doi.org/10.1086/380085'
			},
			{
				label:
					'Milkman, Beshears, Choi, Laibson & Madrian (2011): Implementation intentions in savings behavior',
				url: 'https://doi.org/10.1073/pnas.1103170108'
			}
		]
	}
];

export const synthesisPrompts: SynthesisPrompt[] = [
	{
		id: 'most-surprising',
		prompt: 'Which finding surprised you most?',
		kind: 'select',
		options: [
			{ id: 'tipping-service', label: 'That tips track a server’s appearance more than their service' },
			{ id: 'tipped-minimum', label: 'That the federal tipped minimum wage has been frozen since 1991' },
			{ id: 'platform-tips', label: 'That moving the tip prompt later cut delivery tips by two-thirds' },
			{ id: 'tax-refund', label: 'That a big refund means you overpaid, interest-free, all year' },
			{ id: 'deduction-vs-credit', label: 'That a credit and a deduction of the same size save very different amounts' },
			{ id: 'emergency-fund', label: 'That money in checking isn’t the same as an emergency fund' },
			{ id: 'compound-direction', label: 'That compound interest runs against you on debt, too' },
			{ id: 'credit-score', label: 'That a high credit score doesn’t mean you’re financially healthy' },
			{ id: 'rewards-myth', label: 'That card rewards are funded by fees, including from people with no card' },
			{ id: 'big-changes', label: 'That small automatic actions outperform big one-time changes' }
		]
	},
	{
		id: 'assume-cause',
		prompt: 'Is there something you assumed about money that this changed or confirmed?',
		helper: 'A few words is fine. No right answer.',
		kind: 'text'
	}
];

export { LAST_UPDATED };
