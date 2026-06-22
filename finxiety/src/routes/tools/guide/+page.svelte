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

	const situations = [
		{
			id: 'benefits',
			label: "I'm trying to figure out what programs or assistance I might be able to get",
			tools: ['screener', 'document-checklist', 'recertification', 'myth-quiz']
		},
		{
			id: 'news',
			label: "I got some financial news — an unexpected bill, a job change, or a raise",
			tools: ['cliff-calculator', 'emergency-fund', 'work-hours']
		},
		{
			id: 'paycheck',
			label: "I want to understand my paycheck or what my taxes actually mean",
			tools: ['work-hours', 'tax-clarity']
		},
		{
			id: 'debt-savings',
			label: "I'm trying to get on top of debt, or start saving",
			tools: ['debt-growth', 'compound-interest', 'emergency-fund', 'savings-commitment']
		},
		{
			id: 'learning',
			label: "I just want to understand how money or benefits actually work",
			tools: ['myth-quiz', 'myth-quiz-2', 'tip-calculator', 'tax-clarity']
		}
	] as const;

	type SituationId = (typeof situations)[number]['id'];

	const toolMeta: Record<string, { question: string; desc: string; href: string; icon: string }> = {
		screener: {
			question: 'What programs might help you?',
			desc: "Food, health coverage, phone, energy, school meals — see which California programs you may qualify for.",
			href: '/tools/screener',
			icon: 'ShieldCheck',
		},
		'document-checklist': {
			question: 'What do you need to bring?',
			desc: "One de-duplicated list of documents across every program you're applying to.",
			href: '/tools/document-checklist',
			icon: 'ClipboardList',
		},
		recertification: {
			question: 'When does your renewal come up?',
			desc: "Calculate your renewal date and add a reminder to your own phone calendar — nothing is stored.",
			href: '/tools/recertification',
			icon: 'CalendarClock',
		},
		'myth-quiz': {
			question: "What's actually true about benefits?",
			desc: "Five things most people believe about benefits programs — and what the data shows.",
			href: '/tools/myth-quiz',
			icon: 'HelpCircle',
		},
		'cliff-calculator': {
			question: 'Got a raise — do you actually come out ahead?',
			desc: "See what a higher income does to your benefits.",
			href: '/tools/cliff-calculator',
			icon: 'TrendingUp',
		},
		'emergency-fund': {
			question: 'How many months of runway do you actually have?',
			desc: "Check your emergency fund against your real monthly costs.",
			href: '/tools/emergency-fund',
			icon: 'Umbrella',
		},
		'work-hours': {
			question: 'Where does each hour of work actually go?',
			desc: "See your pay broken down by taxes and take-home — in time, not just dollars.",
			href: '/tools/work-hours',
			icon: 'Clock',
		},
		'tax-clarity': {
			question: 'What does a deduction actually save you?',
			desc: "See the difference between a deduction, a credit, and what your refund really means.",
			href: '/tools/tax-clarity',
			icon: 'FileText',
		},
		'debt-growth': {
			question: 'Is your debt growing faster than your savings?',
			desc: "Compound interest runs in both directions. See them on the same chart.",
			href: '/tools/debt-growth',
			icon: 'TrendingDown',
		},
		'compound-interest': {
			question: 'How does a small amount grow over time?',
			desc: "See the split between what you put in and what interest added — at any horizon.",
			href: '/tools/compound-interest',
			icon: 'LineChart',
		},
		'savings-commitment': {
			question: 'Want to save more — what would actually make it happen?',
			desc: "Set one savings goal in your own words — the tool generates a calendar reminder.",
			href: '/tools/savings-commitment',
			icon: 'PiggyBank',
		},
		'myth-quiz-2': {
			question: 'How many money rules are actually true?',
			desc: "Ten things most people believe about taxes, credit, tipping, and compound interest.",
			href: '/tools/myth-quiz-2',
			icon: 'HelpCircle',
		},
		'tip-calculator': {
			question: 'What do servers in your state actually earn?',
			desc: "Split the check and see the wage context behind the tip screen.",
			href: '/tools/tip-calculator',
			icon: 'Receipt',
		}
	};

	let selected = $state<SituationId | null>(null);
	const matched = $derived(
		selected ? (situations.find((s) => s.id === selected)?.tools ?? []) : []
	);

	let resultsEl = $state<HTMLElement | null>(null);
	let cardEls: HTMLButtonElement[] = $state([]);

	$effect(() => {
		if (selected && resultsEl) {
			resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	});

	function select(id: SituationId) {
		selected = id;
	}

	function onKeydown(event: KeyboardEvent, index: number) {
		const key = event.key;
		if (key === 'ArrowDown' || key === 'ArrowRight') {
			event.preventDefault();
			const next = (index + 1) % situations.length;
			cardEls[next]?.focus();
		} else if (key === 'ArrowUp' || key === 'ArrowLeft') {
			event.preventDefault();
			const prev = (index - 1 + situations.length) % situations.length;
			cardEls[prev]?.focus();
		} else if (key === ' ' || key === 'Enter') {
			event.preventDefault();
			select(situations[index].id);
		}
	}
</script>

<svelte:head>
	<title>What's going on? | Finxiety</title>
	<meta
		name="description"
		content="Pick the situation that fits and we'll show you the Finxiety tools that match. Free. No account."
	/>
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/tools">← All tools</a>
</nav>

<h1 id="guide-q">What's going on?</h1>
<p class="subhead">Pick the situation that fits — we'll show you the tools that match.</p>
<p class="trust-line">Free. No account. Nothing stored.</p>

<div class="cards" role="radiogroup" aria-labelledby="guide-q">
	{#each situations as s, i (s.id)}
		<button
			type="button"
			role="radio"
			class="card"
			class:selected={selected === s.id}
			aria-checked={selected === s.id}
			tabindex={selected === s.id || (selected === null && i === 0) ? 0 : -1}
			bind:this={cardEls[i]}
			onclick={() => select(s.id)}
			onkeydown={(e) => onKeydown(e, i)}
		>
			{s.label}
		</button>
	{/each}
</div>

{#if selected}
	<section class="results" aria-live="polite" aria-label="Matched tools" bind:this={resultsEl}>
		{#each matched as toolId (toolId)}
			{@const tool = toolMeta[toolId]}
			{@const Icon = iconMap[tool.icon]}
			<a href={tool.href} class="tool-row">
				<span class="tool-icon" aria-hidden="true"><Icon size={22} /></span>
				<span class="tool-row-inner">
					<span class="tool-name">{tool.question}</span>
					<span class="tool-desc">{tool.desc}</span>
				</span>
				<span class="tool-arrow" aria-hidden="true">→</span>
			</a>
		{/each}
		<p class="fallback">Not quite right? <a href="/tools">See all tools →</a></p>
	</section>
{/if}

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
		margin-bottom: var(--space-xs);
	}

	.subhead {
		color: var(--ink-soft);
		font-size: 0.9375rem;
		line-height: 1.55;
		margin-bottom: var(--space-xs);
		max-width: 46ch;
	}

	.trust-line {
		font-size: 0.8125rem;
		color: var(--muted);
		margin-bottom: var(--space-lg);
	}

	.cards {
		display: flex;
		flex-direction: column;
	}

	.card {
		display: block;
		width: 100%;
		min-height: 48px;
		text-align: left;
		font-family: var(--font);
		font-size: 0.9375rem;
		line-height: 1.5;
		color: var(--ink);
		background: transparent;
		border: 1px solid var(--border);
		border-left: 3px solid var(--border);
		border-radius: var(--radius);
		padding: 16px;
		margin-bottom: 8px;
		cursor: pointer;
		transition:
			border-color 0.12s ease,
			background 0.12s ease;
	}

	.card:hover {
		border-color: var(--forest);
	}

	.card.selected {
		border-color: var(--forest);
		border-left-color: var(--forest);
		border-left-width: 5px;
		background: rgba(60, 74, 58, 0.06);
		font-weight: 600;
	}

	.card:focus-visible {
		outline: 3px solid var(--forest);
		outline-offset: 2px;
	}

	/* Results */
	.results {
		margin-top: var(--space-lg);
		animation: fade-in 150ms ease both;
	}

	.results:focus {
		outline: none;
	}

	@keyframes fade-in {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
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

	.tool-row:first-of-type {
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
		color: var(--muted);
		flex-shrink: 0;
		transition: transform 0.12s;
	}

	.fallback {
		margin-top: var(--space-md);
		font-size: 0.875rem;
		color: var(--ink-mute);
	}

	.fallback a {
		color: var(--forest);
		font-weight: 500;
		text-decoration: none;
		border-bottom: 1px solid rgba(60, 74, 58, 0.35);
		padding-bottom: 1px;
	}

	.fallback a:hover {
		border-bottom-color: var(--forest);
	}

	@media (prefers-reduced-motion: reduce) {
		.card,
		.tool-row,
		.tool-arrow {
			transition: none;
		}

		.results {
			animation: none;
		}
	}
</style>
