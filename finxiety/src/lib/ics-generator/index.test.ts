// RECERT-1 ICS generator tests. Run with: node --test (Node 18+).
// These check RFC 5545 structure, all-day date formatting, TEXT escaping, and
// line folding at 75 octets. downloadIcs is browser-only and not unit-tested
// here (no DOM in node:test); it is exercised manually in the browser.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { generateIcs, type IcsEvent } from './index.ts';

const sampleEvent: IcsEvent = {
	summary: 'CalFresh recertification — reminder',
	description: 'Recertifying means confirming you still qualify.',
	dtstart: new Date(2026, 10, 1), // 2026-11-01 (local)
	dtend: new Date(2026, 10, 2), // 2026-11-02 (exclusive end)
	uid: 'recert-CA-snap-30d@finxiety'
};

// Split a folded ICS back into logical lines by unfolding CRLF + space.
function unfold(ics: string): string[] {
	return ics.replace(/\r\n[ \t]/g, '').split('\r\n');
}

test('generateIcs emits a well-formed VCALENDAR envelope', () => {
	const ics = generateIcs([sampleEvent]);
	const lines = unfold(ics);
	assert.equal(lines[0], 'BEGIN:VCALENDAR');
	assert.ok(lines.includes('VERSION:2.0'));
	assert.ok(lines.includes('PRODID:-//Finxiety//Recertification Tracker//EN'));
	assert.ok(lines.includes('BEGIN:VEVENT'));
	assert.ok(lines.includes('END:VEVENT'));
	// END:VCALENDAR is the last non-empty logical line.
	assert.equal(lines.filter((l) => l !== '').at(-1), 'END:VCALENDAR');
});

test('all-day events use VALUE=DATE with YYYYMMDD and an exclusive DTEND', () => {
	const ics = generateIcs([sampleEvent]);
	const lines = unfold(ics);
	assert.ok(lines.includes('DTSTART;VALUE=DATE:20261101'));
	assert.ok(lines.includes('DTEND;VALUE=DATE:20261102'));
});

test('every event carries a UID and a DTSTAMP', () => {
	const ics = generateIcs([sampleEvent]);
	const lines = unfold(ics);
	assert.ok(lines.includes('UID:recert-CA-snap-30d@finxiety'));
	assert.ok(lines.some((l) => /^DTSTAMP:\d{8}T\d{6}Z$/.test(l)));
});

test('TEXT values escape commas, semicolons, and newlines', () => {
	const event: IcsEvent = {
		...sampleEvent,
		description: 'One, two; three\nfour'
	};
	const ics = generateIcs([event]);
	const lines = unfold(ics);
	const desc = lines.find((l) => l.startsWith('DESCRIPTION:'));
	assert.ok(desc);
	assert.ok(desc.includes('One\\, two\\; three\\nfour'));
});

test('long lines fold so no physical line exceeds 75 octets', () => {
	const event: IcsEvent = {
		...sampleEvent,
		description:
			'This is a deliberately long description that should exceed seventy-five octets ' +
			'and therefore must be folded across multiple physical lines per RFC 5545 section 3.1.'
	};
	const ics = generateIcs([event]);
	const encoder = new TextEncoder();
	for (const physicalLine of ics.split('\r\n')) {
		assert.ok(
			encoder.encode(physicalLine).length <= 75,
			`physical line exceeds 75 octets: ${physicalLine}`
		);
	}
	// And it must round-trip: unfolding restores the original DESCRIPTION text.
	const lines = unfold(ics);
	const desc = lines.find((l) => l.startsWith('DESCRIPTION:'));
	assert.ok(desc && desc.includes('folded across multiple physical lines'));
});

test('two events produce two VEVENT blocks', () => {
	const ics = generateIcs([
		sampleEvent,
		{ ...sampleEvent, uid: 'recert-CA-snap-7d@finxiety' }
	]);
	const beginCount = (ics.match(/BEGIN:VEVENT/g) ?? []).length;
	const endCount = (ics.match(/END:VEVENT/g) ?? []).length;
	assert.equal(beginCount, 2);
	assert.equal(endCount, 2);
});
