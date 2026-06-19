// HOURS-1: "Where Do Your Work Hours Actually Go?" calculation.
//
// Pure functions, no side effects, no Svelte imports. All tax tables are passed
// in by the caller (the route imports the JSON and hands it to calculateHours),
// so this module never reaches for a file or a network — it is fully testable in
// isolation with fixtures.
//
// Method, in plain terms:
//   1. Annualize the per-period gross pay and pre-tax deductions using the number
//      of pay periods in a year for the chosen frequency.
//   2. Federal income tax: annual taxable income = annual gross − annual pre-tax
//      deductions − the standard deduction for the filing status. Apply the
//      progressive federal brackets to that taxable income, then divide the annual
//      tax back down to a per-period figure.
//   3. State income tax: same annualize → bracket/flat → divide-back approach.
//      State standard deductions and credits are out of V1 scope (documented).
//   4. FICA: Social Security is 6.2% of GROSS (not reduced by pre-tax deductions),
//      capped at the annual wage base; Medicare is 1.45% of gross, no cap in V1.
//   5. Net = gross − pre-tax − federal − state − FICA.
//   6. Time reframe: for each dollar category, minutes-per-hour-worked =
//      (category / gross) × 60. The "minutes until your pay is yours" on an 8-hour
//      day = (1 − net/gross) × 480, and we format that as a clock time from a 9am
//      start.
//
// This is an estimate of withholding-style math, not a filed return. It does not
// model credits (EITC, CTC), additional Medicare tax, local/city income tax, or
// non-standard deductions. The route frames every output as an estimate.

// --- 2026 FICA constants (SSA) ----------------------------------------------
// Re-verify annually against https://www.ssa.gov/oact/cola/cbb.html
export const SOCIAL_SECURITY_RATE = 0.062;
export const SOCIAL_SECURITY_WAGE_BASE_2026 = 176100;
export const MEDICARE_RATE = 0.0145;

// Minutes in a standard 8-hour workday, used for the annual "days worked for
// taxes" rollup and the "until your pay is yours" clock.
export const MINUTES_PER_WORKDAY = 480;

export type PayFrequency = 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';

export type FilingStatus =
	| 'single'
	| 'married_filing_jointly'
	| 'married_filing_separately'
	| 'head_of_household';

// --- Shapes of the data files (passed in, never imported here) ---------------

export interface Bracket {
	rate: number;
	min: number;
	max: number | null; // null = no upper bound (top band)
}

export interface FederalBracketData {
	standard_deductions: Record<string, number>;
	brackets: Record<string, Bracket[]>;
}

// A single state's entry. Typed loosely on purpose: it is read straight from a
// JSON file, where TypeScript widens string literals to `string` and treats
// optional fields as absent on entries that omit them. The shape below is what
// the imported JSON is actually assignable to (no cast needed at the call site);
// annualStateTax() narrows on `type` at runtime. `type` is one of
// 'brackets' | 'flat' | 'none'.
export interface StateTaxEntry {
	type: string;
	brackets?: Bracket[];
	rate?: number;
	surcharge?: { rate: number; min: number; label?: string };
}

export interface StateTaxData {
	states: Record<string, StateTaxEntry>;
}

// --- Inputs / outputs --------------------------------------------------------

export interface HoursInputs {
	grossPayPerPeriod: number;
	payFrequency: PayFrequency;
	hoursWorkedPerPeriod: number;
	preTaxDeductions: number;
	filingStatus: FilingStatus;
	state: string; // 'CA' | 'TX' | 'FL' | 'NY' | 'AZ' | 'other'
	stateTaxData: StateTaxData;
	federalBracketData: FederalBracketData;
}

export interface HoursResult {
	grossPay: number;
	preTaxDeductions: number;
	federalIncomeTax: number;
	socialSecurity: number;
	medicare: number;
	stateIncomeTax: number;
	netPay: number;
	totalDeductions: number;
	// Employer-side FICA match (informational; not part of net pay):
	employerFica: number;
	// Time breakdown — minutes of each hour worked that fund each category:
	minutesPerHourForFederal: number;
	minutesPerHourForFICA: number;
	minutesPerHourForState: number;
	minutesPerHourForPreTax: number;
	minutesPerHourForNet: number; // the "yours" portion
	// Annualized:
	annualGross: number;
	annualNet: number;
	periodsPerYear: number;
	annualTaxAndFica: number; // federal + state + employee FICA, annualized
	daysWorkedForTaxesPerYear: number; // annualTaxAndFica time ÷ 480-min workday
	// "You work until X before any of today's pay is yours":
	minutesUntilYoursPerDay: number; // on an 8-hour day
	timeUntilYoursFormatted: string; // e.g. "2:47 PM", assuming a 9am start
}

// --- Helpers -----------------------------------------------------------------

const PERIODS_PER_YEAR: Record<PayFrequency, number> = {
	weekly: 52,
	biweekly: 26,
	semimonthly: 24,
	monthly: 12
};

export function periodsPerYear(freq: PayFrequency): number {
	return PERIODS_PER_YEAR[freq] ?? 12;
}

function round2(value: number): number {
	return Math.round(value * 100) / 100;
}

function safeNonNegative(n: number): number {
	return Number.isFinite(n) ? Math.max(n, 0) : 0;
}

// Progressive tax on `taxable` income using marginal brackets. A null `max`
// means the band has no upper bound.
export function taxFromBrackets(taxable: number, brackets: Bracket[]): number {
	if (taxable <= 0) return 0;
	let tax = 0;
	for (const band of brackets) {
		if (taxable <= band.min) break;
		const upper = band.max === null ? taxable : Math.min(taxable, band.max);
		tax += (upper - band.min) * band.rate;
	}
	return tax;
}

// Federal income tax for an ANNUAL taxable income, given filing status.
export function annualFederalTax(
	annualTaxableIncome: number,
	filingStatus: FilingStatus,
	federal: FederalBracketData
): number {
	const brackets = federal.brackets[filingStatus] ?? federal.brackets.single;
	return taxFromBrackets(annualTaxableIncome, brackets);
}

// State income tax for an ANNUAL taxable income, given a 2-letter code. Unknown
// codes (including 'other') resolve to zero — federal-only, no state tax.
export function annualStateTax(
	annualTaxableIncome: number,
	stateCode: string,
	stateData: StateTaxData
): number {
	const entry = stateData.states[stateCode];
	if (!entry || entry.type === 'none') return 0;
	if (entry.type === 'flat') {
		const rate = entry.rate ?? 0;
		return annualTaxableIncome > 0 ? annualTaxableIncome * rate : 0;
	}
	if (entry.type === 'brackets' && entry.brackets) {
		let tax = taxFromBrackets(annualTaxableIncome, entry.brackets);
		if (entry.surcharge && annualTaxableIncome > entry.surcharge.min) {
			tax += (annualTaxableIncome - entry.surcharge.min) * entry.surcharge.rate;
		}
		return tax;
	}
	return 0;
}

// Format minutes-after-9am as a 12-hour clock time, e.g. 347 → "2:47 PM".
export function formatClockTime(minutesAfter9am: number, startHour = 9): string {
	const totalMinutes = Math.round(startHour * 60 + Math.max(minutesAfter9am, 0));
	let hour24 = Math.floor(totalMinutes / 60) % 24;
	const minute = totalMinutes % 60;
	const period = hour24 >= 12 ? 'PM' : 'AM';
	let hour12 = hour24 % 12;
	if (hour12 === 0) hour12 = 12;
	return `${hour12}:${String(minute).padStart(2, '0')} ${period}`;
}

// --- Main --------------------------------------------------------------------

export function calculateHours(inputs: HoursInputs): HoursResult {
	const gross = safeNonNegative(inputs.grossPayPerPeriod);
	const preTaxRaw = safeNonNegative(inputs.preTaxDeductions);
	// Pre-tax deductions can never exceed gross.
	const preTax = Math.min(preTaxRaw, gross);
	const periods = periodsPerYear(inputs.payFrequency);

	const annualGross = gross * periods;
	const annualPreTax = preTax * periods;

	// --- Federal income tax --------------------------------------------------
	const stdDeduction =
		inputs.federalBracketData.standard_deductions[inputs.filingStatus] ??
		inputs.federalBracketData.standard_deductions.single ??
		0;
	const annualFedTaxable = Math.max(annualGross - annualPreTax - stdDeduction, 0);
	const annualFed = annualFederalTax(annualFedTaxable, inputs.filingStatus, inputs.federalBracketData);
	const federalIncomeTax = round2(annualFed / periods);

	// --- State income tax ----------------------------------------------------
	// State taxable income mirrors the federal pre-tax treatment but applies no
	// state standard deduction in V1 (documented limitation).
	const annualStateTaxable = Math.max(annualGross - annualPreTax, 0);
	const annualState = annualStateTax(annualStateTaxable, inputs.state, inputs.stateTaxData);
	const stateIncomeTax = round2(annualState / periods);

	// --- FICA (on GROSS, not reduced by pre-tax) -----------------------------
	// Social Security applies to gross up to the annual wage base. We track how
	// much of the annual base has already been "used" implicitly by annualizing:
	// SS for the period is 6.2% of the gross that still falls under the base.
	const annualSsEligible = Math.min(annualGross, SOCIAL_SECURITY_WAGE_BASE_2026);
	const annualSs = annualSsEligible * SOCIAL_SECURITY_RATE;
	const socialSecurity = round2(annualSs / periods);
	const medicare = round2(gross * MEDICARE_RATE);
	const employerFica = round2(socialSecurity + medicare); // employer matches both

	// --- Net -----------------------------------------------------------------
	const totalDeductions = round2(
		preTax + federalIncomeTax + socialSecurity + medicare + stateIncomeTax
	);
	const netPay = round2(gross - totalDeductions);

	// --- Time breakdown (minutes per hour worked) ----------------------------
	// Each dollar category as a fraction of gross, scaled to 60 minutes. When
	// gross is zero, every share is zero.
	const perHour = (amount: number) => (gross > 0 ? round2((amount / gross) * 60) : 0);
	const minutesPerHourForFederal = perHour(federalIncomeTax);
	const minutesPerHourForFICA = perHour(socialSecurity + medicare);
	const minutesPerHourForState = perHour(stateIncomeTax);
	const minutesPerHourForPreTax = perHour(preTax);
	const minutesPerHourForNet = perHour(netPay);

	// --- Annual rollups ------------------------------------------------------
	const annualNet = round2(netPay * periods);
	// Income/payroll tax burden (federal + state + employee FICA), annualized.
	const annualTaxAndFica = round2(
		(federalIncomeTax + stateIncomeTax + socialSecurity + medicare) * periods
	);
	// Days per year "worked for taxes" = total tax minutes per year ÷ 480.
	// Total tax minutes per year = (tax share of every hour) × the minutes the user
	// actually works in a year, i.e. taxFraction × annualMinutesWorked.
	const annualMinutesWorked = safeNonNegative(inputs.hoursWorkedPerPeriod) * 60 * periods;
	const taxFraction = gross > 0 ? (federalIncomeTax + stateIncomeTax + socialSecurity + medicare) / gross : 0;
	const daysWorkedForTaxesPerYear =
		annualMinutesWorked > 0
			? round2((taxFraction * annualMinutesWorked) / MINUTES_PER_WORKDAY)
			: 0;

	// --- "Until your pay is yours" -------------------------------------------
	// Everything that isn't net (pre-tax + all taxes) as a share of an 8-hour day.
	const notYoursFraction = gross > 0 ? 1 - netPay / gross : 0;
	const minutesUntilYoursPerDay = round2(notYoursFraction * MINUTES_PER_WORKDAY);
	const timeUntilYoursFormatted = formatClockTime(minutesUntilYoursPerDay);

	return {
		grossPay: round2(gross),
		preTaxDeductions: round2(preTax),
		federalIncomeTax,
		socialSecurity,
		medicare,
		stateIncomeTax,
		netPay,
		totalDeductions,
		employerFica,
		minutesPerHourForFederal,
		minutesPerHourForFICA,
		minutesPerHourForState,
		minutesPerHourForPreTax,
		minutesPerHourForNet,
		annualGross: round2(annualGross),
		annualNet,
		periodsPerYear: periods,
		annualTaxAndFica,
		daysWorkedForTaxesPerYear,
		minutesUntilYoursPerDay,
		timeUntilYoursFormatted
	};
}
