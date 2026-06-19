<script lang="ts">
</script>

<svelte:head>
	<title>Finxiety — Free financial tools, one step at a time</title>
	<meta name="description" content="Free financial tools for people navigating money and benefits without a guide. No account. No sign-up. Nothing saved." />
</svelte:head>

<section class="hero">
	<h1>When money gets complicated,<br />let's figure it out one step at a time.</h1>
	<p class="hero-sub">Free. No sign-up. We're not selling anything.</p>
</section>

<section class="callout" aria-label="Featured tool: Benefits Screener">
	<p class="callout-eyebrow">Not sure where to start?</p>
	<h2 class="callout-title">Benefits Screener</h2>
	<p class="callout-desc">Food, health coverage, phone, energy, school meals, and more — see what California programs may help you.</p>
	<a href="/tools/screener" class="btn btn-callout">See what's available to you</a>
	<p class="callout-note">A few questions. Nothing shared.</p>
</section>

<section class="tools" aria-label="Other tools">
	<h2 class="tools-heading">Other tools</h2>
	<nav>
		<a href="/tools/recertification" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">Recertification Tracker</span>
				<span class="tool-desc">When does your SNAP or Medicaid renewal come up? Get a calendar reminder.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>
		<a href="/tools/cliff-calculator" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">Benefits Cliff Calculator</span>
				<span class="tool-desc">Got a raise or job offer? See what happens to your benefits — and whether you come out ahead.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>
		<a href="/tools/document-checklist" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">Document Checklist</span>
				<span class="tool-desc">One de-duplicated list of what to bring across every program you're applying to.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>
		<a href="/tools/tip-calculator" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">Tip Calculator</span>
				<span class="tool-desc">Split the check, see the math, and know what servers in your state actually earn.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>
		<a href="/tools/myth-quiz" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">Benefits Myth-Check Quiz</span>
				<span class="tool-desc">Five things most people believe about benefits — and what's actually true.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>
		<a href="/tools/debt-growth" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">Debt vs. Growth Visualizer</span>
				<span class="tool-desc">See compound interest run in both directions — a debt growing against you and an investment growing for you, on one chart.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>
		<a href="/tools/emergency-fund" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">Emergency Fund Checker</span>
				<span class="tool-desc">How many months of runway do you actually have?</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>
	</nav>
</section>

<p class="coming-soon">More coming: Earnings Calculator</p>

<style>
	/* Hero */
	.hero {
		padding-bottom: var(--space-lg);
	}

	.hero-sub {
		margin-top: var(--space-sm);
		font-size: 0.9375rem;
		font-weight: 600;
		color: var(--muted);
		letter-spacing: 0.01em;
	}

	/* Callout block — full-bleed on mobile, contained on desktop */
	.callout {
		background: var(--surface);
		border-top: 2px solid var(--pine);
		border-bottom: 2px solid var(--pine);
		padding: var(--space-lg) var(--space-md);
		margin-left: calc(-1 * var(--space-md));
		margin-right: calc(-1 * var(--space-md));
		margin-bottom: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	@media (min-width: 640px) {
		.callout {
			margin-left: calc(-1 * var(--space-lg));
			margin-right: calc(-1 * var(--space-lg));
			padding-left: var(--space-lg);
			padding-right: var(--space-lg);
		}
	}

	.callout-eyebrow {
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--pine);
	}

	.callout-title {
		font-size: clamp(1.25rem, 4vw, 1.625rem);
		color: var(--ink);
		margin: 0;
	}

	.callout-desc {
		font-size: 0.9375rem;
		color: var(--muted);
		line-height: 1.6;
		max-width: 44ch;
	}

	.btn-callout {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font);
		font-size: 1rem;
		font-weight: 700;
		padding: 0.875rem 1.5rem;
		border-radius: var(--radius);
		border: none;
		cursor: pointer;
		background: var(--pine);
		color: white;
		text-decoration: none;
		min-height: 48px;
		transition: background 0.15s, transform 0.1s;
		width: 100%;
		margin-top: var(--space-xs);
	}

	.btn-callout:hover {
		background: var(--pine-dark);
		color: white;
	}

	.btn-callout:focus-visible {
		outline: 3px solid var(--pine);
		outline-offset: 2px;
	}

	.btn-callout:active {
		transform: translateY(1px);
	}

	.callout-note {
		font-size: 0.8125rem;
		color: var(--muted);
		text-align: center;
	}

	/* Tools section */
	.tools {
		margin-bottom: var(--space-lg);
	}

	.tools-heading {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--muted);
		margin-bottom: var(--space-md);
	}

	nav {
		display: flex;
		flex-direction: column;
	}

	.tool-row {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		padding: var(--space-sm) 0;
		border-bottom: 1px solid var(--border);
		text-decoration: none;
		color: inherit;
		transition: color 0.12s;
	}

	.tool-row:first-child {
		border-top: 1px solid var(--border);
	}

	.tool-row:hover {
		color: var(--pine);
	}

	.tool-row:hover .tool-arrow {
		transform: translateX(3px);
	}

	.tool-row:focus-visible {
		outline: 3px solid var(--pine);
		outline-offset: 2px;
		border-radius: 2px;
	}

	.tool-row-inner {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.tool-name {
		font-size: 0.9375rem;
		font-weight: 700;
		color: var(--ink);
	}

	.tool-row:hover .tool-name {
		color: var(--pine);
	}

	.tool-desc {
		font-size: 0.8125rem;
		color: var(--muted);
		line-height: 1.45;
	}

	.tool-arrow {
		font-size: 1.125rem;
		color: var(--sage);
		flex-shrink: 0;
		transition: transform 0.12s;
	}

	/* Coming soon */
	.coming-soon {
		font-size: 0.8125rem;
		color: var(--muted);
		text-align: center;
		padding: var(--space-sm) 0 var(--space-lg);
	}
</style>
