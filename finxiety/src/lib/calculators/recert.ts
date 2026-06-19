// RECERT-1: Recertification date calculator.
// Pure functions, no side effects, no Svelte imports.
//
// Given a program, a state, and the last certification date, estimate the next
// recertification date and the two reminder dates (30 and 7 days before).

export type ProgramKey = 'snap' | 'medicaid';

export interface PeriodData {
	label: string;
	months: number;
	notes: string;
	mid_cert_note?: string;
	source: string;
}

export interface CertificationPeriods {
	last_updated: string;
	verify_at: Record<string, string>;
	periods: Record<string, Record<ProgramKey, PeriodData>>;
}

export interface RecertResult {
	program: ProgramKey;
	programLabel: string; // resolved label for the state/program
	lastCertDate: Date;
	nextCertDate: Date; // lastCertDate + months
	reminder30: Date; // nextCertDate - 30 days
	reminder7: Date; // nextCertDate - 7 days
	daysUntilDue: number; // whole days from today (start-of-day) to nextCertDate
	months: number; // the certification period length used
	source: string; // official verify URL for this program/state
	midCertNote?: string; // only present when the state/program defines one
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Add a whole number of calendar months to a date. Anchored to the day-of-month
// of the source date; if the target month is shorter (e.g. Jan 31 + 1 month),
// JS Date rolls forward, so we clamp back to the last day of the target month
// to keep the result inside the intended month.
export function addMonths(date: Date, months: number): Date {
	const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	const targetMonth = result.getMonth() + months;
	result.setMonth(targetMonth);
	// If the day overflowed into the next month, clamp to the last valid day.
	if (result.getMonth() !== ((targetMonth % 12) + 12) % 12) {
		result.setDate(0); // last day of the previous (intended) month
	}
	return result;
}

// Subtract whole days from a date, returning a new date at local midnight.
function subtractDays(date: Date, days: number): Date {
	const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
	result.setDate(result.getDate() - days);
	return result;
}

// Normalize to local midnight so day-count math is calendar-based, not affected
// by the time-of-day component of either operand.
function startOfDay(date: Date): Date {
	return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

// Whole calendar days from `from` to `to` (positive when `to` is later).
function wholeDaysBetween(from: Date, to: Date): number {
	return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / MS_PER_DAY);
}

// Is this state/program combination supported by the data file?
export function isSupported(state: string, data: CertificationPeriods): boolean {
	return Boolean(data.periods[state]);
}

export function calcRecert(
	program: ProgramKey,
	state: string,
	lastCertDate: Date,
	data: CertificationPeriods,
	today: Date = new Date()
): RecertResult {
	const period = data.periods[state]?.[program];
	if (!period) {
		throw new Error(`No certification-period data for ${state}/${program}`);
	}

	const lastCert = startOfDay(lastCertDate);
	const nextCertDate = addMonths(lastCert, period.months);
	const reminder30 = subtractDays(nextCertDate, 30);
	const reminder7 = subtractDays(nextCertDate, 7);
	const daysUntilDue = wholeDaysBetween(today, nextCertDate);

	return {
		program,
		programLabel: period.label,
		lastCertDate: lastCert,
		nextCertDate,
		reminder30,
		reminder7,
		daysUntilDue,
		months: period.months,
		source: period.source,
		midCertNote: period.mid_cert_note
	};
}
