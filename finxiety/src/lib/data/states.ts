// TIP-1: Static state reference data.
//
// One Fair Wage map sourced from tip-one-fair-wage-2026.json (re-verify annually
// against https://onefairwage.site/). State-name map is static reference, not a
// threshold table, so it lives here rather than in a dated JSON file.
//
// No external API calls. All lookups are client-side and static.

import fairWageData from './tip-one-fair-wage-2026.json';

export const TIP_DATA_LAST_UPDATED = fairWageData.last_updated;
export const TIP_DATA_VERIFY_AT = fairWageData.verify_at;

const ONE_FAIR_WAGE: Record<string, boolean> = fairWageData.states;

// 50 states + DC. Order is alphabetical by full name for the selector.
export const STATE_NAMES: Record<string, string> = {
	AL: 'Alabama',
	AK: 'Alaska',
	AZ: 'Arizona',
	AR: 'Arkansas',
	CA: 'California',
	CO: 'Colorado',
	CT: 'Connecticut',
	DE: 'Delaware',
	DC: 'District of Columbia',
	FL: 'Florida',
	GA: 'Georgia',
	HI: 'Hawaii',
	ID: 'Idaho',
	IL: 'Illinois',
	IN: 'Indiana',
	IA: 'Iowa',
	KS: 'Kansas',
	KY: 'Kentucky',
	LA: 'Louisiana',
	ME: 'Maine',
	MD: 'Maryland',
	MA: 'Massachusetts',
	MI: 'Michigan',
	MN: 'Minnesota',
	MS: 'Mississippi',
	MO: 'Missouri',
	MT: 'Montana',
	NE: 'Nebraska',
	NV: 'Nevada',
	NH: 'New Hampshire',
	NJ: 'New Jersey',
	NM: 'New Mexico',
	NY: 'New York',
	NC: 'North Carolina',
	ND: 'North Dakota',
	OH: 'Ohio',
	OK: 'Oklahoma',
	OR: 'Oregon',
	PA: 'Pennsylvania',
	RI: 'Rhode Island',
	SC: 'South Carolina',
	SD: 'South Dakota',
	TN: 'Tennessee',
	TX: 'Texas',
	UT: 'Utah',
	VT: 'Vermont',
	VA: 'Virginia',
	WA: 'Washington',
	WV: 'West Virginia',
	WI: 'Wisconsin',
	WY: 'Wyoming'
};

// Selector options, sorted alphabetically by full state name.
export const STATE_OPTIONS: { code: string; name: string }[] = Object.entries(STATE_NAMES)
	.map(([code, name]) => ({ code, name }))
	.sort((a, b) => a.name.localeCompare(b.name));

// Resolve a 2-letter code to its full name. Returns '' for unknown / unselected.
export function stateName(code: string): string {
	return STATE_NAMES[code] ?? '';
}

// true = One Fair Wage state (server gets full minimum wage regardless of tips).
// false = tipped-wage state (default for any state not in the map).
export function isOneFairWage(code: string): boolean {
	return ONE_FAIR_WAGE[code] === true;
}
