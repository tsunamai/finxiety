// RECERT-1: RFC 5545 (.ics) generator.
// Pure TypeScript, zero dependencies. No network, no storage.
//
// Produces an all-day VEVENT calendar for benefit recertification reminders.
// All work is client-side; downloadIcs only runs in the browser.

export interface IcsEvent {
	summary: string; // e.g. "CalFresh recertification due in 30 days"
	description: string; // plain text, ~2-3 sentences
	dtstart: Date; // the reminder date (30 or 7 days before deadline)
	dtend: Date; // for all-day events, the (exclusive) end date
	uid: string; // stable unique id, e.g. "recert-CA-snap-30d@finxiety"
}

// Pad to two digits.
function pad2(n: number): string {
	return n < 10 ? `0${n}` : String(n);
}

// Format a Date as a local YYYYMMDD date stamp (for VALUE=DATE / all-day events).
// We use the calendar date the user is looking at, not a UTC instant, so a
// reminder dated "March 1" lands on March 1 in the user's own calendar app.
function formatDate(d: Date): string {
	return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
}

// Format a Date as a UTC timestamp for DTSTAMP (required, RFC 5545 §3.8.7.2).
function formatUtcStamp(d: Date): string {
	return (
		`${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}` +
		`T${pad2(d.getUTCHours())}${pad2(d.getUTCMinutes())}${pad2(d.getUTCSeconds())}Z`
	);
}

// Escape a TEXT value per RFC 5545 §3.3.11: backslash, semicolon, comma, newline.
function escapeText(value: string): string {
	return value
		.replace(/\\/g, '\\\\')
		.replace(/;/g, '\\;')
		.replace(/,/g, '\\,')
		.replace(/\r\n|\n|\r/g, '\\n');
}

// Fold a single content line at 75 octets per RFC 5545 §3.1. Continuation lines
// begin with a single space. We measure in UTF-8 bytes (octets), not JS chars,
// and never split a multi-byte character across a fold boundary.
function foldLine(line: string): string {
	const encoder = new TextEncoder();
	if (encoder.encode(line).length <= 75) return line;

	const out: string[] = [];
	let current = '';
	let currentBytes = 0;
	// First line allows 75 octets; continuation lines start with a leading space,
	// so their content budget is 74 octets (1 octet spent on the space).
	let limit = 75;

	for (const char of line) {
		const charBytes = encoder.encode(char).length;
		if (currentBytes + charBytes > limit) {
			out.push(current);
			current = char;
			currentBytes = charBytes;
			limit = 74;
		} else {
			current += char;
			currentBytes += charBytes;
		}
	}
	out.push(current);

	return out.join('\r\n ');
}

// RFC 5545 requires CRLF line endings between content lines.
const CRLF = '\r\n';

export function generateIcs(events: IcsEvent[]): string {
	const stamp = formatUtcStamp(new Date());

	const lines: string[] = [
		'BEGIN:VCALENDAR',
		'VERSION:2.0',
		'PRODID:-//Finxiety//Recertification Tracker//EN',
		'CALSCALE:GREGORIAN',
		'METHOD:PUBLISH'
	];

	for (const event of events) {
		lines.push('BEGIN:VEVENT');
		lines.push(`UID:${event.uid}`);
		lines.push(`DTSTAMP:${stamp}`);
		lines.push(`DTSTART;VALUE=DATE:${formatDate(event.dtstart)}`);
		lines.push(`DTEND;VALUE=DATE:${formatDate(event.dtend)}`);
		lines.push(foldLine(`SUMMARY:${escapeText(event.summary)}`));
		lines.push(foldLine(`DESCRIPTION:${escapeText(event.description)}`));
		lines.push('TRANSP:TRANSPARENT');
		lines.push('END:VEVENT');
	}

	lines.push('END:VCALENDAR');

	// Trailing CRLF after END:VCALENDAR is conventional and harmless.
	return lines.join(CRLF) + CRLF;
}

// Trigger a client-side download of the .ics content. Browser-only.
export function downloadIcs(filename: string, content: string): void {
	if (typeof document === 'undefined' || typeof URL === 'undefined') return;

	const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const anchor = document.createElement('a');
	anchor.href = url;
	anchor.download = filename;
	anchor.style.display = 'none';
	document.body.appendChild(anchor);
	anchor.click();
	document.body.removeChild(anchor);
	URL.revokeObjectURL(url);
}
