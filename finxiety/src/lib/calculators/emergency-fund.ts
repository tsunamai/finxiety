export interface RunwayResult {
	designatedMonths: number;
	combinedMonths: number;
	designatedLabel: string;
	combinedLabel: string;
}

export function calcRunway(
	designated: number,
	checking: number,
	monthlyExpenses: number
): RunwayResult {
	const designatedMonths = designated / monthlyExpenses;
	const combinedMonths = (designated + checking) / monthlyExpenses;

	return {
		designatedMonths,
		combinedMonths,
		designatedLabel: formatMonths(designatedMonths),
		combinedLabel: formatMonths(combinedMonths)
	};
}

function formatMonths(months: number): string {
	if (months < 0.05) return '0 months';
	if (months >= 120) return '10+ years';
	return `${months.toFixed(1)} ${months === 1.0 ? 'month' : 'months'}`;
}
