<script lang="ts">
	import { tick } from 'svelte';
	import { calcRunway, type RunwayResult } from '$lib/calculators/emergency-fund';

	interface Rec {
		action: string;
		tactic: string;
		watchOut: string;
	}

	const branchConfig: Record<
		string,
		{ headline: string; question: string; options: { key: string; label: string }[] }
	> = {
		zero: {
			headline: 'This result often reflects monthly slack more than habit.',
			question: 'Do you have high-interest debt (credit cards, etc.)?',
			options: [
				{ key: 'yes', label: 'Yes' },
				{ key: 'no', label: 'No' }
			]
		},
		starting: {
			headline: "You've started building a cushion.",
			question: 'Is your income steady or variable?',
			options: [
				{ key: 'steady', label: 'Steady' },
				{ key: 'variable', label: 'Variable' }
			]
		},
		solid: {
			headline: "You're in a solid range.",
			question: 'Want to keep building this, or put extra to work elsewhere?',
			options: [
				{ key: 'keep', label: 'Keep building' },
				{ key: 'redirect', label: 'Redirect elsewhere' }
			]
		},
		excess: {
			headline: "You're well-covered.",
			question: 'Which feels more true to you right now?',
			options: [
				{ key: 'safety', label: 'Cash as a safety net' },
				{ key: 'growth', label: 'Concerned about inflation' }
			]
		}
	};

	const recommendations: Record<string, Record<string, Rec>> = {
		starting: {
			steady: {
				action:
					'Steady income means a recurring transfer can work reliably. With predictable paychecks, contributions to a separate savings account can happen in the background without requiring an ongoing decision. Many people in this range find the balance grows without much active attention once a recurring transfer is set up.',
				tactic:
					'Some banks allow auto-transfers to be scheduled for the same day as a paycheck. Even $25–50 per paycheck adds $650–$1,300 a year.',
				watchOut:
					"A growing cushion is only useful if it stays designated for actual emergencies. Treating it as accessible spending money defeats the purpose."
			},
			variable: {
				action:
					"Variable income makes a fixed recurring transfer tricky — the amount that works in a strong month can overdraft in a slow one. A percentage-based approach tends to fit better: a portion of whatever comes in, rather than a fixed dollar amount each period.",
				tactic:
					'Some banks and apps allow a percentage of each deposit to transfer automatically into a separate account. Even 3–5% of each payment scales down in slower months.',
				watchOut:
					'In slow months, the amount matters less than consistency. Even a small transfer in a slow period keeps the habit going and prevents the cushion from being raided.'
			}
		},
		solid: {
			keep: {
				action:
					"Three to six months is the widely-cited target range. If expenses are high or income is irregular, some people choose a larger cushion. Continuing at the same pace is a common choice — particularly if there's any chance of a significant expense in the next year.",
				tactic:
					"If a recurring transfer is already in place, the main question is whether the current amount and destination still fit. No change is required if the current pace feels right.",
				watchOut:
					"A cushion that keeps growing past a certain point may mean other priorities — high-rate debt, employer match contributions — are being deferred. There's usually a point where additional cash earns more elsewhere."
			},
			redirect: {
				action:
					'At 3–6 months of coverage, some people shift additional savings toward other goals: paying down higher-rate debt, contributing to a retirement account, or building toward a specific expense. The cushion is in place; redirecting the surplus is a common next step.',
				tactic:
					'One approach people use: changing where an existing recurring transfer goes — same amount, different destination. The savings habit stays in place; only the destination changes.',
				watchOut:
					'After redirecting savings, the emergency fund can erode below three months without it being obvious. A quick check once a year — or any time a significant emergency expense happens — helps keep it calibrated.'
			}
		},
		excess: {
			safety: {
				action:
					"Holding more cash than the typical three-to-six month range is a legitimate choice — particularly when income is unpredictable, a major expense is on the horizon, or the extra cushion provides meaningful peace of mind. That has real value.",
				tactic:
					"One option worth knowing: high-yield savings accounts (HYSAs) typically earn significantly more than standard savings accounts — same cash, same liquidity, better return. If the current account earns close to 0%, the same balance can earn more in a high-yield account with no change in access.",
				watchOut:
					'A large cash balance in a standard savings account earning close to 0% means purchasing power erodes over time. High-yield options with the same accessibility exist.'
			},
			growth: {
				action:
					"If there's more cash than is needed for security and purchasing-power loss is a concern, some people define a target floor — for example, three months' worth of expenses — keep that in liquid savings, and direct anything above it toward assets with higher expected returns. Both the floor and the destination are personal decisions.",
				tactic:
					"One approach people use: determine a target floor (monthly expenses × 3), confirm the current balance exceeds it, then decide where ongoing contributions above that floor should go.",
				watchOut:
					"Accessible cash and invested assets serve different purposes. The floor should be genuinely accessible — not in an account with penalties or lock-up periods — so it's available when something unexpected arrives."
			}
		}
	};

	// Focus management
	let branchHeadingEl: HTMLHeadingElement | null = $state(null);
	let recSectionEl: HTMLElement | null = $state(null);

	// Inputs — persisted across steps so back navigation restores the form
	let designated = $state('');
	let checking = $state('');
	let monthlyExpenses = $state('');

	let step = $state<1 | 2 | 3>(1);
	let result = $state<RunwayResult | null>(null);
	let toggleAnswer = $state<string | null>(null);
	let error = $state('');

	const branch = $derived(
		result
			? result.designatedMonths < 0.05
				? 'zero'
				: result.designatedMonths < 3
					? 'starting'
					: result.designatedMonths < 6
						? 'solid'
						: 'excess'
			: null
	);

	const config = $derived(branch ? branchConfig[branch] : null);

	const rec = $derived<Rec | null>(
		branch && toggleAnswer ? (recommendations[branch]?.[toggleAnswer] ?? null) : null
	);

	async function calculate(e: Event) {
		e.preventDefault();
		error = '';
		await tick(); // clear alert before re-setting so screen readers re-announce on repeat submits

		const m = parseFloat(monthlyExpenses);
		if (!monthlyExpenses || isNaN(m) || m <= 0) {
			error = 'Enter your monthly expenses to see your months covered.';
			return;
		}

		const d = Math.max(parseFloat(designated) || 0, 0);
		const c = Math.max(parseFloat(checking) || 0, 0);
		result = calcRunway(d, c, m);
		step = 2;
		await tick();
		branchHeadingEl?.focus();
	}

	async function selectToggle(answer: string) {
		toggleAnswer = answer;
		step = 3;
		await tick();
		recSectionEl?.focus();
	}

	function goBack() {
		if (step === 3) {
			// Return to step 2 with previous toggle selection still visible
			step = 2;
		} else {
			// Return to form; preserve input values, clear result
			result = null;
			error = '';
			step = 1;
		}
	}

	function startOver() {
		result = null;
		error = '';
		toggleAnswer = null;
		designated = '';
		checking = '';
		monthlyExpenses = '';
		step = 1;
	}
</script>

<svelte:head>
	<title>Emergency Fund Checker — Finxiety</title>
	<meta
		name="description"
		content="How many months of expenses can you cover? Enter three numbers and find out."
	/>
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>Emergency Fund Checker</h1>
<p class="tool-description">
	How many months of expenses can your savings actually cover? This tool shows you two numbers: what
	counts as a true emergency fund, and what your total picture looks like if you include checking.
</p>

<hr class="divider" />

{#key step}
	{#if step === 1}
		<form class="step" onsubmit={calculate} novalidate>
			<div class="field">
				<label for="designated">Designated emergency savings</label>
				<span class="field-hint" id="designated-hint">
					A savings account set aside only for emergencies. Enter $0 if you don't have one.
				</span>
				<div class="input-prefix-wrap">
					<span class="input-prefix" aria-hidden="true">$</span>
					<input
						id="designated"
						type="number"
						inputmode="decimal"
						min="0"
						placeholder="0"
						bind:value={designated}
						aria-describedby="designated-hint"
					/>
				</div>
			</div>

			<div class="field">
				<label for="checking">Checking / general savings</label>
				<span class="field-hint" id="checking-hint">
					Cash that's not specifically set aside for emergencies. Enter $0 if none.
				</span>
				<div class="input-prefix-wrap">
					<span class="input-prefix" aria-hidden="true">$</span>
					<input
						id="checking"
						type="number"
						inputmode="decimal"
						min="0"
						placeholder="0"
						bind:value={checking}
						aria-describedby="checking-hint"
					/>
				</div>
			</div>

			<div class="field">
				<label for="monthly-expenses">
					Monthly essential expenses <span class="required" aria-hidden="true">*</span>
				</label>
				<span class="field-hint" id="expenses-hint">
					Rent, utilities, groceries, insurance, and minimum debt payments.
				</span>
				<div class="input-prefix-wrap">
					<span class="input-prefix" aria-hidden="true">$</span>
					<input
						id="monthly-expenses"
						type="number"
						inputmode="decimal"
						min="1"
						placeholder="e.g. 2500"
						bind:value={monthlyExpenses}
						aria-describedby="expenses-hint"
						required
					/>
				</div>
			</div>

			{#if error}
				<p class="error-msg" role="alert">{error}</p>
			{/if}

			<button class="btn btn-primary" type="submit">Show my months covered</button>
		</form>

	{:else if step === 2 && result && config}
		<section class="step" aria-live="polite" aria-label="Your result">
			<div class="result-summary">
				<div class="result-summary-row">
					<span class="summary-label">Designated savings only</span>
					<span
						class="summary-months"
						class:summary-zero={result.designatedMonths < 0.05}
					>{result.designatedLabel}</span>
				</div>
				<div class="result-summary-row">
					<span class="summary-label">Including checking</span>
					<span class="summary-months">{result.combinedLabel}</span>
				</div>
			</div>

			<h2 class="branch-headline" bind:this={branchHeadingEl} tabindex="-1">{config.headline}</h2>

			{#if branch === 'zero'}
				<div class="bridge-box" role="note">
					<p>A near-zero result most often reflects tight monthly slack, not a missing habit. If you're not sure whether you qualify for food assistance, utility support, or other programs that could help, the <a href="/tools/screener">Benefits Screener</a> checks in about two minutes.</p>
				</div>
			{:else}
				<p class="branch-question">{config.question}</p>

				<div class="toggle-group" role="group" aria-label={config.question}>
					{#each config.options as opt}
						<button
							class="btn btn-toggle"
							class:selected={toggleAnswer === opt.key}
							aria-pressed={toggleAnswer === opt.key}
							onclick={() => selectToggle(opt.key)}
							type="button"
						>
							{opt.label}
						</button>
					{/each}
				</div>
			{/if}

			<button class="btn btn-ghost" onclick={goBack} type="button">← Back</button>
		</section>

	{:else if step === 3 && result && rec}
		<section class="step" aria-live="polite" aria-label="Next steps" bind:this={recSectionEl} tabindex="-1">
			<div class="result-summary">
				<div class="result-summary-row">
					<span class="summary-label">Designated savings only</span>
					<span
						class="summary-months"
						class:summary-zero={result.designatedMonths < 0.05}
					>{result.designatedLabel}</span>
				</div>
				<div class="result-summary-row">
					<span class="summary-label">Including checking</span>
					<span class="summary-months">{result.combinedLabel}</span>
				</div>
			</div>

			<div class="recommendation-body">
				<p>{rec.action}</p>
			</div>

			<div class="tactic-box" role="note">
				<p class="box-label">How people approach this</p>
				<p>{rec.tactic}</p>
			</div>

			<div class="watchout-box" role="note">
				<p class="box-label">Worth knowing</p>
				<p>{rec.watchOut}</p>
			</div>

			{#if branch === 'solid' || branch === 'excess'}
				<p class="able-note">
					If your income includes SSI or SSDI, savings above certain limits can affect your
					benefits. ABLE accounts (CalABLE in California) let eligible people save without it
					counting toward SSI's asset limit.
					<a href="https://www.calable.ca.gov" target="_blank" rel="noopener noreferrer"
						>Learn about CalABLE →</a
					>
				</p>
			{/if}

			<div class="step-actions">
				<button class="btn btn-ghost" onclick={goBack} type="button">← Back</button>
				<button class="btn btn-ghost" onclick={startOver} type="button">Start over</button>
			</div>
		</section>
	{/if}
{/key}

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.step {
		animation: fadeIn 0.2s ease;
	}

	.breadcrumb {
		margin-bottom: var(--space-lg);
		font-size: 0.875rem;
	}

	.breadcrumb a {
		color: var(--muted);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--terracotta);
	}

	.tool-description {
		margin-top: var(--space-sm);
		color: var(--muted);
		max-width: 52ch;
	}

	/* Dollar prefix on inputs */
	.input-prefix-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-prefix {
		position: absolute;
		left: 1rem;
		font-size: 1.125rem;
		color: var(--muted);
		pointer-events: none;
		user-select: none;
	}

	.input-prefix-wrap input {
		padding-left: 1.875rem;
	}

	.required {
		color: var(--terracotta);
	}

	/* Result summary (steps 2 and 3) */
	.result-summary {
		background: var(--surface);
		border-radius: var(--radius);
		padding: var(--space-md);
		margin-bottom: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.result-summary-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-sm);
	}

	.summary-label {
		font-size: 0.875rem;
		color: var(--muted);
	}

	.summary-months {
		font-size: 1rem;
		font-weight: 700;
		color: var(--dark);
		white-space: nowrap;
	}

	.summary-zero {
		font-weight: 400;
		color: var(--muted);
	}

	/* Step 2 — branch */
	.branch-headline {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--dark);
		margin-bottom: var(--space-sm);
	}

	.branch-question {
		font-size: 1rem;
		color: var(--text);
		margin-bottom: var(--space-md);
	}

	.toggle-group {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
		margin-bottom: var(--space-lg);
	}

	.btn-toggle {
		flex: 1;
		min-width: 120px;
		min-height: 48px;
		border: 2px solid var(--border);
		background: transparent;
		color: var(--text);
		border-radius: var(--radius);
		font-size: 0.9375rem;
		font-family: var(--font);
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s, color 0.15s;
		padding: var(--space-sm) var(--space-md);
	}

	.btn-toggle:hover {
		border-color: var(--terracotta);
	}

	.btn-toggle.selected {
		border-color: var(--terracotta);
		background: var(--terracotta);
		color: white;
	}

	/* Step 3 — recommendation */
	.recommendation-body {
		margin-bottom: var(--space-lg);
		font-size: 0.9375rem;
		line-height: 1.7;
		color: var(--text);
	}

	.tactic-box {
		background: var(--cream);
		border-left: 3px solid var(--terracotta);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		margin-bottom: var(--space-md);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text);
	}

	.watchout-box {
		background: var(--cream);
		border-left: 3px solid var(--olive);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		margin-bottom: var(--space-lg);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--muted);
	}

	.box-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: inherit;
		margin-bottom: var(--space-xs);
	}

	.bridge-box {
		background: var(--surface);
		border-left: 3px solid var(--border);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		margin-bottom: var(--space-lg);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--muted);
	}

	.bridge-box a {
		color: var(--terracotta);
	}

	.step-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-top: var(--space-md);
		border-top: 1px solid var(--border);
	}

	.branch-headline:focus-visible,
	section:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 3px;
		border-radius: 2px;
	}

	.able-note {
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.6;
		margin-bottom: var(--space-md);
	}

	.able-note a {
		color: var(--terracotta);
	}
</style>
