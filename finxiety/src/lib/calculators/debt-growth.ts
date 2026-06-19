// DEBT-VIZ-1: Debt vs. Growth Compound Visualizer.
// Pure month-by-month compound math. No Svelte, no side effects, no data files —
// every number is user-supplied (balances, rates, payment, horizon).
//
// The point of the tool: compound interest is the same exponential curve whether
// it runs for you (an investment growing) or against you (a debt balance growing).
// We model both on the same time axis so the two curves can share one chart.

export interface DebtGrowthPoint {
	month: number;
	debtBalance: number;
	investmentBalance: number;
}

// Clamp a numeric input to a finite, non-negative number. Non-finite or negative
// values (NaN from an empty field, a stray minus sign) collapse to 0 so the math
// never produces Infinity or a misleading negative curve.
function clampNonNegative(value: number): number {
	return Number.isFinite(value) && value > 0 ? value : 0;
}

export function computeDebtGrowth(
	debtBalance: number, // starting debt ($)
	debtApr: number, // annual percentage rate (e.g. 24 for 24%)
	monthlyPayment: number, // fixed monthly payment toward debt (0 = untouched)
	investmentAmount: number, // same dollar amount invested instead
	annualReturn: number, // expected annual return (e.g. 7 for 7%)
	years: number // time horizon (5, 10, 20, or 30)
): DebtGrowthPoint[] {
	const startDebt = clampNonNegative(debtBalance);
	const apr = clampNonNegative(debtApr);
	const payment = clampNonNegative(monthlyPayment);
	const startInvestment = clampNonNegative(investmentAmount);
	const annual = clampNonNegative(annualReturn);
	// Horizon must be a whole, positive number of years. Anything else is 0 months.
	const horizonYears = Number.isFinite(years) && years > 0 ? Math.floor(years) : 0;
	const totalMonths = horizonYears * 12;

	const debtMonthlyRate = apr / 12 / 100;
	const investMonthlyRate = annual / 12 / 100;

	const points: DebtGrowthPoint[] = [];
	let debt = startDebt;
	let investment = startInvestment;

	// Month 0 is the starting snapshot before any compounding happens.
	points.push({ month: 0, debtBalance: debt, investmentBalance: investment });

	for (let month = 1; month <= totalMonths; month++) {
		// Debt: accrue one month of interest, then subtract the fixed payment.
		// Floor at 0 — a payment larger than the balance pays it off, it does not
		// turn the debt into a negative (which would read as the bank owing the user).
		debt = Math.max(0, debt * (1 + debtMonthlyRate) - payment);
		// Investment: one month of growth, no contributions or withdrawals.
		investment = investment * (1 + investMonthlyRate);
		points.push({ month, debtBalance: debt, investmentBalance: investment });
	}

	return points;
}
