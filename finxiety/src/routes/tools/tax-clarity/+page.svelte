<script lang="ts">
	import { tick } from 'svelte';
	import {
		calcDeduction,
		calcCredit,
		calcRefund,
		isFilingStatus,
		formatDollars,
		formatDollarsCents,
		formatPercent,
		FILING_STATUS_LABELS,
		type BracketData,
		type FilingStatus,
		type DeductionResult,
		type CreditResult,
		type RefundResult
	} from '$lib/calculators/deduct';
	import rawData from '$lib/data/federal-brackets-2026.json';

	const data = rawData as BracketData;
	const SOURCE_URL = data.verify_at;

	type Mode = 'deduction' | 'credit' | 'refund';

	const modeOptions: { key: Mode; label: string; desc: string }[] = [
		{
			key: 'deduction',
			label: 'A tax deduction',
			desc: 'Something that lowers the income you’re taxed on.'
		},
		{
			key: 'credit',
			label: 'A tax credit',
			desc: 'Something subtracted straight from the tax you owe.'
		},
		{
			key: 'refund',
			label: 'A tax refund',
			desc: 'Money that came back to you after you filed.'
		}
	];

	const filingOptions: FilingStatus[] = [
		'single',
		'married_filing_jointly',
		'married_filing_separately',
		'head_of_household'
	];

	let step = $state<1 | 2>(1);
	let mode = $state<Mode | null>(null);
	let stepHeadingEl: HTMLElement | null = $state(null);
	let deductionResultEl: HTMLElement | null = $state(null);
	let creditResultEl: HTMLElement | null = $state(null);
	let refundResultEl: HTMLElement | null = $state(null);

	// Deduction inputs
	let deductionAmount = $state<number | ''>('');
	let filingStatus = $state<FilingStatus>('single');
	let taxableIncome = $state<number | ''>('');

	// Credit input
	let creditAmount = $state<number | ''>('');

	// Refund input
	let refundAmount = $state<number | ''>('');

	let error = $state('');

	let deductionResult = $state<DeductionResult | null>(null);
	let creditResult = $state<CreditResult | null>(null);
	let refundResult = $state<RefundResult | null>(null);

	async function chooseMode(m: Mode) {
		mode = m;
		error = '';
		step = 2;
		await tick();
		stepHeadingEl?.focus();
	}

	function parseAmount(raw: number | ''): number | null {
		if (raw === '' || typeof raw !== 'number') return null;
		if (isNaN(raw) || raw < 0) return null;
		return raw;
	}

	async function calculateDeduction(e: Event) {
		e.preventDefault();
		error = '';
		const amount = parseAmount(deductionAmount);
		const income = parseAmount(taxableIncome);
		if (amount === null || amount <= 0) {
			error = 'Enter the deduction amount you want to understand.';
			return;
		}
		if (income === null) {
			error = 'Enter your estimated taxable income so we can find your bracket.';
			return;
		}
		if (!isFilingStatus(filingStatus)) {
			error = 'Choose a filing status.';
			return;
		}
		deductionResult = calcDeduction(amount, income, filingStatus, data);
		await tick();
		deductionResultEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		deductionResultEl?.focus();
	}

	async function calculateCredit(e: Event) {
		e.preventDefault();
		error = '';
		const amount = parseAmount(creditAmount);
		if (amount === null || amount <= 0) {
			error = 'Enter the credit amount you want to understand.';
			return;
		}
		creditResult = calcCredit(amount, data);
		await tick();
		creditResultEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		creditResultEl?.focus();
	}

	async function calculateRefund(e: Event) {
		e.preventDefault();
		error = '';
		const amount = parseAmount(refundAmount);
		if (amount === null || amount <= 0) {
			error = 'Enter your most recent refund amount.';
			return;
		}
		refundResult = calcRefund(amount);
		await tick();
		refundResultEl?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		refundResultEl?.focus();
	}

	async function goBack() {
		error = '';
		deductionResult = null;
		creditResult = null;
		refundResult = null;
		mode = null;
		step = 1;
		await tick();
		stepHeadingEl?.focus();
	}

	async function startOver() {
		step = 1;
		mode = null;
		error = '';
		deductionAmount = '';
		filingStatus = 'single';
		taxableIncome = '';
		creditAmount = '';
		refundAmount = '';
		deductionResult = null;
		creditResult = null;
		refundResult = null;
		await tick();
		stepHeadingEl?.focus();
	}
</script>

<svelte:head>
	<title>Tax Clarity — Finxiety</title>
	<meta
		name="description"
		content="What a deduction actually saves you, what a credit is worth, and what your refund really means. Three plain-language answers, federal numbers, nothing saved."
	/>
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>Tax Clarity</h1>
<p class="tool-description">
	A deduction, a credit, and a refund are three different things, and the difference can be worth
	real money. Pick the one you want to understand, and we’ll show you the plain-language math.
</p>

<hr class="divider" />

{#key step}
	{#if step === 1}
		<section class="step">
			<h2 class="picker-heading" tabindex="-1" bind:this={stepHeadingEl}>Which one do you want to understand?</h2>
			<div class="mode-list" role="group" aria-label="Choose what to understand">
				{#each modeOptions as opt}
					<button class="mode-card" type="button" onclick={() => chooseMode(opt.key)}>
						<span class="mode-card-content">
							<span class="mode-card-label">{opt.label}</span>
							<span class="mode-card-desc">{opt.desc}</span>
						</span>
						<span class="mode-arrow" aria-hidden="true">→</span>
					</button>
				{/each}
			</div>
		</section>

		<!-- ============================ DEDUCTION ============================ -->
	{:else if step === 2 && mode === 'deduction'}
		<section class="step">
			<h2 class="picker-heading" tabindex="-1" bind:this={stepHeadingEl}>A tax deduction</h2>
			<p class="mode-intro">
				A deduction lowers the income you’re taxed on. So what it saves you depends on your tax
				bracket, not the full deduction amount.
			</p>

			<form onsubmit={calculateDeduction} novalidate>
				<div class="field">
					<label for="deduction-amount">
						Deduction amount <span class="required" aria-hidden="true">*</span>
					</label>
					<span class="field-hint" id="deduction-amount-hint">
						The size of the deduction you’re curious about.
					</span>
					<div class="input-prefix-wrap">
						<span class="input-prefix" aria-hidden="true">$</span>
						<input
							id="deduction-amount"
							type="number"
							inputmode="decimal"
							min="0"
							placeholder="e.g. 2000"
							bind:value={deductionAmount}
							aria-describedby="deduction-amount-hint"
							required
						/>
					</div>
				</div>

				<div class="field">
					<label for="filing-status">Filing status</label>
					<select id="filing-status" bind:value={filingStatus}>
						{#each filingOptions as status}
							<option value={status}>{FILING_STATUS_LABELS[status]}</option>
						{/each}
					</select>
				</div>

				<div class="field">
					<label for="taxable-income">
						Estimated taxable income <span class="required" aria-hidden="true">*</span>
					</label>
					<span class="field-hint" id="taxable-income-hint">
						A rough number is fine. This is your income after the standard deduction — roughly the
						taxable-income line on last year’s return. We only use it to find your bracket.
					</span>
					<div class="input-prefix-wrap">
						<span class="input-prefix" aria-hidden="true">$</span>
						<input
							id="taxable-income"
							type="number"
							inputmode="decimal"
							min="0"
							placeholder="e.g. 45000"
							bind:value={taxableIncome}
							aria-describedby="taxable-income-hint"
							required
						/>
					</div>
				</div>

				{#if error}
					<p class="error-msg" role="alert">{error}</p>
				{/if}

				<button class="btn btn-primary" type="submit">Show what it saves</button>
			</form>

			{#if deductionResult}
				<div class="result" aria-live="polite" tabindex="-1" bind:this={deductionResultEl}>
					{#if deductionResult.taxSavings === 0}
						<p class="result-lead">
							At your income level, this deduction doesn’t reduce your federal tax right now — the deduction amount exceeds or equals your taxable income.
						</p>
						<p class="result-sub">
							Some credits — like the Earned Income Tax Credit — are refundable and can pay you even when you owe $0 in tax. Free filing help is available at <a href="https://www.irs.gov/individuals/free-tax-return-preparation-for-qualifying-taxpayers" target="_blank" rel="noopener noreferrer">VITA sites</a> near you. The Credit tab shows how a credit works differently.
						</p>
					{:else}
						<p class="result-lead">
							A <strong>{formatDollars(deductionResult.deductionAmount)}</strong> deduction at your
							<strong>{formatPercent(deductionResult.marginalRate)}</strong> bracket lowers your tax by about
						</p>
						<p class="result-figure">{formatDollars(deductionResult.taxSavings)}</p>
						<p class="result-sub">
							— not {formatDollars(deductionResult.deductionAmount)}. A deduction comes off your income,
							so it saves you your bracket’s share of it.
						</p>

						<p class="illustrative-note">
							These are illustrative estimates based on 2026 federal brackets and your marginal rate.
							They don’t account for other income, phaseouts, or state taxes. They’re here to show the
							idea, not to file your return.
						</p>

						<div class="compare-box" role="note">
							<p class="box-label">If this were a credit instead</p>
							<p>
								The same {formatDollars(deductionResult.deductionAmount)} as a <em>credit</em> would lower
								your tax by the full {formatDollars(deductionResult.asCreditValue)}, dollar-for-dollar —
								about {formatDollars(deductionResult.difference)} more than the deduction. That’s the difference
								between the two.
							</p>
						</div>
					{/if}
				</div>
			{/if}
		</section>

		<!-- ============================= CREDIT ============================= -->
	{:else if step === 2 && mode === 'credit'}
		<section class="step">
			<h2 class="picker-heading" tabindex="-1" bind:this={stepHeadingEl}>A tax credit</h2>
			<p class="mode-intro">
				A credit comes straight off the tax you owe, dollar-for-dollar. That makes it worth more
				than a deduction of the same size.
			</p>

			<form onsubmit={calculateCredit} novalidate>
				<div class="field">
					<label for="credit-amount">
						Credit amount <span class="required" aria-hidden="true">*</span>
					</label>
					<span class="field-hint" id="credit-amount-hint">
						The size of the credit you’re curious about.
					</span>
					<div class="input-prefix-wrap">
						<span class="input-prefix" aria-hidden="true">$</span>
						<input
							id="credit-amount"
							type="number"
							inputmode="decimal"
							min="0"
							placeholder="e.g. 1000"
							bind:value={creditAmount}
							aria-describedby="credit-amount-hint"
							required
						/>
					</div>
				</div>

				{#if error}
					<p class="error-msg" role="alert">{error}</p>
				{/if}

				<button class="btn btn-primary" type="submit">Show what it’s worth</button>
			</form>

			{#if creditResult}
				<div class="result" aria-live="polite" tabindex="-1" bind:this={creditResultEl}>
					<p class="result-lead">
						A <strong>{formatDollars(creditResult.creditAmount)}</strong> credit reduces what you owe by
					</p>
					<p class="result-figure">{formatDollars(creditResult.reduction)}</p>
					<p class="result-sub">— the full amount, dollar-for-dollar.</p>

					<p class="illustrative-note">
						This is an illustrative comparison using 2026 federal brackets. Some credits are
						refundable and some aren’t, which changes what you actually receive. This shows the basic
						idea, not your full return.
					</p>

					<div class="compare-box" role="note">
						<p class="box-label">Why that beats a deduction</p>
						<p>
							A <em>deduction</em> of the same {formatDollars(creditResult.creditAmount)}, even at the
							top federal bracket of {formatPercent(creditResult.topRate)}, would save only about
							{formatDollars(creditResult.deductionAtTopRate)}. A credit is worth more than a deduction
							of the same size unless your bracket were 100%.
						</p>
					</div>
				</div>
			{/if}
		</section>

		<!-- ============================= REFUND ============================= -->
	{:else if step === 2 && mode === 'refund'}
		<section class="step">
			<h2 class="picker-heading" tabindex="-1" bind:this={stepHeadingEl}>A tax refund</h2>
			<p class="mode-intro">
				A refund is money that was already yours — withheld from your pay during the year and
				returned after you filed. Here’s another way to look at it.
			</p>

			<form onsubmit={calculateRefund} novalidate>
				<div class="field">
					<label for="refund-amount">
						Your most recent refund <span class="required" aria-hidden="true">*</span>
					</label>
					<span class="field-hint" id="refund-amount-hint">
						The amount you got back the last time you filed.
					</span>
					<div class="input-prefix-wrap">
						<span class="input-prefix" aria-hidden="true">$</span>
						<input
							id="refund-amount"
							type="number"
							inputmode="decimal"
							min="0"
							placeholder="e.g. 3000"
							bind:value={refundAmount}
							aria-describedby="refund-amount-hint"
							required
						/>
					</div>
				</div>

				{#if error}
					<p class="error-msg" role="alert">{error}</p>
				{/if}

				<button class="btn btn-primary" type="submit">Show what it means</button>
			</form>

			{#if refundResult}
				<div class="result" aria-live="polite" tabindex="-1" bind:this={refundResultEl}>
					<p class="result-lead">
						<strong>{formatDollars(refundResult.refundAmount)}</strong> ÷ 12 is about
					</p>
					<p class="result-figure">{formatDollarsCents(refundResult.monthlyEquivalent)}/month</p>
					<p class="result-sub">
						that you sent to the government across the year and got back, interest-free, after you
						filed.
					</p>

					<p class="illustrative-note">
						The earnings figure is illustrative and uses a sample rate; actual savings rates change
						over time. This isn’t advice about your withholding.
					</p>

					<div class="compare-box" role="note">
						<p class="box-label">Illustrative</p>
						<p>
							If that {formatDollarsCents(refundResult.monthlyEquivalent)} were set aside each month
							instead, in a savings account earning about {formatPercent(refundResult.hysaRate)} a year,
							it would earn roughly {formatDollarsCents(refundResult.illustrativeEarnings)} over the year.
							That’s a simple-interest illustration, not a prediction.
						</p>
					</div>

					<div class="neutral-box" role="note">
						<p>
							Some people prefer smaller refunds so their money works for them sooner. Others prefer
							a refund as a kind of forced savings they don’t have to think about. Neither is wrong —
							it’s about what fits your life.
						</p>
					</div>
				</div>
			{/if}
		</section>
	{/if}
{/key}

{#if step === 2}
	<div class="step-actions">
		<button class="btn btn-ghost" onclick={goBack} type="button">← Pick something else</button>
		<button class="btn btn-ghost" onclick={startOver} type="button">Start over</button>
	</div>
{/if}

<hr class="divider" />

<footer class="source-footer">
	<p>
		Bracket and standard-deduction figures are 2026 federal amounts. Verify against the official
		source: <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer"
			>IRS tax inflation adjustments for 2026</a
		>.
	</p>
</footer>

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

	.picker-heading {
		margin-bottom: var(--space-md);
	}

	/* Step 1 — mode picker */
	.mode-list {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.mode-card {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		width: 100%;
		text-align: left;
		background: white;
		border: 2px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-md);
		cursor: pointer;
		font-family: var(--font);
		color: inherit;
		min-height: 48px;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.mode-card:hover {
		border-color: var(--terracotta);
		box-shadow: 0 2px 8px rgba(193, 103, 76, 0.12);
	}

	.mode-card:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 2px;
	}

	.mode-card-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.mode-card-label {
		font-size: 1.0625rem;
		font-weight: 700;
		color: var(--dark);
	}

	.mode-card-desc {
		font-size: 0.9375rem;
		color: var(--muted);
		line-height: 1.5;
	}

	.mode-arrow {
		font-size: 1.25rem;
		color: var(--terracotta);
		flex-shrink: 0;
	}

	/* Step 2 — forms */
	.mode-intro {
		margin-bottom: var(--space-lg);
		color: var(--muted);
		max-width: 52ch;
		line-height: 1.6;
	}

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
		transition: border-color 0.15s;
	}

	select:focus {
		outline: none;
		border-color: var(--terracotta);
	}

	select:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 2px;
	}

	/* Result block */
	.result {
		margin-top: var(--space-lg);
		animation: fadeIn 0.2s ease;
	}

	.result-lead {
		font-size: 1rem;
		color: var(--text);
		line-height: 1.6;
	}

	.result-figure {
		font-size: clamp(2rem, 9vw, 2.75rem);
		font-weight: 800;
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--terracotta);
		margin: var(--space-xs) 0;
	}

	.result-sub {
		font-size: 0.9375rem;
		color: var(--muted);
		line-height: 1.6;
		max-width: 52ch;
	}

	.compare-box {
		background: var(--cream);
		border-left: 3px solid var(--terracotta);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		margin-top: var(--space-lg);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text);
	}

	.neutral-box {
		background: var(--surface);
		border-left: 3px solid var(--olive);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		margin-top: var(--space-md);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text);
	}

	.box-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: inherit;
		margin-bottom: var(--space-xs);
	}

	.illustrative-note {
		margin-top: var(--space-md);
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.55;
		max-width: 56ch;
	}

	.step-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-md);
		margin-top: var(--space-lg);
		padding-top: var(--space-md);
		border-top: 1px solid var(--border);
	}

	.source-footer {
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.55;
	}

	.source-footer a {
		color: var(--terracotta);
	}
</style>
