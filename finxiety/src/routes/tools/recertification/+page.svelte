<script lang="ts">
	import { tick } from 'svelte';
	import {
		calcRecert,
		isSupported,
		type CertificationPeriods,
		type ProgramKey,
		type RecertResult
	} from '$lib/calculators/recert';
	import {
		generateIcs,
		downloadIcs,
		type IcsEvent
	} from '$lib/ics-generator';
	import { STATE_OPTIONS } from '$lib/data/states';
	import rawData from '$lib/data/certification-periods-2026.json';

	const data = rawData as CertificationPeriods;

	// Supported states for v1 (the only ones with data). We filter the shared
	// STATE_OPTIONS down to these five so we don't set a false expectation.
	const SUPPORTED_STATES = ['CA', 'TX', 'FL', 'NY', 'AZ'];
	const stateOptions = STATE_OPTIONS.filter((o) => SUPPORTED_STATES.includes(o.code));

	// The two v1 programs. Order is the display order on step 1.
	const PROGRAM_KEYS: ProgramKey[] = ['snap', 'medicaid'];

	// Generic, state-neutral labels for the program checkboxes on step 1, before
	// a state is chosen. Once a state is known, we use the data file's label.
	const GENERIC_LABELS: Record<ProgramKey, string> = {
		snap: 'SNAP / food benefits',
		medicaid: 'Medicaid / health coverage'
	};

	// The .ics file opens in an external calendar app, so the DOC-1 link inside it
	// must be absolute. We derive the origin from the live page at download time,
	// which is always correct for whatever domain is serving this tool — no
	// hardcoded production domain to drift out of date.
	const DOC_CHECKLIST_PATH = '/tools/document-checklist';

	function docChecklistUrl(): string {
		const origin = typeof window !== 'undefined' ? window.location.origin : '';
		return `${origin}${DOC_CHECKLIST_PATH}`;
	}

	// --- Flow state -----------------------------------------------------------
	let step = $state<1 | 2 | 3>(1);

	// Step 1 inputs.
	let selectedPrograms = $state<Record<ProgramKey, boolean>>({ snap: false, medicaid: false });
	let selectedState = $state('');

	// Step 2 inputs, keyed by program. Date strings are the native input value
	// (YYYY-MM-DD). "unknown" excludes a program from the calendar.
	let lastCertInput = $state<Record<ProgramKey, string>>({ snap: '', medicaid: '' });
	let dontKnow = $state<Record<ProgramKey, boolean>>({ snap: false, medicaid: false });

	// Step 3 outputs.
	let results = $state<RecertResult[]>([]);
	let excludedPrograms = $state<ProgramKey[]>([]);
	let resultState = $state('');
	let downloadStatus = $state('');

	let step2HeadingEl: HTMLHeadingElement | null = $state(null);
	let step3HeadingEl: HTMLHeadingElement | null = $state(null);

	// --- Derived --------------------------------------------------------------
	const chosenPrograms = $derived(PROGRAM_KEYS.filter((k) => selectedPrograms[k]));
	const stateSupported = $derived(selectedState !== '' && isSupported(selectedState, data));

	const canLeaveStep1 = $derived(chosenPrograms.length >= 1 && stateSupported);

	// Step 2 is satisfiable when, for every chosen program, the user has either
	// entered a date OR checked "I don't know".
	const canShowResults = $derived(
		chosenPrograms.length >= 1 &&
			chosenPrograms.every((k) => dontKnow[k] || lastCertInput[k] !== '')
	);

	// Resolve a program's state-specific label from the data file. Falls back to
	// the generic label if the state has no entry (shouldn't happen post-filter).
	function programLabelFor(program: ProgramKey, state: string): string {
		return data.periods[state]?.[program]?.label ?? GENERIC_LABELS[program];
	}

	// Today at local midnight, for "I don't know" guidance + max date guard.
	const todayIso = new Date().toISOString().slice(0, 10);

	// --- Plain-language "days until due" --------------------------------------
	// Under 60 days: count in days. Otherwise: round to whole months.
	function describeDue(result: RecertResult): string {
		const days = result.daysUntilDue;
		if (days < 0) {
			// Past due per our estimate. Stay neutral; the agency notice is truth.
			return 'Your estimated date has already passed. Check your approval notice for the real date.';
		}
		if (days === 0) return 'around today, based on our estimate';
		if (days < 60) {
			return days === 1 ? 'in about 1 day' : `in about ${days} days`;
		}
		const months = Math.round(days / 30.44);
		return months === 1 ? 'in about 1 month' : `in about ${months} months`;
	}

	// Long, human date for display: "March 14, 2027".
	const longDate = new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	function formatLong(d: Date): string {
		return longDate.format(d);
	}

	// --- Navigation -----------------------------------------------------------
	async function goToStep2(e: Event) {
		e.preventDefault();
		if (!canLeaveStep1) return;
		// Clear any step-2 entries for programs no longer selected, so a
		// deselect-then-reselect doesn't carry a stale date forward.
		for (const k of PROGRAM_KEYS) {
			if (!selectedPrograms[k]) {
				lastCertInput[k] = '';
				dontKnow[k] = false;
			}
		}
		step = 2;
		await tick();
		step2HeadingEl?.focus();
	}

	async function backToStep1() {
		step = 1;
		await tick();
		// Focus is returned to the top heading on re-render via the h1.
	}

	// Parse a native date input (YYYY-MM-DD) as a LOCAL date at midnight.
	// `new Date("2026-01-01")` parses as UTC, which can shift a day in negative
	// timezones; building from parts avoids that.
	function parseLocalDate(iso: string): Date {
		const [y, m, d] = iso.split('-').map(Number);
		return new Date(y, m - 1, d);
	}

	async function showResults(e: Event) {
		e.preventDefault();
		if (!canShowResults) return;

		downloadStatus = '';
		const computed: RecertResult[] = [];
		const excluded: ProgramKey[] = [];

		for (const program of chosenPrograms) {
			if (dontKnow[program] || lastCertInput[program] === '') {
				excluded.push(program);
				continue;
			}
			const lastCert = parseLocalDate(lastCertInput[program]);
			computed.push(calcRecert(program, selectedState, lastCert, data));
		}

		results = computed;
		excludedPrograms = excluded;
		resultState = selectedState;
		step = 3;
		await tick();
		step3HeadingEl?.focus();
	}

	function startOver() {
		step = 1;
		selectedPrograms = { snap: false, medicaid: false };
		selectedState = '';
		lastCertInput = { snap: '', medicaid: '' };
		dontKnow = { snap: false, medicaid: false };
		results = [];
		excludedPrograms = [];
		resultState = '';
		downloadStatus = '';
	}

	// --- .ics composition -----------------------------------------------------
	// Two events per program: a 30-day and a 7-day reminder. All-day events use an
	// exclusive DTEND, so dtend = reminder date + 1 day.
	function nextDay(d: Date): Date {
		const n = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		n.setDate(n.getDate() + 1);
		return n;
	}

	function buildDescription(r: RecertResult, lead: number): string {
		return (
			`${r.programLabel} recertification is estimated for ${formatLong(r.nextCertDate)} ` +
			`(about ${lead} days from this reminder). ` +
			`Recertifying means confirming you still qualify so your benefits keep going. ` +
			`This is an estimate — your real deadline is on your approval notice from the agency. ` +
			`Prepare your documents: ${docChecklistUrl()}`
		);
	}

	function buildEvents(): IcsEvent[] {
		const events: IcsEvent[] = [];
		for (const r of results) {
			events.push({
				summary: `${r.programLabel} recertification — reminder (about 30 days out)`,
				description: buildDescription(r, 30),
				dtstart: r.reminder30,
				dtend: nextDay(r.reminder30),
				uid: `recert-${resultState}-${r.program}-30d@finxiety`
			});
			events.push({
				summary: `${r.programLabel} recertification — reminder (about 7 days out)`,
				description: buildDescription(r, 7),
				dtstart: r.reminder7,
				dtend: nextDay(r.reminder7),
				uid: `recert-${resultState}-${r.program}-7d@finxiety`
			});
		}
		return events;
	}

	function handleDownload() {
		const events = buildEvents();
		if (events.length === 0) {
			downloadStatus = 'There are no dated programs to add to a calendar yet.';
			return;
		}
		const ics = generateIcs(events);
		downloadIcs('finxiety-recertification-reminders.ics', ics);
		downloadStatus = 'Your reminder file is downloading. Open it to add the dates to your calendar.';
	}
</script>

<svelte:head>
	<title>Recertification Deadline Tracker | Finxiety</title>
	<meta
		name="description"
		content="See when your SNAP or Medicaid benefits come up for recertification, and download calendar reminders so the date doesn't slip by. No account. Nothing saved."
	/>
</svelte:head>

<!-- Persistent live region for step transitions -->
<div class="sr-only" aria-live="polite" aria-atomic="true">
	{#if step === 2}
		Step 2 of 3: enter your last certification dates.
	{:else if step === 3}
		Step 3 of 3: your reminders are ready below.
	{/if}
</div>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>Recertification Deadline Tracker</h1>
<p class="tool-description">
	Benefits don't end because people stop qualifying. They often end because a renewal date slipped
	by. Tell us your benefits and when they were last renewed, and we'll estimate the next date and
	build calendar reminders you can keep.
</p>

<p class="step-indicator" aria-hidden="true">Step {step} of 3</p>

<hr class="divider" />

{#if step === 1}
	<form class="recert-form" onsubmit={goToStep2} novalidate>
		<fieldset class="program-group">
			<legend class="group-legend">Which benefits are you currently enrolled in?</legend>
			<p class="field-hint" id="program-hint">Pick the ones you want reminders for.</p>
			{#each PROGRAM_KEYS as key}
				<label class="program-label">
					<input
						type="checkbox"
						bind:checked={selectedPrograms[key]}
						aria-describedby="program-hint"
					/>
					<span class="program-text">
						{selectedState && stateSupported
							? programLabelFor(key, selectedState)
							: GENERIC_LABELS[key]}
					</span>
				</label>
			{/each}
		</fieldset>

		<div class="field">
			<label for="state">Your state</label>
			<select id="state" bind:value={selectedState}>
				<option value="">Select your state</option>
				{#each stateOptions as opt}
					<option value={opt.code}>{opt.name}</option>
				{/each}
			</select>
			<p class="field-hint">
				We have data for California, Texas, Florida, New York, and Arizona right now. More states
				are coming.
			</p>
		</div>

		{#if selectedState && !stateSupported}
			<div class="signpost-box" role="note">
				<p>
					<strong>Good to know:</strong> We don't have recertification data for your state yet, so we
					can't estimate dates here. Your approval notice from the agency always shows your exact
					recertification date.
				</p>
			</div>
		{/if}

		<button class="btn btn-primary" type="submit" disabled={!canLeaveStep1}>Next</button>
		{#if !canLeaveStep1}
			<p class="field-hint submit-hint" aria-live="polite">
				Pick at least one benefit and a state we have data for to continue.
			</p>
		{/if}
	</form>
{/if}

{#if step === 2}
	<form class="recert-form" onsubmit={showResults} novalidate>
		<h2 bind:this={step2HeadingEl} tabindex="-1" class="step-heading">
			When were these last renewed?
		</h2>
		<p class="result-note">
			We mean the date the agency last approved or renewed your benefits — not the date you first
			applied, if that was longer ago.
		</p>

		{#each chosenPrograms as program}
			{@const label = programLabelFor(program, selectedState)}
			<fieldset class="cert-block">
				<legend class="cert-legend">
					When did {label} last approve or renew your benefits?
				</legend>

				{#if dontKnow[program]}
					<div class="signpost-box dont-know-guidance" role="note">
						<p>
							No problem. Check the approval notice letter you received from the agency, or call 211
							to ask a navigator. When you have the date, come back and we'll build your reminders.
						</p>
					</div>
				{:else}
					<div class="field">
						<label for="cert-{program}">Last approval or renewal date</label>
						<input
							id="cert-{program}"
							type="date"
							max={todayIso}
							bind:value={lastCertInput[program]}
						/>
					</div>
				{/if}

				<label class="dont-know-label">
					<input type="checkbox" bind:checked={dontKnow[program]} />
					<span>I don't know this date</span>
				</label>
			</fieldset>
		{/each}

		<div class="step-actions">
			<button class="btn btn-secondary" type="button" onclick={backToStep1}>Back</button>
			<button class="btn btn-primary" type="submit" disabled={!canShowResults}>
				Show my reminders
			</button>
		</div>
		{#if !canShowResults}
			<p class="field-hint submit-hint" aria-live="polite">
				For each benefit, enter a date or check "I don't know" to continue.
			</p>
		{/if}
	</form>
{/if}

{#if step === 3}
	<section class="result" aria-label="Your recertification reminders">
		<h2 bind:this={step3HeadingEl} tabindex="-1" class="step-heading">
			Your estimated recertification dates
		</h2>
		<p class="result-note">
			These are estimates based on typical certification periods in {resultState}. Your actual
			deadline is on your approval notice from the agency.
		</p>

		{#if results.length === 0}
			<div class="signpost-box" role="note">
				<p>
					<strong>Good to know:</strong> We don't have a date to estimate from for any of the benefits
					you picked. When you find your last approval or renewal date, come back and we'll build your
					reminders.
				</p>
			</div>
		{:else}
			{#each results as r (r.program)}
				<div class="result-card">
					<h3 class="result-card-title">{r.programLabel}</h3>
					<p class="result-date">
						Estimated next recertification: <strong>{formatLong(r.nextCertDate)}</strong>
					</p>
					<p class="result-due">{describeDue(r)}</p>
					<p class="result-detail">
						Based on a {r.months}-month certification period, starting from {formatLong(
							r.lastCertDate
						)}. Recertification is due by this date. Missing it can interrupt your benefits while
						you're still eligible, so it's worth setting a reminder.
					</p>

					{#if r.midCertNote}
						<div class="signpost-box mid-cert" role="note">
							<p><strong>Good to know:</strong> {r.midCertNote}</p>
						</div>
					{/if}

					<p class="result-detail">
						<a href={r.source} target="_blank" rel="noopener noreferrer">
							Check {r.programLabel} directly <span aria-hidden="true">→</span>
						</a>
					</p>
				</div>
			{/each}
		{/if}

		{#if excludedPrograms.length > 0}
			<div class="signpost-box excluded-note" role="note">
				<p>
					<strong>Good to know:</strong> We left
					{#each excludedPrograms as program, i}{i > 0
							? i === excludedPrograms.length - 1
								? ' and '
								: ', '
							: ''}{programLabelFor(program, resultState)}{/each}
					out of the reminders because we don't have a last renewal date for
					{excludedPrograms.length === 1 ? 'it' : 'them'}. When you find
					{excludedPrograms.length === 1 ? 'that date' : 'those dates'}, come back and we'll add
					{excludedPrograms.length === 1 ? 'it' : 'them'} in.
				</p>
			</div>
		{/if}

		{#if results.length > 0}
			<div class="download-block">
				<button class="btn btn-primary" type="button" onclick={handleDownload}>
					Download reminders
				</button>
				<p class="field-hint download-hint">
					Opens in Apple Calendar, Google Calendar, or any calendar app. You'll get a reminder about
					30 days and 7 days before each date.
				</p>
				<p class="copy-status" role="status" aria-live="polite">{downloadStatus}</p>
			</div>
		{/if}

		<p class="result-note privacy-note">
			Nothing here is saved or sent anywhere. The dates stay on your device, and the calendar file is
			built right in your browser.
		</p>

		<div class="step-actions">
			<button class="btn btn-secondary" type="button" onclick={startOver}>Start over</button>
		</div>
	</section>
{/if}

<div class="signpost-footer" role="note">
	<h2 class="footer-heading">Related tools</h2>
	<ul class="related-list">
		<li>
			<a href="/tools/document-checklist">Document Checklist</a> — get one list of what to bring so
			you're ready when recertification comes up.
		</li>
		<li>
			<a href="/tools/screener">Benefits Screener</a> — check whether other programs may apply to
			you, too.
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
		margin-bottom: var(--space-xs);
	}

	.step-heading:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 3px;
		border-radius: 2px;
	}

	/* Program multi-select (checkbox affordance, shared with DOC-1) */
	.program-group {
		border: none;
		padding: 0;
		margin: 0 0 var(--space-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.group-legend {
		font-weight: 600;
		font-size: 1rem;
		color: var(--text);
		padding: 0;
		margin-bottom: var(--space-xs);
	}

	.program-group .field-hint {
		margin-bottom: var(--space-xs);
	}

	.program-label {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		min-height: 44px;
		cursor: pointer;
	}

	.program-label input[type='checkbox'] {
		flex-shrink: 0;
		width: 1.125rem;
		height: 1.125rem;
		accent-color: var(--terracotta);
		cursor: pointer;
	}

	.program-text {
		font-size: 1rem;
		color: var(--text);
		line-height: 1.4;
	}

	/* State selector (TIP-1 / DOC-1 pattern) */
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

	/* Native date input, sized to match the rest of the form */
	input[type='date'] {
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

	input[type='date']:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 2px;
	}

	.btn-primary:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.btn-primary:disabled:hover {
		background: var(--terracotta);
	}

	.submit-hint {
		margin-top: var(--space-sm);
	}

	/* Step 2: per-program cert blocks */
	.cert-block {
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-md);
		margin-bottom: var(--space-md);
		background: white;
	}

	.cert-legend {
		font-weight: 600;
		font-size: 1rem;
		color: var(--text);
		padding: 0;
		margin-bottom: var(--space-sm);
		line-height: 1.4;
	}

	.cert-block .field {
		margin-bottom: var(--space-sm);
	}

	.dont-know-label {
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		min-height: 44px;
		cursor: pointer;
		font-weight: 400;
		font-size: 0.9375rem;
		color: var(--text);
	}

	.dont-know-label input[type='checkbox'] {
		flex-shrink: 0;
		width: 1.125rem;
		height: 1.125rem;
		accent-color: var(--terracotta);
		cursor: pointer;
	}

	.dont-know-guidance {
		margin-bottom: var(--space-sm);
	}

	/* Step actions: back + primary side by side */
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

	/* Results */
	.result {
		margin-top: var(--space-md);
	}

	.result-note {
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.55;
		margin-top: var(--space-xs);
	}

	.result-card {
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-md);
		background: white;
		margin-top: var(--space-md);
	}

	.result-card-title {
		font-size: 1.125rem;
		font-weight: 700;
		color: var(--dark);
		margin-bottom: var(--space-xs);
	}

	.result-date {
		font-size: 1rem;
		color: var(--text);
		line-height: 1.5;
	}

	.result-due {
		font-size: 1rem;
		font-weight: 700;
		color: var(--olive);
		margin-top: var(--space-xs);
	}

	.result-detail {
		font-size: 0.9375rem;
		color: var(--text);
		line-height: 1.6;
		margin-top: var(--space-sm);
	}

	/* Signpost (olive marker), shared across tools */
	.signpost-box {
		background: var(--cream);
		border-left: 3px solid var(--olive);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text);
	}

	.mid-cert,
	.excluded-note {
		margin-top: var(--space-md);
	}

	/* Download */
	.download-block {
		margin-top: var(--space-lg);
	}

	.download-hint {
		margin-top: var(--space-sm);
	}

	.copy-status {
		font-size: 0.8125rem;
		color: var(--muted);
		margin-top: var(--space-xs);
		min-height: 1.2rem;
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
