<script lang="ts">
	import { tick } from 'svelte';
	import {
		calculateHours,
		type PayFrequency,
		type FilingStatus
	} from '$lib/calculators/hours';
	import federalBracketData from '$lib/data/federal-brackets-2026.json';
	import stateTaxData from '$lib/data/state-income-tax-2026.json';

	const IRS_SOURCE =
		'https://www.irs.gov/newsroom/irs-releases-tax-inflation-adjustments-for-tax-year-2026-including-amendments-from-the-one-big-beautiful-bill';
	const SSA_SOURCE = 'https://www.ssa.gov/oact/cola/cbb.html';

	// State options for this tool's V1 scope. "Other" runs federal-only, no state tax.
	const STATE_OPTIONS: { code: string; name: string }[] = [
		{ code: 'CA', name: 'California' },
		{ code: 'TX', name: 'Texas' },
		{ code: 'FL', name: 'Florida' },
		{ code: 'NY', name: 'New York' },
		{ code: 'AZ', name: 'Arizona' },
		{ code: 'other', name: 'Other / not listed' }
	];

	const FILING_OPTIONS: { value: FilingStatus; label: string }[] = [
		{ value: 'single', label: 'Single' },
		{ value: 'married_filing_jointly', label: 'Married filing jointly' },
		{ value: 'head_of_household', label: 'Head of household' }
	];

	const FREQUENCIES: { value: PayFrequency; label: string }[] = [
		{ value: 'weekly', label: 'Weekly' },
		{ value: 'biweekly', label: 'Bi-weekly' },
		{ value: 'semimonthly', label: 'Semi-monthly' },
		{ value: 'monthly', label: 'Monthly' }
	];

	// Default hours that match a 40-hour week for each frequency.
	const DEFAULT_HOURS: Record<PayFrequency, number> = {
		weekly: 40,
		biweekly: 80,
		semimonthly: 87, // ~2080/24, rounded
		monthly: 173 // ~2080/12, rounded
	};

	// --- Inputs ---------------------------------------------------------------
	let payFrequency = $state<PayFrequency>('biweekly');
	let grossPay = $state('');
	// Track whether the user has hand-edited hours; if not, hours follow the
	// frequency default so the field is never silently wrong after a switch.
	let hoursTouched = $state(false);
	let hoursInput = $state(String(DEFAULT_HOURS.biweekly));
	let preTaxInput = $state('');
	let filingStatus = $state<FilingStatus>('single');
	let selectedState = $state('CA');
	let showEmployerMatch = $state(false);

	function selectFrequency(freq: PayFrequency) {
		payFrequency = freq;
		if (!hoursTouched) {
			hoursInput = String(DEFAULT_HOURS[freq]);
		}
	}

	function onHoursInput() {
		hoursTouched = true;
	}

	// Roving arrow-key navigation for the pay-frequency radiogroup (WCAG radio).
	const freqIndex = $derived(FREQUENCIES.findIndex((f) => f.value === payFrequency));
	function onFreqKeydown(e: KeyboardEvent) {
		const count = FREQUENCIES.length;
		let next = freqIndex;
		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			next = (freqIndex + 1) % count;
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			next = (freqIndex - 1 + count) % count;
		} else {
			return;
		}
		e.preventDefault();
		selectFrequency(FREQUENCIES[next].value);
		const group = e.currentTarget as HTMLElement;
		const buttons = group.querySelectorAll<HTMLElement>('[role="radio"]');
		buttons[next]?.focus();
	}

	// --- Parsed numeric inputs ------------------------------------------------
	const gross = $derived(Math.max(parseFloat(grossPay) || 0, 0));
	const hoursWorked = $derived(Math.max(parseFloat(hoursInput) || 0, 0));
	const preTax = $derived(Math.max(parseFloat(preTaxInput) || 0, 0));

	// Required fields: gross pay and hours both present and positive.
	const ready = $derived(gross > 0 && hoursWorked > 0);

	const result = $derived(
		calculateHours({
			grossPayPerPeriod: gross,
			payFrequency,
			hoursWorkedPerPeriod: hoursWorked,
			preTaxDeductions: preTax,
			filingStatus,
			state: selectedState,
			stateTaxData,
			federalBracketData
		})
	);

	// --- Formatting -----------------------------------------------------------
	function money(n: number): string {
		return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
	}

	function minutesLabel(min: number): string {
		const rounded = Math.round(min);
		return rounded === 1 ? '1 min' : `${rounded} min`;
	}

	// Workday bar segments, built from the minutes-per-hour breakdown so each
	// segment width is proportional to that category's share of an hour worked.
	const segments = $derived([
		{ key: 'federal', label: 'Federal tax', minutes: result.minutesPerHourForFederal, cssVar: 'seg-federal' },
		{ key: 'fica', label: 'FICA', minutes: result.minutesPerHourForFICA, cssVar: 'seg-fica' },
		{ key: 'state', label: 'State tax', minutes: result.minutesPerHourForState, cssVar: 'seg-state' },
		{ key: 'pretax', label: 'Pre-tax', minutes: result.minutesPerHourForPreTax, cssVar: 'seg-pretax' },
		{ key: 'net', label: 'Yours', minutes: result.minutesPerHourForNet, cssVar: 'seg-net' }
	]);

	// Only render segments that hold at least a sliver of time.
	const visibleSegments = $derived(segments.filter((s) => s.minutes > 0));

	// Plain-text description of the bar for screen readers.
	const barAria = $derived(
		`Of every hour you work, this is where the time goes: ` +
			segments
				.filter((s) => s.minutes > 0)
				.map((s) => `${minutesLabel(s.minutes)} for ${s.label.toLowerCase()}`)
				.join(', ') +
			'.'
	);

	// State display name for callouts.
	const stateName = $derived(STATE_OPTIONS.find((s) => s.code === selectedState)?.name ?? '');
	const hasStateTax = $derived(result.stateIncomeTax > 0);

	let resultsEl: HTMLElement | null = $state(null);
	let firstReadyShown = false;

	$effect(() => {
		if (ready) {
			if (!firstReadyShown && resultsEl) {
				firstReadyShown = true;
				resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
				resultsEl.focus();
			}
		} else {
			firstReadyShown = false;
		}
	});
</script>

<svelte:head>
	<title>Work Hours Breakdown | Finxiety</title>
	<meta
		name="description"
		content="Where does each hour of work actually go? See your pay broken down by taxes, deductions, and take-home — in time, not just dollars."
	/>
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>Where do your work hours actually go?</h1>
<p class="tool-description">
	A pay stub shows your deductions in dollars. This shows them in time — how many minutes of each
	hour you work fund taxes, deductions, and your own take-home pay.
</p>

<hr class="divider" />

<form class="hours-form" onsubmit={(e) => e.preventDefault()} novalidate>
	<!-- 1. Pay frequency -->
	<div class="field">
		<span class="group-label" id="freq-label">How often are you paid?</span>
		<div
			class="segmented segmented-wrap"
			role="radiogroup"
			aria-labelledby="freq-label"
			tabindex="-1"
			onkeydown={onFreqKeydown}
		>
			{#each FREQUENCIES as freq, i}
				<button
					type="button"
					class="btn btn-toggle"
					class:selected={payFrequency === freq.value}
					role="radio"
					aria-checked={payFrequency === freq.value}
					tabindex={freqIndex === i ? 0 : -1}
					onclick={() => selectFrequency(freq.value)}
				>
					{freq.label}
				</button>
			{/each}
		</div>
	</div>

	<!-- 2. Gross pay per period -->
	<div class="field">
		<label for="gross">Gross pay this period</label>
		<p class="field-hint">Before any taxes or deductions come out.</p>
		<div class="input-prefix-wrap">
			<span class="input-prefix" aria-hidden="true">$</span>
			<input
				id="gross"
				type="number"
				inputmode="decimal"
				min="0"
				step="0.01"
				placeholder="0.00"
				bind:value={grossPay}
			/>
		</div>
	</div>

	<!-- 3. Hours worked per period -->
	<div class="field">
		<label for="hours">Hours worked this period</label>
		<p class="field-hint">Defaults to a 40-hour week for your pay schedule. Change it if yours differs.</p>
		<input
			id="hours"
			type="number"
			inputmode="decimal"
			min="0"
			step="0.5"
			bind:value={hoursInput}
			oninput={onHoursInput}
		/>
	</div>

	<!-- 4. Pre-tax deductions -->
	<div class="field">
		<label for="pretax">Pre-tax deductions this period <span class="optional">(optional)</span></label>
		<p class="field-hint">401(k), health insurance, HSA, etc. Leave blank if none.</p>
		<div class="input-prefix-wrap">
			<span class="input-prefix" aria-hidden="true">$</span>
			<input
				id="pretax"
				type="number"
				inputmode="decimal"
				min="0"
				step="0.01"
				placeholder="0.00"
				bind:value={preTaxInput}
			/>
		</div>
	</div>

	<!-- 5. Filing status -->
	<div class="field">
		<label for="filing">Federal filing status</label>
		<select id="filing" bind:value={filingStatus}>
			{#each FILING_OPTIONS as opt}
				<option value={opt.value}>{opt.label}</option>
			{/each}
		</select>
	</div>

	<!-- 6. State -->
	<div class="field">
		<label for="state">Your state</label>
		<select id="state" bind:value={selectedState}>
			{#each STATE_OPTIONS as opt}
				<option value={opt.code}>{opt.name}</option>
			{/each}
		</select>
		<p class="field-hint">V1 covers CA, TX, FL, NY, and AZ. "Other" estimates federal taxes only.</p>
	</div>
</form>

<!-- Results -->
<section class="results" aria-live="polite" aria-label="Your work-hours breakdown" tabindex="-1" bind:this={resultsEl}>
	{#if ready}
		<!-- Workday bar -->
		<div class="result-block">
			<h2 class="result-heading">Every hour you work</h2>
			<div class="workday-bar-scroll">
				<div class="workday-bar" role="img" aria-label={barAria}>
					{#each visibleSegments as seg (seg.key)}
						<div
							class="bar-seg bar-{seg.cssVar}"
							style="flex-grow: {seg.minutes};"
						>
							<span class="bar-seg-min" aria-hidden="true">{Math.round(seg.minutes)}</span>
						</div>
					{/each}
				</div>
			</div>
			<ul class="bar-legend" aria-hidden="true">
				{#each visibleSegments as seg (seg.key)}
					<li>
						<span class="legend-swatch bar-{seg.cssVar}"></span>
						<span class="legend-label">{seg.label}</span>
						<span class="legend-min">{minutesLabel(seg.minutes)}/hr</span>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Until yours -->
		<div class="result-block until-block">
			<p class="until-line">
				On an 8-hour day starting at 9:00 AM, you work until
				<strong>{result.timeUntilYoursFormatted}</strong>
				before any of that day's pay is yours to keep.
			</p>
			<p class="estimate-note">This is an estimate based on the numbers you entered.</p>
		</div>

		<!-- Per-period breakdown -->
		<div class="result-block">
			<h2 class="result-heading">Your {payFrequency === 'biweekly' ? 'bi-weekly' : payFrequency} pay</h2>
			<table class="breakdown">
				<tbody>
					<tr>
						<th scope="row">Gross pay</th>
						<td>{money(result.grossPay)}</td>
					</tr>
					{#if result.preTaxDeductions > 0}
						<tr>
							<th scope="row">Pre-tax deductions</th>
							<td class="deduct">−{money(result.preTaxDeductions)}</td>
						</tr>
					{/if}
					<tr>
						<th scope="row">Federal income tax</th>
						<td class="deduct">−{money(result.federalIncomeTax)}</td>
					</tr>
					<tr>
						<th scope="row">Social Security (6.2%)</th>
						<td class="deduct">−{money(result.socialSecurity)}</td>
					</tr>
					<tr class="credits-caveat-row">
						<td colspan="2">
							<p class="credits-caveat">Credits like the Earned Income Tax Credit and Child Tax Credit can reduce the federal tax line or produce a refund — they're not modeled here. <a href="/tools/tax-clarity">Tax Clarity</a> shows how credits work, or check <a href="https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc" target="_blank" rel="noopener noreferrer">IRS EITC info</a> to see if one applies to you.</p>
						</td>
					</tr>
					<tr>
						<th scope="row">Medicare (1.45%)</th>
						<td class="deduct">−{money(result.medicare)}</td>
					</tr>
					{#if hasStateTax}
						<tr>
							<th scope="row">{stateName} income tax</th>
							<td class="deduct">−{money(result.stateIncomeTax)}</td>
						</tr>
					{/if}
					<tr class="net-row">
						<th scope="row">Take-home pay</th>
						<td>{money(result.netPay)}</td>
					</tr>
				</tbody>
			</table>
			<p class="estimate-note">This is an estimate based on the numbers you entered.</p>
		</div>

		<!-- Annual rollup -->
		<div class="result-block annual-block">
			<h2 class="result-heading">Over a full year</h2>
			<div class="annual-grid">
				<div class="annual-stat">
					<span class="annual-value">{money(result.annualGross)}</span>
					<span class="annual-label">Gross pay</span>
				</div>
				<div class="annual-stat">
					<span class="annual-value">{money(result.annualNet)}</span>
					<span class="annual-label">Take-home pay</span>
				</div>
				<div class="annual-stat">
					<span class="annual-value">{result.daysWorkedForTaxesPerYear.toFixed(1)}</span>
					<span class="annual-label">8-hour days worked for taxes</span>
				</div>
			</div>
			<p class="annual-note">
				At this rate, about {result.daysWorkedForTaxesPerYear.toFixed(1)} full 8-hour days of your
				working year fund federal tax, state tax, and FICA combined.
			</p>
			<p class="estimate-note">This is an estimate based on the numbers you entered.</p>
		</div>

		<!-- Employer FICA toggle -->
		<div class="result-block">
			<button
				type="button"
				class="match-toggle"
				onclick={() => (showEmployerMatch = !showEmployerMatch)}
				aria-expanded={showEmployerMatch}
				aria-controls="employer-match"
			>
				{showEmployerMatch ? 'Hide' : 'Show'} the hidden employer-side FICA match
			</button>
			{#if showEmployerMatch}
				<div class="signpost-box" id="employer-match" role="note">
					<p>
						Your employer also pays 6.2% Social Security and 1.45% Medicare on your behalf — an
						additional <strong>{money(result.employerFica)}</strong> per pay period that never appears
						on your stub. It's part of what your work costs, even though you don't see it.
					</p>
					<p class="estimate-note">This is an estimate based on the numbers you entered.</p>
				</div>
			{/if}
		</div>

		<!-- Benefits signpost -->
		<div class="benefits-signpost" role="note">
			<p>Looking at take-home pay alongside what programs might be available is often useful together. <a href="/tools/screener">The Benefits Screener</a> checks programs like SNAP and Medi-Cal based on income and household size — no account needed.</p>
		</div>

		<!-- SSI / SSDI scope note -->
		<div class="scope-note" role="note">
			<p>This tool models gross earned wages. If you receive SSDI, earnings above the Substantial Gainful Activity threshold (~$1,550/month in 2026 for non-blind recipients) can affect the benefit separately. If you receive SSI, a roughly $2,000 resource limit applies. <a href="https://www.calable.ca.gov/" target="_blank" rel="noopener noreferrer">ABLE accounts (CalABLE in California)</a> let eligible people save above that SSI limit without it counting toward eligibility.</p>
		</div>
	{:else}
		<p class="results-empty">
			Enter your gross pay and hours worked to see where each hour of work goes.
		</p>
	{/if}
</section>

<!-- Sources -->
<div class="sources" role="note">
	<p class="sources-title">Where these numbers come from</p>
	<ul>
		<li>
			Federal income tax brackets and standard deductions:
			<a href={IRS_SOURCE} target="_blank" rel="noopener noreferrer">IRS, tax year 2026</a>
		</li>
		<li>
			Social Security and Medicare rates and the Social Security wage base:
			<a href={SSA_SOURCE} target="_blank" rel="noopener noreferrer">SSA, 2026</a>
		</li>
		<li>
			State income tax:
			<a
				href="https://www.ftb.ca.gov/file/personal/tax-calculator-tables-rates.html"
				target="_blank"
				rel="noopener noreferrer">California FTB</a
			>,
			<a href="https://www.tax.ny.gov/pit/file/tax_tables.htm" target="_blank" rel="noopener noreferrer"
				>New York DTF</a
			>,
			<a href="https://azdor.gov/forms/individual-income-tax-highlights" target="_blank" rel="noopener noreferrer"
				>Arizona DOR</a
			>. Texas and Florida have no state income tax.
		</li>
	</ul>
	<p class="sources-fine">
		Estimates use marginal tax brackets applied to your annualized pay. They don't include tax
		credits, local or city income tax, additional Medicare tax on high earners, or state-specific
		deductions, so your actual withholding and final tax may differ.
	</p>
</div>

<div class="signpost-footer" role="note">
	<p>
		Wondering what a deduction is actually worth, or how a refund works? <a href="/tools/tax-clarity">Tax Clarity</a> breaks both down in plain language.
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

	.group-label {
		font-weight: 600;
		font-size: 0.9375rem;
	}

	.optional {
		font-weight: 400;
		color: var(--muted);
	}

	/* Segmented control */
	.segmented {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
		margin-top: var(--space-xs);
	}

	.segmented .btn-toggle {
		flex: 1 1 auto;
		min-width: 88px;
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
		padding: var(--space-sm);
	}

	.segmented .btn-toggle:hover {
		border-color: var(--terracotta);
	}

	.segmented .btn-toggle.selected {
		border-color: var(--terracotta);
		background: var(--terracotta);
		color: white;
	}

	.segmented .btn-toggle:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 2px;
	}

	/* Dollar prefix inputs */
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

	/* Results */
	.results {
		margin-top: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.results-empty {
		font-size: 0.9375rem;
		color: var(--muted);
		background: var(--surface);
		border-radius: var(--radius);
		padding: var(--space-md);
	}

	.result-block {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.result-heading {
		font-size: 1.125rem;
	}

	/* Workday bar */
	.workday-bar-scroll {
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
	}

	.workday-bar {
		display: flex;
		width: 100%;
		min-width: 320px;
		height: 56px;
		border-radius: var(--radius);
		overflow: hidden;
		border: 1px solid var(--border);
	}

	.bar-seg {
		flex-basis: 0;
		min-width: 28px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 0.8125rem;
		font-weight: 700;
	}

	.bar-seg-min {
		padding: 0 0.25rem;
		text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
	}

	/* Segment colors — derived from brand tokens, each visually distinct and
	   all meeting 4.5:1 with white text. */
	.bar-seg-federal {
		background: var(--terracotta);
	}
	.bar-seg-fica {
		background: var(--copper);
	}
	.bar-seg-state {
		background: #7a5230; /* darker copper derivative, distinct from FICA */
	}
	.bar-seg-pretax {
		background: var(--muted);
	}
	.bar-seg-net {
		background: var(--pine); /* --olive/#6B8A78 failed 4.5:1 with white text; pine passes at ~9.5:1 */
	}

	/* Legend */
	.bar-legend {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		margin-top: var(--space-xs);
	}

	.bar-legend li {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		font-size: 0.875rem;
	}

	.legend-swatch {
		width: 16px;
		height: 16px;
		border-radius: 3px;
		flex-shrink: 0;
	}

	.legend-label {
		flex: 1;
		color: var(--text);
		font-weight: 600;
	}

	.legend-min {
		color: var(--muted);
		font-variant-numeric: tabular-nums;
	}

	/* Until-yours */
	.until-block {
		background: var(--surface);
		border-radius: var(--radius);
		padding: var(--space-md);
	}

	.until-line {
		font-size: 1.0625rem;
		line-height: 1.6;
		color: var(--text);
	}

	.until-line strong {
		color: var(--dark);
		white-space: nowrap;
	}

	.estimate-note {
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.5;
	}

	/* Breakdown table */
	.breakdown {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9375rem;
	}

	.breakdown th,
	.breakdown td {
		padding: var(--space-sm) 0;
		text-align: left;
		border-bottom: 1px solid var(--border);
	}

	.breakdown th {
		font-weight: 600;
		color: var(--text);
	}

	.breakdown td {
		text-align: right;
		font-variant-numeric: tabular-nums;
		font-weight: 700;
		color: var(--dark);
		white-space: nowrap;
	}

	.breakdown td.deduct {
		color: var(--muted);
		font-weight: 600;
	}

	.breakdown .net-row th,
	.breakdown .net-row td {
		border-bottom: none;
		border-top: 2px solid var(--dark);
		padding-top: var(--space-sm);
		font-size: 1.0625rem;
	}

	.breakdown .net-row td {
		color: var(--pine);
	}

	/* Annual rollup */
	.annual-block {
		background: var(--cream);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-md);
	}

	.annual-grid {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-md);
	}

	.annual-stat {
		flex: 1 1 8rem;
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
	}

	.annual-value {
		font-size: 1.25rem;
		font-weight: 800;
		color: var(--dark);
		font-variant-numeric: tabular-nums;
	}

	.annual-label {
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.4;
	}

	.annual-note {
		font-size: 0.9375rem;
		color: var(--text);
		line-height: 1.6;
	}

	/* Employer match toggle */
	.match-toggle {
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font);
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--terracotta);
		text-decoration: underline;
		text-underline-offset: 3px;
		padding: 0;
		min-height: 44px;
		display: flex;
		align-items: center;
		text-align: left;
	}

	.match-toggle:hover {
		color: var(--copper);
	}

	.match-toggle:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 2px;
		border-radius: var(--radius);
	}

	.signpost-box {
		background: var(--cream);
		border-left: 3px solid var(--olive);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	/* Sources */
	.sources {
		margin-top: var(--space-lg);
		padding: var(--space-md);
		background: var(--surface);
		border-radius: var(--radius);
		font-size: 0.875rem;
		color: var(--muted);
	}

	.sources-title {
		font-weight: 700;
		color: var(--text);
		margin-bottom: var(--space-xs);
	}

	.sources ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		margin-bottom: var(--space-sm);
	}

	.sources li {
		line-height: 1.5;
	}

	.sources a {
		color: var(--terracotta);
	}

	.sources-fine {
		font-size: 0.8125rem;
		line-height: 1.5;
	}

	.signpost-footer {
		margin-top: var(--space-lg);
		padding: var(--space-md);
		background: var(--surface);
		border-radius: var(--radius);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--muted);
	}

	.signpost-footer a {
		color: var(--terracotta);
	}

	@media (min-width: 480px) {
		.bar-legend {
			flex-direction: row;
			flex-wrap: wrap;
			gap: var(--space-md);
		}

		.bar-legend li {
			flex: 0 1 auto;
		}

		.legend-label {
			flex: 0 0 auto;
		}
	}

	/* EITC credits caveat row */
	.credits-caveat-row td {
		padding: 0;
	}

	.credits-caveat {
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.5;
		padding: var(--space-xs) var(--space-sm);
		background: var(--surface);
		border-radius: var(--radius);
		margin: var(--space-xs) 0 0;
	}

	.credits-caveat a {
		color: var(--pine);
	}

	/* Benefits signpost */
	.benefits-signpost {
		background: var(--surface);
		border-left: 3px solid var(--pine);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-sm) var(--space-md);
		margin-bottom: var(--space-md);
		font-size: 0.9375rem;
		line-height: 1.6;
	}

	.benefits-signpost a {
		color: var(--pine);
	}

	/* SSI/SSDI scope note */
	.scope-note {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-sm) var(--space-md);
		margin-bottom: var(--space-md);
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.6;
	}

	.scope-note a {
		color: var(--pine);
	}

	/* Focus ring for the results section (programmatic focus target) */
	.results:focus-visible {
		outline: none;
	}
</style>
