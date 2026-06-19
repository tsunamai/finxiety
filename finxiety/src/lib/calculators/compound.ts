// COMPOUND-1: The Compounding Effect calculator.
// Pure monthly-compounding math. No Svelte, no side effects, no data files —
// every number is user-supplied (starting amount, monthly addition, rate, horizon).
//
// The point of the tool: show, not prescribe. We model standard monthly
// compounding and split the final balance into "what you put in" vs. "what the
// interest added," so the educational story is visible rather than asserted.

export interface GrowthPoint {
	year: number;
	totalValue: number; // balance at the end of this year
	totalContributed: number; // principal + every monthly addition made so far
	totalInterest: number; // totalValue - totalContributed
}

// Clamp a numeric input to a finite, non-negative number. Non-finite values
// (NaN from an empty field) or negatives collapse to 0 so the math never
// produces Infinity or a misleading negative curve. Principal and monthly
// contribution can legitimately be 0; this only guards against junk input.
function clampNonNegative(value: number): number {
	return Number.isFinite(value) && value > 0 ? value : 0;
}

export function computeGrowth(
	principal: number, // starting amount ($), can be 0
	monthlyContribution: number, // monthly addition ($), can be 0
	annualRate: number, // annual interest rate as a percentage (e.g. 7 for 7%)
	years: number // time horizon (5, 10, 20, or 30)
): GrowthPoint[] {
	const startPrincipal = clampNonNegative(principal);
	const monthly = clampNonNegative(monthlyContribution);
	const rate = clampNonNegative(annualRate);
	// Horizon must be a whole, positive number of years. Anything else is 0 years.
	const horizonYears = Number.isFinite(years) && years > 0 ? Math.floor(years) : 0;

	const monthlyRate = rate / 12 / 100;

	const points: GrowthPoint[] = [];

	// Year 0 is the starting state: just the principal, no contributions yet,
	// no interest yet.
	points.push({
		year: 0,
		totalValue: startPrincipal,
		totalContributed: startPrincipal,
		totalInterest: 0
	});

	let balance = startPrincipal;

	for (let year = 1; year <= horizonYears; year++) {
		// Compound month by month: one month of interest on the running balance,
		// then the fixed monthly addition.
		for (let m = 0; m < 12; m++) {
			balance = balance * (1 + monthlyRate) + monthly;
		}
		const totalContributed = startPrincipal + monthly * (year * 12);
		points.push({
			year,
			totalValue: balance,
			totalContributed,
			totalInterest: balance - totalContributed
		});
	}

	return points;
}
