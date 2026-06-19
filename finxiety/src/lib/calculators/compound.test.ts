// COMPOUND-1 calculator tests. Run with: node --test (Node 18+ has node:test
// built in; no framework is installed in this project). These exercise the
// year-only output shape, the principal-only and contribution-only branches,
// the year-0 starting state, the contributed/interest split, and negative cases.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { computeGrowth, type GrowthPoint } from './compound.ts';

// Tolerance for floating-point dollar math.
function approx(actual: number, expected: number, tol = 0.01): void {
	assert.ok(
		Math.abs(actual - expected) <= tol,
		`expected ${actual} to be within ${tol} of ${expected}`
	);
}

// --- Output shape: one point per year, plus year 0 ---------------------------

test('returns one entry per year plus the year-0 starting state', () => {
	const points = computeGrowth(1000, 100, 7, 30);
	assert.equal(points.length, 31); // year 0 through year 30
	assert.equal(points[0].year, 0);
	assert.equal(points[30].year, 30);
	// Years are sequential.
	points.forEach((p, i) => assert.equal(p.year, i));
});

test('respects the chosen horizon (10 years -> 11 points)', () => {
	const points = computeGrowth(0, 50, 5, 10);
	assert.equal(points.length, 11);
	assert.equal(points[10].year, 10);
});

// --- Year 0 is the untouched starting state ----------------------------------

test('year 0 is principal only, zero contributed-beyond-principal, zero interest', () => {
	const points = computeGrowth(5000, 200, 7, 20);
	const y0 = points[0];
	assert.equal(y0.totalValue, 5000);
	assert.equal(y0.totalContributed, 5000);
	assert.equal(y0.totalInterest, 0);
});

// --- Principal-only branch (no monthly addition) -----------------------------

test('principal only, no contributions: matches monthly-compounded lump sum', () => {
	// $10,000 at 12%/yr compounded monthly for 1 year = 10000 * (1.01)^12.
	const points = computeGrowth(10000, 0, 12, 1);
	const expected = 10000 * Math.pow(1.01, 12);
	approx(points[1].totalValue, expected);
	// Contributed stays at the principal; the rest is interest.
	assert.equal(points[1].totalContributed, 10000);
	approx(points[1].totalInterest, expected - 10000);
});

// --- Contribution-only branch (zero principal) -------------------------------

test('zero principal, monthly contributions only: contributed tracks deposits', () => {
	const points = computeGrowth(0, 100, 6, 5);
	const final = points[5];
	// 5 years * 12 months * $100 deposited.
	assert.equal(final.totalContributed, 100 * 60);
	// Value exceeds contributions because of interest.
	assert.ok(final.totalValue > final.totalContributed);
	approx(final.totalInterest, final.totalValue - final.totalContributed);
});

// --- Zero-rate branch: no interest, value equals contributions ---------------

test('zero rate: value equals total contributed, interest is zero', () => {
	const points = computeGrowth(1000, 100, 0, 10);
	const final = points[10];
	assert.equal(final.totalValue, 1000 + 100 * 120);
	assert.equal(final.totalContributed, 1000 + 100 * 120);
	assert.equal(final.totalInterest, 0);
});

// --- totalContributed formula holds at every year ----------------------------

test('totalContributed = principal + monthly * (year * 12) at each point', () => {
	const principal = 2500;
	const monthly = 75;
	const points = computeGrowth(principal, monthly, 7, 20);
	points.forEach((p) => {
		assert.equal(p.totalContributed, principal + monthly * (p.year * 12));
	});
});

// --- Negative / junk input cases collapse to safe behavior -------------------

test('negative principal and rate clamp to zero', () => {
	const points = computeGrowth(-5000, 100, -3, 5);
	// Negative principal -> 0 start; negative rate -> 0 growth.
	// So value equals pure contributions with no interest.
	assert.equal(points[5].totalValue, 100 * 60);
	assert.equal(points[5].totalInterest, 0);
});

test('zero or negative years yields only the year-0 point', () => {
	const zero = computeGrowth(1000, 100, 7, 0);
	assert.equal(zero.length, 1);
	assert.equal(zero[0].year, 0);

	const negative = computeGrowth(1000, 100, 7, -5);
	assert.equal(negative.length, 1);
	assert.equal(negative[0].year, 0);
});

test('NaN inputs do not produce NaN or Infinity in the output', () => {
	const points = computeGrowth(NaN, NaN, NaN, 10);
	points.forEach((p: GrowthPoint) => {
		assert.ok(Number.isFinite(p.totalValue));
		assert.ok(Number.isFinite(p.totalContributed));
		assert.ok(Number.isFinite(p.totalInterest));
	});
	// All zero inputs -> a flat line at $0.
	assert.equal(points[10].totalValue, 0);
});
