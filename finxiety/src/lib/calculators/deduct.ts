// DEDUCT-1: Deduction vs. Credit vs. Refund Clarifier.
// Pure functions, no side effects, no Svelte imports.
//
// Three independent modes the tool selects between:
//   A. Deduction — what a deduction actually saves at the user's marginal rate.
//   B. Credit    — a dollar-for-dollar reduction in tax owed.
//   C. Refund    — the monthly amount overwithheld, reframed.
//
// Federal only (v1). State treatment of deductions/credits is out of scope.

export type FilingStatus =
	| 'single'
	| 'married_filing_jointly'
	| 'married_filing_separately'
	| 'head_of_household';

export interface Bracket {
	rate: number;
	min: number;
	max: number | null; // null = top band, no upper bound
}

export interface BracketData {
	last_updated: string;
	verify_at: string;
	standard_deductions: Record<FilingStatus, number>;
	brackets: Record<FilingStatus, Bracket[]>;
}

export interface DeductionResult {
	deductionAmount: number;
	taxableIncome: number;
	filingStatus: FilingStatus;
	marginalRate: number; // e.g. 0.22
	taxSavings: number; // deductionAmount * marginalRate (capped at taxableIncome's tax)
	asCreditValue: number; // what the same dollar amount would save if it were a credit
	difference: number; // asCreditValue - taxSavings (always >= 0)
}

export interface CreditResult {
	creditAmount: number;
	reduction: number; // dollar-for-dollar — equals creditAmount
	// A deduction of the same size, even at the top federal marginal rate, saves
	// only this much. Illustrates the ceiling on a deduction's value.
	deductionAtTopRate: number;
	topRate: number;
}

export interface RefundResult {
	refundAmount: number;
	monthlyEquivalent: number; // refundAmount / 12
	hysaRate: number; // the illustrative annual rate used
	// Illustrative simple-interest earnings if the monthly amount were set aside
	// in a high-yield savings account across the year rather than overwithheld.
	illustrativeEarnings: number;
}

const FILING_STATUSES: FilingStatus[] = [
	'single',
	'married_filing_jointly',
	'married_filing_separately',
	'head_of_household'
];

export function isFilingStatus(value: string): value is FilingStatus {
	return (FILING_STATUSES as string[]).includes(value);
}

// The marginal rate is the rate of the band the *top* dollar of taxable income
// falls into. A deduction comes off that top dollar first, so its value is set
// by the marginal rate (not the effective rate).
export function marginalRate(taxableIncome: number, brackets: Bracket[]): number {
	const income = Math.max(taxableIncome, 0);
	// Walk from the top band down; the first band whose floor the income reaches
	// is the marginal band. Income of exactly 0 lands in the lowest band.
	for (let i = brackets.length - 1; i >= 0; i--) {
		if (income > brackets[i].min) {
			return brackets[i].rate;
		}
	}
	return brackets[0].rate;
}

// The top marginal rate available in a schedule (the highest band's rate).
function topRate(brackets: Bracket[]): number {
	return brackets.reduce((max, b) => Math.max(max, b.rate), 0);
}

// Mode A: Deduction.
export function calcDeduction(
	deductionAmount: number,
	taxableIncome: number,
	filingStatus: FilingStatus,
	brackets: BracketData
): DeductionResult {
	const amount = Math.max(deductionAmount, 0);
	const income = Math.max(taxableIncome, 0);
	const schedule = brackets.brackets[filingStatus];
	const rate = marginalRate(income, schedule);

	// A deduction cannot reduce taxable income below zero, so its benefit is
	// bounded by the income it can actually offset.
	const effectiveDeduction = Math.min(amount, income);
	const taxSavings = effectiveDeduction * rate;

	// If it were a credit, the full amount would reduce tax dollar-for-dollar.
	const asCreditValue = amount;

	return {
		deductionAmount: amount,
		taxableIncome: income,
		filingStatus,
		marginalRate: rate,
		taxSavings,
		asCreditValue,
		difference: Math.max(asCreditValue - taxSavings, 0)
	};
}

// Mode B: Credit.
export function calcCredit(creditAmount: number, brackets: BracketData): CreditResult {
	const amount = Math.max(creditAmount, 0);
	// Use the single schedule's top rate as the federal ceiling for the
	// illustrative comparison; the top rate (37%) is identical across schedules.
	const tRate = topRate(brackets.brackets.single);

	return {
		creditAmount: amount,
		reduction: amount,
		deductionAtTopRate: amount * tRate,
		topRate: tRate
	};
}

// Mode C: Refund.
export function calcRefund(refundAmount: number, hysaRate = 0.045): RefundResult {
	const amount = Math.max(refundAmount, 0);
	const monthly = amount / 12;

	// Illustrative simple interest: set aside `monthly` at the start of each of
	// the 12 months, each tranche earning simple interest for the months it sits.
	// Tranche set aside in month k (1..12) earns for (12 - k) full months.
	// Total = monthly * rate * (sum of (12-k) for k=1..12) / 12
	//       = monthly * rate * (11 + 10 + ... + 0) / 12
	//       = monthly * rate * 66 / 12
	//       = monthly * rate * 5.5
	const illustrativeEarnings = monthly * hysaRate * 5.5;

	return {
		refundAmount: amount,
		monthlyEquivalent: monthly,
		hysaRate,
		illustrativeEarnings
	};
}

// --- Formatting helpers (shared by the route) ---

export function formatDollars(value: number): string {
	return value.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});
}

export function formatDollarsCents(value: number): string {
	return value.toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
}

export function formatPercent(rate: number): string {
	// Rates are whole-percent bands (10, 12, 22, ...); show without decimals.
	return `${Math.round(rate * 100)}%`;
}

export const FILING_STATUS_LABELS: Record<FilingStatus, string> = {
	single: 'Single',
	married_filing_jointly: 'Married filing jointly',
	married_filing_separately: 'Married filing separately',
	head_of_household: 'Head of household'
};
