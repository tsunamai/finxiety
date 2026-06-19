// DEBT-VIZ-1 calculator tests. Run with: node --test (Node 18+ has node:test
// built in; no framework is installed in this project). These exercise the
// compound math in both directions, the payment-floor branch, the untouched-debt
// branch, the horizon shape, and a negative/garbage-input case.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeDebtGrowth, type DebtGrowthPoint } from './debt-growth.ts';

// Helper: round to cents so floating-point noise doesn't break equality checks.
function cents(n: number): number {
	return Math.round(n * 100) / 100;
}

test('returns one point per month from 0 through years*12', () => {
	const pts = computeDebtGrowth(5000, 24, 0, 5000, 7, 10);
	assert.equal(pts.length, 10 * 12 + 1);
	assert.equal(pts[0].month, 0);
	assert.equal(pts[pts.length - 1].month, 120);
});

test('month 0 is the untouched starting snapshot', () => {
	const pts = computeDebtGrowth(5000, 24, 200, 5000, 7, 5);
	assert.equal(pts[0].debtBalance, 5000);
	assert.equal(pts[0].investmentBalance, 5000);
});

test('investment compounds upward at the monthly rate', () => {
	// One month of 12% annual = 1% monthly. 1000 -> 1010.
	const pts = computeDebtGrowth(0, 0, 0, 1000, 12, 1);
	assert.equal(cents(pts[1].investmentBalance), 1010);
});

test('untouched debt (payment 0) compounds upward like the investment', () => {
	// 24% APR = 2% monthly. 1000 -> 1020 after one month, no payment subtracted.
	const pts = computeDebtGrowth(1000, 24, 0, 0, 0, 1);
	assert.equal(cents(pts[1].debtBalance), 1020);
});

test('a payment reduces the debt after interest accrues', () => {
	// 1000 at 2% monthly = 1020, minus a 100 payment = 920.
	const pts = computeDebtGrowth(1000, 24, 100, 0, 0, 1);
	assert.equal(cents(pts[1].debtBalance), 920);
});

test('debt floors at 0 and never goes negative', () => {
	// A payment far larger than the balance pays it off; the curve sits at 0,
	// it does not invert into negative territory.
	const pts = computeDebtGrowth(100, 24, 10000, 0, 0, 2);
	assert.equal(pts[1].debtBalance, 0);
	assert.equal(pts[2].debtBalance, 0);
});

test('garbage / negative inputs collapse to safe zeros', () => {
	const pts = computeDebtGrowth(NaN, -5, -100, Number.POSITIVE_INFINITY, NaN, 3);
	// 3 years still produces a full month series.
	assert.equal(pts.length, 3 * 12 + 1);
	for (const p of pts) {
		assert.ok(Number.isFinite(p.debtBalance));
		assert.ok(Number.isFinite(p.investmentBalance));
		assert.equal(p.debtBalance, 0);
		assert.equal(p.investmentBalance, 0);
	}
});

test('non-positive horizon yields only the starting snapshot', () => {
	const pts: DebtGrowthPoint[] = computeDebtGrowth(5000, 24, 0, 5000, 7, 0);
	assert.equal(pts.length, 1);
	assert.equal(pts[0].month, 0);
});
