<script lang="ts">
	import { tick } from 'svelte';
	import {
		computeCliff,
		cliffChartPoints,
		type CliffResult,
		type IncomeSnapshot
	} from '$lib/calculators/cliff';

	// Form state
	let currentIncomeStr = $state('');
	let proposedIncomeStr = $state('');
	let householdSize = $state(1);
	let hasChildUnder5 = $state(false);

	// Paycheck converter (for current income)
	let showPaycheckCalc = $state(false);
	let paycheckFrequency = $state<'biweekly' | 'weekly' | 'semimonthly' | 'monthly'>('biweekly');
	let paycheckAmount = $state('');
	let paycheckTriggerEl: HTMLButtonElement | null = $state(null);
	let paycheckInputEl: HTMLInputElement | null = $state(null);

	// Annual converter (for proposed income)
	let showAnnualCalc = $state(false);
	let annualAmount = $state('');
	let annualTriggerEl: HTMLButtonElement | null = $state(null);
	let annualInputEl: HTMLInputElement | null = $state(null);

	// Results state
	let submitted = $state(false);
	let result: CliffResult | null = $state(null);
	let chartData: IncomeSnapshot[] = $state([]);
	let chartMaxIncome = $state(7000);
	let resultHeadingEl: HTMLHeadingElement | null = $state(null);

	const MULTIPLIERS: Record<string, number> = {
		biweekly: 26 / 12,
		weekly: 52 / 12,
		semimonthly: 2,
		monthly: 1
	};

	const monthlyFromPaycheck = $derived.by(() => {
		const amt = Number(paycheckAmount);
		if (!paycheckAmount || isNaN(amt) || amt <= 0) return null;
		return Math.round(amt * MULTIPLIERS[paycheckFrequency]);
	});

	const monthlyFromAnnual = $derived.by(() => {
		const amt = Number(annualAmount);
		if (!annualAmount || isNaN(amt) || amt <= 0) return null;
		return Math.round(amt / 12);
	});

	const currentIncome = $derived(Number(currentIncomeStr) || 0);
	const proposedIncome = $derived(Number(proposedIncomeStr) || 0);

	const canSubmit = $derived(
		currentIncome >= 0 &&
			proposedIncome > 0 &&
			currentIncomeStr !== '' &&
			proposedIncomeStr !== '' &&
			householdSize >= 1
	);

	async function togglePaycheckCalc() {
		showPaycheckCalc = !showPaycheckCalc;
		if (showPaycheckCalc) {
			await tick();
			paycheckInputEl?.focus();
		} else {
			paycheckTriggerEl?.focus();
		}
	}

	function usePaycheckAmount() {
		if (monthlyFromPaycheck !== null) {
			currentIncomeStr = String(monthlyFromPaycheck);
			showPaycheckCalc = false;
			paycheckAmount = '';
			paycheckTriggerEl?.focus();
		}
	}

	function cancelPaycheckCalc() {
		showPaycheckCalc = false;
		paycheckAmount = '';
		paycheckTriggerEl?.focus();
	}

	async function toggleAnnualCalc() {
		showAnnualCalc = !showAnnualCalc;
		if (showAnnualCalc) {
			await tick();
			annualInputEl?.focus();
		} else {
			annualTriggerEl?.focus();
		}
	}

	function useAnnualAmount() {
		if (monthlyFromAnnual !== null) {
			proposedIncomeStr = String(monthlyFromAnnual);
			showAnnualCalc = false;
			annualAmount = '';
			annualTriggerEl?.focus();
		}
	}

	function cancelAnnualCalc() {
		showAnnualCalc = false;
		annualAmount = '';
		annualTriggerEl?.focus();
	}

	async function handleSubmit(e: Event) {
		e.preventDefault();
		if (!canSubmit) return;
		const inputs = { householdSize, hasChildUnder5OrPregnant: hasChildUnder5 };
		result = computeCliff(currentIncome, proposedIncome, inputs);
		const maxIncome = Math.max(7000, Math.ceil(proposedIncome / 500) * 500 + 500);
		chartMaxIncome = maxIncome;
		chartData = cliffChartPoints(inputs, maxIncome);
		submitted = true;
		await tick();
		resultHeadingEl?.focus();
	}

	// --- SVG chart helpers ---

	const PAD_L = 58;
	const PAD_R = 20;
	const PAD_T = 16;
	const PAD_B = 44;
	const VB_W = 640;
	const VB_H = 240;
	const CHART_W = VB_W - PAD_L - PAD_R; // 562
	const CHART_H = VB_H - PAD_T - PAD_B; // 180

	function mapX(income: number): number {
		return PAD_L + (income / chartMaxIncome) * CHART_W;
	}

	function mapY(resources: number, maxResources: number): number {
		if (maxResources === 0) return PAD_T + CHART_H;
		return PAD_T + CHART_H - (resources / maxResources) * CHART_H;
	}

	const chartMaxResources = $derived(
		chartData.length > 0 ? Math.max(...chartData.map((p) => p.calculableResources)) * 1.05 : 7000
	);

	const totalResourcesPolyline = $derived.by(() => {
		if (chartData.length === 0) return '';
		return chartData
			.map((p) => `${mapX(p.grossMonthly).toFixed(1)},${mapY(p.calculableResources, chartMaxResources).toFixed(1)}`)
			.join(' ');
	});

	const incomeOnlyPolyline = $derived.by(() => {
		if (chartData.length === 0) return '';
		return chartData
			.map((p) => `${mapX(p.grossMonthly).toFixed(1)},${mapY(p.grossMonthly, chartMaxResources).toFixed(1)}`)
			.join(' ');
	});

	// X-axis tick values (every $1K, capped at chartMaxIncome)
	const xTicks = $derived.by(() => {
		const ticks: number[] = [];
		const step = chartMaxIncome <= 7000 ? 1000 : 2000;
		for (let v = 0; v <= chartMaxIncome; v += step) {
			if (v > 0) ticks.push(v);
		}
		return ticks;
	});

	// Y-axis tick values (3-4 round increments)
	const yTicks = $derived.by(() => {
		if (chartMaxResources === 0) return [];
		const magnitude = Math.pow(10, Math.floor(Math.log10(chartMaxResources)));
		const step = Math.ceil(chartMaxResources / (4 * magnitude)) * magnitude;
		const ticks: number[] = [];
		for (let v = step; v < chartMaxResources; v += step) {
			ticks.push(v);
		}
		return ticks;
	});

	function fmtK(n: number): string {
		if (n >= 1000) return '$' + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
		return '$' + n;
	}

	function fmtDollars(n: number): string {
		return '$' + Math.abs(n).toLocaleString('en-US');
	}

	function fmtDelta(n: number): string {
		const sign = n >= 0 ? '+' : '-';
		return sign + '$' + Math.abs(Math.round(n)).toLocaleString('en-US');
	}
</script>

<svelte:head>
	<title>Benefits Cliff Calculator | Finxiety</title>
	<meta
		name="description"
		content="See how your CalFresh, Medi-Cal, and other benefits change when your income changes. Free, California-focused, nothing saved."
	/>
</svelte:head>

<div class="sr-only" aria-live="polite" aria-atomic="true">
	{#if submitted}
		Your benefits cliff comparison is ready below.
	{/if}
</div>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>Benefits Cliff Calculator</h1>
<p class="tool-description">
	Getting a raise or a new job offer? Enter your current and proposed income to see how CalFresh,
	Medi-Cal, and other California programs would change — and whether the raise leaves you better
	off in total.
</p>

<hr class="divider" />

<form class="cliff-form" onsubmit={handleSubmit} novalidate>
	<div class="field">
		<label for="current-income">Your current monthly income</label>
		<p class="field-hint" id="current-income-hint">Gross (before taxes). Enter 0 if not currently working.</p>
		<input
			id="current-income"
			type="number"
			inputmode="decimal"
			min="0"
			bind:value={currentIncomeStr}
			placeholder="e.g. 1700"
			aria-describedby="current-income-hint"
		/>
		<button
			type="button"
			class="btn btn-ghost paycheck-toggle"
			bind:this={paycheckTriggerEl}
			onclick={togglePaycheckCalc}
			aria-expanded={showPaycheckCalc}
			aria-controls="paycheck-calc"
		>
			{showPaycheckCalc ? 'Hide paycheck calculator' : 'Calculate from a paycheck instead'}
		</button>
		{#if showPaycheckCalc}
			<div class="paycheck-calc" id="paycheck-calc" role="group" aria-label="Paycheck calculator">
				<div class="paycheck-row">
					<div class="field paycheck-field">
						<label for="paycheck-freq">Pay frequency</label>
						<select id="paycheck-freq" bind:value={paycheckFrequency}>
							<option value="weekly">Weekly</option>
							<option value="biweekly">Every two weeks</option>
							<option value="semimonthly">Twice a month</option>
							<option value="monthly">Monthly</option>
						</select>
					</div>
					<div class="field paycheck-field">
						<label for="paycheck-amt">Gross amount per check</label>
						<input
							id="paycheck-amt"
							type="number"
							inputmode="decimal"
							min="0"
							bind:value={paycheckAmount}
							bind:this={paycheckInputEl}
							placeholder="e.g. 800"
						/>
					</div>
				</div>
				{#if monthlyFromPaycheck !== null}
					<p class="paycheck-result">That's about <strong>{fmtDollars(monthlyFromPaycheck)}/month</strong></p>
				{/if}
				<div class="paycheck-actions">
					<button
						type="button"
						class="btn btn-primary paycheck-use"
						onclick={usePaycheckAmount}
						disabled={monthlyFromPaycheck === null}
					>
						Use this amount
					</button>
					<button type="button" class="btn btn-ghost" onclick={cancelPaycheckCalc}>Cancel</button>
				</div>
			</div>
		{/if}
	</div>

	<div class="field">
		<label for="proposed-income">Monthly income you are considering</label>
		<p class="field-hint" id="proposed-income-hint">The new job, the raise, the offer on the table.</p>
		<input
			id="proposed-income"
			type="number"
			inputmode="decimal"
			min="0"
			bind:value={proposedIncomeStr}
			placeholder="e.g. 2200"
			aria-describedby="proposed-income-hint"
		/>
		<button
			type="button"
			class="btn btn-ghost paycheck-toggle"
			bind:this={annualTriggerEl}
			onclick={toggleAnnualCalc}
			aria-expanded={showAnnualCalc}
			aria-controls="annual-calc"
		>
			{showAnnualCalc ? 'Hide salary calculator' : 'Convert from an annual salary instead'}
		</button>
		{#if showAnnualCalc}
			<div class="paycheck-calc" id="annual-calc" role="group" aria-label="Annual salary calculator">
				<div class="field">
					<label for="annual-amt">Annual salary</label>
					<input
						id="annual-amt"
						type="number"
						inputmode="decimal"
						min="0"
						bind:value={annualAmount}
						bind:this={annualInputEl}
						placeholder="e.g. 42000"
					/>
				</div>
				{#if monthlyFromAnnual !== null}
					<p class="paycheck-result">That's about <strong>{fmtDollars(monthlyFromAnnual)}/month</strong></p>
				{/if}
				<div class="paycheck-actions">
					<button
						type="button"
						class="btn btn-primary paycheck-use"
						onclick={useAnnualAmount}
						disabled={monthlyFromAnnual === null}
					>
						Use this amount
					</button>
					<button type="button" class="btn btn-ghost" onclick={cancelAnnualCalc}>Cancel</button>
				</div>
			</div>
		{/if}
	</div>

	<div class="field">
		<label for="household-size">People in your household</label>
		<p class="field-hint" id="size-hint">Include yourself, your partner if applicable, and any children or dependents.</p>
		<select id="household-size" bind:value={householdSize} aria-describedby="size-hint">
			<option value={1}>Just me</option>
			<option value={2}>2 people</option>
			<option value={3}>3 people</option>
			<option value={4}>4 people</option>
			<option value={5}>5 people</option>
			<option value={6}>6 people</option>
			<option value={7}>7 people</option>
			<option value={8}>8 or more people</option>
		</select>
	</div>

	<div class="field checkbox-field">
		<label class="checkbox-label">
			<input type="checkbox" bind:checked={hasChildUnder5} />
			<span>My household includes a child under 5, or someone who is pregnant</span>
		</label>
		<p class="field-hint">This affects the Medi-Cal income limit.</p>
	</div>

	<button class="btn btn-primary" type="submit" disabled={!canSubmit}>Show me what changes</button>
	{#if !canSubmit}
		<p class="field-hint submit-hint" aria-live="polite">
			Enter your current and proposed income to continue.
		</p>
	{/if}
</form>

{#if submitted && result}
	<section class="results" aria-label="Benefits cliff comparison">
		<h2 bind:this={resultHeadingEl} tabindex="-1">
			At {fmtDollars(currentIncome)}/month vs. {fmtDollars(proposedIncome)}/month
		</h2>
		<p class="results-note">
			California programs only. Estimates based on published income thresholds. Your exact benefit
			depends on your specific situation and what your county processes.
		</p>

		<div class="comparison-grid" aria-label="Side-by-side comparison">
			<div class="scenario-card" aria-label="Current income scenario">
				<p class="scenario-label">Right now</p>
				<p class="scenario-income">{fmtDollars(currentIncome)}<span class="per-month">/month</span></p>

				<div class="program-list">
					<div class="program-row">
						<span class="program-name">CalFresh (food assistance)</span>
						{#if result.current.calFreshEligible}
							<span class="program-value eligible">
								~{fmtDollars(result.current.calFreshBenefit)}/month <span class="estimated-tag">estimated</span>
							</span>
						{:else}
							<span class="program-value ineligible">Over the income limit</span>
						{/if}
					</div>

					<div class="program-row">
						<span class="program-name">Medi-Cal (health coverage)</span>
						{#if result.current.mediCalEligible}
							<span class="program-value eligible">Free coverage</span>
						{:else}
							<span class="program-value ineligible">Over the income limit</span>
						{/if}
					</div>

					<div class="program-row">
						<span class="program-name">Lifeline (phone/internet)</span>
						{#if result.current.lifelineEligible}
							<span class="program-value eligible">$9.25/month off</span>
						{:else}
							<span class="program-value ineligible">Over the income limit</span>
						{/if}
					</div>
				</div>
			</div>

			<div class="scenario-card" aria-label="Proposed income scenario">
				<p class="scenario-label">At the new income</p>
				<p class="scenario-income">{fmtDollars(proposedIncome)}<span class="per-month">/month</span></p>

				<div class="program-list">
					<div class="program-row {result.current.calFreshEligible !== result.proposed.calFreshEligible ? 'changing' : ''}">
						<span class="program-name">CalFresh (food assistance)</span>
						{#if result.proposed.calFreshEligible}
							<span class="program-value eligible">
								~{fmtDollars(result.proposed.calFreshBenefit)}/month <span class="estimated-tag">estimated</span>
							</span>
						{:else}
							<span class="program-value ineligible">Over the income limit</span>
						{/if}
					</div>

					<div class="program-row {result.losingMediCal || result.gainingMediCal ? 'changing' : ''}">
						<span class="program-name">Medi-Cal (health coverage)</span>
						{#if result.proposed.mediCalEligible}
							<span class="program-value eligible">Free coverage</span>
						{:else}
							<span class="program-value ineligible">
								Over the income limit
								{#if result.losingMediCal}<span class="change-flag">changes</span>{/if}
							</span>
						{/if}
					</div>

					<div class="program-row {result.current.lifelineEligible !== result.proposed.lifelineEligible ? 'changing' : ''}">
						<span class="program-name">Lifeline (phone/internet)</span>
						{#if result.proposed.lifelineEligible}
							<span class="program-value eligible">$9.25/month off</span>
						{:else}
							<span class="program-value ineligible">Over the income limit</span>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<!-- Net verdict -->
		<div class="verdict-box {result.netDelta < 0 ? 'verdict-cliff' : result.netDelta === 0 ? 'verdict-neutral' : 'verdict-gain'}">
			<div class="verdict-table" aria-label="Financial impact summary">
				<div class="verdict-row">
					<span class="verdict-label">Income change</span>
					<span class="verdict-value">{fmtDelta(result.incomeDelta)}/month</span>
				</div>
				{#if result.calFreshDelta !== 0}
					<div class="verdict-row">
						<span class="verdict-label">CalFresh change</span>
						<span class="verdict-value">{fmtDelta(result.calFreshDelta)}/month <span class="estimated-tag">estimated</span></span>
					</div>
				{/if}
				{#if result.lifelineDelta !== 0}
					<div class="verdict-row">
						<span class="verdict-label">Lifeline change</span>
						<span class="verdict-value">{fmtDelta(result.lifelineDelta)}/month</span>
					</div>
				{/if}
				<div class="verdict-row verdict-total">
					<span class="verdict-label">Net change</span>
					<span class="verdict-value">{fmtDelta(result.netDelta)}/month</span>
				</div>
			</div>

			<p class="verdict-summary">
				{#if result.netDelta < -50}
					The raise adds {fmtDollars(result.incomeDelta)}/month to your paycheck, but estimated benefit changes subtract roughly {fmtDollars(Math.abs(result.calFreshDelta + result.lifelineDelta))}/month. You'd have about {fmtDollars(Math.abs(result.netDelta))} less per month in total resources than you do now. This is the benefits cliff.
				{:else if result.netDelta < 0}
					After estimated benefit changes, you'd have slightly less per month in total resources. The income gain and the benefit loss are nearly offsetting, with a small net loss.
				{:else if result.netDelta === 0 || (result.netDelta > 0 && result.netDelta < 10)}
					The income gain and estimated benefit changes roughly cancel out. Your total monthly resources would stay about the same.
				{:else if result.calFreshDelta < 0 || result.lifelineDelta < 0}
					The raise adds {fmtDollars(result.incomeDelta)}/month, and estimated benefit changes reduce that by about {fmtDollars(Math.abs(result.calFreshDelta + result.lifelineDelta))}/month. Net gain: roughly {fmtDollars(result.netDelta)}/month.
				{:else}
					Your income would increase and your benefits would stay the same. Total resources: up about {fmtDollars(result.netDelta)}/month.
				{/if}
			</p>
		</div>

		<!-- Medi-Cal separate note -->
		{#if result.losingMediCal}
			<div class="medi-cal-note" role="note">
				<p class="medi-cal-heading">About health coverage</p>
				<p>
					At {fmtDollars(proposedIncome)}/month, you would likely no longer qualify for free Medi-Cal
					coverage. You would become eligible for subsidized plans on Covered California. The
					premium you'd pay depends on your household income and size. At your income level,
					subsidies could significantly reduce the cost, but the amount varies.
				</p>
				<p class="medi-cal-link">
					<a href="https://apply.coveredca.com/lw-shopandcompare/" target="_blank" rel="noopener noreferrer">
						See plans on Covered California
					</a>
				</p>
				<p class="medi-cal-warning">
					This calculator does not estimate the cost of Covered California coverage. Factor health
					insurance into your decision separately.
				</p>
			</div>
		{/if}

		<!-- Chart -->
		<div class="chart-section">
			<h3 class="chart-heading">Total monthly resources across income levels</h3>
			<p class="chart-description">
				Solid line: income plus estimated CalFresh and Lifeline benefits combined.
				Dashed line: income only, for comparison.
				Vertical markers show your current and proposed income.
			</p>

			<div class="chart-wrap" aria-hidden="true">
				<svg
					viewBox="0 0 {VB_W} {VB_H}"
					width="100%"
					role="img"
					aria-label="Line chart showing total monthly resources rising with income, with a cliff where CalFresh benefits drop off"
				>
					<!-- Y-axis grid lines and labels -->
					{#each yTicks as tick}
						{@const y = mapY(tick, chartMaxResources)}
						<line x1={PAD_L} y1={y} x2={VB_W - PAD_R} y2={y} class="grid-line" />
						<text x={PAD_L - 6} y={y + 4} class="axis-label" text-anchor="end">{fmtK(tick)}</text>
					{/each}

					<!-- X-axis labels -->
					{#each xTicks as tick}
						{@const x = mapX(tick)}
						<line x1={x} y1={PAD_T + CHART_H} x2={x} y2={PAD_T + CHART_H + 4} class="axis-tick" />
						<text x={x} y={PAD_T + CHART_H + 16} class="axis-label" text-anchor="middle">{fmtK(tick)}</text>
					{/each}

					<!-- X-axis baseline -->
					<line
						x1={PAD_L}
						y1={PAD_T + CHART_H}
						x2={VB_W - PAD_R}
						y2={PAD_T + CHART_H}
						class="axis-line"
					/>

					<!-- Income-only reference line (dashed) -->
					{#if incomeOnlyPolyline}
						<polyline points={incomeOnlyPolyline} class="line-reference" />
					{/if}

					<!-- Total resources line -->
					{#if totalResourcesPolyline}
						<polyline points={totalResourcesPolyline} class="line-resources" />
					{/if}

					<!-- Current income marker -->
					<line x1={mapX(currentIncome)} y1={PAD_T} x2={mapX(currentIncome)} y2={PAD_T + CHART_H} class="marker-current" />
					<circle cx={mapX(currentIncome)} cy={mapY(result.current.calculableResources, chartMaxResources)} r="5" class="dot-current" />
					<text x={mapX(currentIncome)} y={PAD_T - 4} class="marker-label" text-anchor="middle">Now</text>

					<!-- Proposed income marker -->
					<line x1={mapX(proposedIncome)} y1={PAD_T} x2={mapX(proposedIncome)} y2={PAD_T + CHART_H} class="marker-proposed" />
					<circle cx={mapX(proposedIncome)} cy={mapY(result.proposed.calculableResources, chartMaxResources)} r="5" class="dot-proposed" />
					<text x={mapX(proposedIncome)} y={PAD_T - 4} class="marker-label" text-anchor="middle">Proposed</text>
				</svg>
			</div>

			<p class="chart-note">
				This chart shows CalFresh and Lifeline only. Medi-Cal coverage value is not included because
				it varies widely; see the note above if your Medi-Cal eligibility changes.
			</p>
		</div>

		<!-- Employer questions (shown when net delta is negative or close) -->
		{#if result.netDelta < 100 && (result.calFreshDelta < 0 || result.losingMediCal)}
			<div class="employer-questions" role="note">
				<p class="eq-heading">Questions some people ask their employer in this situation</p>
				<ul class="eq-list">
					{#if result.losingMediCal}
						<li>Does the job include employer-sponsored health insurance? If so, at what cost?</li>
					{/if}
					{#if result.calFreshDelta < -50}
						<li>Is a phased raise an option, with a smaller increase now and more later?</li>
					{/if}
					<li>Does the employer offer pre-tax benefits like an HSA or dependent care FSA that would reduce taxable income?</li>
				</ul>
				<p class="eq-note">
					These are questions, not recommendations. What matters depends on your specific situation.
				</p>
			</div>
		{/if}

		<!-- Sources -->
		<div class="sources">
			<h3 class="sources-heading">Sources and notes</h3>
			<ul class="sources-list">
				<li>CalFresh (SNAP) income limits and maximum benefits: <a href="https://www.fns.usda.gov/snap/recipient/eligibility" target="_blank" rel="noopener noreferrer">USDA FNS</a>, FY2025. Benefit estimate uses the standard earned income deduction (20% of gross); actual benefit varies with shelter costs and other deductions.</li>
				<li>Medi-Cal income limits: <a href="https://www.dhcs.ca.gov/services/medi-cal" target="_blank" rel="noopener noreferrer">CA DHCS</a>, 138% FPL for adults; 266% FPL for children under 5.</li>
				<li>Lifeline: <a href="https://www.lifelinesupport.org/" target="_blank" rel="noopener noreferrer">lifelinesupport.org</a>. $9.25/month off phone or internet; income limit 135% FPL or program-based via CalFresh or Medi-Cal enrollment.</li>
				<li>Covered California plans if Medi-Cal eligibility changes: <a href="https://apply.coveredca.com/lw-shopandcompare/" target="_blank" rel="noopener noreferrer">apply.coveredca.com</a>.</li>
			</ul>
			<p class="sources-updated">Thresholds last verified October 2025. Limits update annually.</p>
		</div>
	</section>
{/if}

<div class="signpost-footer" role="note">
	<p>
		Not sure which programs you currently qualify for? <a href="/tools/screener">The Benefits
		Screener</a> can check your eligibility. Need to know what documents to bring? <a
			href="/tools/document-checklist">The Document Checklist</a> has one de-duplicated list.
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
	.cliff-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	select {
		font-family: var(--font);
		font-size: 1.125rem;
		padding: 0.75rem 1rem;
		border: 2px solid var(--border);
		border-radius: var(--radius);
		background: white;
		color: var(--dark);
		width: 100%;
		min-height: 48px;
	}

	select:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 2px;
	}

	.checkbox-field {
		gap: var(--space-xs);
	}

	.checkbox-label {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		cursor: pointer;
		font-weight: 400;
	}

	.checkbox-label input[type='checkbox'] {
		flex-shrink: 0;
		width: 1.125rem;
		height: 1.125rem;
		margin-top: 2px;
		accent-color: var(--terracotta);
		cursor: pointer;
	}

	.paycheck-toggle {
		font-size: 0.875rem;
		margin-top: var(--space-xs);
		align-self: flex-start;
	}

	.paycheck-calc {
		background: var(--surface);
		border-radius: var(--radius);
		padding: var(--space-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		margin-top: var(--space-xs);
	}

	.paycheck-row {
		display: flex;
		gap: var(--space-sm);
	}

	.paycheck-field {
		flex: 1;
		margin-bottom: 0;
	}

	.paycheck-result {
		font-size: 0.9375rem;
		color: var(--text);
	}

	.paycheck-actions {
		display: flex;
		gap: var(--space-sm);
		align-items: center;
	}

	.paycheck-use {
		flex: 1;
		font-size: 0.9375rem;
		padding: 0.625rem 1rem;
	}

	.submit-hint {
		margin-top: var(--space-xs);
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

	/* Comparison grid */
	.comparison-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		margin-bottom: var(--space-lg);
	}

	@media (min-width: 560px) {
		.comparison-grid {
			flex-direction: row;
		}

		.scenario-card {
			flex: 1;
		}
	}

	.scenario-card {
		background: white;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-md);
	}

	.scenario-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
		margin-bottom: var(--space-xs);
	}

	.scenario-income {
		font-size: 1.5rem;
		font-weight: 800;
		color: var(--dark);
		margin-bottom: var(--space-md);
		letter-spacing: -0.01em;
	}

	.per-month {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--muted);
	}

	.program-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.program-row {
		padding: var(--space-sm) 0;
		border-top: 1px solid var(--border);
	}

	.program-row.changing {
		background: var(--cream);
		margin: 0 calc(-1 * var(--space-md));
		padding: var(--space-sm) var(--space-md);
		border-top: 1px solid var(--border);
	}

	.program-name {
		display: block;
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--muted);
		margin-bottom: 2px;
	}

	.program-value {
		display: block;
		font-size: 0.9375rem;
		font-weight: 700;
	}

	.program-value.eligible {
		color: var(--olive);
	}

	.program-value.ineligible {
		color: var(--muted);
		font-weight: 400;
	}

	.estimated-tag {
		font-size: 0.75rem;
		font-weight: 400;
		color: var(--muted);
	}

	.change-flag {
		font-size: 0.75rem;
		font-weight: 700;
		color: var(--terracotta);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-left: var(--space-xs);
	}

	/* Verdict box */
	.verdict-box {
		border-radius: var(--radius);
		padding: var(--space-md);
		margin-bottom: var(--space-lg);
	}

	.verdict-gain {
		background: var(--cream);
		border-left: 4px solid var(--olive);
	}

	.verdict-cliff {
		background: var(--surface);
		border-left: 4px solid var(--terracotta);
	}

	.verdict-neutral {
		background: var(--surface);
		border-left: 4px solid var(--border);
	}

	.verdict-table {
		display: flex;
		flex-direction: column;
		gap: 4px;
		margin-bottom: var(--space-sm);
	}

	.verdict-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-md);
		font-size: 0.9375rem;
		padding: 4px 0;
		border-bottom: 1px solid var(--border);
	}

	.verdict-total {
		font-weight: 700;
		border-bottom: none;
		padding-top: var(--space-xs);
	}

	.verdict-label {
		color: var(--text);
	}

	.verdict-value {
		color: var(--dark);
		white-space: nowrap;
	}

	.verdict-summary {
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text);
		margin-top: var(--space-sm);
	}

	/* Medi-Cal note */
	.medi-cal-note {
		background: var(--cream);
		border-left: 3px solid var(--olive);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		margin-bottom: var(--space-lg);
		font-size: 0.9375rem;
		line-height: 1.6;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.medi-cal-heading {
		font-weight: 700;
		color: var(--dark);
	}

	.medi-cal-link a {
		font-weight: 600;
	}

	.medi-cal-warning {
		font-size: 0.8125rem;
		color: var(--muted);
	}

	/* Chart */
	.chart-section {
		margin-bottom: var(--space-lg);
	}

	.chart-heading {
		font-size: 0.8125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted);
		margin-bottom: var(--space-xs);
	}

	.chart-description {
		font-size: 0.8125rem;
		color: var(--muted);
		margin-bottom: var(--space-sm);
		line-height: 1.5;
	}

	.chart-wrap {
		background: white;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-sm);
		overflow: hidden;
	}

	.chart-note {
		font-size: 0.75rem;
		color: var(--muted);
		margin-top: var(--space-xs);
		line-height: 1.5;
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

	:global(.line-reference) {
		fill: none;
		stroke: var(--border);
		stroke-width: 1.5;
		stroke-dasharray: 4 4;
	}

	:global(.line-resources) {
		fill: none;
		stroke: var(--terracotta);
		stroke-width: 2.5;
		stroke-linejoin: round;
		stroke-linecap: round;
	}

	:global(.marker-current) {
		stroke: var(--muted);
		stroke-width: 1.5;
		stroke-dasharray: 4 3;
	}

	:global(.marker-proposed) {
		stroke: var(--dark);
		stroke-width: 1.5;
		stroke-dasharray: 4 3;
	}

	:global(.dot-current) {
		fill: var(--muted);
	}

	:global(.dot-proposed) {
		fill: var(--dark);
	}

	:global(.marker-label) {
		font-family: var(--font);
		font-size: 10px;
		fill: var(--muted);
		font-weight: 600;
	}

	/* Employer questions */
	.employer-questions {
		background: var(--surface);
		border-radius: var(--radius);
		padding: var(--space-md);
		margin-bottom: var(--space-lg);
	}

	.eq-heading {
		font-weight: 700;
		color: var(--dark);
		margin-bottom: var(--space-sm);
		font-size: 0.9375rem;
	}

	.eq-list {
		list-style: disc;
		padding-left: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		font-size: 0.9375rem;
		line-height: 1.55;
		color: var(--text);
	}

	.eq-note {
		font-size: 0.8125rem;
		color: var(--muted);
		margin-top: var(--space-sm);
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

	.sources-updated {
		font-size: 0.75rem;
		color: var(--muted);
		margin-top: var(--space-sm);
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
		.cliff-form,
		.breadcrumb,
		.signpost-footer,
		.employer-questions {
			display: none !important;
		}
	}
</style>
