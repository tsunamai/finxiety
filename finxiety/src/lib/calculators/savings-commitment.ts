// SAVE-1: Savings Commitment Maker.
// Pure TypeScript, zero dependencies. No network, no storage.
//
// Assembles a self-authored implementation-intention statement (Gollwitzer 1999)
// from the user's own words, and an optional rough timeline. This module never
// recommends an amount, never references income, and never sets a floor — the
// user's stated values pass through verbatim.

// The three cadences SAVE-1 offers. This key drives the timeline math; the
// human-readable `frequency` phrase is what appears in the statement.
export type FrequencyKey = 'weekly' | 'biweekly' | 'monthly';

export interface CommitmentInputs {
	goal: string; // "new tires" — the user's own words, verbatim
	amount: number; // 20 — the transfer amount; any positive number, including small
	frequency: string; // a human phrase, e.g. "every other Friday"
	frequencyKey: FrequencyKey; // the cadence, supplied by the UI; drives timeline math
	whenAnchor: string; // the implementation-intention "when", e.g. "after I get paid"
	habitAnchor?: string; // optional habit-stacking anchor, e.g. "when I pay rent"
	targetAmount?: number; // optional total goal; drives the rough timeline only
}

export interface CommitmentResult {
	statement: string; // the full assembled commitment sentence
	roughTimeline?: string; // only present when targetAmount is provided and amount > 0
}

// Format a dollar amount as "$X": no decimals when whole, one decimal otherwise.
// We keep this deliberately simple — the tool shows the user's number back to
// them, not a rounded or "advised" figure.
export function formatAmount(amount: number): string {
	const isWhole = Number.isInteger(amount);
	return `$${isWhole ? String(amount) : amount.toFixed(1)}`;
}

// Build the rough timeline sentence for a given transfer cadence.
// transfers = ceil(target / amount). The unit of the span depends on cadence:
//   weekly   → transfers weeks
//   biweekly → transfers * 2 weeks   (one transfer every two weeks)
//   monthly  → transfers months
// Always suffixed with the rough-estimate caveat. Returns undefined when the
// inputs can't yield a meaningful estimate.
export function buildRoughTimeline(
	amount: number,
	targetAmount: number | undefined,
	frequencyKey: FrequencyKey
): string | undefined {
	if (targetAmount === undefined || !Number.isFinite(targetAmount) || targetAmount <= 0) {
		return undefined;
	}
	if (!Number.isFinite(amount) || amount <= 0) {
		return undefined;
	}

	const transfers = Math.ceil(targetAmount / amount);
	const amountLabel = formatAmount(amount);
	const targetLabel = formatAmount(targetAmount);

	let cadencePhrase: string;
	let span: number;
	let unit: string;

	switch (frequencyKey) {
		case 'weekly':
			cadencePhrase = 'every week';
			span = transfers;
			unit = 'week';
			break;
		case 'biweekly':
			cadencePhrase = 'every two weeks';
			span = transfers * 2;
			unit = 'week';
			break;
		case 'monthly':
			cadencePhrase = 'every month';
			span = transfers;
			unit = 'month';
			break;
	}

	const unitLabel = span === 1 ? unit : `${unit}s`;

	return (
		`At ${amountLabel} ${cadencePhrase}, reaching ${targetLabel} would take approximately ` +
		`${span} ${unitLabel} — rough estimate; your actual timeline will vary.`
	);
}

// Assemble the commitment statement. The user's goal, frequency phrase, when,
// and habit anchor all appear verbatim — no paraphrasing, no glossing.
//
// Shape:
//   "I will transfer $X to savings [frequency] [whenAnchor] so that I can save for [goal]."
// With a habit anchor:
//   "I will transfer $X to savings [frequency] [whenAnchor], [habitAnchor], so that I can save for [goal]."
export function buildCommitment(inputs: CommitmentInputs): CommitmentResult {
	const { goal, amount, frequency, frequencyKey, whenAnchor, habitAnchor, targetAmount } = inputs;

	const amountLabel = formatAmount(amount);
	const goalText = goal.trim();
	const frequencyText = frequency.trim();
	const whenText = whenAnchor.trim();
	const habitText = habitAnchor?.trim();

	// The middle clause: frequency + when, plus the optional habit anchor set off
	// by commas so it reads as a linked-to-an-existing-routine aside.
	let middle = `${frequencyText} ${whenText}`.trim();
	if (habitText) {
		middle = `${middle}, ${habitText},`;
	}

	const statement = `I will transfer ${amountLabel} to savings ${middle} so that I can save for ${goalText}.`;

	const result: CommitmentResult = { statement };

	// Rough timeline is supplementary and only appears when the user gave a target
	// and a positive amount. It never recommends, never motivates.
	const timeline = buildRoughTimeline(amount, targetAmount, frequencyKey);
	if (timeline) result.roughTimeline = timeline;

	return result;
}
