<script lang="ts">
	import { tick } from 'svelte';
	import {
		questions,
		synthesisPrompts,
		type Question
	} from '$lib/data/myth-quiz-2';

	// Phases of the quiz. 'estimate' and 'reveal' repeat per question.
	type Phase = 'welcome' | 'estimate' | 'reveal' | 'synthesis' | 'score';

	let phase = $state<Phase>('welcome');
	// Zero-based index into `questions`.
	let qIndex = $state(0);

	// The user's committed estimate per question, by question id. Locked once
	// submitted; back navigation re-shows the reveal, never re-opens the input.
	let estimates = $state<Record<string, number>>({});
	// The live value of the current control before it's committed.
	let currentValue = $state<number>(questions[0].inputDefault);
	let inputError = $state('');

	// Synthesis answers (both optional, ungraded).
	let surprisedChoice = $state<string | null>(null);
	let assumeText = $state('');

	let estimateSectionEl: HTMLElement | null = $state(null);
	let revealSectionEl: HTMLElement | null = $state(null);
	let synthesisSectionEl: HTMLElement | null = $state(null);
	let scoreSectionEl: HTMLElement | null = $state(null);

	const current = $derived<Question>(questions[qIndex]);
	const totalQuestions = questions.length;
	// How many reveals the user has seen = how far they've progressed.
	const revealsSeen = $derived(Object.keys(estimates).length);

	async function startQuiz() {
		qIndex = 0;
		currentValue = questions[0].inputDefault;
		inputError = '';
		phase = 'estimate';
		await tick();
		estimateSectionEl?.focus();
	}

	function formatGuess(q: Question, value: number): string {
		switch (q.inputType) {
			case 'dollar':
				return `$${value}`;
			case 'percentage':
				return `${value}%`;
			case 'number':
				return `${value} ${q.realAnswerLabel}`.trim();
			case 'range':
				// Range maps a 0–100 position onto the anchor scale. Report the
				// position descriptively rather than as a bare number.
				return describeRange(q, value);
		}
	}

	function describeRange(q: Question, value: number): string {
		const [low, high] = q.anchorLabels ?? ['Low', 'High'];
		if (value <= 20) return low;
		if (value >= 80) return high;
		if (value < 50) return `Closer to "${low}"`;
		if (value > 50) return `Closer to "${high}"`;
		return 'Somewhere in the middle';
	}

	function formatRealAnswer(q: Question): string {
		if (q.realAnswerDisplay) return q.realAnswerDisplay;
		if (q.inputType === 'dollar') return `$${q.realAnswer} ${q.realAnswerLabel}`.trim();
		if (q.inputType === 'percentage') return `${q.realAnswer}%`;
		return `${q.realAnswer} ${q.realAnswerLabel}`.trim();
	}

	async function submitEstimate(e: Event) {
		e.preventDefault();
		inputError = '';

		if (String(currentValue) === '') {
			inputError = 'Enter a number to see the real figure.';
			return;
		}

		const value = Number(currentValue);
		if (Number.isNaN(value)) {
			inputError = 'Enter a number to see the real figure.';
			return;
		}
		if (value < current.inputMin || value > current.inputMax) {
			inputError = `Enter a number between ${current.inputMin} and ${current.inputMax}.`;
			return;
		}

		estimates[current.id] = value;
		phase = 'reveal';
		await tick();
		revealSectionEl?.focus();
	}

	async function nextQuestion() {
		if (qIndex < totalQuestions - 1) {
			qIndex += 1;
			currentValue = questions[qIndex].inputDefault;
			inputError = '';
			phase = 'estimate';
			await tick();
			estimateSectionEl?.focus();
		} else {
			phase = 'synthesis';
			await tick();
			synthesisSectionEl?.focus();
		}
	}

	// Re-see the previous reveal. Estimates stay locked.
	async function previousReveal() {
		if (qIndex > 0) {
			qIndex -= 1;
			phase = 'reveal';
			await tick();
			revealSectionEl?.focus();
		}
	}

	async function finishSynthesis() {
		phase = 'score';
		await tick();
		scoreSectionEl?.focus();
	}

	function startOver() {
		phase = 'welcome';
		qIndex = 0;
		estimates = {};
		currentValue = questions[0].inputDefault;
		inputError = '';
		surprisedChoice = null;
		assumeText = '';
	}
</script>

<svelte:head>
	<title>Personal Finance Myth Quiz | Finxiety</title>
	<meta
		name="description"
		content="Ten things most people believe about personal finance — tips, taxes, credit, and compound interest — and what the data actually shows."
	/>
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>Personal Finance Myth Quiz</h1>

{#if phase === 'welcome'}
	<section class="step" aria-label="Welcome">
		<p class="tool-description">
			Ten questions about money rules most people live by. Guess first, then see what the research actually says.
		</p>
		<p class="estimate-note">These gaps aren't about financial literacy — they're about how systems were built and what they don't explain. No grades, no right answers.</p>
		<button class="btn btn-primary" type="button" onclick={startQuiz}>Start the quiz</button>
	</section>

{:else if phase === 'estimate'}
	{#key current.id}
		<section class="step" bind:this={estimateSectionEl} tabindex="-1" aria-label="Question {qIndex + 1} of {totalQuestions}">
			<div class="progress" aria-hidden="true">
				<div class="progress-track">
					<div
						class="progress-fill"
						style="width: {((qIndex) / totalQuestions) * 100}%"
					></div>
				</div>
			</div>
			<p class="progress-label">Question {qIndex + 1} of {totalQuestions}</p>

			<form class="estimate-form" onsubmit={submitEstimate} novalidate>
				<label class="question-prompt" for="estimate-input">{current.prompt}</label>

				{#if current.inputType === 'number'}
					<div class="field">
						<input
							id="estimate-input"
							type="number"
							inputmode="numeric"
							min={current.inputMin}
							max={current.inputMax}
							step={current.inputStep}
							bind:value={currentValue}
							aria-describedby="estimate-bounds"
						/>
						<span class="field-hint" id="estimate-bounds">
							A number from {current.inputMin} to {current.inputMax}.
						</span>
					</div>

				{:else if current.inputType === 'dollar'}
					<div class="field">
						<div class="input-prefix-wrap">
							<span class="input-prefix" aria-hidden="true">$</span>
							<input
								id="estimate-input"
								type="number"
								inputmode="decimal"
								min={current.inputMin}
								max={current.inputMax}
								step={current.inputStep}
								bind:value={currentValue}
								aria-describedby="estimate-bounds"
							/>
						</div>
						<span class="field-hint" id="estimate-bounds">
							A dollar amount from ${current.inputMin} to ${current.inputMax}.
						</span>
					</div>

				{:else if current.inputType === 'percentage'}
					<div class="field">
							<div class="slider-row">
							<input
								id="estimate-input"
								class="slider"
								type="range"
								min={current.inputMin}
								max={current.inputMax}
								step={current.inputStep}
								bind:value={currentValue}
								aria-describedby="estimate-bounds"
								aria-valuetext="{currentValue} percent"
							/>
							<output class="slider-value" for="estimate-input">{currentValue}%</output>
						</div>
						<div class="anchor-labels" aria-hidden="true">
							<span>{current.inputMin}%</span>
							<span>{current.inputMax}%</span>
						</div>
						<span class="field-hint" id="estimate-bounds">
							Slide to your best guess, from {current.inputMin}% to {current.inputMax}%.
						</span>
					</div>

				{:else if current.inputType === 'range'}
					<div class="field">
						<div class="slider-row">
							<input
								id="estimate-input"
								class="slider"
								type="range"
								min={current.inputMin}
								max={current.inputMax}
								step={current.inputStep}
								bind:value={currentValue}
								aria-describedby="estimate-bounds"
								aria-valuetext={describeRange(current, currentValue)}
							/>
						</div>
						<div class="anchor-labels">
							<span>{current.anchorLabels?.[0]}</span>
							<span>{current.anchorLabels?.[1]}</span>
						</div>
						<span class="field-hint" id="estimate-bounds">
							Slide toward your best guess. Your guess: {describeRange(current, currentValue)}.
						</span>
					</div>
				{/if}

				{#if inputError}
					<p class="error-msg" role="alert">{inputError}</p>
				{/if}

				<button class="btn btn-primary" type="submit">Lock in my guess</button>
			</form>

			{#if qIndex > 0}
				<button class="btn btn-ghost back-link" type="button" onclick={previousReveal}>
					← See the previous answer
				</button>
			{/if}
		</section>
	{/key}

{:else if phase === 'reveal'}
	{#key current.id}
		<section class="step reveal" bind:this={revealSectionEl} tabindex="-1" aria-live="polite" aria-label="The real answer">
			<div class="progress" aria-hidden="true">
				<div class="progress-track">
					<div
						class="progress-fill"
						style="width: {((qIndex + 1) / totalQuestions) * 100}%"
					></div>
				</div>
			</div>
			<p class="progress-label">Question {qIndex + 1} of {totalQuestions}</p>

			<div class="compare">
				<div class="compare-row">
					<span class="compare-label">You guessed</span>
					<span class="compare-value compare-guess"
						>{formatGuess(current, estimates[current.id])}</span
					>
				</div>
				<div class="compare-row">
					<span class="compare-label">The real number</span>
					<span class="compare-value compare-real">{formatRealAnswer(current)}</span>
				</div>
			</div>

			<h2 class="reveal-headline">{current.revealHeadline}</h2>
			<p class="reveal-body">{current.revealBody}</p>

			<div class="why-box" role="note">
				<p class="box-label">Why the gap exists</p>
				<p>{current.structuralExplanation}</p>
			</div>

			<div class="signpost-box" role="note">
				<p>{current.signpost}</p>
				{#if current.signpostUrl}
					<a href={current.signpostUrl} class="signpost-link">Open the tool →</a>
				{/if}
				{#if current.signpostNote}
					<p class="signpost-note">{current.signpostNote} <a href="/tools/screener">The Benefits Screener →</a></p>
				{/if}
			</div>

			<details class="sources">
				<summary>Sources for this figure</summary>
				<ul>
					{#each current.sources as source}
						<li>
							<a href={source.url} target="_blank" rel="noopener noreferrer">{source.label}</a>
						</li>
					{/each}
				</ul>
			</details>

			<div class="step-actions">
				{#if qIndex > 0}
					<button class="btn btn-ghost" type="button" onclick={previousReveal}>← Previous</button>
				{:else}
					<span></span>
				{/if}
				<button class="btn btn-primary next-btn" type="button" onclick={nextQuestion}>
					{qIndex < totalQuestions - 1 ? 'Next question →' : 'Continue →'}
				</button>
			</div>
		</section>
	{/key}

{:else if phase === 'synthesis'}
	<section class="step" bind:this={synthesisSectionEl} tabindex="-1" aria-label="Reflection">
		<p class="tool-description">
			One more thing (optional, no right answers).
		</p>

		<fieldset class="synthesis-block">
			<legend class="question-prompt">{synthesisPrompts[0].prompt}</legend>
			<div class="choice-group">
				{#each synthesisPrompts[0].options ?? [] as opt}
					<button
						class="btn btn-choice"
						class:selected={surprisedChoice === opt.id}
						aria-pressed={surprisedChoice === opt.id}
						type="button"
						onclick={() =>
							(surprisedChoice = surprisedChoice === opt.id ? null : opt.id)}
					>
						{opt.label}
					</button>
				{/each}
			</div>
		</fieldset>

		<div class="synthesis-block">
			<label class="question-prompt" for="assume-text">{synthesisPrompts[1].prompt}</label>
			{#if synthesisPrompts[1].helper}
				<span class="field-hint" id="assume-hint">{synthesisPrompts[1].helper}</span>
			{/if}
			<textarea
				id="assume-text"
				rows="3"
				bind:value={assumeText}
				aria-describedby="assume-hint"
				placeholder="A few words…"
			></textarea>
		</div>

		<button class="btn btn-primary" type="button" onclick={finishSynthesis}>Finish</button>
	</section>

{:else if phase === 'score'}
	<section class="step" bind:this={scoreSectionEl} tabindex="-1" aria-live="polite" aria-label="Your results">
		<div class="score-card">
			<p class="score-number">{revealsSeen} of {totalQuestions}</p>
			<p class="score-label">reveals seen</p>
		</div>

		<h2 class="reveal-headline">The real numbers behind ten things most people believe.</h2>
		<p class="reveal-body">
			Most of these gaps aren't about what any one person did. They're about how the systems are
			built, and how rarely anyone explains them. Knowing that changes how you move.
		</p>

		<p class="estimate-note">
			These figures come from public research, linked on each reveal. Programs change. The official sources are the place to confirm what applies to you.
		</p>

		<div class="step-actions score-actions">
			<a href="/" class="btn btn-ghost">← Back to Finxiety</a>
			<button class="btn btn-ghost" type="button" onclick={startOver}>Start over</button>
		</div>
	</section>
{/if}

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

	h1 {
		margin-bottom: var(--space-md);
	}

	.tool-description {
		margin-top: var(--space-sm);
		color: var(--muted);
		max-width: 52ch;
	}

	.estimate-note {
		margin-top: var(--space-sm);
		margin-bottom: var(--space-lg);
		font-size: 0.875rem;
		color: var(--muted);
		max-width: 52ch;
	}

	/* Screen-reader-only utility */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}

	/* Progress */
	.progress {
		margin-bottom: var(--space-xs);
	}

	.progress-track {
		height: 6px;
		background: var(--surface);
		border-radius: 999px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: var(--terracotta);
		border-radius: 999px;
		transition: width 0.3s ease;
	}

	.progress-label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--muted);
		margin-bottom: var(--space-md);
	}

	/* Estimate form */
	.question-prompt {
		display: block;
		font-size: 1.125rem;
		font-weight: 700;
		line-height: 1.4;
		color: var(--dark);
		margin-bottom: var(--space-md);
	}

	.estimate-form {
		margin-bottom: var(--space-md);
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

	/* Sliders */
	.slider-row {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.slider {
		flex: 1;
		width: 100%;
		height: 36px;
		accent-color: var(--terracotta);
		cursor: pointer;
	}

	.slider:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 4px;
		border-radius: var(--radius);
	}

	.slider-value {
		min-width: 3.5ch;
		text-align: right;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--dark);
	}

	.anchor-labels {
		display: flex;
		justify-content: space-between;
		font-size: 0.8125rem;
		color: var(--muted);
		margin-top: var(--space-xs);
	}

	.back-link {
		margin-top: var(--space-md);
	}

	/* Reveal: guess vs. real comparison */
	.compare {
		background: var(--surface);
		border-radius: var(--radius);
		padding: var(--space-md);
		margin-bottom: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.compare-row {
		display: grid;
		grid-template-columns: max-content 1fr;
		align-items: baseline;
		gap: var(--space-sm);
	}

	.compare-label {
		font-size: 0.875rem;
		color: var(--muted);
	}

	.compare-value {
		font-size: 1.0625rem;
		font-weight: 700;
	}

	.compare-guess {
		color: var(--muted);
	}

	.compare-real {
		color: var(--terracotta);
	}

	.reveal-headline {
		font-size: 1.375rem;
		font-weight: 700;
		line-height: 1.3;
		color: var(--dark);
		margin-bottom: var(--space-sm);
	}

	.reveal-body {
		font-size: 1rem;
		line-height: 1.65;
		color: var(--text);
		margin-bottom: var(--space-md);
	}

	.why-box {
		background: var(--cream);
		border-left: 3px solid var(--olive);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		margin-bottom: var(--space-md);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text);
	}

	.signpost-box {
		background: var(--cream);
		border-left: 3px solid var(--terracotta);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		margin-bottom: var(--space-md);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text);
	}

	.signpost-link {
		display: inline-block;
		margin-top: var(--space-sm);
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--terracotta);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.signpost-note {
		margin-top: var(--space-sm);
		font-size: 0.875rem;
		color: var(--muted);
		line-height: 1.5;
	}

	.signpost-note a {
		color: var(--pine);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.box-label {
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: var(--muted);
		margin-bottom: var(--space-xs);
	}

	/* Sources expander */
	.sources {
		margin-bottom: var(--space-lg);
		font-size: 0.875rem;
	}

	.sources summary {
		cursor: pointer;
		color: var(--muted);
		font-weight: 600;
		padding: var(--space-xs) 0;
	}

	.sources summary:hover {
		color: var(--terracotta);
	}

	.sources ul {
		list-style: none;
		margin-top: var(--space-xs);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.sources li {
		line-height: 1.5;
	}

	/* Action rows */
	.step-actions {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-md);
	}

	.next-btn {
		width: auto;
	}

	.score-actions {
		padding-top: var(--space-md);
		border-top: 1px solid var(--border);
		margin-top: var(--space-md);
	}

	/* Synthesis */
	.synthesis-block {
		border: none;
		margin-bottom: var(--space-lg);
	}

	.synthesis-block legend {
		padding: 0;
	}

	.choice-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.btn-choice {
		justify-content: flex-start;
		text-align: left;
		border: 2px solid var(--border);
		background: transparent;
		color: var(--text);
		font-size: 0.9375rem;
		font-weight: 600;
		line-height: 1.4;
		padding: var(--space-sm) var(--space-md);
		min-height: 48px;
	}

	.btn-choice:hover {
		border-color: var(--terracotta);
	}

	.btn-choice.selected {
		border-color: var(--terracotta);
		background: var(--terracotta);
		color: white;
	}

	textarea {
		font-family: var(--font);
		font-size: 1rem;
		padding: 0.75rem 1rem;
		border: 2px solid var(--border);
		border-radius: var(--radius);
		background: white;
		color: var(--dark);
		width: 100%;
		resize: vertical;
		transition: border-color 0.15s;
		margin-top: var(--space-xs);
	}

	textarea:focus {
		outline: none;
		border-color: var(--terracotta);
	}

	textarea:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 2px;
	}

	/* Score */
	.score-card {
		background: var(--surface);
		border-radius: var(--radius);
		padding: var(--space-lg);
		text-align: center;
		margin-bottom: var(--space-lg);
	}

	.score-number {
		font-size: 2.5rem;
		font-weight: 800;
		color: var(--terracotta);
		line-height: 1.1;
	}

	.score-label {
		font-size: 0.875rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted);
		margin-top: var(--space-xs);
	}

	@media (max-width: 380px) {
		.step-actions {
			flex-wrap: wrap;
		}

		.next-btn {
			width: 100%;
		}
	}
</style>
