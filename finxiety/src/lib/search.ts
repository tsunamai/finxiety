import Fuse from 'fuse.js';
import { tools, type ToolDefinition } from './tools';

const searchableTools = tools.filter((t) => t.id !== 'guide');

const fuse = new Fuse(searchableTools, {
	keys: [
		{ name: 'keywords', weight: 0.5 },
		{ name: 'description', weight: 0.35 },
		{ name: 'question', weight: 0.15 },
	],
	threshold: 0.45,
	minMatchCharLength: 3,
	ignoreLocation: true,
	includeScore: true,
	shouldSort: true,
});

export function searchToolsWithScore(
	query: string
): Array<{ item: ToolDefinition; score: number }> {
	if (!query || query.trim().length < 3) return [];

	const q = query.trim();

	// Full-query search (good for phrase-level keyword matches)
	const fullResults = fuse.search(q);

	// Per-token search (fixes short keywords like "raise", "paycheck", "taxes"
	// that score poorly when the full query is 40+ chars)
	const tokens = q
		.toLowerCase()
		.split(/\s+/)
		.map((w) => w.replace(/[^a-z']/gi, ''))
		.filter((w) => w.length >= 3);

	const tokenResults = tokens.flatMap((token) => fuse.search(token));

	// Keep the best (lowest) score per tool across all search variants
	const best = new Map<string, { item: ToolDefinition; score: number }>();
	for (const r of [...fullResults, ...tokenResults]) {
		const s = r.score ?? 1;
		const existing = best.get(r.item.id);
		if (!existing || s < existing.score) {
			best.set(r.item.id, { item: r.item, score: s });
		}
	}

	return Array.from(best.values())
		.sort((a, b) => a.score - b.score)
		.slice(0, 5);
}

export function searchTools(query: string): ToolDefinition[] {
	return searchToolsWithScore(query).map((r) => r.item);
}
