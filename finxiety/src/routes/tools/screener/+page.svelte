<script lang="ts">
	import { tick } from 'svelte';
	import { checkAllPrograms, type ProgramResult, type ScreenerInputs } from '$lib/eligibility';

	let householdSize = $state(1);
	let grossMonthlyIncome = $state('');
	let hasChildUnder5OrPregnant = $state(false);
	let hasSchoolAgeChild = $state(false);
	let step = $state<1 | 2>(1);
	let results = $state<ProgramResult[]>([]);
	let error = $state('');

	// Focus management
	let toolHeadingEl: HTMLHeadingElement | null = $state(null);
	let resultsHeadingEl: HTMLHeadingElement | null = $state(null);

	// Paycheck calculator
	let showPaycheckCalc = $state(false);
	let paycheckFrequency = $state<'biweekly' | 'weekly' | 'semimonthly' | 'monthly'>('biweekly');
	let paycheckAmount = $state('');
	let paycheckCalcTriggerEl: HTMLButtonElement | null = $state(null);
	let paycheckAmountInputEl: HTMLInputElement | null = $state(null);

	const MULTIPLIERS: Record<string, number> = {
		biweekly: 26 / 12,
		weekly: 52 / 12,
		semimonthly: 2,
		monthly: 1
	};

	const monthlyFromPaycheck = $derived.by(() => {
		const amount = Number(paycheckAmount);
		if (!paycheckAmount || isNaN(amount) || amount <= 0) return null;
		return Math.round(amount * MULTIPLIERS[paycheckFrequency]);
	});

	async function togglePaycheckCalc() {
		showPaycheckCalc = !showPaycheckCalc;
		if (showPaycheckCalc) {
			await tick();
			paycheckAmountInputEl?.focus();
		} else {
			paycheckCalcTriggerEl?.focus();
		}
	}

	function usePaycheckAmount() {
		if (monthlyFromPaycheck !== null) {
			grossMonthlyIncome = String(monthlyFromPaycheck);
			showPaycheckCalc = false;
			paycheckAmount = '';
			paycheckCalcTriggerEl?.focus();
		}
	}

	function cancelPaycheckCalc() {
		showPaycheckCalc = false;
		paycheckAmount = '';
		paycheckCalcTriggerEl?.focus();
	}

	async function calculate(e: Event) {
		e.preventDefault();
		error = '';

		const income = Number(grossMonthlyIncome);
		if (grossMonthlyIncome === '' || isNaN(income) || income < 0) {
			error = 'Enter your gross monthly income. Use $0 if you have no income right now.';
			return;
		}
		if (!householdSize || householdSize < 1) {
			error = 'Household size must be at least 1.';
			return;
		}

		const inputs: ScreenerInputs = {
			householdSize: Math.floor(householdSize),
			grossMonthlyIncome: income,
			state: 'CA',
			hasChildUnder5OrPregnant,
			hasSchoolAgeChild
		};

		results = checkAllPrograms(inputs);
		step = 2;
		await tick();
		resultsHeadingEl?.focus();

		if (typeof window !== 'undefined' && window.parent !== window) {
			const hasPrograms = results.some((r) => r.status === 'likely');
			window.parent.postMessage(
				{
					type: 'finxiety:complete',
					tool: 'screener',
					result: hasPrograms ? 'programs_found' : 'no_programs_found'
				},
				'*'
			);
		}
	}

	async function startOver() {
		step = 1;
		results = [];
		grossMonthlyIncome = '';
		hasChildUnder5OrPregnant = false;
		hasSchoolAgeChild = false;
		showPaycheckCalc = false;
		paycheckAmount = '';
		await tick();
		toolHeadingEl?.focus();
	}
</script>

<svelte:head>
	<title>Benefits Screener | Finxiety</title>
	<meta
		name="description"
		content="Check which California benefits programs you may qualify for, including CalFresh, Medi-Cal, WIC, Lifeline, HEAP, school meals, and CalEITC."
	/>
</svelte:head>

<!-- Persistent live region outside {#key} for reliable VoiceOver/Safari announcements -->
<div class="sr-only" aria-live="polite" aria-atomic="true">
	{#if step === 2 && results.length > 0}
		{results.filter((r) => r.status === 'likely').length} programs may apply to your household.
	{/if}
</div>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1 bind:this={toolHeadingEl} tabindex="-1">Benefits Screener</h1>
<p class="tool-description">
	Check which California benefits programs you may qualify for. Enter your household size and income
	and we will show you which programs to look into and where to apply.
</p>

<hr class="divider" />

{#key step}
	{#if step === 1}
		<form class="step" onsubmit={calculate} novalidate>
			<div class="field">
				<label for="household-size">People in your household</label>
				<span class="field-hint" id="household-size-hint">
					Include everyone you buy food and pay shared bills for.
				</span>
				<input
					id="household-size"
					type="number"
					inputmode="numeric"
					min="1"
					max="20"
					step="1"
					bind:value={householdSize}
					aria-describedby="household-size-hint"
				/>
			</div>

			<div class="field">
				<label for="income">
					Gross monthly income before taxes <span class="required" aria-hidden="true">*</span>
				</label>
				<div class="input-prefix-wrap">
					<span class="input-prefix" aria-hidden="true">$</span>
					<input
						id="income"
						type="number"
						inputmode="decimal"
						min="0"
						placeholder="e.g. 2200"
						bind:value={grossMonthlyIncome}
						aria-describedby="income-hint"
						required
					/>
				</div>
				<div class="income-field-footer">
					<span class="field-hint" id="income-hint">Enter $0 if you have no income right now.</span>
					<button
						class="paycheck-calc-trigger"
						type="button"
						bind:this={paycheckCalcTriggerEl}
						aria-expanded={showPaycheckCalc}
						aria-controls="paycheck-calc-panel"
						onclick={togglePaycheckCalc}
					>
						{showPaycheckCalc ? 'Hide calculator' : 'Calculate from paycheck'}
						<span aria-hidden="true">{showPaycheckCalc ? ' ▲' : ' ▼'}</span>
					</button>
				</div>

				{#if showPaycheckCalc}
					<div
						id="paycheck-calc-panel"
						class="paycheck-calc-panel"
						role="group"
						aria-label="Paycheck to monthly income calculator"
					>
						<div class="calc-field">
							<label for="paycheck-frequency">How often are you paid?</label>
							<select id="paycheck-frequency" bind:value={paycheckFrequency}>
								<option value="biweekly">Every 2 weeks</option>
								<option value="weekly">Every week</option>
								<option value="semimonthly">Twice a month</option>
								<option value="monthly">Once a month</option>
							</select>
						</div>

						<div class="calc-field">
							<label for="paycheck-amount">Gross pay per paycheck (before taxes)</label>
							<div class="input-prefix-wrap">
								<span class="input-prefix" aria-hidden="true">$</span>
								<input
									id="paycheck-amount"
									type="number"
									inputmode="decimal"
									min="0"
									placeholder="e.g. 1015"
									bind:value={paycheckAmount}
									bind:this={paycheckAmountInputEl}
								/>
							</div>
						</div>

						{#if monthlyFromPaycheck !== null}
							<div class="calc-result" aria-live="polite">
								<span class="calc-result-label">Estimated monthly gross income</span>
								<span class="calc-result-amount"
									>${monthlyFromPaycheck.toLocaleString('en-US')}</span
								>
							</div>
						{/if}

						<div class="calc-actions">
							{#if monthlyFromPaycheck !== null}
								<button class="btn btn-primary" type="button" onclick={usePaycheckAmount}>
									Use ${monthlyFromPaycheck.toLocaleString('en-US')}
								</button>
							{/if}
							<button class="btn btn-ghost calc-cancel" type="button" onclick={cancelPaycheckCalc}>
								Cancel
							</button>
						</div>
					</div>
				{/if}
			</div>

			<fieldset class="checkbox-group">
				<legend class="checkbox-group-legend">A few more details (optional, but helpful)</legend>
				<label class="checkbox-label">
					<input type="checkbox" bind:checked={hasChildUnder5OrPregnant} />
					<span class="checkbox-text">
						Someone in my household is pregnant, gave birth in the last 12 months, or is under age 5
					</span>
				</label>
				<label class="checkbox-label">
					<input type="checkbox" bind:checked={hasSchoolAgeChild} />
					<span class="checkbox-text">A school-age child (ages 5-18) is in my household</span>
				</label>
			</fieldset>

			{#if error}
				<p class="error-msg" role="alert">{error}</p>
			{/if}

			<button class="btn btn-primary" type="submit">Check programs</button>
		</form>
	{:else if step === 2}
		{@const likelyCount = results.filter((r) => r.status === 'likely').length}
		{@const visibleResults = results.filter((r) => r.status !== 'not_applicable')}
		<section class="step" aria-label="Eligibility results">
			<div class="results-header">
				{#if likelyCount > 0}
					<h2 bind:this={resultsHeadingEl} tabindex="-1">
						You may qualify for {likelyCount} program{likelyCount === 1 ? '' : 's'}.
					</h2>
				{:else}
					<h2 bind:this={resultsHeadingEl} tabindex="-1">
						These programs may not match your situation right now.
					</h2>
				{/if}
				<p class="results-note">
					These are estimates based on income only. Actual eligibility is determined by the
					administering agency.
				</p>
			</div>

			<ul class="program-list" role="list">
				{#each visibleResults as program (program.id)}
					<li
						class="program-card"
						class:program-card--likely={program.status === 'likely'}
						class:program-card--unlikely={program.status === 'unlikely'}
					>
						<div class="program-card-header">
							<h3 class="program-name">{program.name}</h3>
							{#if program.status === 'likely'}
								<span class="eligibility-tag eligibility-tag--likely">May qualify</span>
							{:else}
								<span class="eligibility-tag eligibility-tag--unlikely">Above limit</span>
							{/if}
						</div>

						{#if program.status === 'likely'}
							<p class="program-description">{program.description}</p>
							{#if program.estimatedBenefit}
								<p class="program-benefit">{program.estimatedBenefit}</p>
							{/if}
							<a
								href={program.applicationUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="btn btn-primary program-link"
								aria-label="{program.applicationLabel}, opens in new tab"
							>
								{program.applicationLabel} <span aria-hidden="true">→</span>
							</a>
							<p class="income-vs-limit">{program.incomeVsLimit}</p>
						{:else if program.nearLimit}
							<p class="near-limit-note">
								You are close to the income limit for this program. Limits update each October.
								Worth checking again if your income or household changes.
							</p>
							<p class="income-vs-limit">{program.incomeVsLimit}</p>
						{:else}
							<p class="above-limit-note">
								Income limits for this program are set by Congress and state agencies. They update
								annually each October.
							</p>
						{/if}
					</li>
				{/each}
			</ul>

			{#if likelyCount === 0}
				<div class="bridge-box" role="note">
					<p>
						The programs above have income limits that may not match your situation right now.
						Income limits are set by Congress and state agencies and update annually each October.
					</p>
					<p>
						The <a href="/tools/myth-quiz">Benefits Myth-Check Quiz</a> covers what these programs
						actually provide and why so many eligible families never enroll.
					</p>
				</div>
			{/if}

			<div class="results-footer">
				<p class="results-note">Currently covering California. More states coming soon.</p>
				<p class="results-note">
					Income limits are based on 2025 federal guidelines. They update annually each October.
				</p>
			</div>

			<div class="cross-tool-link">
				<a href="/tools/myth-quiz">Benefits Myth-Check Quiz →</a>
			</div>

			<button class="btn btn-ghost start-over-btn" onclick={startOver} type="button">
				Check another household
			</button>
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

	h1:focus-visible,
	h2:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 3px;
		border-radius: 2px;
	}

	/* Dollar prefix */
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

	/* Income field footer: hint + calculator trigger on one line */
	.income-field-footer {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: var(--space-md);
		flex-wrap: wrap;
		margin-top: var(--space-xs);
	}

	.income-field-footer .field-hint {
		margin-top: 0;
	}

	/* Paycheck calculator trigger button */
	.paycheck-calc-trigger {
		background: none;
		border: none;
		color: var(--terracotta);
		font-size: 0.875rem;
		font-family: var(--font);
		font-weight: 600;
		cursor: pointer;
		padding: 0;
		text-decoration: underline;
		text-underline-offset: 3px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.paycheck-calc-trigger:hover {
		color: var(--copper);
	}

	.paycheck-calc-trigger:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 3px;
		border-radius: 2px;
	}

	/* Paycheck calculator panel */
	.paycheck-calc-panel {
		margin-top: var(--space-sm);
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	/* Internal fields in the calculator */
	.calc-field {
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.calc-field label {
		font-weight: 600;
		font-size: 0.875rem;
		color: var(--text);
	}

	.calc-field select {
		font-family: var(--font);
		font-size: 1rem;
		padding: 0.75rem 1rem;
		border: 2px solid var(--border);
		border-radius: var(--radius);
		background: white;
		color: var(--dark);
		width: 100%;
		cursor: pointer;
	}

	.calc-field select:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 2px;
		border-color: var(--terracotta);
	}

	/* Result display */
	.calc-result {
		background: white;
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-sm) var(--space-md);
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.calc-result-label {
		font-size: 0.75rem;
		color: var(--muted);
		font-weight: 400;
	}

	.calc-result-amount {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--dark);
	}

	/* Actions row */
	.calc-actions {
		display: flex;
		gap: var(--space-sm);
		align-items: center;
	}

	.calc-actions .btn-primary {
		flex: 1;
	}

	.calc-cancel {
		min-height: 44px;
		padding: var(--space-xs) var(--space-sm);
	}

	/* Checkbox group */
	.checkbox-group {
		border: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.checkbox-group-legend {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text);
		margin-bottom: var(--space-sm);
		padding: 0;
	}

	.checkbox-label {
		display: flex;
		align-items: flex-start;
		gap: var(--space-sm);
		cursor: pointer;
	}

	.checkbox-label input[type='checkbox'] {
		margin-top: 0.2rem;
		flex-shrink: 0;
		width: 1.125rem;
		height: 1.125rem;
		accent-color: var(--terracotta);
		cursor: pointer;
	}

	.checkbox-text {
		font-size: 0.9375rem;
		color: var(--text);
		line-height: 1.5;
	}

	/* Results */
	.results-header {
		margin-bottom: var(--space-lg);
	}

	.results-header h2 {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--dark);
		margin-bottom: var(--space-xs);
	}

	.results-note {
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.5;
	}

	/* Program cards */
	.program-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		margin-bottom: var(--space-lg);
	}

	.program-card {
		border-radius: var(--radius);
		padding: var(--space-md);
		border: 2px solid var(--border);
	}

	.program-card--likely {
		border-color: var(--terracotta);
		background: white;
	}

	.program-card--unlikely {
		border-color: var(--border);
		background: var(--surface);
	}

	.program-card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: var(--space-sm);
		margin-bottom: var(--space-sm);
	}

	.program-name {
		font-size: 1rem;
		font-weight: 700;
		color: var(--dark);
		margin: 0;
	}

	.eligibility-tag {
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	.eligibility-tag--likely {
		background: var(--terracotta);
		color: white;
	}

	/* Use --text on --border background: passes WCAG 2.1 AA 4.5:1 */
	.eligibility-tag--unlikely {
		background: var(--border);
		color: var(--text);
	}

	.program-description {
		font-size: 0.9375rem;
		color: var(--text);
		line-height: 1.6;
		margin-bottom: var(--space-sm);
	}

	.program-benefit {
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--dark);
		margin-bottom: var(--space-md);
	}

	.program-link {
		display: inline-block;
		margin-bottom: var(--space-sm);
		text-decoration: none;
	}

	.income-vs-limit {
		font-size: 0.75rem;
		color: var(--muted);
		margin-top: var(--space-xs);
		margin-bottom: 0;
	}

	.near-limit-note {
		font-size: 0.9375rem;
		color: var(--muted);
		line-height: 1.6;
		font-style: italic;
		margin-bottom: var(--space-sm);
	}

	.above-limit-note {
		font-size: 0.875rem;
		color: var(--muted);
		line-height: 1.6;
		margin-bottom: 0;
	}

	/* Bridge, footer, cross-tool link */
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

	.bridge-box p + p {
		margin-top: var(--space-sm);
	}

	.results-footer {
		margin-bottom: var(--space-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.cross-tool-link {
		margin-bottom: var(--space-lg);
		font-size: 0.9375rem;
	}

	.cross-tool-link a {
		color: var(--terracotta);
		text-decoration: none;
	}

	.cross-tool-link a:hover {
		text-decoration: underline;
	}

	/* Minimum touch target for the ghost reset button */
	.start-over-btn {
		min-height: 44px;
		padding: var(--space-xs) 0;
	}
</style>
