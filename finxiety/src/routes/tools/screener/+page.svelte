<script lang="ts">
	import { checkAllPrograms, type ProgramResult, type ScreenerInputs } from '$lib/eligibility';

	let householdSize = $state(1);
	let grossMonthlyIncome = $state('');
	let hasChildUnder5OrPregnant = $state(false);
	let hasSchoolAgeChild = $state(false);
	let step = $state<1 | 2>(1);
	let results = $state<ProgramResult[]>([]);
	let error = $state('');

	function calculate(e: Event) {
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

	function startOver() {
		step = 1;
		results = [];
		grossMonthlyIncome = '';
		hasChildUnder5OrPregnant = false;
		hasSchoolAgeChild = false;
	}
</script>

<svelte:head>
	<title>Benefits Screener | Finxiety</title>
	<meta
		name="description"
		content="Check which California benefits programs you may qualify for, including CalFresh, Medi-Cal, WIC, Lifeline, HEAP, school meals, and CalEITC."
	/>
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>Benefits Screener</h1>
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
				<p class="paycheck-hint" id="income-hint">
					Not sure of your monthly total? Use the gross amount on one paycheck (before taxes):<br />
					Paid every 2 weeks: multiply by 2.17 &nbsp;&middot;&nbsp; Weekly: multiply by 4.3
					&nbsp;&middot;&nbsp; Twice a month: multiply by 2.<br />
					Enter $0 if you have no income right now.
				</p>
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
		<section class="step" aria-live="polite" aria-label="Eligibility results">
			<div class="results-header">
				{#if likelyCount > 0}
					<h2>
						You may qualify for {likelyCount} program{likelyCount === 1 ? '' : 's'}.
					</h2>
				{:else}
					<h2>These programs may not match your situation right now.</h2>
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

			<button class="btn btn-ghost" onclick={startOver} type="button">
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

	/* Dollar prefix on income input */
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

	.paycheck-hint {
		margin-top: var(--space-xs);
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.6;
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

	.eligibility-tag--unlikely {
		background: var(--border);
		color: var(--muted);
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
</style>
