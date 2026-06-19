<script lang="ts">
	import { computeGrowth, type GrowthPoint } from '$lib/calculators/compound';

	// Historical S&P 500 long-run average, used only as the default rate.
	const SP500_SOURCE = 'https://www.officialdata.org/us/stocks/s-p-500/1957';
	const INVESTOR_GOV_COMPOUND =
		'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator';

	const HORIZONS = [5, 10, 20, 30] as const;

	// --- Form state (strings so empty fields stay empty, not 0) ---
	let principalStr = $state('');
	let monthlyStr = $state('');
	let rateStr = $state('7');
	let years = $state<(typeof HORIZONS)[number]>(20);

	const principal = $derived(Number(principalStr) || 0);
	const monthly = $derived(Number(monthlyStr) || 0);
	const rate = $derived(Number(rateStr) || 0);

	// Show the chart only once there is something to grow (a starting amount or a
	// monthly addition) and a positive rate that the curve can act on.
	const hasInputs = $derived((principal > 0 || monthly > 0) && rate > 0);

	// Reactive: recompute whenever any input changes. No submit button.
	const chartData = $derived<GrowthPoint[]>(
		hasInputs ? computeGrowth(principal, monthly, rate, years) : []
	);

	const lastPoint = $derived(chartData.length > 0 ? chartData[chartData.length - 1] : null);
	const futureValue = $derived(lastPoint ? lastPoint.totalValue : 0);
	const totalContributed = $derived(lastPoint ? lastPoint.totalContributed : 0);
	const totalInterest = $derived(lastPoint ? lastPoint.totalInterest : 0);

	// Rule of 72: rough years for the money to double at this rate.
	const doublingYears = $derived(rate > 0 ? 72 / rate : 0);

	// Compare interest earned in the first half of the horizon vs. the second half,
	// to make the "it accelerates" point with the user's own numbers.
	const halfYear = $derived(Math.floor(years / 2));
	const midPoint = $derived(
		chartData.find((p) => p.year === halfYear) ?? null
	);
	const firstHalfInterest = $derived(midPoint ? midPoint.totalInterest : 0);
	const secondHalfInterest = $derived(totalInterest - firstHalfInterest);
	// True when the back half out-earns the front half (the usual case with a
	// positive rate and a meaningful horizon).
	const secondHalfWins = $derived(secondHalfInterest > firstHalfInterest);

	// --- SVG chart helpers (same pattern as DEBT-VIZ-1 / CLIFF-1) ---
	const PAD_L = 58;
	const PAD_R = 20;
	const PAD_T = 16;
	const PAD_B = 44;
	const VB_W = 640;
	const VB_H = 240;
	const CHART_W = VB_W - PAD_L - PAD_R; // 562
	const CHART_H = VB_H - PAD_T - PAD_B; // 180

	function mapX(year: number): number {
		if (years === 0) return PAD_L;
		return PAD_L + (year / years) * CHART_W;
	}

	function mapY(value: number, maxValue: number): number {
		if (maxValue === 0) return PAD_T + CHART_H;
		return PAD_T + CHART_H - (value / maxValue) * CHART_H;
	}

	// Top of the Y scale = final total value, with 5% headroom.
	const maxValue = $derived(
		chartData.length > 0 ? Math.max(...chartData.map((p) => p.totalValue)) * 1.05 : 0
	);

	// Polyline for the total-value curve (the visible stroke on top).
	const totalPolyline = $derived.by(() => {
		if (chartData.length === 0) return '';
		return chartData
			.map((p) => `${mapX(p.year).toFixed(1)},${mapY(p.totalValue, maxValue).toFixed(1)}`)
			.join(' ');
	});

	// Filled area for "what you put in": from the baseline up to the contributed
	// line. Closed polygon: contributed curve left-to-right, then back along the
	// baseline.
	const contributedArea = $derived.by(() => {
		if (chartData.length === 0) return '';
		const baseY = (PAD_T + CHART_H).toFixed(1);
		const top = chartData
			.map((p) => `${mapX(p.year).toFixed(1)},${mapY(p.totalContributed, maxValue).toFixed(1)}`)
			.join(' ');
		const lastX = mapX(chartData[chartData.length - 1].year).toFixed(1);
		const firstX = mapX(chartData[0].year).toFixed(1);
		return `${top} ${lastX},${baseY} ${firstX},${baseY}`;
	});

	// Filled area for "interest added": the band between the contributed line and
	// the total-value line. Total curve left-to-right, then contributed curve
	// right-to-left to close the band.
	const interestArea = $derived.by(() => {
		if (chartData.length === 0) return '';
		const top = chartData
			.map((p) => `${mapX(p.year).toFixed(1)},${mapY(p.totalValue, maxValue).toFixed(1)}`)
			.join(' ');
		const bottom = [...chartData]
			.reverse()
			.map((p) => `${mapX(p.year).toFixed(1)},${mapY(p.totalContributed, maxValue).toFixed(1)}`)
			.join(' ');
		return `${top} ${bottom}`;
	});

	// X-axis ticks every 5 years.
	const xTicks = $derived.by(() => {
		const ticks: { year: number; label: string }[] = [];
		const step = years <= 10 ? 5 : years <= 20 ? 5 : 10;
		for (let y = step; y <= years; y += step) {
			ticks.push({ year: y, label: `${y}y` });
		}
		return ticks;
	});

	// Y-axis ticks: 3-4 round increments.
	const yTicks = $derived.by(() => {
		if (maxValue === 0) return [];
		const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
		const step = Math.ceil(maxValue / (4 * magnitude)) * magnitude;
		const ticks: number[] = [];
		for (let v = step; v < maxValue; v += step) {
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

	function fmtRate(n: number): string {
		// Trim a trailing .0 so "7%" reads cleanly but "7.5%" survives.
		return Number.isInteger(n) ? String(n) : n.toFixed(1);
	}
</script>

<svelte:head>
	<title>The Compounding Effect | Finxiety</title>
	<meta
		name="description"
		content="See how a starting amount and a monthly addition grow over time with compound interest, split into what you put in and what the interest added. Free, nothing saved."
	/>
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>The Compounding Effect</h1>
<p class="tool-description">
	Compound interest is money earning interest, and then that interest earning interest too. Enter a
	starting amount and a monthly addition to see how the math plays out over time, split into what
	you put in and what the interest added.
</p>

<hr class="divider" />

<form class="compound-form" onsubmit={(e) => e.preventDefault()} novalidate>
	<div class="form-grid">
		<div class="field">
			<label for="principal">Starting amount</label>
			<p class="field-hint" id="principal-hint">What you're starting with. Can be 0.</p>
			<div class="input-prefix-wrap">
				<span class="input-prefix" aria-hidden="true">$</span>
				<input
					id="principal"
					type="number"
					inputmode="decimal"
					min="0"
					step="any"
					bind:value={principalStr}
					placeholder="1000"
					aria-describedby="principal-hint"
				/>
			</div>
		</div>

		<div class="field">
			<label for="monthly">Monthly addition</label>
			<p class="field-hint" id="monthly-hint">Added at the end of each month. Can be 0.</p>
			<div class="input-prefix-wrap">
				<span class="input-prefix" aria-hidden="true">$</span>
				<input
					id="monthly"
					type="number"
					inputmode="decimal"
					min="0"
					step="any"
					bind:value={monthlyStr}
					placeholder="100"
					aria-describedby="monthly-hint"
				/>
			</div>
		</div>

		<div class="field">
			<label for="rate">Annual return (%)</label>
			<p class="field-hint" id="rate-hint">
				7% is the historical S&amp;P 500 average. Use a lower rate for savings accounts. Past
				returns don't predict future results.
			</p>
			<div class="input-suffix-wrap">
				<input
					id="rate"
					type="number"
					inputmode="decimal"
					min="0"
					step="any"
					bind:value={rateStr}
					placeholder="7"
					aria-describedby="rate-hint"
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

	{#if !hasInputs}
		<p class="field-hint submit-hint">
			Enter a starting amount or a monthly addition, and a return above 0, to see the chart.
		</p>
	{/if}
</form>

{#if hasInputs && lastPoint}
	<section class="results" aria-label="How the amount grows over time">
		<div class="sr-only" aria-live="polite" aria-atomic="true">
			After {years} years, the estimated future value is {fmtDollars(futureValue)}.
		</div>

		<!-- Headline future value -->
		<div class="headline">
			<p class="headline-label">Estimated value after {years} years</p>
			<p class="headline-value">
				~{fmtDollars(futureValue)} <span class="estimated-tag">estimated</span>
			</p>
		</div>

		<p class="results-note">
			An estimate based on the return you entered, compounded monthly. Real returns vary year to
			year; this shows how the math works, not a prediction.
		</p>

		<!-- Two-part breakdown -->
		<div class="breakdown" aria-label="Where the value comes from">
			<div class="breakdown-cell cell-contributed">
				<p class="breakdown-label">You put in</p>
				<p class="breakdown-value">{fmtDollars(totalContributed)}</p>
			</div>
			<div class="breakdown-cell cell-interest">
				<p class="breakdown-label">Interest added</p>
				<p class="breakdown-value">
					~{fmtDollars(totalInterest)} <span class="estimated-tag">estimated</span>
				</p>
			</div>
		</div>

		<!-- Chart -->
		<div class="chart-section">
			<div class="chart-wrap" aria-hidden="true">
				<svg
					viewBox="0 0 {VB_W} {VB_H}"
					width="100%"
					role="img"
					aria-label="Area chart showing total value growing over time, with the amount contributed shaded below and the interest shaded above"
				>
					<!-- Y-axis grid lines and labels -->
					{#each yTicks as tick}
						{@const y = mapY(tick, maxValue)}
						<line x1={PAD_L} y1={y} x2={VB_W - PAD_R} y2={y} class="grid-line" />
						<text x={PAD_L - 6} y={y + 4} class="axis-label" text-anchor="end">{fmtK(tick)}</text>
					{/each}

					<!-- X-axis labels -->
					{#each xTicks as tick}
						{@const x = mapX(tick.year)}
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

					<!-- Contributed area (lighter, below) -->
					{#if contributedArea}
						<polygon points={contributedArea} class="area-contributed" />
					{/if}

					<!-- Interest area (more saturated, stacked on top) -->
					{#if interestArea}
						<polygon points={interestArea} class="area-interest" />
					{/if}

					<!-- Total value curve -->
					{#if totalPolyline}
						<polyline points={totalPolyline} class="line-total" />
					{/if}
				</svg>
			</div>

			<!-- Legend -->
			<ul class="legend">
				<li class="legend-item">
					<span class="legend-swatch swatch-contributed" aria-hidden="true"></span>
					What you put in
				</li>
				<li class="legend-item">
					<span class="legend-swatch swatch-interest" aria-hidden="true"></span>
					Interest added
				</li>
			</ul>
		</div>

		<!-- Plain-language callout -->
		<div class="callout" role="note">
			<p>
				At {fmtRate(rate)}%, money roughly doubles every
				<strong>{doublingYears.toFixed(doublingYears % 1 === 0 ? 0 : 1)} years</strong>
				(a rule of thumb called the Rule of 72).
				{#if secondHalfWins && firstHalfInterest > 0}
					In your numbers, the last {years - halfYear} years add about
					<strong>{fmtDollars(secondHalfInterest)}</strong> in interest — more than the
					<strong>{fmtDollars(firstHalfInterest)}</strong> from the first {halfYear}. The longer it
					compounds, the more the back half outpaces the front.
				{:else}
					The longer money compounds, the larger each year's growth tends to be, because interest
					starts earning interest of its own.
				{/if}
			</p>
		</div>

		<!-- Sources -->
		<div class="sources">
			<h3 class="sources-heading">Sources and notes</h3>
			<ul class="sources-list">
				<li>
					This uses standard monthly compounding. Learn how compound interest works:
					<a href={INVESTOR_GOV_COMPOUND} target="_blank" rel="noopener noreferrer">Investor.gov compound interest calculator</a>.
				</li>
				<li>
					The 7% default is a rough long-run, after-inflation S&amp;P 500 average:
					<a href={SP500_SOURCE} target="_blank" rel="noopener noreferrer">historical S&amp;P 500 returns</a>. Past returns don't predict future results.
				</li>
				<li>
					Real returns rise and fall year to year, and savings accounts typically pay far less than
					7%. These figures are estimates to illustrate the math, not a forecast.
				</li>
			</ul>
		</div>
	</section>
{/if}

<div class="signpost-footer" role="note">
	<p>
		The same compound math runs on debt too. <a href="/tools/emergency-fund">The Emergency Fund
		Checker</a> looks at the runway you have right now, and <a href="/tools/myth-quiz">the Benefits
		Myth-Check Quiz</a> covers other places money works differently than most people assume.
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
	.compound-form {
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

	/* Dollar prefix on inputs (matches TIP-1 / EMG-1 / DEBT-VIZ-1) */
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

	/* Percent suffix on the rate input */
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

	/* Segmented button set (matches DEBT-VIZ-1 / TIP-1) */
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
		margin-top: var(--space-sm);
	}

	/* Results */
	.results {
		margin-top: var(--space-xl);
	}

	/* Headline */
	.headline {
		margin-bottom: var(--space-sm);
	}

	.headline-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted);
		margin-bottom: var(--space-xs);
	}

	.headline-value {
		font-size: clamp(2rem, 8vw, 2.75rem);
		font-weight: 800;
		color: var(--dark);
		letter-spacing: -0.02em;
		line-height: 1.1;
	}

	.results-note {
		font-size: 0.8125rem;
		color: var(--muted);
		margin-bottom: var(--space-lg);
		max-width: 52ch;
	}

	/* Two-part breakdown */
	.breakdown {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		margin-bottom: var(--space-lg);
	}

	@media (min-width: 480px) {
		.breakdown {
			flex-direction: row;
		}

		.breakdown-cell {
			flex: 1;
		}
	}

	.breakdown-cell {
		background: white;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-md);
		border-left-width: 4px;
		border-left-style: solid;
	}

	.cell-contributed {
		border-left-color: var(--copper);
	}

	.cell-interest {
		border-left-color: var(--olive);
	}

	.breakdown-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted);
		margin-bottom: var(--space-xs);
	}

	.breakdown-value {
		font-size: 1.375rem;
		font-weight: 800;
		color: var(--dark);
		letter-spacing: -0.01em;
		line-height: 1.2;
	}

	.estimated-tag {
		font-size: 0.6875rem;
		font-weight: 400;
		color: var(--muted);
		text-transform: none;
		letter-spacing: 0;
		display: inline-block;
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
		width: 1rem;
		height: 1rem;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.swatch-contributed {
		background: var(--copper);
		opacity: 0.35;
	}

	.swatch-interest {
		background: var(--olive);
		opacity: 0.55;
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

	:global(.area-contributed) {
		fill: var(--copper);
		fill-opacity: 0.16;
		stroke: none;
	}

	:global(.area-interest) {
		fill: var(--olive);
		fill-opacity: 0.22;
		stroke: none;
	}

	:global(.line-total) {
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
		.compound-form,
		.breadcrumb,
		.signpost-footer {
			display: none !important;
		}
	}
</style>
