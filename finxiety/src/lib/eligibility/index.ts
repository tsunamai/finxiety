// Pure TypeScript eligibility engine. No Svelte, no side effects.
// Exported per-program functions are reusable by CLIFF-1.
import {
	getFPL,
	CALFRESH,
	MEDI_CAL,
	WIC,
	LIFELINE,
	HEAP,
	SCHOOL_MEALS,
	CALEITC
} from '../data/snap-eligibility';

export type EligibilityStatus = 'likely' | 'unlikely' | 'not_applicable';

export interface ProgramResult {
	id: string;
	name: string;
	description: string;
	status: EligibilityStatus;
	incomeVsLimit: string;
	estimatedBenefit: string | null;
	applicationUrl: string;
	applicationLabel: string;
	nearLimit: boolean;
}

export interface ScreenerInputs {
	householdSize: number;
	grossMonthlyIncome: number;
	state: string;
	hasChildUnder5OrPregnant: boolean;
	hasSchoolAgeChild: boolean;
}

function getLimit(limits: Record<number, number>, additional: number, size: number): number {
	const n = Math.max(1, Math.floor(size));
	if (n <= 8) return limits[n];
	return limits[8] + (n - 8) * additional;
}

function isNearLimit(income: number, limit: number): boolean {
	return income > limit && income <= limit * 1.15;
}

function fmt(n: number): string {
	return '$' + n.toLocaleString('en-US');
}

export function checkCalFresh(inputs: ScreenerInputs): ProgramResult {
	const { householdSize: size, grossMonthlyIncome: income } = inputs;
	const limit = getLimit(CALFRESH.grossMonthlyLimits, CALFRESH.grossMonthlyAdditional, size);
	const maxBenefit = getLimit(
		CALFRESH.maxMonthlyBenefits,
		CALFRESH.maxMonthlyAdditional,
		size
	);
	const status: EligibilityStatus = income <= limit ? 'likely' : 'unlikely';
	return {
		id: 'calfresh',
		name: CALFRESH.name,
		description: CALFRESH.description,
		status,
		incomeVsLimit: `${fmt(income)} vs. ${fmt(limit)} limit`,
		estimatedBenefit: status === 'likely' ? `up to ${fmt(maxBenefit)}/month` : null,
		applicationUrl: CALFRESH.applicationUrl,
		applicationLabel: CALFRESH.applicationLabel,
		nearLimit: isNearLimit(income, limit)
	};
}

export function checkMediCal(inputs: ScreenerInputs): ProgramResult {
	const { householdSize: size, grossMonthlyIncome: income, hasChildUnder5OrPregnant } = inputs;
	const adultLimit = getLimit(
		MEDI_CAL.grossMonthlyLimits,
		MEDI_CAL.grossMonthlyAdditional,
		size
	);
	const childLimit = Math.round(getFPL(size) * MEDI_CAL.childFPLPct);

	let status: EligibilityStatus;
	let description = MEDI_CAL.description;

	if (income <= adultLimit) {
		status = 'likely';
	} else if (hasChildUnder5OrPregnant && income <= childLimit) {
		status = 'likely';
		description =
			'Based on the child or pregnancy in your household. Children and pregnant individuals have higher income limits. Not all adults in the household may qualify at this income level.';
	} else {
		status = 'unlikely';
	}

	return {
		id: 'medi_cal',
		name: MEDI_CAL.name,
		description,
		status,
		incomeVsLimit: `${fmt(income)} vs. ${fmt(adultLimit)} adult limit`,
		estimatedBenefit: null,
		applicationUrl: MEDI_CAL.applicationUrl,
		applicationLabel: MEDI_CAL.applicationLabel,
		nearLimit: status === 'unlikely' && isNearLimit(income, adultLimit)
	};
}

export function checkWIC(inputs: ScreenerInputs): ProgramResult {
	const { householdSize: size, grossMonthlyIncome: income, hasChildUnder5OrPregnant } = inputs;

	if (!hasChildUnder5OrPregnant) {
		return {
			id: 'wic',
			name: WIC.name,
			description: WIC.description,
			status: 'not_applicable',
			incomeVsLimit: '',
			estimatedBenefit: null,
			applicationUrl: WIC.applicationUrl,
			applicationLabel: WIC.applicationLabel,
			nearLimit: false
		};
	}

	const limit = getLimit(WIC.grossMonthlyLimits, WIC.grossMonthlyAdditional, size);
	const status: EligibilityStatus = income <= limit ? 'likely' : 'unlikely';
	return {
		id: 'wic',
		name: WIC.name,
		description: WIC.description,
		status,
		incomeVsLimit: `${fmt(income)} vs. ${fmt(limit)} limit`,
		estimatedBenefit: null,
		applicationUrl: WIC.applicationUrl,
		applicationLabel: WIC.applicationLabel,
		nearLimit: isNearLimit(income, limit)
	};
}

export function checkLifeline(inputs: ScreenerInputs): ProgramResult {
	const { householdSize: size, grossMonthlyIncome: income } = inputs;
	const limit = getLimit(LIFELINE.grossMonthlyLimits, LIFELINE.grossMonthlyAdditional, size);
	// Program-based: eligible when income qualifies for CalFresh or Medi-Cal
	const calFreshLimit = getLimit(
		CALFRESH.grossMonthlyLimits,
		CALFRESH.grossMonthlyAdditional,
		size
	);
	const mediCalLimit = getLimit(
		MEDI_CAL.grossMonthlyLimits,
		MEDI_CAL.grossMonthlyAdditional,
		size
	);
	const programBased = income <= calFreshLimit || income <= mediCalLimit;
	const status: EligibilityStatus = income <= limit || programBased ? 'likely' : 'unlikely';
	return {
		id: 'lifeline',
		name: LIFELINE.name,
		description: LIFELINE.description,
		status,
		incomeVsLimit: `${fmt(income)} vs. ${fmt(limit)} limit`,
		estimatedBenefit: status === 'likely' ? 'up to $9.25/month off your phone or internet bill' : null,
		applicationUrl: LIFELINE.applicationUrl,
		applicationLabel: LIFELINE.applicationLabel,
		nearLimit: status === 'unlikely' && isNearLimit(income, limit)
	};
}

export function checkHEAP(inputs: ScreenerInputs): ProgramResult {
	const { householdSize: size, grossMonthlyIncome: income } = inputs;
	const limit = getLimit(HEAP.grossMonthlyLimits, HEAP.grossMonthlyAdditional, size);
	const status: EligibilityStatus = income <= limit ? 'likely' : 'unlikely';
	return {
		id: 'heap',
		name: HEAP.name,
		description: HEAP.description,
		status,
		incomeVsLimit: `${fmt(income)} vs. ~${fmt(limit)} limit`,
		estimatedBenefit: null,
		applicationUrl: HEAP.applicationUrl,
		applicationLabel: HEAP.applicationLabel,
		nearLimit: isNearLimit(income, limit)
	};
}

export function checkSchoolMeals(inputs: ScreenerInputs): ProgramResult {
	const { householdSize: size, grossMonthlyIncome: income, hasSchoolAgeChild } = inputs;

	if (!hasSchoolAgeChild) {
		return {
			id: 'school_meals',
			name: SCHOOL_MEALS.name,
			description: SCHOOL_MEALS.description,
			status: 'not_applicable',
			incomeVsLimit: '',
			estimatedBenefit: null,
			applicationUrl: SCHOOL_MEALS.applicationUrl,
			applicationLabel: SCHOOL_MEALS.applicationLabel,
			nearLimit: false
		};
	}

	const freeLimit = getLimit(
		SCHOOL_MEALS.freeMonthlyLimits,
		SCHOOL_MEALS.freeMonthlyAdditional,
		size
	);
	const reducedLimit = getLimit(
		SCHOOL_MEALS.reducedMonthlyLimits,
		SCHOOL_MEALS.reducedMonthlyAdditional,
		size
	);

	let status: EligibilityStatus;
	let estimatedBenefit: string | null;

	if (income <= freeLimit) {
		status = 'likely';
		estimatedBenefit = 'Free breakfast and lunch at school (estimated)';
	} else if (income <= reducedLimit) {
		status = 'likely';
		estimatedBenefit = 'Reduced-price meals (up to $0.30 breakfast, $0.40 lunch, estimated)';
	} else {
		status = 'unlikely';
		estimatedBenefit = null;
	}

	return {
		id: 'school_meals',
		name: SCHOOL_MEALS.name,
		description: SCHOOL_MEALS.description,
		status,
		incomeVsLimit: `${fmt(income)} vs. ${fmt(freeLimit)} for free meals`,
		estimatedBenefit,
		applicationUrl: SCHOOL_MEALS.applicationUrl,
		applicationLabel: SCHOOL_MEALS.applicationLabel,
		nearLimit: status === 'unlikely' && isNearLimit(income, reducedLimit)
	};
}

export function checkCalEITC(inputs: ScreenerInputs): ProgramResult {
	const { grossMonthlyIncome: income, hasChildUnder5OrPregnant, hasSchoolAgeChild } = inputs;

	if (income <= 0) {
		return {
			id: 'caleitc',
			name: CALEITC.name,
			description:
				'CalEITC requires earned income. With $0 income reported, this credit would not apply.',
			status: 'not_applicable',
			incomeVsLimit: '',
			estimatedBenefit: null,
			applicationUrl: CALEITC.applicationUrl,
			applicationLabel: CALEITC.applicationLabel,
			nearLimit: false
		};
	}

	// Estimate qualifying children from categorical flags
	const qualifyingChildren = Math.min(
		3,
		(hasChildUnder5OrPregnant ? 1 : 0) + (hasSchoolAgeChild ? 1 : 0)
	);
	const annualIncome = income * 12;
	const annualLimit = CALEITC.earnedIncomeLimitsAnnual[qualifyingChildren];
	const maxCredit = CALEITC.maxCreditAnnual[qualifyingChildren];
	const status: EligibilityStatus = annualIncome <= annualLimit ? 'likely' : 'unlikely';

	return {
		id: 'caleitc',
		name: CALEITC.name,
		description: CALEITC.description,
		status,
		incomeVsLimit: `${fmt(annualIncome)}/year vs. ${fmt(annualLimit)}/year limit`,
		estimatedBenefit: status === 'likely' ? `up to ${fmt(maxCredit)} at tax time (estimated)` : null,
		applicationUrl: CALEITC.applicationUrl,
		applicationLabel: CALEITC.applicationLabel,
		nearLimit: status === 'unlikely' && isNearLimit(annualIncome, annualLimit)
	};
}

export function checkAllPrograms(inputs: ScreenerInputs): ProgramResult[] {
	return [
		checkCalFresh(inputs),
		checkMediCal(inputs),
		checkWIC(inputs),
		checkLifeline(inputs),
		checkHEAP(inputs),
		checkSchoolMeals(inputs),
		checkCalEITC(inputs)
	];
}
