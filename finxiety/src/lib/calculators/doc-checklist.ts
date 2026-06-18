// DOC-1: Document Checklist de-duplication.
// Pure functions, no side effects, no Svelte imports.
//
// Given a set of programs and a state, merge each program's document
// requirements into ONE de-duplicated checklist. Documents shared across
// programs collapse into a single item that lists every program it covers.

export type DocumentStatus = 'required' | 'one_of' | 'conditional';

export type DocCategory = 'identity' | 'income' | 'residency' | 'household' | 'program_specific';

export interface DocItem {
	id: string;
	category: DocCategory;
	name: string;
	description: string;
	status: DocumentStatus;
	one_of_group: string | null;
	condition_note: string | null;
	accepts?: string[]; // for one_of items -- the acceptable document types
	divergence_note?: string; // inline note attached to this item in the merged output
}

export interface ProgramData {
	label: string;
	ca_label: string;
	official_url: string;
	ca_official_url: string;
	program_note?: string;
	requirements: DocItem[];
}

export interface StateOverrideItem {
	description?: string;
	divergence_note?: string;
}

export interface DocRequirements {
	last_updated: string;
	verify_at: Record<string, string>;
	programs: Record<string, ProgramData>;
	state_overrides: Record<string, Record<string, Record<string, StateOverrideItem>>>;
}

export interface MergedItem extends DocItem {
	needed_for: string[]; // resolved program labels (state-contextual)
	resolved_status: DocumentStatus; // strictest status wins
}

export interface ChecklistCategory {
	category: DocCategory;
	label: string;
	items: MergedItem[];
}

// Display order for the five document categories.
const CATEGORY_ORDER: DocCategory[] = [
	'identity',
	'income',
	'residency',
	'household',
	'program_specific'
];

const CATEGORY_LABELS: Record<DocCategory, string> = {
	identity: 'Identity',
	income: 'Income',
	residency: 'Residency',
	household: 'Household',
	program_specific: 'Program-specific'
};

// Status precedence: required (strictest) > one_of > conditional.
const STATUS_RANK: Record<DocumentStatus, number> = {
	required: 3,
	one_of: 2,
	conditional: 1
};

function stricterStatus(a: DocumentStatus, b: DocumentStatus): DocumentStatus {
	return STATUS_RANK[a] >= STATUS_RANK[b] ? a : b;
}

// Resolve a program's display label for the given state.
export function programLabel(program: ProgramData, state: string): string {
	return state === 'CA' ? program.ca_label : program.label;
}

// Resolve a program's official application/verify URL for the given state.
export function programUrl(program: ProgramData, state: string): string {
	return state === 'CA' ? program.ca_official_url : program.official_url;
}

// Apply state-specific overrides to a copied item. May add/replace a
// divergence_note or modify the description. Returns a NEW object; never
// mutates the source data.
function applyOverride(item: DocItem, override: StateOverrideItem | undefined): DocItem {
	if (!override) return { ...item };
	const next: DocItem = { ...item };
	if (override.description !== undefined) next.description = override.description;
	if (override.divergence_note !== undefined) next.divergence_note = override.divergence_note;
	return next;
}

// Intersection of two accepts lists, preserving the order of the first.
function intersectAccepts(a: string[] | undefined, b: string[] | undefined): string[] {
	const first = a ?? [];
	const second = new Set(b ?? []);
	return first.filter((x) => second.has(x));
}

/**
 * Build a single de-duplicated checklist for the selected programs and state.
 *
 * De-duplication rules:
 *  1. Keyed on `id`. Same id across programs merges into one item.
 *     `needed_for` lists every program. `resolved_status` is the strictest.
 *  2. `one_of` items in the same `one_of_group` merge their `accepts` arrays by
 *     intersection (documents ALL programs accept). Empty intersection -> do NOT
 *     merge; surface each program's group separately with its own needed_for tag.
 *  3. Unique-id (program-specific) items pass through with their program tag.
 *  4. State overrides are applied to each program's items BEFORE the merge.
 */
export function buildChecklist(
	programs: string[],
	state: string,
	data: DocRequirements
): ChecklistCategory[] {
	const stateOverrides = data.state_overrides[state] ?? {};

	// Merge by id. Insertion order is preserved by Map.
	const byId = new Map<string, MergedItem>();

	for (const programKey of programs) {
		const program = data.programs[programKey];
		if (!program) continue;
		const label = programLabel(program, state);
		const programOverrides = stateOverrides[programKey] ?? {};

		for (const raw of program.requirements) {
			const item = applyOverride(raw, programOverrides[raw.id]);
			const existing = byId.get(item.id);

			if (!existing) {
				byId.set(item.id, {
					...item,
					needed_for: [label],
					resolved_status: item.status
				});
				continue;
			}

			// Same id seen in an earlier program -- merge.
			if (!existing.needed_for.includes(label)) existing.needed_for.push(label);
			existing.resolved_status = stricterStatus(existing.resolved_status, item.status);

			// For one_of items, the accepts set narrows to the intersection.
			if (item.status === 'one_of' && existing.status === 'one_of') {
				const merged = intersectAccepts(existing.accepts, item.accepts);
				if (merged.length > 0) {
					existing.accepts = merged;
				} else {
					// Empty intersection: rule 2 -- do not merge. Roll back this
					// program from the shared item and surface it separately.
					existing.needed_for = existing.needed_for.filter((l) => l !== label);
					const separateKey = `${item.id}::${programKey}`;
					byId.set(separateKey, {
						...item,
						needed_for: [label],
						resolved_status: item.status
					});
				}
			}

			// A later program may carry a divergence_note the first did not.
			if (item.divergence_note && !existing.divergence_note) {
				existing.divergence_note = item.divergence_note;
			}
		}
	}

	// Group into categories.
	const grouped = new Map<DocCategory, MergedItem[]>();
	for (const item of byId.values()) {
		const list = grouped.get(item.category) ?? [];
		list.push(item);
		grouped.set(item.category, list);
	}

	// Within each category: required first, then one_of, then conditional.
	// Items with equal status keep their insertion order (stable sort).
	const result: ChecklistCategory[] = [];
	for (const category of CATEGORY_ORDER) {
		const items = grouped.get(category);
		if (!items || items.length === 0) continue;
		const sorted = items
			.map((item, index) => ({ item, index }))
			.sort((a, b) => {
				const rank = STATUS_RANK[b.item.resolved_status] - STATUS_RANK[a.item.resolved_status];
				return rank !== 0 ? rank : a.index - b.index;
			})
			.map((entry) => entry.item);
		result.push({ category, label: CATEGORY_LABELS[category], items: sorted });
	}

	return result;
}
