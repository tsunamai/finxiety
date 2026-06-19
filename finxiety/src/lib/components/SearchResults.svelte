<script lang="ts">
	import {
		ShieldCheck,
		CalendarClock,
		TrendingUp,
		Umbrella,
		LineChart,
		TrendingDown,
		PiggyBank,
		Receipt,
		FileText,
		ClipboardList,
		HelpCircle,
		Clock,
		Compass,
	} from '@lucide/svelte';
	import type { Component } from 'svelte';
	import type { ToolDefinition } from '$lib/tools';

	interface Props {
		results: ToolDefinition[];
		score0: number;
	}

	let { results, score0 }: Props = $props();

	const iconMap: Record<string, Component> = {
		ShieldCheck,
		CalendarClock,
		TrendingUp,
		Umbrella,
		LineChart,
		TrendingDown,
		PiggyBank,
		Receipt,
		FileText,
		ClipboardList,
		HelpCircle,
		Clock,
		Compass,
	};

	const isSingleHighConfidence = $derived(results.length === 1 && score0 < 0.15);
</script>

<div class="results" aria-label="Search results">
	{#if results.length === 0}
		<p class="no-results">
			We don&rsquo;t have a tool for that yet &mdash; <a href="/tools">See all tools &rarr;</a> might have something close.
		</p>
	{:else if isSingleHighConfidence}
		{@const tool = results[0]}
		{@const Icon = iconMap[tool.icon]}
		<div class="featured-result">
			<div class="featured-icon">
				<Icon size={28} />
			</div>
			<div class="featured-body">
				<h2 class="featured-question">{tool.question}</h2>
				<p class="featured-desc">{tool.description}</p>
				<a href={tool.route} class="featured-cta">Go to tool &rarr;</a>
			</div>
		</div>
	{:else}
		<ul class="result-list" role="list">
			{#each results as tool}
				{@const Icon = iconMap[tool.icon]}
				<li>
					<a href={tool.route} class="result-row">
						<span class="result-icon" aria-hidden="true">
							<Icon size={20} />
						</span>
						<span class="result-text">
							<span class="result-question">{tool.question}</span>
							<span class="result-desc">{tool.description}</span>
						</span>
						<span class="result-arrow" aria-hidden="true">&rarr;</span>
					</a>
				</li>
			{/each}
		</ul>
		<p class="results-footer"><a href="/tools">See all tools &rarr;</a></p>
	{/if}
</div>

<style>
	.results {
		animation: fade-in 150ms ease both;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.no-results {
		color: var(--ink-soft);
		font-size: 0.9375rem;
		padding: var(--space-md) 0;
	}

	.no-results a {
		color: var(--forest);
		font-weight: 500;
	}

	/* Featured (single high-confidence) result */
	.featured-result {
		display: flex;
		gap: var(--space-md);
		background: var(--paper-elevated);
		border: 1.5px solid var(--border);
		border-radius: 12px;
		padding: var(--space-md) var(--space-lg);
	}

	.featured-icon {
		color: var(--forest);
		flex-shrink: 0;
		margin-top: 2px;
	}

	.featured-question {
		font-size: 1.125rem;
		font-weight: 500;
		margin-bottom: 6px;
		line-height: 1.3;
	}

	.featured-desc {
		color: var(--ink-soft);
		font-size: 0.9375rem;
		line-height: 1.5;
		margin-bottom: var(--space-md);
	}

	.featured-cta {
		display: inline-block;
		background: var(--forest);
		color: var(--paper);
		font-family: var(--font);
		font-size: 0.9375rem;
		font-weight: 500;
		padding: 10px 20px;
		border-radius: var(--radius);
		text-decoration: none;
		transition: background 0.15s ease;
	}

	.featured-cta:hover {
		background: var(--pine-dark);
	}

	/* Multi-result list */
	.result-list {
		list-style: none;
	}

	.result-row {
		display: flex;
		align-items: flex-start;
		gap: 12px;
		padding: var(--space-sm) 0;
		border-bottom: 1px solid var(--border);
		text-decoration: none;
		color: inherit;
	}

	.result-list li:first-child .result-row {
		border-top: 1px solid var(--border);
	}

	.result-icon {
		color: var(--forest);
		flex-shrink: 0;
		margin-top: 2px;
	}

	.result-text {
		display: flex;
		flex-direction: column;
		gap: 3px;
		flex: 1;
	}

	.result-question {
		font-size: 1rem;
		font-weight: 500;
		color: var(--ink);
		transition: color 0.12s ease;
	}

	.result-row:hover .result-question {
		color: var(--forest);
	}

	.result-desc {
		font-size: 0.875rem;
		color: var(--ink-mute);
		line-height: 1.45;
	}

	.result-arrow {
		color: var(--ink-faint);
		flex-shrink: 0;
		margin-top: 2px;
		font-size: 1rem;
		transition: color 0.12s ease, transform 0.12s ease;
	}

	.result-row:hover .result-arrow {
		color: var(--forest);
		transform: translateX(3px);
	}

	.result-row:focus-visible {
		outline: 2px solid var(--forest);
		outline-offset: 3px;
		border-radius: 2px;
	}

	.results-footer {
		margin-top: var(--space-md);
		font-size: 0.9375rem;
	}

	.results-footer a {
		color: var(--forest);
		font-weight: 500;
		text-decoration: none;
		border-bottom: 1px solid rgba(60, 74, 58, 0.35);
		padding-bottom: 1px;
	}

	.results-footer a:hover {
		border-bottom-color: var(--forest);
	}

	@media (prefers-reduced-motion: reduce) {
		.results {
			animation: none;
		}

		.result-question,
		.result-arrow,
		.featured-cta {
			transition: none;
		}
	}
</style>
