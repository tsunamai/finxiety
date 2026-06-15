// BEN-1: Benefits eligibility threshold data — California
//
// Data freshness: all thresholds update annually each October (federal fiscal year).
// Release agent must re-verify every figure before ship and each October.
// Sources: HHS ASPE (FPL), USDA FNS (SNAP/WIC/school meals), CA CDSS (CalFresh/HEAP),
//          CA DHCS (Medi-Cal), FCC (Lifeline), CA FTB (CalEITC)
export const LAST_UPDATED = '2025-10-01';

// 2025 FPL monthly gross income — 48 contiguous states + DC
// Source: https://aspe.hhs.gov/topics/poverty-economic-mobility/poverty-guidelines
const FPL_MONTHLY: Record<number, number> = {
	1: 1255,
	2: 1703,
	3: 2152,
	4: 2600,
	5: 3048,
	6: 3497,
	7: 3945,
	8: 4393
};
const FPL_ADDITIONAL = 448;

export function getFPL(householdSize: number): number {
	const n = Math.max(1, Math.floor(householdSize));
	if (n <= 8) return FPL_MONTHLY[n];
	return FPL_MONTHLY[8] + (n - 8) * FPL_ADDITIONAL;
}

// CalFresh (SNAP in California) — gross income limit: 130% FPL
// CA eliminated SNAP asset test via BBCE
// Source: https://www.fns.usda.gov/snap/recipient/eligibility
export const CALFRESH = {
	name: 'CalFresh (food assistance)',
	description: 'Monthly funds loaded to an EBT card to buy groceries.',
	// FY2025 gross monthly income limits (130% FPL) by household size
	grossMonthlyLimits: {
		1: 1632,
		2: 2215,
		3: 2798,
		4: 3380,
		5: 3963,
		6: 4546,
		7: 5129,
		8: 5711
	} as Record<number, number>,
	grossMonthlyAdditional: 583,
	// FY2025 maximum monthly benefits by household size
	maxMonthlyBenefits: {
		1: 292,
		2: 536,
		3: 768,
		4: 975,
		5: 1158,
		6: 1390,
		7: 1536,
		8: 1756
	} as Record<number, number>,
	maxMonthlyAdditional: 219,
	applicationUrl: 'https://benefitscal.com/',
	applicationLabel: 'Check eligibility on BenefitsCal'
} as const;

// Medi-Cal (Medicaid in California)
// Adult limit (19-64): 138% FPL. Children (0-18): 266% FPL. Pregnant: 213% FPL.
// Source: https://www.dhcs.ca.gov/services/medi-cal/Pages/DoYouQualifyForMedi-Cal.aspx
export const MEDI_CAL = {
	name: 'Medi-Cal (health coverage)',
	description: 'Free or low-cost health insurance through California.',
	// 138% FPL monthly limits for adults
	grossMonthlyLimits: {
		1: 1732,
		2: 2351,
		3: 2970,
		4: 3588,
		5: 4206,
		6: 4826,
		7: 5444,
		8: 6062
	} as Record<number, number>,
	grossMonthlyAdditional: 618,
	childFPLPct: 2.66,
	applicationUrl: 'https://benefitscal.com/',
	applicationLabel: 'Check eligibility on BenefitsCal'
} as const;

// WIC — 185% FPL + categorical requirement
// Categorical: pregnant, postpartum (up to 12 months breastfeeding or 6 months not), infants, children under 5
// Source: https://www.cdph.ca.gov/Programs/CFH/DWICSN/Pages/WICProgram.aspx
export const WIC = {
	name: 'WIC (nutrition for young families)',
	description:
		'Food packages, formula, and nutrition support for pregnant people, new parents, and children under 5.',
	// 185% FPL monthly limits
	grossMonthlyLimits: {
		1: 2322,
		2: 3151,
		3: 3981,
		4: 4810,
		5: 5639,
		6: 6469,
		7: 7298,
		8: 8128
	} as Record<number, number>,
	grossMonthlyAdditional: 829,
	applicationUrl: 'https://www.cdph.ca.gov/Programs/CFH/DWICSN/Pages/WICProgram.aspx',
	applicationLabel: 'Find a WIC office near you'
} as const;

// Lifeline — 135% FPL gross income OR program-based via CalFresh or Medi-Cal enrollment
// Source: https://www.fcc.gov/consumers/guides/lifeline-support-affordable-communications
export const LIFELINE = {
	name: 'Lifeline (phone or internet discount)',
	description: 'Up to $9.25/month off a phone or internet bill. Higher discounts on Tribal lands.',
	// 135% FPL monthly limits
	grossMonthlyLimits: {
		1: 1694,
		2: 2299,
		3: 2905,
		4: 3510,
		5: 4115,
		6: 4721,
		7: 5326,
		8: 5931
	} as Record<number, number>,
	grossMonthlyAdditional: 605,
	applicationUrl: 'https://www.lifelinesupport.org/',
	applicationLabel: 'Check Lifeline eligibility'
} as const;

// HEAP (CA LIHEAP) — 60% State Median Income, 2024-25 program year
// These are approximate; verify annually at https://www.csd.ca.gov/Pages/HEAP.aspx
export const HEAP = {
	name: 'HEAP (utility bill help)',
	description:
		'One-time or seasonal help with electric, gas, or propane bills. Enrollment typically opens in fall.',
	// Approximate 60% CA SMI monthly limits (2024-25 program year)
	grossMonthlyLimits: {
		1: 2800,
		2: 3700,
		3: 4600,
		4: 5200,
		5: 5800,
		6: 6400,
		7: 6900,
		8: 7400
	} as Record<number, number>,
	grossMonthlyAdditional: 400,
	applicationUrl: 'https://www.csd.ca.gov/Pages/HEAP.aspx',
	applicationLabel: 'Find a HEAP provider near you'
} as const;

// School Meals — 130% FPL (free), up to 185% FPL (reduced price)
// Categorical: school-age child (5-18) must be in household
// Source: https://www.fns.usda.gov/nslp
export const SCHOOL_MEALS = {
	name: 'School Meals (free or reduced-price)',
	description: 'Free or reduced-price breakfast and lunch for school-age children.',
	freeMonthlyLimits: {
		1: 1632,
		2: 2215,
		3: 2798,
		4: 3380,
		5: 3963,
		6: 4546,
		7: 5129,
		8: 5711
	} as Record<number, number>,
	freeMonthlyAdditional: 583,
	reducedMonthlyLimits: {
		1: 2322,
		2: 3151,
		3: 3981,
		4: 4810,
		5: 5639,
		6: 6469,
		7: 7298,
		8: 8128
	} as Record<number, number>,
	reducedMonthlyAdditional: 829,
	applicationUrl: 'https://www.cde.ca.gov/ls/nu/sn/nslp.asp',
	applicationLabel: 'Apply through your school district'
} as const;

// CalEITC — California Earned Income Tax Credit
// Tax year 2024 limits (filed 2025); update when CA FTB publishes 2025 tax year figures
// Note: Young Child Tax Credit (YCTC) of up to $1,117 per child under 6 is not included in v1
// Source: https://www.ftb.ca.gov/file/personal/credits/california-earned-income-tax-credit.html
export const CALEITC = {
	name: 'CalEITC (state tax credit)',
	description:
		'A California tax credit for working people. Claimed when you file state taxes, not monthly.',
	// Annual earned income limits by number of qualifying children (0, 1, 2, 3+)
	earnedIncomeLimitsAnnual: { 0: 18591, 1: 24078, 2: 24078, 3: 24078 } as Record<number, number>,
	// Approximate maximum annual credit by number of qualifying children
	maxCreditAnnual: { 0: 285, 1: 1900, 2: 3137, 3: 3529 } as Record<number, number>,
	applicationUrl:
		'https://www.ftb.ca.gov/file/personal/credits/california-earned-income-tax-credit.html',
	applicationLabel: 'Learn about CalEITC on the CA FTB site'
} as const;
