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
	import { tools } from '$lib/tools';

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

	const byId = Object.fromEntries(tools.map((t) => [t.id, t]));

	const helpNow = [
		'screener',
		'recertification',
		'cliff-calculator',
		'document-checklist',
		'emergency-fund',
		'myth-quiz',
	].map((id) => byId[id]);

	const clarity = [
		'tax-clarity',
		'compound-interest',
		'debt-growth',
		'work-hours',
		'savings-commitment',
		'myth-quiz-2',
	].map((id) => byId[id]);
</script>

<svelte:head>
	<title>All tools | Finxiety</title>
	<meta
		name="description"
		content="All Finxiety tools — benefits help, tax clarity, debt, savings, and more. Free. No account."
	/>
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>All tools</h1>

<section class="group" aria-labelledby="group-1-title">
	<h2 id="group-1-title">If you need help right now</h2>
	<p class="group-desc">Benefits, deadlines, and decisions with a time pressure on them.</p>

	<nav aria-label="Immediate help tools">
		{#each helpNow as tool}
			{@const Icon = iconMap[tool.icon]}
			<a href={tool.route} class="tool-row">
				<span class="tool-icon" aria-hidden="true"><Icon size={22} /></span>
				<span class="tool-row-inner">
					<span class="tool-name">{tool.question}</span>
					<span class="tool-desc">{tool.description}</span>
				</span>
				<span class="tool-arrow" aria-hidden="true">→</span>
			</a>
		{/each}
	</nav>
</section>

<section class="group" aria-labelledby="group-2-title">
	<h2 id="group-2-title">Get a clearer picture</h2>
	<p class="group-desc">Financial math and money rules, without the jargon.</p>

	<nav aria-label="Financial clarity tools">
		{#each clarity as tool}
			{@const Icon = iconMap[tool.icon]}
			<a href={tool.route} class="tool-row">
				<span class="tool-icon" aria-hidden="true"><Icon size={22} /></span>
				<span class="tool-row-inner">
					<span class="tool-name">{tool.question}</span>
					<span class="tool-desc">{tool.description}</span>
				</span>
				<span class="tool-arrow" aria-hidden="true">→</span>
			</a>
		{/each}
	</nav>
</section>

<style>
	.breadcrumb {
		margin-bottom: var(--space-md);
		font-size: 0.875rem;
	}

	.breadcrumb a {
		color: var(--muted);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--pine);
	}

	h1 {
		margin-bottom: var(--space-lg);
	}

	.group {
		margin-bottom: var(--space-xl);
	}

	.group h2 {
		margin-bottom: var(--space-xs);
	}

	.group-desc {
		font-size: 0.9375rem;
		color: var(--muted);
		margin-bottom: var(--space-md);
	}

	nav {
		display: flex;
		flex-direction: column;
	}

	.tool-row {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-sm) 0;
		border-bottom: 1px solid var(--border);
		text-decoration: none;
		color: inherit;
		transition: color 0.12s;
	}

	.tool-row:first-child {
		border-top: 1px solid var(--border);
	}

	.tool-row:hover {
		color: var(--pine);
	}

	.tool-row:hover .tool-arrow {
		transform: translateX(3px);
	}

	.tool-row:focus-visible {
		outline: 3px solid var(--pine);
		outline-offset: 2px;
		border-radius: 2px;
	}

	.tool-icon {
		color: var(--forest);
		flex-shrink: 0;
		margin-top: 1px;
	}

	.tool-row-inner {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.tool-name {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--ink);
	}

	.tool-row:hover .tool-name {
		color: var(--pine);
	}

	.tool-desc {
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.45;
	}

	.tool-arrow {
		font-size: 1.125rem;
		color: var(--sage);
		flex-shrink: 0;
		transition: transform 0.12s;
	}

	@media (prefers-reduced-motion: reduce) {
		.tool-row,
		.tool-arrow {
			transition: none;
		}
	}
</style>
