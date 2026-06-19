<script lang="ts">
	import SearchBox from '$lib/components/SearchBox.svelte';
	import PromptChips from '$lib/components/PromptChips.svelte';
	import SearchResults from '$lib/components/SearchResults.svelte';
	import AllTools from '$lib/components/AllTools.svelte';
	import { searchToolsWithScore } from '$lib/search';
	import type { ToolDefinition } from '$lib/tools';

	let query = $state('');
	let hasSearched = $state(false);
	let results = $state<ToolDefinition[]>([]);
	let topScore = $state(1);
	let resultsEl = $state<HTMLElement | null>(null);

	function runSearch(q: string) {
		query = q;
		const scored = searchToolsWithScore(q);
		results = scored.map((r) => r.item);
		topScore = scored[0]?.score ?? 1;
		hasSearched = true;

		if (typeof window !== 'undefined' && (window as Window & { posthog?: { capture: (event: string, props: object) => void } }).posthog) {
			(window as Window & { posthog: { capture: (event: string, props: object) => void } }).posthog.capture('query_submitted', {
				query: q,
				result_count: results.length,
				top_result_id: results[0]?.id ?? null,
			});
		}

		setTimeout(() => resultsEl?.focus(), 50);
	}

	function handleSearch(q: string) {
		runSearch(q);
	}

	function handleChip(q: string) {
		runSearch(q);
	}
</script>

<svelte:head>
	<title>Finxiety — Free financial tools, one step at a time</title>
	<meta
		name="description"
		content="Type your situation and find the right free financial tool. No account. No sign-up. Nothing saved."
	/>
</svelte:head>

<section class="hero">
	<h1>What&rsquo;s going on with your money?</h1>

</section>

<section class="search-surface" aria-label="Search tools">
	<SearchBox bind:query onSearch={handleSearch} />
	<PromptChips onChip={handleChip} />

</section>

{#if hasSearched}
	<section
		class="results-surface"
		aria-live="polite"
		aria-label="Search results"
		tabindex="-1"
		bind:this={resultsEl}
	>
		<SearchResults {results} score0={topScore} />
	</section>
{/if}

<AllTools />

<style>
	.hero {
		padding-bottom: var(--space-lg);
	}

	.hero h1 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(2rem, 7vw, 2.75rem);
		line-height: 1.1;
		letter-spacing: -0.01em;
		margin-bottom: var(--space-sm);
	}

	.search-surface {
		margin-bottom: var(--space-lg);
	}

	.results-surface {
		margin-bottom: var(--space-lg);
		outline: none;
	}
</style>
