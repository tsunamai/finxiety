<script lang="ts">
	import { tick } from 'svelte';
	import { computeDebtGrowth, type DebtGrowthPoint } from '$lib/calculators/debt-growth';

	// Historical S&P 500 long-run average, used as the default return assumption.
	const SP500_SOURCE =
		'https://www.officialdata.org/us/stocks/s-p-500/1957';
	const INVESTOR_GOV_COMPOUND =
		'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator';

	const HORIZONS = [5, 10, 20, 30] as const;

	// --- Form state (strings so empty fields stay empty, not 0) ---
	let debtBalanceStr = $state('');
	let aprStr = $state('24');
	let monthlyPaymentStr = $state('0');
	let investmentStr = $state('');
	let returnStr = $state('7');
	let years = $state<(typeof HORIZONS)[number]>(10);

	// Whether the user has hand-edited the investment field. Until they do, it
	// mirrors the debt balance (the tool's framing: "the same amount invested").
	let investmentTouched = $state(false);

	// Results state
	let submitted = $state(false);
	let chartData: DebtGrowthPoint[] = $state([]);
	let resultHeadingEl: HTMLHeadingElement | null = $state(null);

	const debtBalance = $derived(Number(debtBalanceStr) || 0);
	const apr = $derived(Number(aprStr) || 0);
	const monthlyPayment = $derived(Number(monthlyPaymentStr) || 0);
	const annualReturn = $derived(Number(returnStr) || 0);

	// Effective investment amount: mirrors the debt balance until the user edits it.
	const effectiveInvestment = $derived(
		investmentTouched ? Number(investmentStr) || 0 : debtBalance
	);

	// The investment field shows the mirrored value until it's been touched.
	const investmentDisplay = $derived(
		investmentTouched ? investmentStr : debtBalanceStr
	);

	function onInvestmentInput(e: Event) {
		investmentTouched = true;
		investmentStr = (e.currentTarget as HTMLInputElement).value;
	}

	const canSubmit = $derived(
		debtBalanceStr !== '' && debtBalance > 0 && effectiveInvestment > 0
	);

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!canSubmit) return;
		chartData = computeDebtGrowth(
			debtBalance,
			apr,
			monthlyPayment,
			effectiveInvestment,
			annualReturn,
			years
		);
		submitted = true;
		await tick();
		resultHeadingEl?.focus();
	}

	// --- Derived end-of-horizon figures ---
	const lastPoint = $derived(
		chartData.length > 0 ? chartData[chartData.length - 1] : null
	);
	const debtEnd = $derived(lastPoint ? lastPoint.debtBalance : 0);
	const investmentEnd = $derived(lastPoint ? lastPoint.investmentBalance : 0);
	const difference = $derived(investmentEnd - debtEnd);
	// Whether the debt was left untouched (no payment) — changes the callout framing.
	const debtUntouched = $derived(monthlyPayment <= 0);
	const debtPaidOff = $derived(submitted && debtEnd === 0);

	// --- SVG chart helpers (same pattern as CLIFF-1) ---
	const PAD_L = 58;
	const PAD_R = 20;
	const PAD_T = 16;
	const PAD_B = 44;
	const VB_W = 640;
	const VB_H = 240;
	const CHART_W = VB_W - PAD_L - PAD_R; // 562
	const CHART_H = VB_H - PAD_T - PAD_B; // 180

	const totalMonths = $derived(years * 12);

	function mapX(month: number): number {
		if (totalMonths === 0) return PAD_L;
		return PAD_L + (month / totalMonths) * CHART_W;
	}

	function mapY(balance: number, maxBalance: number): number {
		if (maxBalance === 0) return PAD_T + CHART_H;
		return PAD_T + CHART_H - (balance / maxBalance) * CHART_H;
	}

	// Shared Y scale across both curves, with 5% headroom.
	const maxBalance = $derived(
		chartData.length > 0
			? Math.max(
					...chartData.map((p) => p.debtBalance),
					...chartData.map((p) => p.investmentBalance)
				) * 1.05
			: 0
	);

	const debtPolyline = $derived.by(() => {
		if (chartData.length === 0) return '';
		return chartData
			.map((p) => `${mapX(p.month).toFixed(1)},${mapY(p.debtBalance, maxBalance).toFixed(1)}`)
			.join(' ');
	});

	const investmentPolyline = $derived.by(() => {
		if (chartData.length === 0) return '';
		return chartData
			.map(
				(p) =>
					`${mapX(p.month).toFixed(1)},${mapY(p.investmentBalance, maxBalance).toFixed(1)}`
			)
			.join(' ');
	});

	// X-axis ticks every 5 years (in months).
	const xTicks = $derived.by(() => {
		const ticks: { month: number; label: string }[] = [];
		for (let y = 5; y <= years; y += 5) {
			ticks.push({ month: y * 12, label: `${y}y` });
		}
		return ticks;
	});

	// Y-axis ticks: 3-4 round increments.
	const yTicks = $derived.by(() => {
		if (maxBalance === 0) return [];
		const magnitude = Math.pow(10, Math.floor(Math.log10(maxBalance)));
		const step = Math.ceil(maxBalance / (4 * magnitude)) * magnitude;
		const ticks: number[] = [];
		for (let v = step; v < maxBalance; v += step) {
			ticks.push(v);
		}
		return ticks;
	});

	function fmtK(n: number): string {
		if (n >= 1000) return '$' + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
		return '$' + Math.round(n);
	}

	function fmtDollars(n: number): string {
		return '$' + Math.round(n).toLocaleString('en-US');
	}
</script>

<svelte:head>
	<title>Debt vs. Growth Visualizer | Finxiety</title>
	<meta
		name="description"
		content="See compound interest run in both directions: a debt balance growing against you, and the same amount invested growing for you, on one chart. Free, nothing saved."
	/>
</svelte:head>

<div class="sr-only" aria-live="polite" aria-atomic="true">
	{#if submitted}
		Your debt and growth comparison is ready below.
	{/if}
</div>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>Debt vs. Growth Visualizer</h1>
<p class="tool-description">
	Compound interest is usually explained as a savings superpower. It runs the same way on debt —
	the same exponential curve, pointed the other direction. This puts both on one chart so you can
	see them side by side.
</p>

<hr class="divider" />

<form class="debt-form" onsubmit={handleSubmit} novalidate>
	<div class="form-grid">
		<div class="field">
			<label for="debt-balance">Debt balance</label>
			<p class="field-hint" id="debt-balance-hint">What you currently owe, for example a credit card balance.</p>
			<div class="input-prefix-wrap">
				<span class="input-prefix" aria-hidden="true">$</span>
				<input
					id="debt-balance"
					type="number"
					inputmode="decimal"
					min="0"
					step="any"
					bind:value={debtBalanceStr}
					placeholder="5000"
					aria-describedby="debt-balance-hint"
				/>
			</div>
		</div>

		<div class="field">
			<label for="apr">APR (annual interest rate)</label>
			<p class="field-hint" id="apr-hint">The rate on the debt. Credit cards often run 20–29%.</p>
			<div class="input-suffix-wrap">
				<input
					id="apr"
					type="number"
					inputmode="decimal"
					min="0"
					step="any"
					bind:value={aprStr}
					placeholder="24"
					aria-describedby="apr-hint"
				/>
				<span class="input-suffix" aria-hidden="true">%</span>
			</div>
		</div>

		<div class="field">
			<label for="monthly-payment">Monthly payment toward the debt</label>
			<p class="field-hint" id="payment-hint">Leave at 0 to see what happens if the debt sits untouched.</p>
			<div class="input-prefix-wrap">
				<span class="input-prefix" aria-hidden="true">$</span>
				<input
					id="monthly-payment"
					type="number"
					inputmode="decimal"
					min="0"
					step="any"
					bind:value={monthlyPaymentStr}
					placeholder="0"
					aria-describedby="payment-hint"
				/>
			</div>
		</div>

		<div class="field">
			<label for="investment">Same amount invested</label>
			<p class="field-hint" id="investment-hint">Mirrors your debt balance by default. Edit it to compare a different amount.</p>
			<div class="input-prefix-wrap">
				<span class="input-prefix" aria-hidden="true">$</span>
				<input
					id="investment"
					type="number"
					inputmode="decimal"
					min="0"
					step="any"
					value={investmentDisplay}
					oninput={onInvestmentInput}
					placeholder="5000"
					aria-describedby="investment-hint"
				/>
			</div>
		</div>

		<div class="field">
			<label for="return">Expected annual return</label>
			<p class="field-hint" id="return-hint">Historical S&P 500 average is about 7% after inflation.</p>
			<div class="input-suffix-wrap">
				<input
					id="return"
					type="number"
					inputmode="decimal"
					min="0"
					step="any"
					bind:value={returnStr}
					placeholder="7"
					aria-describedby="return-hint"
				/>
				<span class="input-suffix" aria-hidden="true">%</span>
			</div>
		</div>

		<div class="field">
			<span class="group-label" id="horizon-label">Time horizon</span>
			<div class="segmented" role="radiogroup" aria-labelledby="horizon-label">
				{#each HORIZONS as h}
					<button
						type="button"
						class="btn btn-toggle"
						class:selected={years === h}
						role="radio"
						aria-checked={years === h}
						onclick={() => (years = h)}
					>
						{h} yr
					</button>
				{/each}
			</div>
		</div>
	</div>

	<button class="btn btn-primary" type="submit" disabled={!canSubmit}>Show me both curves</button>
	{#if !canSubmit}
		<p class="field-hint submit-hint" aria-live="polite">
			Enter a debt balance and an amount to invest to continue.
		</p>
	{/if}
</form>

{#if submitted && lastPoint}
	<section class="results" aria-label="Debt versus growth comparison">
		<h2 bind:this={resultHeadingEl} tabindex="-1">
			Over {years} years
		</h2>
		<p class="results-note">
			These are estimates based on the rates you entered, compounded monthly. Real debt and real
			investments vary. The point is the shape of the two curves, not an exact dollar prediction.
		</p>

		<!-- Chart -->
		<div class="chart-section">
			<div class="chart-wrap" aria-hidden="true">
				<svg
					viewBox="0 0 {VB_W} {VB_H}"
					width="100%"
					role="img"
					aria-label="Line chart comparing a debt balance and an investment balance over time, both following compound-interest curves"
				>
					<!-- Y-axis grid lines and labels -->
					{#each yTicks as tick}
						{@const y = mapY(tick, maxBalance)}
						<line x1={PAD_L} y1={y} x2={VB_W - PAD_R} y2={y} class="grid-line" />
						<text x={PAD_L - 6} y={y + 4} class="axis-label" text-anchor="end">{fmtK(tick)}</text>
					{/each}

					<!-- X-axis labels -->
					{#each xTicks as tick}
						{@const x = mapX(tick.month)}
						<line x1={x} y1={PAD_T + CHART_H} x2={x} y2={PAD_T + CHART_H + 4} class="axis-tick" />
						<text x={x} y={PAD_T + CHART_H + 16} class="axis-label" text-anchor="middle">{tick.label}</text>
					{/each}

					<!-- X-axis baseline -->
					<line
						x1={PAD_L}
						y1={PAD_T + CHART_H}
						x2={VB_W - PAD_R}
						y2={PAD_T + CHART_H}
						class="axis-line"
					/>

					<!-- Investment curve (cooler color) -->
					{#if investmentPolyline}
						<polyline points={investmentPolyline} class="line-investment" />
					{/if}

					<!-- Debt curve (warmer color) -->
					{#if debtPolyline}
						<polyline points={debtPolyline} class="line-debt" />
					{/if}
				</svg>
			</div>

			<!-- Legend -->
			<ul class="legend">
				<li class="legend-item">
					<span class="legend-swatch swatch-debt" aria-hidden="true"></span>
					Debt balance
				</li>
				<li class="legend-item">
					<span class="legend-swatch swatch-investment" aria-hidden="true"></span>
					Same amount invested
				</li>
			</ul>
		</div>

		<!-- Callout -->
		<div class="callout" role="note">
			{#if debtPaidOff}
				<p>
					At {fmtDollars(monthlyPayment)}/month, this debt is paid off before {years} years are up —
					the curve reaches $0. Meanwhile {fmtDollars(effectiveInvestment)} invested at the same
					math could grow to about <strong>{fmtDollars(investmentEnd)}</strong>. Compound interest
					runs in both directions; here, paying the debt down stops it from running against you.
				</p>
			{:else if debtUntouched}
				<p>
					Left untouched, in {years} years this debt could grow to about
					<strong>{fmtDollars(debtEnd)}</strong>. {fmtDollars(effectiveInvestment)} invested at the
					same math could grow to about <strong>{fmtDollars(investmentEnd)}</strong> — compound
					interest runs in both directions.
				</p>
			{:else}
				<p>
					In {years} years, after {fmtDollars(monthlyPayment)}/month in payments, this debt could
					stand at about <strong>{fmtDollars(debtEnd)}</strong>. {fmtDollars(effectiveInvestment)}
					invested at the same math could grow to about
					<strong>{fmtDollars(investmentEnd)}</strong> — compound interest runs in both directions.
				</p>
			{/if}
		</div>

		<!-- Summary row -->
		<div class="summary-row" aria-label="End-of-horizon balances">
			<div class="summary-cell">
				<p class="summary-label">Debt after {years} years</p>
				<p class="summary-value value-debt">~{fmtDollars(debtEnd)} <span class="estimated-tag">estimated</span></p>
			</div>
			<div class="summary-cell">
				<p class="summary-label">Investment after {years} years</p>
				<p class="summary-value value-investment">~{fmtDollars(investmentEnd)} <span class="estimated-tag">estimated</span></p>
			</div>
			<div class="summary-cell">
				<p class="summary-label">Difference</p>
				<p class="summary-value">~{fmtDollars(Math.abs(difference))} <span class="estimated-tag">estimated</span></p>
			</div>
		</div>

		<!-- Sources -->
		<div class="sources">
			<h3 class="sources-heading">Sources and notes</h3>
			<ul class="sources-list">
				<li>
					Both balances use standard monthly compounding. Learn how compound interest works:
					<a href={INVESTOR_GOV_COMPOUND} target="_blank" rel="noopener noreferrer">Investor.gov compound interest calculator</a>.
				</li>
				<li>
					The 7% default return is a rough long-run, after-inflation S&amp;P 500 average:
					<a href={SP500_SOURCE} target="_blank" rel="noopener noreferrer">historical S&amp;P 500 returns</a>. Past performance does not predict future returns.
				</li>
				<li>
					Real credit card interest can compound daily and carry fees, so an actual balance may grow
					faster than this estimate. Check your own statement for the exact terms.
				</li>
			</ul>
		</div>
	</section>
{/if}

<div class="signpost-footer" role="note">
	<p>
		The same compound math shows up in everyday money decisions. <a href="/tools/emergency-fund">The
		Emergency Fund Checker</a> looks at the runway you have right now, and <a href="/tools/myth-quiz">the
		Benefits Myth-Check Quiz</a> covers other things financial systems work differently than most
		people assume.
	</p>
</div>

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

	/* Form */
	.debt-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	/* Single column on mobile (375px first); two columns from 560px up. */
	.form-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	@media (min-width: 560px) {
		.form-grid {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--space-md);
			column-gap: var(--space-lg);
		}
	}

	.form-grid .field {
		margin-bottom: 0;
	}

	/* Dollar prefix on inputs (matches TIP-1 / EMG-1) */
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

	/* Percent suffix on rate inputs */
	.input-suffix-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	.input-suffix {
		position: absolute;
		right: 1rem;
		font-size: 1.125rem;
		color: var(--muted);
		pointer-events: none;
		user-select: none;
	}

	.input-suffix-wrap input {
		padding-right: 2rem;
	}

	.group-label {
		font-weight: 600;
		font-size: 0.9375rem;
		display: block;
		margin-bottom: var(--space-xs);
	}

	/* Segmented button set — equal visual weight (matches TIP-1) */
	.segmented {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	.segmented .btn-toggle {
		flex: 1;
		min-width: 64px;
		min-height: 48px;
		border: 2px solid var(--border);
		background: transparent;
		color: var(--text);
		border-radius: var(--radius);
		font-size: 0.9375rem;
		font-family: var(--font);
		font-weight: 700;
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s, color 0.15s;
		padding: var(--space-sm) var(--space-sm);
	}

	.segmented .btn-toggle:hover {
		border-color: var(--terracotta);
	}

	.segmented .btn-toggle.selected {
		border-color: var(--terracotta);
		background: var(--terracotta);
		color: white;
	}

	.submit-hint {
		margin-top: var(--space-xs);
	}

	.btn-primary {
		margin-top: var(--space-sm);
	}

	.btn-primary:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	/* Results */
	.results {
		margin-top: var(--space-xl);
	}

	.results h2 {
		margin-bottom: var(--space-xs);
	}

	.results h2:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 3px;
		border-radius: 2px;
	}

	.results-note {
		font-size: 0.8125rem;
		color: var(--muted);
		margin-bottom: var(--space-lg);
		max-width: 52ch;
	}

	/* Chart */
	.chart-section {
		margin-bottom: var(--space-lg);
	}

	.chart-wrap {
		background: white;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-sm);
		overflow: hidden;
	}

	.legend {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
		margin-top: var(--space-sm);
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: var(--space-xs);
		font-size: 0.8125rem;
		color: var(--muted);
	}

	.legend-swatch {
		display: inline-block;
		width: 1.5rem;
		height: 0;
		border-top-width: 3px;
		border-top-style: solid;
		flex-shrink: 0;
	}

	.swatch-debt {
		border-top-color: var(--terracotta);
	}

	.swatch-investment {
		border-top-color: var(--olive);
	}

	/* SVG chart elements */
	:global(.grid-line) {
		stroke: var(--border);
		stroke-width: 1;
	}

	:global(.axis-tick) {
		stroke: var(--muted);
		stroke-width: 1;
	}

	:global(.axis-line) {
		stroke: var(--muted);
		stroke-width: 1.5;
	}

	:global(.axis-label) {
		font-family: var(--font);
		font-size: 10px;
		fill: var(--muted);
	}

	:global(.line-debt) {
		fill: none;
		stroke: var(--terracotta);
		stroke-width: 2.5;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	:global(.line-investment) {
		fill: none;
		stroke: var(--olive);
		stroke-width: 2.5;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	/* Callout */
	.callout {
		background: var(--surface);
		border-left: 4px solid var(--copper);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		margin-bottom: var(--space-lg);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text);
	}

	/* Summary row */
	.summary-row {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}

	@media (min-width: 560px) {
		.summary-row {
			flex-direction: row;
		}

		.summary-cell {
			flex: 1;
		}
	}

	.summary-cell {
		background: white;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-md);
	}

	.summary-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted);
		margin-bottom: var(--space-xs);
	}

	.summary-value {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--dark);
		letter-spacing: -0.01em;
		line-height: 1.2;
	}

	.value-debt {
		color: var(--terracotta);
	}

	.value-investment {
		color: var(--olive);
	}

	.estimated-tag {
		font-size: 0.6875rem;
		font-weight: 400;
		color: var(--muted);
		text-transform: none;
		letter-spacing: 0;
		display: inline-block;
	}

	/* Sources */
	.sources {
		margin-bottom: var(--space-md);
	}

	.sources-heading {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted);
		margin-bottom: var(--space-xs);
	}

	.sources-list {
		list-style: disc;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.55;
	}

	/* Crosslink footer */
	.signpost-footer {
		margin-top: var(--space-lg);
		padding: var(--space-md);
		background: var(--surface);
		border-radius: var(--radius);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--muted);
	}

	/* Print */
	@media print {
		.debt-form,
		.breadcrumb,
		.signpost-footer {
			display: none !important;
		}
	}
</style>
