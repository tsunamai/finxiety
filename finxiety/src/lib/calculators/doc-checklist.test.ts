// DOC-1 calculator tests. Run with: node --test (after tsc compile) -- see
// the npm-free runner note below. These exercise every de-duplication branch
// plus a negative case.
//
// No test framework is installed in this project, so these are authored against
// node:test (built into Node 18+) and the pure functions in doc-checklist.ts.
// They take `data` as an argument, so no JSON loader is needed at test time --
// a small inline fixture stands in for the production data file.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChecklist, type DocRequirements } from './doc-checklist.ts';

// --- Fixture: minimal data covering all merge branches -----------------------

const fixture: DocRequirements = {
	last_updated: '2026-06-17',
	verify_at: {},
	programs: {
		a: {
			label: 'Program A',
			ca_label: 'CA-A',
			official_url: 'https://a.example',
			ca_official_url: 'https://ca-a.example',
			requirements: [
				{
					id: 'identity.photo_id',
					category: 'identity',
					name: 'Photo ID',
					description: 'An ID.',
					status: 'required',
					one_of_group: null,
					condition_note: null
				},
				{
					id: 'residency.proof',
					category: 'residency',
					name: 'Proof of address',
					description: 'Address proof.',
					status: 'one_of',
					one_of_group: 'residency',
					condition_note: null,
					accepts: ['Utility bill', 'Lease', 'Recent mail']
				},
				{
					id: 'income.benefit',
					category: 'income',
					name: 'Award letters',
					description: 'Award letters.',
					status: 'conditional',
					one_of_group: null,
					condition_note: 'if you receive benefits.'
				}
			]
		},
		b: {
			label: 'Program B',
			ca_label: 'CA-B',
			official_url: 'https://b.example',
			ca_official_url: 'https://ca-b.example',
			requirements: [
				{
					// Same id as A's photo_id but only required for B -- merges, status stays required.
					id: 'identity.photo_id',
					category: 'identity',
					name: 'Photo ID',
					description: 'An ID.',
					status: 'required',
					one_of_group: null,
					condition_note: null
				},
				{
					// Same one_of group, overlapping accepts -> intersection merge.
					id: 'residency.proof',
					category: 'residency',
					name: 'Proof of address',
					description: 'Address proof.',
					status: 'one_of',
					one_of_group: 'residency',
					condition_note: null,
					accepts: ['Utility bill', 'Recent mail']
				},
				{
					// Program-specific unique id.
					id: 'program_specific.energy_bill',
					category: 'program_specific',
					name: 'Energy bill',
					description: 'Energy bill.',
					status: 'required',
					one_of_group: null,
					condition_note: null
				}
			]
		},
		c: {
			label: 'Program C',
			ca_label: 'CA-C',
			official_url: 'https://c.example',
			ca_official_url: 'https://ca-c.example',
			requirements: [
				{
					// Same one_of group but DISJOINT accepts -> empty intersection -> no merge.
					id: 'residency.proof',
					category: 'residency',
					name: 'Proof of address',
					description: 'Address proof.',
					status: 'one_of',
					one_of_group: 'residency',
					condition_note: null,
					accepts: ['Passport stamp', 'Bank statement']
				}
			]
		}
	},
	state_overrides: {
		CA: {
			a: {
				'identity.photo_id': {
					divergence_note: 'CA can accept a signed statement.'
				}
			}
		}
	}
};

// --- Branch 1: shared id merges, needed_for lists both -----------------------

test('shared id merges into one item listing both programs', () => {
	const result = buildChecklist(['a', 'b'], 'XX', fixture);
	const identity = result.find((c) => c.category === 'identity');
	assert.ok(identity, 'identity category present');
	const photoId = identity.items.find((i) => i.id === 'identity.photo_id');
	assert.ok(photoId, 'photo id item present');
	assert.deepEqual(photoId.needed_for, ['Program A', 'Program B']);
	assert.equal(photoId.resolved_status, 'required');
	// Appears exactly once.
	assert.equal(identity.items.filter((i) => i.id === 'identity.photo_id').length, 1);
});

// --- Branch 2a: one_of with overlapping accepts -> intersection --------------

test('one_of group with overlapping accepts merges to the intersection', () => {
	const result = buildChecklist(['a', 'b'], 'XX', fixture);
	const residency = result.find((c) => c.category === 'residency');
	assert.ok(residency);
	const proofs = residency.items.filter((i) => i.id.startsWith('residency.proof'));
	assert.equal(proofs.length, 1, 'single merged residency item');
	assert.deepEqual(proofs[0].needed_for, ['Program A', 'Program B']);
	// Intersection of [Utility bill, Lease, Recent mail] and [Utility bill, Recent mail]
	assert.deepEqual(proofs[0].accepts, ['Utility bill', 'Recent mail']);
});

// --- Branch 2b: one_of with EMPTY intersection -> surfaced separately --------

test('one_of group with disjoint accepts is NOT merged; surfaced separately', () => {
	const result = buildChecklist(['a', 'c'], 'XX', fixture);
	const residency = result.find((c) => c.category === 'residency');
	assert.ok(residency);
	const proofs = residency.items.filter((i) => i.id.startsWith('residency.proof'));
	assert.equal(proofs.length, 2, 'two separate residency items');
	const aProof = proofs.find((p) => p.needed_for.includes('Program A'));
	const cProof = proofs.find((p) => p.needed_for.includes('Program C'));
	assert.ok(aProof && cProof, 'each program has its own item');
	assert.deepEqual(aProof.needed_for, ['Program A']);
	assert.deepEqual(cProof.needed_for, ['Program C']);
	// A keeps its full accepts list since the merge was rolled back.
	assert.deepEqual(aProof.accepts, ['Utility bill', 'Lease', 'Recent mail']);
});

// --- Branch 3: program-specific unique id passes through --------------------

test('program-specific unique id passes through with its program tag', () => {
	const result = buildChecklist(['a', 'b'], 'XX', fixture);
	const ps = result.find((c) => c.category === 'program_specific');
	assert.ok(ps);
	const energy = ps.items.find((i) => i.id === 'program_specific.energy_bill');
	assert.ok(energy);
	assert.deepEqual(energy.needed_for, ['Program B']);
});

// --- Branch 4: state overrides apply before merge --------------------------

test('CA override attaches divergence_note and CA labels are used', () => {
	const result = buildChecklist(['a', 'b'], 'CA', fixture);
	const identity = result.find((c) => c.category === 'identity');
	const photoId = identity!.items.find((i) => i.id === 'identity.photo_id');
	assert.ok(photoId);
	assert.equal(photoId.divergence_note, 'CA can accept a signed statement.');
	assert.deepEqual(photoId.needed_for, ['CA-A', 'CA-B']);
});

test('no override outside CA leaves divergence_note undefined', () => {
	const result = buildChecklist(['a', 'b'], 'XX', fixture);
	const identity = result.find((c) => c.category === 'identity');
	const photoId = identity!.items.find((i) => i.id === 'identity.photo_id');
	assert.equal(photoId!.divergence_note, undefined);
});

// --- Category ordering and status ordering ---------------------------------

test('categories come out in the fixed order', () => {
	const result = buildChecklist(['a', 'b'], 'XX', fixture);
	const order = result.map((c) => c.category);
	// Expected present: identity, income, residency, program_specific (no household here)
	assert.deepEqual(order, ['identity', 'income', 'residency', 'program_specific']);
});

// --- Negative case: unknown program key is ignored, empty -> [] -------------

test('unknown program keys are ignored and an empty selection yields []', () => {
	assert.deepEqual(buildChecklist([], 'CA', fixture), []);
	const result = buildChecklist(['does-not-exist'], 'CA', fixture);
	assert.deepEqual(result, []);
});

test('source data is never mutated by buildChecklist', () => {
	const before = JSON.stringify(fixture);
	buildChecklist(['a', 'b', 'c'], 'CA', fixture);
	assert.equal(JSON.stringify(fixture), before, 'fixture unchanged after build');
});
