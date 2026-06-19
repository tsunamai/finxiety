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
	} from '@lucide/svelte';
	import type { Component } from 'svelte';
	import { benefitsTools, clarityTools } from '$lib/tools';

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
	};
</script>

<details class="all-tools">
	<summary class="all-tools-summary">See all tools ({benefitsTools.length + clarityTools.length})</summary>

	<div class="all-tools-body">
		<p class="group-label">If you need help right now</p>
		<div class="tool-grid">
			{#each benefitsTools as tool}
				{@const Icon = iconMap[tool.icon]}
				<a href={tool.route} class="tool-cell">
					<span class="cell-icon" aria-hidden="true">
						<Icon size={22} />
					</span>
					<span class="cell-question">{tool.question}</span>
				</a>
			{/each}
		</div>

		<p class="group-label">Get a clearer picture</p>
		<div class="tool-grid">
			{#each clarityTools as tool}
				{@const Icon = iconMap[tool.icon]}
				<a href={tool.route} class="tool-cell">
					<span class="cell-icon" aria-hidden="true">
						<Icon size={22} />
					</span>
					<span class="cell-question">{tool.question}</span>
				</a>
			{/each}
		</div>
	</div>
</details>

<style>
	.all-tools {
		border-top: 1px solid var(--border);
		padding-top: var(--space-md);
		margin-top: var(--space-lg);
	}

	.all-tools-summary {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--forest);
		cursor: pointer;
		list-style: none;
		display: flex;
		align-items: center;
		gap: 6px;
		user-select: none;
	}

	.all-tools-summary::-webkit-details-marker {
		display: none;
	}

	.all-tools-summary::before {
		content: '›';
		font-size: 1.25rem;
		line-height: 1;
		transition: transform 0.15s ease;
		display: inline-block;
		color: var(--forest);
	}

	.all-tools[open] .all-tools-summary::before {
		transform: rotate(90deg);
	}

	.all-tools-summary:focus-visible {
		outline: 2px solid var(--forest);
		outline-offset: 3px;
		border-radius: 2px;
	}

	.all-tools-body {
		padding-top: var(--space-md);
	}

	.group-label {
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--ink-mute);
		text-transform: uppercase;
		letter-spacing: 0.04em;
		margin-bottom: var(--space-sm);
		margin-top: var(--space-md);
	}

	.all-tools-body .group-label:first-child {
		margin-top: 0;
	}

	.tool-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 8px;
		margin-bottom: var(--space-sm);
	}

	@media (max-width: 400px) {
		.tool-grid {
			grid-template-columns: 1fr;
		}
	}

	.tool-cell {
		display: flex;
		align-items: flex-start;
		gap: 10px;
		padding: 10px 12px;
		background: var(--paper-elevated);
		border: 1px solid var(--border);
		border-radius: 8px;
		text-decoration: none;
		color: inherit;
		transition: border-color 0.12s ease;
	}

	.tool-cell:hover {
		border-color: var(--forest);
	}

	.tool-cell:focus-visible {
		outline: 2px solid var(--forest);
		outline-offset: 2px;
	}

	.cell-icon {
		color: var(--forest);
		flex-shrink: 0;
		margin-top: 1px;
	}

	.cell-question {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--ink);
		line-height: 1.35;
	}

	@media (prefers-reduced-motion: reduce) {
		.all-tools-summary::before,
		.tool-cell {
			transition: none;
		}
	}
</style>
