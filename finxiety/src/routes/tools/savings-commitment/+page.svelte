<script lang="ts">
	import { tick } from 'svelte';
	import {
		buildCommitment,
		type CommitmentResult,
		type FrequencyKey
	} from '$lib/calculators/savings-commitment';
	import { generateIcs, downloadIcs, type IcsEvent } from '$lib/ics-generator';

	// --- Flow state -----------------------------------------------------------
	let step = $state<1 | 2 | 3>(1);

	// Step 1
	let goal = $state('');

	// Step 2
	let amountInput = $state('');
	let frequencyKey = $state<FrequencyKey | ''>('');
	let whenInput = $state('');
	let targetInput = $state('');
	let habitInput = $state('');
	// Tracks whether the user tried to advance without a "when", so we can show an
	// inline prompt without treating an untouched field as an error.
	let whenPrompted = $state(false);

	// Step 3
	let result = $state<CommitmentResult | null>(null);
	// The single editable copy of the statement. Display and edit field share it.
	let editedStatement = $state('');
	let copyStatus = $state('');
	let downloadStatus = $state('');
	let copyTimer: ReturnType<typeof setTimeout> | null = null;

	let step2HeadingEl: HTMLHeadingElement | null = $state(null);
	let step3HeadingEl: HTMLHeadingElement | null = $state(null);

	// The three cadences. `label` is the segmented button text; `phrase` is only
	// used for the timeline math via frequencyKey, not inserted into the statement
	// (the user's own "when" text carries the cadence in their own words).
	const FREQUENCIES: { value: FrequencyKey; label: string }[] = [
		{ value: 'weekly', label: 'Weekly' },
		{ value: 'biweekly', label: 'Every two weeks' },
		{ value: 'monthly', label: 'Monthly' }
	];

	// --- Derived --------------------------------------------------------------
	const amount = $derived(parseFloat(amountInput));
	const amountValid = $derived(Number.isFinite(amount) && amount > 0);
	const whenFilled = $derived(whenInput.trim() !== '');
	const target = $derived(parseFloat(targetInput));
	const targetValid = $derived(Number.isFinite(target) && target > 0);

	const canStartCommitment = $derived(amountValid && frequencyKey !== '' && whenFilled);

	// --- Step 1 ---------------------------------------------------------------
	async function goToStep2(e: Event) {
		e.preventDefault();
		if (goal.trim() === '') return;
		step = 2;
		await tick();
		step2HeadingEl?.focus();
	}

	// --- Step 2: roving radiogroup for frequency ------------------------------
	const freqIndex = $derived(FREQUENCIES.findIndex((f) => f.value === frequencyKey));

	function selectFrequency(value: FrequencyKey) {
		frequencyKey = value;
	}

	function onFreqKeydown(e: KeyboardEvent) {
		const count = FREQUENCIES.length;
		// If nothing is selected yet, arrow keys start at the first option.
		const current = freqIndex < 0 ? 0 : freqIndex;
		let next = current;
		if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
			next = (current + 1) % count;
		} else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
			next = (current - 1 + count) % count;
		} else {
			return;
		}
		e.preventDefault();
		selectFrequency(FREQUENCIES[next].value);
		const group = e.currentTarget as HTMLElement;
		const buttons = group.querySelectorAll<HTMLElement>('[role="radio"]');
		buttons[next]?.focus();
	}

	async function backToStep1() {
		step = 1;
		await tick();
	}

	function buildStatement(e: Event) {
		e.preventDefault();
		whenPrompted = true;
		if (!canStartCommitment || frequencyKey === '') return;

		const built = buildCommitment({
			goal,
			amount,
			// The user's own "when" text carries the cadence in their words; we pass
			// the cadence phrase as empty so the statement isn't doubled.
			frequency: '',
			frequencyKey,
			whenAnchor: whenInput,
			habitAnchor: habitInput.trim() === '' ? undefined : habitInput,
			targetAmount: targetValid ? target : undefined
		});

		result = built;
		editedStatement = built.statement;
		copyStatus = '';
		downloadStatus = '';
		step = 3;
		tick().then(() => step3HeadingEl?.focus());
	}

	// --- Step 3: calendar + clipboard -----------------------------------------

	// Next occurrence of the chosen cadence, computed from today, locally.
	// Weekly: 7 days out. Every two weeks: 14 days out. Monthly: same date next
	// month, clamped to the last valid day of that month.
	function nextOccurrence(key: FrequencyKey, today: Date): Date {
		const base = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		if (key === 'weekly') {
			base.setDate(base.getDate() + 7);
			return base;
		}
		if (key === 'biweekly') {
			base.setDate(base.getDate() + 14);
			return base;
		}
		// monthly: advance one month, clamping the day to the target month's length.
		const day = base.getDate();
		const targetMonth = base.getMonth() + 1;
		const year = base.getFullYear() + Math.floor(targetMonth / 12);
		const month = targetMonth % 12;
		// Day 0 of the following month is the last day of `month`.
		const lastDay = new Date(year, month + 1, 0).getDate();
		return new Date(year, month, Math.min(day, lastDay));
	}

	// All-day events use an exclusive DTEND, so dtend = dtstart + 1 day.
	function nextDay(d: Date): Date {
		const n = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		n.setDate(n.getDate() + 1);
		return n;
	}

	function handleAddToCalendar() {
		if (frequencyKey === '') return;
		const statement = editedStatement.trim();
		if (statement === '') {
			downloadStatus = 'Add some text to your commitment first, then download it.';
			return;
		}
		const start = nextOccurrence(frequencyKey, new Date());
		const event: IcsEvent = {
			summary: 'My savings appointment',
			description: statement,
			dtstart: start,
			dtend: nextDay(start),
			uid: `save-${Date.now()}@finxiety`
		};
		const ics = generateIcs([event]);
		downloadIcs('finxiety-savings-appointment.ics', ics);
		downloadStatus =
			'Your calendar file is ready. On a phone, tap the file when it appears and choose “Add.” On a computer, open the file to add it to your calendar.';
	}

	async function handleCopy() {
		const text = editedStatement.trim();
		if (text === '') return;
		try {
			await navigator.clipboard.writeText(text);
			copyStatus = 'Copied!';
		} catch {
			// Fallback for browsers without async clipboard access (matches DOC-1's
			// intent with an explicit textarea + execCommand path).
			const ta = document.createElement('textarea');
			ta.value = text;
			ta.setAttribute('readonly', '');
			ta.style.position = 'absolute';
			ta.style.left = '-9999px';
			document.body.appendChild(ta);
			ta.select();
			let ok = false;
			try {
				ok = document.execCommand('copy');
			} catch {
				ok = false;
			}
			document.body.removeChild(ta);
			copyStatus = ok ? 'Copied!' : 'Could not copy automatically. You can select the text above.';
		}
		if (copyTimer) clearTimeout(copyTimer);
		copyTimer = setTimeout(() => {
			copyStatus = '';
		}, 2000);
	}

	function startOver() {
		step = 1;
		goal = '';
		amountInput = '';
		frequencyKey = '';
		whenInput = '';
		targetInput = '';
		habitInput = '';
		whenPrompted = false;
		result = null;
		editedStatement = '';
		copyStatus = '';
		downloadStatus = '';
	}
</script>

<svelte:head>
	<title>Savings Commitment Maker | Finxiety</title>
	<meta
		name="description"
		content="Write one specific savings commitment in your own words — and get a calendar reminder to make it happen."
	/>
</svelte:head>

<!-- Persistent live region for step transitions -->
<div class="sr-only" aria-live="polite" aria-atomic="true">
	{#if step === 2}
		Step 2 of 3: choose your amount, how often, and when.
	{:else if step === 3}
		Step 3 of 3: your commitment is ready below.
	{/if}
</div>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>Savings Commitment Maker</h1>
<p class="tool-description">
	Saving is easier when the plan is yours and it's specific. Write one commitment in your own words,
	and take it with you — as a note you can keep or a reminder in your own calendar.
</p>

<p class="step-indicator" aria-hidden="true">Step {step} of 3</p>

<hr class="divider" />

{#if step === 1}
	<form class="save-form" onsubmit={goToStep2} novalidate>
		<h2 class="step-heading">What are you saving for?</h2>
		<div class="field">
			<label for="goal">Your goal</label>
			<input
				id="goal"
				type="text"
				maxlength="120"
				bind:value={goal}
				autocomplete="off"
			/>
		</div>

		<button class="btn btn-primary" type="submit" disabled={goal.trim() === ''}>Next →</button>
	</form>
{/if}

{#if step === 2}
	<form class="save-form" onsubmit={buildStatement} novalidate>
		<h2 bind:this={step2HeadingEl} tabindex="-1" class="step-heading">Set up your transfer</h2>

		<!-- Amount -->
		<div class="field">
			<label for="amount">What's the smallest amount that would feel like progress?</label>
			<div class="input-prefix-wrap">
				<span class="input-prefix" aria-hidden="true">$</span>
				<input
					id="amount"
					type="number"
					inputmode="decimal"
					min="0"
					step="0.01"
					bind:value={amountInput}
				/>
			</div>
		</div>

		<!-- Frequency (roving radiogroup) -->
		<div class="field">
			<span class="group-label" id="freq-label">How often?</span>
			<div
				class="segmented"
				role="radiogroup"
				aria-labelledby="freq-label"
				tabindex="-1"
				onkeydown={onFreqKeydown}
			>
				{#each FREQUENCIES as freq, i}
					<button
						type="button"
						class="btn btn-toggle"
						class:selected={frequencyKey === freq.value}
						role="radio"
						aria-checked={frequencyKey === freq.value}
						tabindex={(freqIndex < 0 ? i === 0 : freqIndex === i) ? 0 : -1}
						onclick={() => selectFrequency(freq.value)}
					>
						{freq.label}
					</button>
				{/each}
			</div>
		</div>

		<!-- When -->
		<div class="field">
			<label for="when">When will you do it?</label>
			<p class="field-hint" id="when-hint">
				A specific day or trigger — "every other Friday after I get paid"
			</p>
			<input
				id="when"
				type="text"
				maxlength="120"
				bind:value={whenInput}
				aria-describedby="when-hint"
				autocomplete="off"
			/>
			{#if whenPrompted && !whenFilled}
				<p class="field-prompt" role="status" aria-live="polite">
					Add a when — a specific day or trigger makes commitments more likely to stick.
				</p>
			{/if}
		</div>

		<!-- Optional target -->
		<div class="field">
			<label for="target">How much do you need in total? (optional)</label>
			<div class="input-prefix-wrap">
				<span class="input-prefix" aria-hidden="true">$</span>
				<input
					id="target"
					type="number"
					inputmode="decimal"
					min="0"
					step="0.01"
					bind:value={targetInput}
				/>
			</div>
		</div>

		<!-- Optional habit anchor -->
		<div class="field">
			<label for="habit">Is there something you already do you could link it to? (optional)</label>
			<input
				id="habit"
				type="text"
				maxlength="80"
				bind:value={habitInput}
				autocomplete="off"
			/>
		</div>

		<div class="step-actions">
			<button class="btn btn-secondary" type="button" onclick={backToStep1}>Back</button>
			<button class="btn btn-primary" type="submit" disabled={!canStartCommitment}>
				Build my commitment
			</button>
		</div>
	</form>
{/if}

{#if step === 3 && result}
	<section class="result" aria-label="Your savings commitment">
		<h2 bind:this={step3HeadingEl} tabindex="-1" class="step-heading">Your commitment</h2>

		<blockquote class="commitment-block">{editedStatement}</blockquote>

		{#if result.roughTimeline}
			<p class="timeline-note">One rough estimate: {result.roughTimeline}</p>
		{/if}

		<p class="not-a-lock">
			This is a plan you made, not a lock. Your money is still yours to use.
		</p>

		<div class="field edit-field">
			<label for="edit-statement">Edit your commitment (optional)</label>
			<textarea
				id="edit-statement"
				rows="3"
				bind:value={editedStatement}
			></textarea>
		</div>

		<div class="step-actions">
			<button class="btn btn-primary" type="button" onclick={handleAddToCalendar}>
				Add to my calendar
			</button>
			<button class="btn btn-secondary" type="button" onclick={handleCopy}>Copy this</button>
		</div>
		<p class="copy-status" role="status" aria-live="polite">{copyStatus}</p>
		<p class="copy-status" role="status" aria-live="polite">{downloadStatus}</p>

		<p class="result-note privacy-note">
			Nothing here is saved or sent anywhere. Your commitment stays on your device, and the calendar
			file is built right in your browser.
		</p>

		<div class="step-actions">
			<button class="btn btn-secondary start-over" type="button" onclick={startOver}>
				Start over
			</button>
		</div>
	</section>
{/if}

<div class="signpost-footer" role="note">
	<h2 class="footer-heading">Related tools</h2>
	<ul class="related-list">
		<li>
			<a href="/tools/emergency-fund">Emergency Fund Checker</a> — see how much runway your savings
			would give you.
		</li>
		<li>
			<a href="/tools/screener">Benefits Screener</a> — find programs that might create more
			breathing room.
		</li>
	</ul>
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
		max-width: 54ch;
	}

	.step-indicator {
		margin-top: var(--space-md);
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.08em;
		color: var(--muted);
	}

	.step-heading {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--dark);
		margin-bottom: var(--space-md);
	}

	.step-heading:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 3px;
		border-radius: 2px;
	}

	.group-label {
		font-weight: 600;
		font-size: 0.9375rem;
		color: var(--text);
	}

	/* Segmented frequency selector (HOURS-1 pattern) */
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

	/* Dollar prefix inputs (HOURS-1 pattern) */
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

	.field-prompt {
		font-size: 0.8125rem;
		color: var(--muted);
		margin-top: var(--space-xs);
		line-height: 1.5;
	}

	.btn-primary:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.btn-primary:disabled:hover {
		background: var(--terracotta);
	}

	/* Step actions */
	.step-actions {
		display: flex;
		gap: var(--space-sm);
		flex-wrap: wrap;
		margin-top: var(--space-md);
	}

	.btn-secondary {
		background: transparent;
		color: var(--terracotta);
		border: 2px solid var(--terracotta);
		flex: 1;
		min-width: 120px;
	}

	.btn-secondary:hover {
		background: var(--terracotta);
		color: white;
	}

	.step-actions .btn-primary {
		flex: 2;
		min-width: 160px;
		width: auto;
	}

	.start-over {
		flex: 0 1 auto;
	}

	/* Result */
	.result {
		margin-top: var(--space-md);
	}

	.commitment-block {
		background: var(--cream);
		border-left: 3px solid var(--olive);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		font-size: 1.125rem;
		line-height: 1.6;
		color: var(--dark);
		font-weight: 600;
		margin: 0;
	}

	.timeline-note {
		font-size: 0.875rem;
		color: var(--muted);
		line-height: 1.6;
		margin-top: var(--space-md);
	}

	.not-a-lock {
		font-size: 0.9375rem;
		color: var(--text);
		line-height: 1.6;
		margin-top: var(--space-sm);
	}

	.edit-field {
		margin-top: var(--space-md);
	}

	.edit-field textarea {
		font-family: var(--font);
		font-size: 1.0625rem;
		padding: 0.75rem 1rem;
		border: 2px solid var(--border);
		border-radius: var(--radius);
		background: white;
		color: var(--ink);
		width: 100%;
		line-height: 1.5;
		resize: vertical;
		min-height: 4.5rem;
	}

	.edit-field textarea:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 2px;
	}

	.copy-status {
		font-size: 0.8125rem;
		color: var(--muted);
		margin-top: var(--space-xs);
		min-height: 1.2rem;
		line-height: 1.5;
	}

	.result-note {
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.55;
	}

	.privacy-note {
		margin-top: var(--space-lg);
	}

	/* Footer crosslink */
	.signpost-footer {
		margin-top: var(--space-lg);
		padding: var(--space-md);
		background: var(--surface);
		border-radius: var(--radius);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--muted);
	}

	.footer-heading {
		font-size: 0.8125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted);
		margin-bottom: var(--space-sm);
	}

	.related-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.related-list li {
		line-height: 1.55;
	}
</style>
