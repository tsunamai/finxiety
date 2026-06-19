// HOURS-1 calculator tests. Run with: node --test (Node 18+ has node:test built
// in; no framework is installed in this project). These exercise the bracket
// math, federal/state annualization, the FICA wage-base cap, clock formatting,
// the minutes-per-hour breakdown, and a zero-gross negative case.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	calculateHours,
	taxFromBrackets,
	annualFederalTax,
	annualStateTax,
	formatClockTime,
	periodsPerYear,
	SOCIAL_SECURITY_RATE,
	SOCIAL_SECURITY_WAGE_BASE_2026,
	MEDICARE_RATE,
	type Bracket,
	type FederalBracketData,
	type StateTaxData,
	type HoursInputs
} from './hours.ts';

// --- Fixtures ----------------------------------------------------------------

const federalFixture: FederalBracketData = {
	standard_deductions: {
		single: 16100,
		married_filing_jointly: 32200,
		married_filing_separately: 16100,
		head_of_household: 24150
	},
	brackets: {
		single: [
			{ rate: 0.1, min: 0, max: 12400 },
			{ rate: 0.12, min: 12400, max: 50400 },
			{ rate: 0.22, min: 50400, max: 105700 },
			{ rate: 0.24, min: 105700, max: 201775 },
			{ rate: 0.32, min: 201775, max: 256225 },
			{ rate: 0.35, min: 256225, max: 640600 },
			{ rate: 0.37, min: 640600, max: null }
		],
		married_filing_jointly: [
			{ rate: 0.1, min: 0, max: 24800 },
			{ rate: 0.12, min: 24800, max: 100800 },
			{ rate: 0.22, min: 100800, max: 211400 },
			{ rate: 0.24, min: 211400, max: 403550 },
			{ rate: 0.32, min: 403550, max: 512450 },
			{ rate: 0.35, min: 512450, max: 768700 },
			{ rate: 0.37, min: 768700, max: null }
		],
		married_filing_separately: [{ rate: 0.1, min: 0, max: 12400 }],
		head_of_household: [{ rate: 0.1, min: 0, max: 17700 }]
	}
};

const stateFixture: StateTaxData = {
	states: {
		CA: {
			type: 'brackets',
			brackets: [
				{ rate: 0.01, min: 0, max: 10756 },
				{ rate: 0.02, min: 10756, max: 25499 },
				{ rate: 0.04, min: 25499, max: 40245 },
				{ rate: 0.06, min: 40245, max: 55866 },
				{ rate: 0.08, min: 55866, max: 70612 },
				{ rate: 0.093, min: 70612, max: 360659 },
				{ rate: 0.103, min: 360659, max: 432787 },
				{ rate: 0.113, min: 432787, max: 721314 },
				{ rate: 0.123, min: 721314, max: null }
			],
			surcharge: { rate: 0.01, min: 1000000 }
		},
		TX: { type: 'none' },
		FL: { type: 'none' },
		AZ: { type: 'flat', rate: 0.025 }
	}
};

// --- taxFromBrackets ---------------------------------------------------------

test('taxFromBrackets: zero/negative income yields zero', () => {
	assert.equal(taxFromBrackets(0, federalFixture.brackets.single), 0);
	assert.equal(taxFromBrackets(-500, federalFixture.brackets.single), 0);
});

test('taxFromBrackets: income within first band taxes only at first rate', () => {
	// $10,000 single → all at 10%.
	assert.equal(taxFromBrackets(10000, federalFixture.brackets.single), 1000);
});

test('taxFromBrackets: spans two bands correctly', () => {
	// $20,000 single → 12400 @ 10% + 7600 @ 12% = 1240 + 912 = 2152.
	assert.equal(taxFromBrackets(20000, federalFixture.brackets.single), 2152);
});

test('taxFromBrackets: top open-ended band uses income as upper bound', () => {
	const simple: Bracket[] = [
		{ rate: 0.1, min: 0, max: 100 },
		{ rate: 0.2, min: 100, max: null }
	];
	// $300 → 100 @ 10% + 200 @ 20% = 10 + 40 = 50.
	assert.equal(taxFromBrackets(300, simple), 50);
});

// --- annualFederalTax --------------------------------------------------------

test('annualFederalTax: unknown filing status falls back to single', () => {
	const a = annualFederalTax(20000, 'single', federalFixture);
	// @ts-expect-error intentionally invalid status to exercise the fallback
	const b = annualFederalTax(20000, 'nonsense', federalFixture);
	assert.equal(a, b);
});

// --- annualStateTax ----------------------------------------------------------

test('annualStateTax: no-tax state returns zero', () => {
	assert.equal(annualStateTax(80000, 'TX', stateFixture), 0);
	assert.equal(annualStateTax(80000, 'FL', stateFixture), 0);
});

test('annualStateTax: unknown/other code returns zero (federal-only)', () => {
	assert.equal(annualStateTax(80000, 'other', stateFixture), 0);
	assert.equal(annualStateTax(80000, 'ZZ', stateFixture), 0);
});

test('annualStateTax: flat rate applies to whole taxable income', () => {
	// AZ flat 2.5% on $80,000 = $2,000.
	assert.equal(annualStateTax(80000, 'AZ', stateFixture), 2000);
});

test('annualStateTax: CA progressive brackets sum correctly', () => {
	// $30,000 CA: 10756 @1% + (25499-10756) @2% + (30000-25499) @4%
	// = 107.56 + 294.86 + 180.04 = 582.46
	const tax = annualStateTax(30000, 'CA', stateFixture);
	assert.ok(Math.abs(tax - 582.46) < 0.01, `expected ~582.46, got ${tax}`);
});

test('annualStateTax: CA mental-health surcharge adds 1% over $1M', () => {
	const base = annualStateTax(1000000, 'CA', stateFixture);
	const over = annualStateTax(1100000, 'CA', stateFixture);
	// The extra $100k is taxed at 12.3% bracket + 1% surcharge = 13.3% on that slice.
	const delta = over - base;
	assert.ok(Math.abs(delta - 100000 * 0.133) < 0.01, `expected ~13300, got ${delta}`);
});

// --- formatClockTime ---------------------------------------------------------

test('formatClockTime: zero minutes is the 9am start', () => {
	assert.equal(formatClockTime(0), '9:00 AM');
});

test('formatClockTime: afternoon conversion', () => {
	// 9:00am + 347 minutes = 2:47pm.
	assert.equal(formatClockTime(347), '2:47 PM');
});

test('formatClockTime: exact noon and rounding', () => {
	assert.equal(formatClockTime(180), '12:00 PM'); // 9am + 3h
	assert.equal(formatClockTime(29.6), '9:30 AM'); // rounds to 30
});

// --- periodsPerYear ----------------------------------------------------------

test('periodsPerYear: known frequencies', () => {
	assert.equal(periodsPerYear('weekly'), 52);
	assert.equal(periodsPerYear('biweekly'), 26);
	assert.equal(periodsPerYear('semimonthly'), 24);
	assert.equal(periodsPerYear('monthly'), 12);
});

// --- calculateHours: full path -----------------------------------------------

function baseInputs(overrides: Partial<HoursInputs> = {}): HoursInputs {
	return {
		grossPayPerPeriod: 2000,
		payFrequency: 'biweekly',
		hoursWorkedPerPeriod: 80,
		preTaxDeductions: 0,
		filingStatus: 'single',
		state: 'CA',
		stateTaxData: stateFixture,
		federalBracketData: federalFixture,
		...overrides
	};
}

test('calculateHours: FICA matches gross-based rates', () => {
	const r = calculateHours(baseInputs());
	// SS: 2000 @ 6.2% = 124 (annual gross 52k is under the wage base).
	assert.equal(r.socialSecurity, round2(2000 * SOCIAL_SECURITY_RATE));
	assert.equal(r.medicare, round2(2000 * MEDICARE_RATE));
	// Employer match equals the employee SS + Medicare.
	assert.equal(r.employerFica, round2(r.socialSecurity + r.medicare));
});

test('calculateHours: Social Security caps at the annual wage base', () => {
	// Monthly gross of $20,000 → annual $240,000, above the $176,100 base.
	const r = calculateHours(baseInputs({ grossPayPerPeriod: 20000, payFrequency: 'monthly', hoursWorkedPerPeriod: 173 }));
	const expectedAnnualSs = SOCIAL_SECURITY_WAGE_BASE_2026 * SOCIAL_SECURITY_RATE;
	const expectedPerPeriod = round2(expectedAnnualSs / 12);
	assert.equal(r.socialSecurity, expectedPerPeriod);
	// And it is strictly less than 6.2% of the uncapped gross.
	assert.ok(r.socialSecurity < 20000 * SOCIAL_SECURITY_RATE);
});

test('calculateHours: net = gross minus all deductions', () => {
	const r = calculateHours(baseInputs({ preTaxDeductions: 150 }));
	const recombined = round2(
		r.preTaxDeductions + r.federalIncomeTax + r.socialSecurity + r.medicare + r.stateIncomeTax + r.netPay
	);
	assert.equal(recombined, r.grossPay);
});

test('calculateHours: pre-tax deductions lower federal taxable income', () => {
	const without = calculateHours(baseInputs({ preTaxDeductions: 0 }));
	const withPreTax = calculateHours(baseInputs({ preTaxDeductions: 200 }));
	assert.ok(withPreTax.federalIncomeTax < without.federalIncomeTax);
});

test('calculateHours: minute breakdown sums to ~60 per hour', () => {
	const r = calculateHours(baseInputs({ preTaxDeductions: 100 }));
	const sum =
		r.minutesPerHourForFederal +
		r.minutesPerHourForFICA +
		r.minutesPerHourForState +
		r.minutesPerHourForPreTax +
		r.minutesPerHourForNet;
	assert.ok(Math.abs(sum - 60) < 0.1, `expected ~60, got ${sum}`);
});

test('calculateHours: no-tax state has zero state line', () => {
	const r = calculateHours(baseInputs({ state: 'TX' }));
	assert.equal(r.stateIncomeTax, 0);
	assert.equal(r.minutesPerHourForState, 0);
});

test('calculateHours: "until yours" time is after 9am and before end of day', () => {
	const r = calculateHours(baseInputs());
	assert.ok(r.minutesUntilYoursPerDay > 0);
	assert.ok(r.minutesUntilYoursPerDay < 480);
	assert.match(r.timeUntilYoursFormatted, /(AM|PM)$/);
});

// --- Negative case: zero gross -----------------------------------------------

test('calculateHours: zero gross produces all-zero, no NaN', () => {
	const r = calculateHours(baseInputs({ grossPayPerPeriod: 0 }));
	assert.equal(r.grossPay, 0);
	assert.equal(r.federalIncomeTax, 0);
	assert.equal(r.socialSecurity, 0);
	assert.equal(r.medicare, 0);
	assert.equal(r.stateIncomeTax, 0);
	assert.equal(r.netPay, 0);
	assert.equal(r.minutesPerHourForNet, 0);
	assert.equal(r.minutesUntilYoursPerDay, 0);
	assert.equal(r.daysWorkedForTaxesPerYear, 0);
	assert.equal(r.timeUntilYoursFormatted, '9:00 AM');
	for (const v of Object.values(r)) {
		if (typeof v === 'number') assert.ok(Number.isFinite(v), 'no NaN/Infinity');
	}
});

// Local rounding helper mirroring the module's round2 for assertions.
function round2(value: number): number {
	return Math.round(value * 100) / 100;
}
