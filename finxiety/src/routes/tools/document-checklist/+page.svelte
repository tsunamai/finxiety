<script lang="ts">
	import { tick } from 'svelte';
	import {
		buildChecklist,
		programLabel,
		programUrl,
		type ChecklistCategory,
		type DocRequirements,
		type DocumentStatus
	} from '$lib/calculators/doc-checklist';
	import { STATE_OPTIONS } from '$lib/data/states';
	import rawData from '$lib/data/doc-requirements.json';

	const data = rawData as DocRequirements;

	// Program order for the checkbox group, sourced from the data file.
	const PROGRAM_KEYS = Object.keys(data.programs);

	// Inputs. `selectedState` is the shared input-model `state` field (string).
	let selectedPrograms = $state<Record<string, boolean>>(
		Object.fromEntries(PROGRAM_KEYS.map((k) => [k, false]))
	);
	let selectedState: string = $state('');

	// Result state.
	let submitted = $state(false);
	let checklist = $state<ChecklistCategory[]>([]);
	let resultPrograms = $state<string[]>([]); // program keys, in selection order
	let resultState = $state('');
	let copyStatus = $state('');

	let resultHeadingEl: HTMLHeadingElement | null = $state(null);

	const chosenPrograms = $derived(PROGRAM_KEYS.filter((k) => selectedPrograms[k]));
	const canSubmit = $derived(chosenPrograms.length >= 1 && selectedState !== '');

	const isCA = $derived(resultState === 'CA');

	const statusPillLabels: Record<DocumentStatus, string> = {
		required: 'Required',
		one_of: 'Choose one',
		conditional: 'If it applies'
	};

	const statusPillClass: Record<DocumentStatus, string> = {
		required: 'status-required',
		one_of: 'status-one-of',
		conditional: 'status-conditional'
	};

	// "CalFresh" | "CalFresh and Medi-Cal" | "CalFresh, Medi-Cal, and HEAP"
	function formatNeededFor(labels: string[]): string {
		if (labels.length === 0) return '';
		if (labels.length === 1) return labels[0];
		if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
		return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
	}

	// Resolved program labels for the result state (used in headings / payload).
	const resultLabels = $derived(
		resultPrograms.map((key) => programLabel(data.programs[key], resultState))
	);

	async function showList(e: Event) {
		e.preventDefault();
		if (!canSubmit) return;
		copyStatus = '';
		resultPrograms = chosenPrograms;
		resultState = selectedState;
		checklist = buildChecklist(resultPrograms, resultState, data);
		submitted = true;
		await tick();
		resultHeadingEl?.focus();
	}

	function buildClipboardText(): string {
		const programNames = formatNeededFor(resultLabels);
		const lines: string[] = [];
		lines.push(
			`Documents commonly requested for: ${programNames}. This is a guide, not the official list. Confirm with the official link for each program.`
		);
		lines.push('');

		for (const category of checklist) {
			lines.push(category.label.toUpperCase());
			for (const item of category.items) {
				const pill = statusPillLabels[item.resolved_status].toUpperCase();
				lines.push(`- [${pill}] ${item.name}`);
				if (item.description) lines.push(`    ${item.description}`);
				if (item.resolved_status === 'one_of' && item.accepts && item.accepts.length > 0) {
					lines.push('    Any one of these works:');
					for (const opt of item.accepts) lines.push(`      - ${opt}`);
				}
				if (item.resolved_status === 'conditional' && item.condition_note) {
					lines.push(`    Bring this ${item.condition_note}`);
				}
				lines.push(`    Needed for ${formatNeededFor(item.needed_for)}`);
				if (item.divergence_note) lines.push(`    Good to know: ${item.divergence_note}`);
			}
			lines.push('');
		}

		lines.push('OFFICIAL SOURCES');
		for (const key of resultPrograms) {
			const program = data.programs[key];
			lines.push(`- ${programLabel(program, resultState)}: ${programUrl(program, resultState)}`);
		}

		return lines.join('\n');
	}

	async function copyChecklist() {
		const text = buildClipboardText();
		try {
			await navigator.clipboard.writeText(text);
			copyStatus = 'Copied to your clipboard.';
		} catch {
			copyStatus = 'Could not copy automatically. You can still print or use the links below.';
		}
	}

	const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

	function printChecklist() {
		if (typeof window !== 'undefined') window.print();
	}
</script>

<svelte:head>
	<title>Document Checklist | Finxiety</title>
	<meta
		name="description"
		content="Applying to more than one program? Get one de-duplicated list of the documents commonly requested across all the programs you pick."
	/>
</svelte:head>

<!-- Persistent live region for reliable screen-reader announcements -->
<div class="sr-only" aria-live="polite" aria-atomic="true">
	{#if submitted}
		Your document checklist is ready below.
	{/if}
</div>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>Document Checklist</h1>
<p class="tool-description">
	Pick the programs you are applying for and your state. We will show you one list of the documents
	commonly requested, with the same document listed once even when several programs ask for it.
</p>

<hr class="divider" />

<form class="checklist-form" onsubmit={showList} novalidate>
	<fieldset class="program-group">
		<legend class="program-group-legend">Which programs are you applying for?</legend>
		<p class="field-hint" id="program-hint">Pick one or more.</p>
		{#each PROGRAM_KEYS as key}
			<label class="program-label">
				<input
					type="checkbox"
					bind:checked={selectedPrograms[key]}
					aria-describedby="program-hint"
				/>
				<span class="program-text">
					{programLabel(data.programs[key], selectedState)}
				</span>
			</label>
		{/each}
	</fieldset>

	<div class="field">
		<label for="state">Your state</label>
		<select id="state" bind:value={selectedState}>
			<option value="">Select your state</option>
			{#each STATE_OPTIONS as opt}
				<option value={opt.code}>{opt.name}</option>
			{/each}
		</select>
		<p class="field-hint">
			California has the most detail right now. Other states show the national baseline.
		</p>
	</div>

	<button class="btn btn-primary" type="submit" disabled={!canSubmit}>Show my list</button>
	<p class="field-hint submit-hint" aria-live="polite" role="status">
		{#if !canSubmit}Select at least one program and a state to continue.{/if}
	</p>
</form>

{#if submitted}
	<div class="print-header" aria-hidden="true">
		<p class="print-title">Your document checklist</p>
		<p class="print-programs">{formatNeededFor(resultLabels)}</p>
		<p class="print-date">Printed {today}</p>
		<p class="print-source">finxiety.org/tools/document-checklist</p>
	</div>

	<section class="result" aria-label="Document checklist">
		<div class="result-header">
			<h2 bind:this={resultHeadingEl} tabindex="-1">
				Documents commonly requested for {formatNeededFor(resultLabels)}
			</h2>
			<p class="result-note">
				This is a guide, not the official list. Your county may ask for something different. Confirm
				with the official link for each program below.
			</p>
		</div>

		{#each resultPrograms as key (key)}
			{#if data.programs[key].program_note}
				<div class="signpost-box program-note" role="note">
					<p>{data.programs[key].program_note}</p>
				</div>
			{/if}
		{/each}

		{#if checklist.length === 0}
			<div class="signpost-box" role="note">
				<p>
					<strong>Good to know:</strong> We could not build a list for that combination. The official
					links below are the most reliable source for each program.
				</p>
			</div>
		{:else}
			{#if !isCA}
				<div class="signpost-box baseline-banner" role="note">
					<p>
						<strong>Good to know:</strong> Showing the national baseline. Your state may ask for
						something different. Check the official link for each program below.
					</p>
				</div>
			{/if}

			{#each checklist as category (category.category)}
				<div class="category-block">
					<h3 class="category-heading">{category.label}</h3>
					<ul class="doc-list" role="list">
						{#each category.items as item (item.id)}
							<li class="doc-item">
								<div class="doc-item-head">
									<span class="status-pill {statusPillClass[item.resolved_status]}">
										<span class="sr-only">{statusPillLabels[item.resolved_status]}: </span>
										<span aria-hidden="true">{statusPillLabels[item.resolved_status]}</span>
									</span>
									<span class="doc-name">{item.name}</span>
								</div>

								{#if item.description}
									<p class="doc-description">{item.description}</p>
								{/if}

								{#if item.resolved_status === 'one_of' && item.accepts && item.accepts.length > 0}
									<div class="one-of-wrap">
										<p class="one-of-intro">Any one of these works:</p>
										<ul class="one-of-options">
											{#each item.accepts as opt}
												<li>{opt}</li>
											{/each}
										</ul>
									</div>
								{/if}

								{#if item.resolved_status === 'conditional' && item.condition_note}
									<p class="doc-condition">Bring this {item.condition_note}</p>
								{/if}

								<p class="doc-needed-for">Needed for {formatNeededFor(item.needed_for)}</p>

								{#if item.divergence_note}
									<div class="signpost-box divergence" role="note">
										<p><strong>Good to know:</strong> {item.divergence_note}</p>
									</div>
								{/if}
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		{/if}

		<div class="sources">
			<h3 class="sources-heading">Official sources</h3>
			<p class="result-note">The most reliable list always comes from the program itself.</p>
			<ul class="source-list" role="list">
				{#each resultPrograms as key (key)}
					<li>
						<a
							class="source-anchor"
							href={programUrl(data.programs[key], resultState)}
							target="_blank"
							rel="noopener noreferrer"
						>
							{programLabel(data.programs[key], resultState)}
							<span aria-hidden="true">→</span>
							<span class="sr-only">(opens in a new tab)</span>
						</a>
					</li>
				{/each}
			</ul>
			<p class="result-note last-updated">
				Document requirements last reviewed {data.last_updated}. They can change; the official links
				above are always current.
			</p>
		</div>

		{#if checklist.length > 0}
			<div class="result-actions">
				<button class="btn btn-secondary" type="button" onclick={copyChecklist}>
					Copy as text
				</button>
				<button class="btn btn-secondary" type="button" onclick={printChecklist}>
					Print / Save as PDF
				</button>
			</div>
			<p class="copy-status" role="status" aria-live="polite">{copyStatus}</p>
		{/if}
	</section>
{/if}

<div class="signpost-footer" role="note">
	<p>
		Not sure which programs you may qualify for? <a href="/tools/screener">The Benefits Screener</a>
		can help you find out.
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

	h2:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 3px;
		border-radius: 2px;
	}

	/* Program multi-select (checkbox affordance, screener pattern) */
	.program-group {
		border: none;
		padding: 0;
		margin: 0 0 var(--space-md);
		display: flex;
		flex-direction: column;
		gap: var(--space-xs);
	}

	.program-group-legend {
		font-weight: 600;
		font-size: 0.9375rem;
		color: var(--text);
		padding: 0;
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

	/* State selector (TIP-1 pattern) */
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

	.btn-primary:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.btn-primary:disabled:hover {
		background: var(--terracotta);
	}

	/* Result */
	.result {
		margin-top: var(--space-lg);
	}

	.result-header {
		margin-bottom: var(--space-md);
	}

	.result-header h2 {
		font-size: 1.375rem;
		font-weight: 700;
		color: var(--dark);
		margin-bottom: var(--space-xs);
	}

	.result-note {
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.55;
	}

	/* Signpost (olive marker), shared with TIP-1 */
	.signpost-box {
		background: var(--cream);
		border-left: 3px solid var(--olive);
		border-radius: 0 var(--radius) var(--radius) 0;
		padding: var(--space-md);
		font-size: 0.9375rem;
		line-height: 1.6;
		color: var(--text);
	}

	.baseline-banner {
		margin-bottom: var(--space-md);
	}

	/* Category blocks */
	.category-block {
		margin-bottom: var(--space-lg);
	}

	.category-heading {
		font-size: 0.8125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted);
		margin-bottom: var(--space-sm);
		padding-bottom: var(--space-xs);
		border-bottom: 1px solid var(--border);
	}

	.doc-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.doc-item {
		border: 1px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-md);
		background: white;
	}

	.doc-item-head {
		display: flex;
		align-items: baseline;
		gap: var(--space-sm);
		flex-wrap: wrap;
	}

	/* Status pills: meaning conveyed by text, not color alone */
	.status-pill {
		font-size: 0.6875rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		padding: 0.2rem 0.5rem;
		border-radius: 999px;
		white-space: nowrap;
		flex-shrink: 0;
	}

	/* terracotta on white: 4.5:1+; white on terracotta passes AA */
	.status-required {
		background: var(--terracotta);
		color: white;
	}

	/* olive on white passes AA */
	.status-one-of {
		background: var(--olive);
		color: white;
	}

	/* --text on --surface passes AA */
	.status-conditional {
		background: var(--surface);
		color: var(--text);
		border: 1px solid var(--border);
	}

	.doc-name {
		font-size: 1rem;
		font-weight: 700;
		color: var(--dark);
		line-height: 1.35;
	}

	.doc-description {
		font-size: 0.9375rem;
		color: var(--text);
		line-height: 1.6;
		margin-top: var(--space-sm);
	}

	.doc-condition {
		font-size: 0.875rem;
		color: var(--muted);
		font-style: italic;
		line-height: 1.55;
		margin-top: var(--space-xs);
	}

	/* CHOOSE ONE sub-list: cream inset, indented, no sub-pills */
	.one-of-wrap {
		margin-top: var(--space-sm);
		background: var(--cream);
		border-radius: var(--radius);
		padding: var(--space-sm) var(--space-md);
	}

	.one-of-intro {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--text);
		margin-bottom: var(--space-xs);
	}

	.one-of-options {
		list-style: disc;
		padding-left: 1.25rem;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.one-of-options li {
		font-size: 0.875rem;
		color: var(--text);
		line-height: 1.5;
	}

	.doc-needed-for {
		font-size: 0.8125rem;
		color: var(--muted);
		margin-top: var(--space-sm);
	}

	.divergence {
		margin-top: var(--space-sm);
		font-size: 0.875rem;
	}

	/* Sources */
	.sources {
		margin-top: var(--space-lg);
		margin-bottom: var(--space-md);
	}

	.sources-heading {
		font-size: 0.8125rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: var(--muted);
		margin-bottom: var(--space-xs);
	}

	.source-list {
		list-style: none;
		padding: 0;
		margin: var(--space-sm) 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.source-anchor {
		color: var(--terracotta);
		font-weight: 600;
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
		min-height: 44px;
	}

	.last-updated {
		margin-top: var(--space-sm);
	}

	/* Actions: in-flow, not sticky */
	.result-actions {
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
		min-width: 140px;
	}

	.btn-secondary:hover {
		background: var(--terracotta);
		color: white;
	}

	.copy-status {
		font-size: 0.8125rem;
		color: var(--muted);
		margin-top: var(--space-xs);
		min-height: 1.2rem;
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

	/* Hidden in-browser; revealed at print time */
	.print-header {
		display: none;
	}

	/* Print: hide chrome, expose URLs, avoid breaking item blocks */
	@media print {
		.print-header {
			display: block;
			margin-bottom: 1.25rem;
		}

		.print-title {
			font-size: 1.125rem;
			font-weight: 700;
			color: #000;
			margin-bottom: 0.25rem;
		}

		.print-programs {
			font-size: 0.9375rem;
			color: #000;
		}

		.print-date,
		.print-source {
			font-size: 0.8125rem;
			color: #555;
		}

		.breadcrumb,
		.checklist-form,
		.result-actions,
		.copy-status,
		.signpost-footer {
			display: none !important;
		}

		.doc-item,
		.one-of-wrap,
		.category-block {
			break-inside: avoid;
		}

		/* Convert tint backgrounds to thin border rules (ink-economical) */
		.doc-item {
			border: none;
			border-left: 2px solid var(--border);
			border-radius: 0;
			padding-left: var(--space-sm);
			background: none;
		}

		.signpost-box,
		.one-of-wrap {
			background: none;
			border-left: 2px solid var(--olive);
			border-radius: 0;
		}

		.status-pill {
			background: none !important;
			color: #000 !important;
			border: 1px solid #000;
			padding: 0.05rem 0.35rem;
		}

		/* Show source URLs as printed text */
		.source-anchor[href]::after {
			content: ' (' attr(href) ')';
			font-weight: 400;
			font-size: 0.75rem;
		}
	}
</style>
