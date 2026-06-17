// TIP-1: Tip calculation. Pure functions, no side effects, no Svelte imports.

export interface TipInputs {
	billAmount: number;
	tipPercent: number; // 0-100
	partySize: number; // integer >= 1
}

export interface TipResult {
	tipAmount: number;
	total: number;
	perPerson: number | null; // null when partySize === 1
}

// Standard half-up rounding to 2 decimal places.
function round2(value: number): number {
	return Math.round(value * 100) / 100;
}

export function calculateTip(inputs: TipInputs): TipResult {
	const bill = Number.isFinite(inputs.billAmount) ? Math.max(inputs.billAmount, 0) : 0;
	const percent = Number.isFinite(inputs.tipPercent) ? Math.max(inputs.tipPercent, 0) : 0;
	const party = Number.isFinite(inputs.partySize) ? Math.max(Math.floor(inputs.partySize), 1) : 1;

	const tipAmount = round2(bill * (percent / 100));
	const total = round2(bill + tipAmount);
	const perPerson = party > 1 ? round2(total / party) : null;

	return { tipAmount, total, perPerson };
}

