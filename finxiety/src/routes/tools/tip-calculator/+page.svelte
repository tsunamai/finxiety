<script lang="ts">
	import { calculateTip } from '$lib/calculators/tip';
	import { STATE_OPTIONS, stateName, isOneFairWage } from '$lib/data/states';

	const DOL_FACT_SHEET = 'https://www.dol.gov/agencies/whd/fact-sheets/15-tipped-employees-flsa';

	const PRESETS = [15, 18, 20, 25];
	const MAX_PARTY = 50;

	// Inputs
	let billAmount = $state('');
	let tipMode = $state<'preset' | 'other'>('preset');
	let presetPercent = $state(18); // default selection per brand
	let otherPercent = $state('');
	let partySize = $state(1);
	// state field — shared input model type (Track1Inputs.state is string)
	let selectedState: string = $state('');
	let baseMode = $state<'pretax' | 'posttax'>('pretax');

	// Active tip percent: from preset buttons or the "Other" numeric input.
	const tipPercent = $derived(
		tipMode === 'other' ? Math.min(Math.max(parseFloat(otherPercent) || 0, 0), 100) : presetPercent
	);

	const bill = $derived(Math.max(parseFloat(billAmount) || 0, 0));

	const result = $derived(
		calculateTip({ billAmount: bill, tipPercent, partySize })
	);

	const hasBill = $derived(bill > 0);

	// Currency formatter — no rounding surprises, always 2 decimals.
	function money(n: number): string {
		return `$${n.toFixed(2)}`;
	}

	// Bill-amount label reflects what the entered amount represents (toggle copy).
	const billLabel = $derived(
		baseMode === 'pretax' ? 'Bill amount (pre-tax subtotal)' : 'Bill amount (post-tax total)'
	);

	const baseNote = $derived(
		baseMode === 'pretax'
			? 'Tipping on the pre-tax subtotal. Most card screens use the post-tax total instead.'
			: 'Tipping on the post-tax total. Some people tip on the pre-tax subtotal instead.'
	);

	// State context
	const stateChosen = $derived(selectedState !== '');
	const stateFull = $derived(stateName(selectedState));
	const oneFairWage = $derived(stateChosen && isOneFairWage(selectedState));

	function selectPreset(value: number) {
		tipMode = 'preset';
		presetPercent = value;
	}

	function chooseOther() {
		tipMode = 'other';
	}

	// Index of the currently-selected tip option (presets 0-3, "Other" = 4).
	const tipSelectedIndex = $derived(tipMode === 'other' ? PRESETS.length : PRESETS.indexOf(presetPercent));

	function applyTipIndex(index: number) {
		if (index < PRESETS.length) {
			selectPreset(PRESETS[index]);
		} else {
			chooseOther();
		}
	}

	// Roving arrow-key navigation within the tip radiogroup (WCAG radio pattern).
	function onTipKeydown(e: KeyboardEvent) {
		const count = PRESETS.length + 1; // presets + "Other"
		let next = tipSelectedIndex;
		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			next = (tipSelectedIndex + 1) % count;
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			next = (tipSelectedIndex - 1 + count) % count;
		} else {
			return;
		}
		e.preventDefault();
		applyTipIndex(next);
		const group = e.currentTarget as HTMLElement;
		const buttons = group.querySelectorAll<HTMLElement>('[role="radio"]');
		buttons[next]?.focus();
	}

	// Roving arrow-key navigation within the pre-tax / post-tax radiogroup.
	function onBaseKeydown(e: KeyboardEvent) {
		if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
		e.preventDefault();
		baseMode = baseMode === 'pretax' ? 'posttax' : 'pretax';
		const group = e.currentTarget as HTMLElement;
		const buttons = group.querySelectorAll<HTMLElement>('[role="radio"]');
		const target = baseMode === 'pretax' ? buttons[0] : buttons[1];
		target?.focus();
	}

	function decreaseParty() {
		if (partySize > 1) partySize -= 1;
	}

	function increaseParty() {
		if (partySize < MAX_PARTY) partySize += 1;
	}
</script>

<svelte:head>
	<title>Tip Calculator | Finxiety</title>
	<meta
		name="description"
		content="Split the check and see the actual math. Plus what your tip means for the person serving you, depending on the state you're in."
	/>
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>Tip Calculator</h1>
<p class="tool-description">
	Split the check and see the actual math. Plus what your tip means for the person serving you,
	depending on the state you're in.
</p>

<hr class="divider" />

<form class="tip-form" onsubmit={(e) => e.preventDefault()} novalidate>
	<!-- 1. Bill amount -->
	<div class="field">
		<label for="bill">{billLabel}</label>
		<div class="input-prefix-wrap">
			<span class="input-prefix" aria-hidden="true">$</span>
			<input
				id="bill"
				type="number"
				inputmode="decimal"
				min="0"
				step="0.01"
				placeholder="0.00"
				bind:value={billAmount}
			/>
		</div>
	</div>

	<!-- 2. Tip percentage -->
	<div class="field">
		<span class="group-label" id="tip-label">Tip percentage</span>
		<div class="segmented" role="radiogroup" aria-label="Tip percentage" tabindex="-1" onkeydown={onTipKeydown}>
			{#each PRESETS as preset, i}
				<button
					type="button"
					class="btn btn-toggle"
					class:selected={tipMode === 'preset' && presetPercent === preset}
					role="radio"
					aria-checked={tipMode === 'preset' && presetPercent === preset}
					tabindex={tipSelectedIndex === i ? 0 : -1}
					onclick={() => selectPreset(preset)}
				>
					{preset}%
				</button>
			{/each}
			<button
				type="button"
				class="btn btn-toggle"
				class:selected={tipMode === 'other'}
				role="radio"
				aria-checked={tipMode === 'other'}
				tabindex={tipSelectedIndex === PRESETS.length ? 0 : -1}
				onclick={chooseOther}
			>
				Other
			</button>
		</div>

		{#if tipMode === 'other'}
			<div class="other-wrap">
				<label for="other-percent" class="sr-only">Custom tip percentage</label>
				<div class="input-suffix-wrap">
					<input
						id="other-percent"
						type="number"
						inputmode="decimal"
						min="0"
						max="100"
						step="0.01"
						placeholder="0"
						bind:value={otherPercent}
					/>
					<span class="input-suffix" aria-hidden="true">%</span>
				</div>
			</div>
		{/if}
	</div>

	<!-- 3. Result block -->
	<section class="result" aria-live="polite" aria-label="Tip result">
		{#if hasBill}
			<div class="result-row">
				<span class="result-label">Tip amount</span>
				<span class="result-value">{money(result.tipAmount)}</span>
			</div>
			<div class="result-row">
				<span class="result-label">Total</span>
				<span class="result-value result-total">{money(result.total)}</span>
			</div>
			{#if partySize > 1 && result.perPerson !== null}
				<div class="result-row result-per-person">
					<span class="result-label">Per person</span>
					<span class="result-value">{money(result.perPerson)} each (approximately)</span>
				</div>
			{/if}
		{:else}
			<p class="result-empty">Enter a bill amount to see the tip and total.</p>
		{/if}
	</section>

	<!-- 4. Party size -->
	<div class="field">
		<span class="group-label" id="party-label">Split between</span>
		<div class="stepper" role="group" aria-labelledby="party-label">
			<button
				type="button"
				class="stepper-btn"
				onclick={decreaseParty}
				disabled={partySize <= 1}
				aria-label="Decrease party size"
			>
				<span aria-hidden="true">−</span>
			</button>
			<span class="stepper-value" aria-live="polite" aria-atomic="true">
				{partySize}
				<span class="sr-only">{partySize === 1 ? 'person' : 'people'}</span>
			</span>
			<button
				type="button"
				class="stepper-btn"
				onclick={increaseParty}
				disabled={partySize >= MAX_PARTY}
				aria-label="Increase party size"
			>
				<span aria-hidden="true">+</span>
			</button>
		</div>
	</div>

	<!-- 5. State selector -->
	<div class="field">
		<label for="state">Your state</label>
		<select id="state" bind:value={selectedState}>
			<option value="">Select your state</option>
			{#each STATE_OPTIONS as opt}
				<option value={opt.code}>{opt.name}</option>
			{/each}
		</select>
	</div>

	<!-- State-aware wage note. Slot reserved from first paint to avoid layout shift. -->
	<div class="wage-slot">
		{#if !stateChosen}
			<p class="wage-prompt">
				Select your state to see wage context for the person serving you.
			</p>
		{:else}
			<div class="signpost-box" role="note">
				{#if oneFairWage}
					<p>
						In {stateFull}, servers receive the full state minimum wage regardless of tips. A
						tip here is additional income, not a wage substitute.
					</p>
				{:else}
					<p>
						In {stateFull}, the law lets employers pay tipped workers as little as $2.13/hr,
						with tips expected to make up the rest. Here, a tip is part of the wage, not an
						extra on top of it.
					</p>
				{/if}
			</div>

			{#if !oneFairWage}
				<p class="historical-fact">
					The $2.13 federal tipped wage has been unchanged since 1991.
				</p>
			{/if}

			<p class="source-link">
				Source:
				<a href={DOL_FACT_SHEET} target="_blank" rel="noopener noreferrer">DOL Fact Sheet 15</a>
			</p>
		{/if}
	</div>

	<!-- 6. Pre-tax / post-tax toggle -->
	<div class="field base-field">
		<span class="group-label" id="base-label">Tip base</span>
		<div
			class="segmented segmented-two"
			role="radiogroup"
			aria-label="Tip base"
			tabindex="-1"
			onkeydown={onBaseKeydown}
		>
			<button
				type="button"
				class="btn btn-toggle"
				class:selected={baseMode === 'pretax'}
				role="radio"
				aria-checked={baseMode === 'pretax'}
				tabindex={baseMode === 'pretax' ? 0 : -1}
				onclick={() => (baseMode = 'pretax')}
			>
				Pre-tax subtotal
			</button>
			<button
				type="button"
				class="btn btn-toggle"
				class:selected={baseMode === 'posttax'}
				role="radio"
				aria-checked={baseMode === 'posttax'}
				tabindex={baseMode === 'posttax' ? 0 : -1}
				onclick={() => (baseMode = 'posttax')}
			>
				Post-tax total
			</button>
		</div>

		<p class="base-note">{baseNote}</p>

		<details class="base-details">
			<summary>How much does this change?</summary>
			<p>
				The difference is small. On a $50 bill in an 8% tax area, post-tax vs. pre-tax is about
				$0.80 at 20%.
			</p>
		</details>
	</div>
</form>

<div class="signpost-footer" role="note">
	<p>More on how financial systems work differently than most people assume: <a href="/tools/myth-quiz">Benefits Myth-Check Quiz</a> applies the same format to benefits programs.</p>
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

	/* Dollar prefix on inputs (matches EMG-1) */
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

	/* Percent suffix on the "Other" input */
	.input-suffix-wrap {
		position: relative;
		display: flex;
		align-items: center;
		max-width: 8rem;
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

	.other-wrap {
		margin-top: var(--space-sm);
	}

	.group-label {
		font-weight: 600;
		font-size: 0.9375rem;
	}

	/* Segmented button set — equal visual weight, no low-to-high emphasis */
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

	.segmented-two .btn-toggle {
		min-width: 120px;
	}

	/* Result block */
	.result {
		background: var(--surface);
		border-radius: var(--radius);
		padding: var(--space-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
		margin-bottom: var(--space-md);
	}

	.result-row {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-sm);
	}

	.result-label {
		font-size: 0.875rem;
		color: var(--muted);
	}

	.result-value {
		font-size: 1rem;
		font-weight: 700;
		color: var(--dark);
		white-space: nowrap;
	}

	.result-total {
		font-size: 1.25rem;
	}

	.result-per-person {
		padding-top: var(--space-xs);
		border-top: 1px solid var(--border);
		margin-top: var(--space-xs);
	}

	.result-per-person .result-value {
		font-weight: 600;
		color: var(--text);
	}

	.result-empty {
		font-size: 0.9375rem;
		color: var(--muted);
	}

	/* Stepper */
	.stepper {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
	}

	.stepper-btn {
		min-width: 48px;
		min-height: 48px;
		border: 2px solid var(--border);
		background: transparent;
		color: var(--dark);
		border-radius: var(--radius);
		font-size: 1.5rem;
		line-height: 1;
		font-family: var(--font);
		cursor: pointer;
		transition: border-color 0.15s, background 0.15s;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.stepper-btn:hover:not(:disabled) {
		border-color: var(--terracotta);
	}

	.stepper-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.stepper-btn:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 2px;
	}

	.stepper-value {
		min-width: 3rem;
		text-align: center;
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--dark);
	}

	/* State selector */
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

	/* Wage note slot — reserve space to prevent layout shift */
	.wage-slot {
		min-height: 5.5rem;
		margin-bottom: var(--space-md);
	}

	.wage-prompt {
		font-size: 0.9375rem;
		color: var(--muted);
		line-height: 1.6;
	}

	/* Signpost box — informational, never an alert color */
	.signpost-box {
		background: var(--cream);
		border-left: 3px solid var(--olive);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text);
	}

	/* Historical fact — quieter than the note, still WCAG 4.5:1 (var(--muted)) */
	.historical-fact {
		margin-top: var(--space-sm);
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.5;
	}

	.source-link {
		margin-top: var(--space-xs);
		font-size: 0.8125rem;
		color: var(--muted);
	}

	.source-link a {
		color: var(--terracotta);
	}

	/* Pre-tax / post-tax */
	.base-field {
		margin-bottom: 0;
	}

	.base-note {
		margin-top: var(--space-sm);
		font-size: 0.875rem;
		color: var(--muted);
		line-height: 1.55;
	}

	.base-details {
		margin-top: var(--space-sm);
	}

	.base-details summary {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--terracotta);
		cursor: pointer;
		min-height: 44px;
		display: flex;
		align-items: center;
	}

	.base-details summary:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 2px;
		border-radius: var(--radius);
	}

	.base-details p {
		margin-top: var(--space-xs);
		font-size: 0.875rem;
		color: var(--muted);
		line-height: 1.6;
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
</style>
