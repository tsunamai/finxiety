// DEDUCT-1 calculator tests. Run with: node --test (Node 22+ strips TS types
// natively; no test framework is installed in this project). These exercise the
// marginal-rate lookup across band boundaries, all three modes, the deduction
// income cap, the refund simple-interest math, and negative / edge cases.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	calcDeduction,
	calcCredit,
	calcRefund,
	marginalRate,
	isFilingStatus,
	formatPercent,
	type BracketData
} from './deduct.ts';

// --- Fixture: a small but real-shaped bracket schedule -----------------------
// Mirrors the structure of federal-brackets-2026.json. Single schedule uses the
// real 2026 thresholds so the boundary tests double as a data sanity check.

const data: BracketData = {
	last_updated: '2026-06-19',
	verify_at: 'https://example.test/irs',
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
		married_filing_separately: [
			{ rate: 0.1, min: 0, max: 12400 },
			{ rate: 0.12, min: 12400, max: 50400 },
			{ rate: 0.22, min: 50400, max: 105700 },
			{ rate: 0.24, min: 105700, max: 201775 },
			{ rate: 0.32, min: 201775, max: 256225 },
			{ rate: 0.35, min: 256225, max: 384350 },
			{ rate: 0.37, min: 384350, max: null }
		],
		head_of_household: [
			{ rate: 0.1, min: 0, max: 17700 },
			{ rate: 0.12, min: 17700, max: 67450 },
			{ rate: 0.22, min: 67450, max: 105700 },
			{ rate: 0.24, min: 105700, max: 201775 },
			{ rate: 0.32, min: 201775, max: 256200 },
			{ rate: 0.35, min: 256200, max: 640600 },
			{ rate: 0.37, min: 640600, max: null }
		]
	}
};

// --- marginalRate ------------------------------------------------------------

test('marginalRate: income inside the 22% band returns 0.22', () => {
	assert.equal(marginalRate(60000, data.brackets.single), 0.22);
});

test('marginalRate: zero income falls in the lowest band', () => {
	assert.equal(marginalRate(0, data.brackets.single), 0.1);
});

test('marginalRate: exactly at a band floor stays in the lower band', () => {
	// 50400 is the floor of the 22% band; the top dollar at exactly 50400 is
	// still the last dollar of the 12% band (band is min-exclusive on the floor).
	assert.equal(marginalRate(50400, data.brackets.single), 0.12);
	// One dollar over crosses into 22%.
	assert.equal(marginalRate(50401, data.brackets.single), 0.22);
});

test('marginalRate: very high income lands in the top 37% band', () => {
	assert.equal(marginalRate(1_000_000, data.brackets.single), 0.37);
});

test('marginalRate: negative income is clamped to the lowest band', () => {
	assert.equal(marginalRate(-5000, data.brackets.single), 0.1);
});

// --- calcDeduction (Mode A) --------------------------------------------------

test('calcDeduction: saves deduction * marginal rate, with credit comparison', () => {
	const r = calcDeduction(2000, 45000, 'single', data);
	assert.equal(r.marginalRate, 0.12); // 45000 is in the 12% band
	assert.equal(r.taxSavings, 240); // 2000 * 0.12
	assert.equal(r.asCreditValue, 2000); // a credit of the same size
	assert.equal(r.difference, 1760); // 2000 - 240
});

test('calcDeduction: a 22% bracket deduction', () => {
	const r = calcDeduction(1000, 60000, 'single', data);
	assert.equal(r.marginalRate, 0.22);
	assert.equal(r.taxSavings, 220);
	assert.equal(r.difference, 780);
});

test('calcDeduction: deduction is capped at taxable income', () => {
	// A 5000 deduction against only 3000 of income can offset at most 3000.
	const r = calcDeduction(5000, 3000, 'single', data);
	assert.equal(r.marginalRate, 0.1);
	assert.equal(r.taxSavings, 300); // 3000 * 0.10, not 5000 * 0.10
	// The credit-equivalent still reflects the full stated amount.
	assert.equal(r.asCreditValue, 5000);
});

test('calcDeduction: negative inputs are floored to zero', () => {
	const r = calcDeduction(-100, -100, 'single', data);
	assert.equal(r.deductionAmount, 0);
	assert.equal(r.taxableIncome, 0);
	assert.equal(r.taxSavings, 0);
	assert.equal(r.difference, 0);
});

// --- calcCredit (Mode B) -----------------------------------------------------

test('calcCredit: dollar-for-dollar reduction equals the credit amount', () => {
	const r = calcCredit(1000, data);
	assert.equal(r.reduction, 1000);
	assert.equal(r.topRate, 0.37);
	assert.equal(r.deductionAtTopRate, 370); // 1000 * 0.37
});

test('calcCredit: negative input floored to zero', () => {
	const r = calcCredit(-50, data);
	assert.equal(r.creditAmount, 0);
	assert.equal(r.reduction, 0);
	assert.equal(r.deductionAtTopRate, 0);
});

// --- calcRefund (Mode C) -----------------------------------------------------

test('calcRefund: monthly equivalent is refund / 12', () => {
	const r = calcRefund(3000);
	assert.equal(r.monthlyEquivalent, 250);
	assert.equal(r.hysaRate, 0.045);
});

test('calcRefund: illustrative simple-interest earnings', () => {
	// monthly=250, rate=0.045, multiplier 5.5 => 250 * 0.045 * 5.5 = 61.875
	const r = calcRefund(3000);
	assert.ok(Math.abs(r.illustrativeEarnings - 61.875) < 1e-9);
});

test('calcRefund: custom rate is honored', () => {
	const r = calcRefund(1200, 0.05);
	assert.equal(r.monthlyEquivalent, 100);
	// 100 * 0.05 * 5.5 = 27.5
	assert.ok(Math.abs(r.illustrativeEarnings - 27.5) < 1e-9);
});

test('calcRefund: negative refund floored to zero', () => {
	const r = calcRefund(-500);
	assert.equal(r.refundAmount, 0);
	assert.equal(r.monthlyEquivalent, 0);
	assert.equal(r.illustrativeEarnings, 0);
});

// --- helpers -----------------------------------------------------------------

test('isFilingStatus: accepts valid, rejects invalid', () => {
	assert.equal(isFilingStatus('single'), true);
	assert.equal(isFilingStatus('head_of_household'), true);
	assert.equal(isFilingStatus('married'), false);
	assert.equal(isFilingStatus(''), false);
});

test('formatPercent: whole-percent rendering', () => {
	assert.equal(formatPercent(0.22), '22%');
	assert.equal(formatPercent(0.1), '10%');
	assert.equal(formatPercent(0.37), '37%');
});
