<script lang="ts">
	import { calcRunway, type RunwayResult } from '$lib/calculators/emergency-fund';

	let designated = $state('');
	let checking = $state('');
	let monthlyExpenses = $state('');
	let result = $state<RunwayResult | null>(null);
	let error = $state('');

	const maxBarMonths = $derived(result ? Math.max(result.combinedMonths, 3) * 1.25 : 6);

	const designatedPct = $derived(
		result ? Math.min((result.designatedMonths / maxBarMonths) * 100, 100) : 0
	);

	const combinedPct = $derived(
		result ? Math.min((result.combinedMonths / maxBarMonths) * 100, 100) : 0
	);

	function calculate(e: Event) {
		e.preventDefault();
		error = '';

		const m = parseFloat(monthlyExpenses);
		if (!monthlyExpenses || isNaN(m) || m <= 0) {
			error = 'Enter your monthly expenses to calculate runway.';
			return;
		}

		const d = Math.max(parseFloat(designated) || 0, 0);
		const c = Math.max(parseFloat(checking) || 0, 0);
		result = calcRunway(d, c, m);
	}

	function reset() {
		result = null;
		designated = '';
		checking = '';
		monthlyExpenses = '';
		error = '';
	}
</script>

<svelte:head>
	<title>Emergency Fund Checker — Finxiety</title>
	<meta name="description" content="How many months of runway do you actually have? Enter three numbers and find out." />
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>Emergency Fund Checker</h1>
<p class="tool-description">
	How many months of expenses can you cover without income? This tool shows you two numbers: what
	counts as a true emergency fund, and what your total picture looks like if you include checking.
</p>

<hr class="divider" />

{#if result}
	<section class="results" aria-live="polite" aria-label="Results">
		<h2>Your runway</h2>
		<p class="results-note">Based on the numbers you entered.</p>

		<div class="runway-rows">
			<div class="runway-row">
				<div class="runway-label">
					<span class="runway-type">Designated savings only</span>
					<span class="runway-months">{result.designatedLabel}</span>
				</div>
				<div class="runway-bar-track" aria-hidden="true">
					<div class="runway-bar bar-designated" style="width: {designatedPct}%"></div>
				</div>
			</div>

			<div class="runway-row">
				<div class="runway-label">
					<span class="runway-type">Including checking</span>
					<span class="runway-months">{result.combinedLabel}</span>
				</div>
				<div class="runway-bar-track" aria-hidden="true">
					<div class="runway-bar bar-combined" style="width: {combinedPct}%"></div>
				</div>
			</div>
		</div>

		<div class="context-note" role="note">
			<p>
				Checking balances tend to cover the next irregular expense before you can use them as a
				safety net — car repair, medical bill, something that breaks without warning. Designating a
				separate savings account is what changes that. Your designated funds are what financial
				guidance usually means when it says <em>emergency fund</em>.
			</p>
		</div>

		<button class="btn btn-ghost" onclick={reset} type="button"> ← Recalculate </button>
	</section>
{:else}
	<form onsubmit={calculate} novalidate>
		<div class="field">
			<label for="designated">
				Designated emergency savings
			</label>
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
			<label for="checking">
				Checking / general savings
			</label>
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

		<button class="btn btn-primary" type="submit"> Calculate my runway </button>
	</form>
{/if}

<style>
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

	/* Results */
	.results h2 {
		margin-bottom: var(--space-xs);
	}

	.results-note {
		font-size: 0.875rem;
		color: var(--muted);
		margin-bottom: var(--space-lg);
	}

	.runway-rows {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		margin-bottom: var(--space-lg);
	}

	.runway-row {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.runway-label {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-sm);
	}

	.runway-type {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--text);
	}

	.runway-months {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--dark);
		white-space: nowrap;
	}

	.runway-bar-track {
		height: 12px;
		background: var(--surface);
		border-radius: 6px;
		overflow: hidden;
	}

	.runway-bar {
		height: 100%;
		border-radius: 6px;
		transition: width 0.4s ease;
	}

	.bar-designated {
		background: var(--terracotta);
	}

	.bar-combined {
		background: var(--olive);
	}

	.context-note {
		background: var(--surface);
		border-left: 3px solid var(--border);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		margin-bottom: var(--space-lg);
		font-size: 0.9375rem;
		color: var(--muted);
		line-height: 1.6;
	}
</style>
