// Pure calculation logic for CLIFF-1 — Benefits Cliff Calculator.
// Shows how CalFresh, Medi-Cal, and Lifeline eligibility and dollar values
// change across income levels. CA-only in v1. No Svelte, no side effects.
import { CALFRESH, MEDI_CAL, LIFELINE, getFPL } from '$lib/data/snap-eligibility';

export interface CliffInputs {
	householdSize: number;
	hasChildUnder5OrPregnant: boolean;
}

export interface IncomeSnapshot {
	grossMonthly: number;
	calFreshBenefit: number;
	calFreshEligible: boolean;
	mediCalEligible: boolean;
	lifelineEligible: boolean;
	// income + CalFresh + Lifeline (Medi-Cal excluded: valuation is too variable)
	calculableResources: number;
}

export interface CliffResult {
	current: IncomeSnapshot;
	proposed: IncomeSnapshot;
	incomeDelta: number;
	calFreshDelta: number;
	lifelineDelta: number;
	netDelta: number;
	losingMediCal: boolean;
	gainingMediCal: boolean;
}

function getLim(limits: Record<number, number>, additional: number, size: number): number {
	const n = Math.max(1, Math.floor(size));
	return n <= 8 ? limits[n] : limits[8] + (n - 8) * additional;
}

function getMaxBenefit(size: number): number {
	const n = Math.max(1, Math.floor(size));
	return n <= 8
		? CALFRESH.maxMonthlyBenefits[n]
		: CALFRESH.maxMonthlyBenefits[8] + (n - 8) * CALFRESH.maxMonthlyAdditional;
}

// Federal SNAP benefit formula (simplified):
// net income = gross * 0.80 (20% earned income deduction only)
// benefit = max(0, maxBenefit - 30% of net income)
// Actual benefit depends on shelter and other deductions — labeled as estimated.
export function estimateCalFreshBenefit(grossMonthly: number, size: number): number {
	const limit = getLim(CALFRESH.grossMonthlyLimits, CALFRESH.grossMonthlyAdditional, size);
	if (grossMonthly > limit) return 0;
	const net = grossMonthly * 0.8;
	return Math.max(0, Math.round(getMaxBenefit(size) - 0.3 * net));
}

function isMediCalEligible(gross: number, size: number, hasYoungChild: boolean): boolean {
	const adultLim = getLim(MEDI_CAL.grossMonthlyLimits, MEDI_CAL.grossMonthlyAdditional, size);
	if (gross <= adultLim) return true;
	if (hasYoungChild) {
		const childLim = Math.round(getFPL(size) * MEDI_CAL.childFPLPct);
		if (gross <= childLim) return true;
	}
	return false;
}

function isLifelineEligible(gross: number, size: number): boolean {
	const llLim = getLim(LIFELINE.grossMonthlyLimits, LIFELINE.grossMonthlyAdditional, size);
	const cfLim = getLim(CALFRESH.grossMonthlyLimits, CALFRESH.grossMonthlyAdditional, size);
	const mcLim = getLim(MEDI_CAL.grossMonthlyLimits, MEDI_CAL.grossMonthlyAdditional, size);
	return gross <= llLim || gross <= cfLim || gross <= mcLim;
}

export function snapshotAt(gross: number, inputs: CliffInputs): IncomeSnapshot {
	const calFreshBenefit = estimateCalFreshBenefit(gross, inputs.householdSize);
	const lifelineVal = isLifelineEligible(gross, inputs.householdSize) ? 9.25 : 0;
	return {
		grossMonthly: gross,
		calFreshBenefit,
		calFreshEligible: calFreshBenefit > 0,
		mediCalEligible: isMediCalEligible(gross, inputs.householdSize, inputs.hasChildUnder5OrPregnant),
		lifelineEligible: lifelineVal > 0,
		calculableResources: gross + calFreshBenefit + lifelineVal
	};
}

export function computeCliff(
	currentGross: number,
	proposedGross: number,
	inputs: CliffInputs
): CliffResult {
	const current = snapshotAt(currentGross, inputs);
	const proposed = snapshotAt(proposedGross, inputs);
	const lifelineCurrent = current.lifelineEligible ? 9.25 : 0;
	const lifelineProposed = proposed.lifelineEligible ? 9.25 : 0;
	const incomeDelta = proposedGross - currentGross;
	const calFreshDelta = proposed.calFreshBenefit - current.calFreshBenefit;
	const lifelineDelta = lifelineProposed - lifelineCurrent;
	return {
		current,
		proposed,
		incomeDelta,
		calFreshDelta,
		lifelineDelta,
		netDelta: incomeDelta + calFreshDelta + lifelineDelta,
		losingMediCal: current.mediCalEligible && !proposed.mediCalEligible,
		gainingMediCal: !current.mediCalEligible && proposed.mediCalEligible
	};
}

// One point every $50 of income, for chart rendering.
export function cliffChartPoints(inputs: CliffInputs, maxIncome: number): IncomeSnapshot[] {
	const points: IncomeSnapshot[] = [];
	for (let i = 0; i <= maxIncome; i += 50) {
		points.push(snapshotAt(i, inputs));
	}
	return points;
}
