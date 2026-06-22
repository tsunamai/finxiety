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
	tipPerPerson: number | null; // null when partySize === 1
}

// Standard half-up rounding to 2 decimal places.
function round2(value: number): number {
	return Math.round(value * 100) / 100;
}

export interface LineItem {
	id: string;
	label: string;
	amount: number;
	isAlcohol: boolean;
}

export interface ItemizedInputs {
	items: LineItem[];
	taxRate: number;       // food sales tax %, e.g. 8.5
	alcoholTaxRate: number; // alcohol tax %; equals taxRate when no separate rate applies
	tipPercent: number;
	tipBase: 'pretax' | 'posttax';
}

export interface ItemizedResult {
	foodSubtotal: number;
	alcoholSubtotal: number;
	subtotal: number;
	taxAmount: number;
	tipBaseAmount: number;
	tipAmount: number;
	total: number;
}

export function calculateItemized(inputs: ItemizedInputs): ItemizedResult {
	const taxRate = Number.isFinite(inputs.taxRate) ? Math.max(inputs.taxRate, 0) : 0;
	const alcoholTaxRate = Number.isFinite(inputs.alcoholTaxRate) ? Math.max(inputs.alcoholTaxRate, 0) : taxRate;
	const percent = Number.isFinite(inputs.tipPercent) ? Math.max(inputs.tipPercent, 0) : 0;

	let foodSubtotal = 0;
	let alcoholSubtotal = 0;
	for (const item of inputs.items) {
		const amt = Number.isFinite(item.amount) ? Math.max(item.amount, 0) : 0;
		if (item.isAlcohol) alcoholSubtotal = round2(alcoholSubtotal + amt);
		else foodSubtotal = round2(foodSubtotal + amt);
	}

	const subtotal = round2(foodSubtotal + alcoholSubtotal);
	const taxAmount = round2(round2(foodSubtotal * taxRate / 100) + round2(alcoholSubtotal * alcoholTaxRate / 100));
	const tipBaseAmount = inputs.tipBase === 'pretax' ? subtotal : round2(subtotal + taxAmount);
	const tipAmount = round2(tipBaseAmount * percent / 100);
	const total = round2(subtotal + taxAmount + tipAmount);

	return { foodSubtotal, alcoholSubtotal, subtotal, taxAmount, tipBaseAmount, tipAmount, total };
}

export function calculateTip(inputs: TipInputs): TipResult {
	const bill = Number.isFinite(inputs.billAmount) ? Math.max(inputs.billAmount, 0) : 0;
	const percent = Number.isFinite(inputs.tipPercent) ? Math.max(inputs.tipPercent, 0) : 0;
	const party = Number.isFinite(inputs.partySize) ? Math.max(Math.floor(inputs.partySize), 1) : 1;

	const tipAmount = round2(bill * (percent / 100));
	const total = round2(bill + tipAmount);
	const perPerson = party > 1 ? round2(total / party) : null;
	const tipPerPerson = party > 1 ? round2(tipAmount / party) : null;

	return { tipAmount, total, perPerson, tipPerPerson };
}

