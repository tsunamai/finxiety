// RECERT-1 calculator tests. Run with: node --test (Node 18+ has node:test built
// in; no framework is installed in this project). These exercise the date math,
// the supported-state guard, the mid-cert note pass-through, and a negative case.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
	addMonths,
	calcRecert,
	isSupported,
	type CertificationPeriods
} from './recert.ts';

// --- Fixture: two states, both programs, one with a mid-cert note ------------

const fixture: CertificationPeriods = {
	last_updated: '2026-06-18',
	verify_at: {},
	periods: {
		CA: {
			snap: {
				label: 'CalFresh',
				months: 12,
				notes: 'Annual.',
				mid_cert_note: 'SAR-7 at 6 months is not a renewal.',
				source: 'https://example.test/calfresh'
			},
			medicaid: {
				label: 'Medi-Cal',
				months: 12,
				notes: 'Annual.',
				source: 'https://example.test/medi-cal'
			}
		},
		TX: {
			snap: {
				label: 'SNAP',
				months: 6,
				notes: 'Six months.',
				source: 'https://example.test/tx-snap'
			},
			medicaid: {
				label: 'Medicaid',
				months: 12,
				notes: 'Annual.',
				source: 'https://example.test/tx-medicaid'
			}
		}
	}
};

function iso(d: Date): string {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
		d.getDate()
	).padStart(2, '0')}`;
}

// --- addMonths --------------------------------------------------------------

test('addMonths advances by whole months on a normal day', () => {
	assert.equal(iso(addMonths(new Date(2026, 0, 15), 12)), '2027-01-15');
	assert.equal(iso(addMonths(new Date(2026, 5, 10), 6)), '2026-12-10');
});

test('addMonths clamps to the last valid day when the target month is shorter', () => {
	// Jan 31 + 1 month -> Feb has no 31st; clamp to Feb 28 (2026 is not a leap year).
	assert.equal(iso(addMonths(new Date(2026, 0, 31), 1)), '2026-02-28');
	// Aug 31 + 6 months -> Feb 28.
	assert.equal(iso(addMonths(new Date(2026, 7, 31), 6)), '2027-02-28');
});

// --- AC: SNAP + CA + 6 months ago -> 6 months out, mid-cert note present ------

test('CA SNAP cert 6 months ago shows the 12-month next date and the SAR-7 note', () => {
	const today = new Date(2026, 5, 18); // 2026-06-18
	const lastCert = new Date(2025, 11, 18); // 6 months before today
	const r = calcRecert('snap', 'CA', lastCert, fixture, today);

	// 12-month period from last cert.
	assert.equal(iso(r.nextCertDate), '2026-12-18');
	// daysUntilDue ~ 6 months out, comfortably over 60 days.
	assert.ok(r.daysUntilDue > 60);
	// Mid-cert note flows through for CA SNAP.
	assert.ok(r.midCertNote && r.midCertNote.includes('SAR-7'));
	assert.equal(r.programLabel, 'CalFresh');
});

// --- AC: Medicaid + CA + 11 months ago -> ~1 month out, no mid-cert note ------

test('CA Medicaid cert 11 months ago is due in about a month with no mid-cert note', () => {
	const today = new Date(2026, 5, 18); // 2026-06-18
	const lastCert = new Date(2025, 6, 18); // 11 months before today
	const r = calcRecert('medicaid', 'CA', lastCert, fixture, today);

	assert.equal(iso(r.nextCertDate), '2026-07-18');
	// Roughly one month out.
	assert.ok(r.daysUntilDue > 0 && r.daysUntilDue < 60);
	assert.equal(r.midCertNote, undefined);
});

// --- Reminder offsets: exactly 30 and 7 days before the next cert date --------

test('reminders are 30 and 7 days before the next cert date', () => {
	const lastCert = new Date(2026, 0, 1);
	const r = calcRecert('snap', 'TX', lastCert, fixture, new Date(2026, 0, 1));
	// TX SNAP is a 6-month period: 2026-07-01.
	assert.equal(iso(r.nextCertDate), '2026-07-01');
	assert.equal(iso(r.reminder30), '2026-06-01'); // 30 days before Jul 1
	assert.equal(iso(r.reminder7), '2026-06-24'); // 7 days before Jul 1
});

// --- Supported-state guard ---------------------------------------------------

test('isSupported is true for states in the data and false otherwise', () => {
	assert.equal(isSupported('CA', fixture), true);
	assert.equal(isSupported('TX', fixture), true);
	assert.equal(isSupported('WA', fixture), false);
});

// --- Negative case: calculating for an unsupported state throws ---------------

test('calcRecert throws for a state with no data', () => {
	assert.throws(
		() => calcRecert('snap', 'WA', new Date(2026, 0, 1), fixture),
		/No certification-period data for WA\/snap/
	);
});
