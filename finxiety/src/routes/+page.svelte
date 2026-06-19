<script lang="ts">
</script>

<svelte:head>
	<title>Finxiety — Free financial tools, one step at a time</title>
	<meta
		name="description"
		content="Free financial tools for people navigating money and benefits without a guide. No account. No sign-up. Nothing saved."
	/>
</svelte:head>

<section class="hero">
	<h1>When money gets complicated,<br />let&rsquo;s figure it out one step at a time.</h1>
	<p class="trust">Free. No sign-up. We&rsquo;re not selling anything.</p>
</section>

<section class="screener" aria-labelledby="screener-title">
	<p class="eyebrow">Not sure where to start?</p>
	<h2 id="screener-title">What kind of help do you need?</h2>
	<p class="lede">
		Answer a few questions and we&rsquo;ll point you to the tools that fit your situation &mdash;
		instead of all of them at once.
	</p>
	<a href="/tools/screener" class="cta">See what&rsquo;s available to you</a>
	<p class="reassure">A few questions. Nothing shared.</p>
</section>

<section class="featured" aria-label="Jump straight in">
	<p class="label">Or jump straight in</p>

	<a class="tool" href="/tools/recertification">
		<h3>When does your renewal come up?</h3>
		<p>Get a calendar reminder before your SNAP or Medicaid recertification.</p>
	</a>

	<a class="tool" href="/tools/cliff-calculator">
		<h3>Got a raise &mdash; do you actually come out ahead?</h3>
		<p>See what a higher income does to your benefits before you decide.</p>
	</a>

	<a class="tool" href="/tools/emergency-fund">
		<h3>How many months of runway do you actually have?</h3>
		<p>Check your emergency fund against your real monthly costs.</p>
	</a>
</section>

<p class="seeall"><a href="/tools">See all tools &rarr;</a></p>

<style>
	/* Hero */
	.hero {
		padding-bottom: var(--space-lg);
	}

	.hero h1 {
		font-family: var(--font-display);
		font-weight: 600;
		font-size: clamp(1.9375rem, 6vw, 2.375rem);
		line-height: 1.12;
		letter-spacing: -0.01em;
		max-width: 18ch;
		margin-bottom: var(--space-md);
	}

	.trust {
		color: var(--ink-mute);
		font-size: 0.9375rem;
		margin: 0;
	}

	/* Screener band — breaks out of main padding to fill the column */
	.screener {
		background: var(--paper-band);
		border-top: 1px solid var(--hair);
		border-bottom: 1px solid var(--hair);
		margin-left: calc(-1 * var(--space-md));
		margin-right: calc(-1 * var(--space-md));
		padding: 40px var(--space-md) 44px;
		margin-bottom: var(--space-lg);
	}

	@media (min-width: 640px) {
		.screener {
			margin-left: calc(-1 * var(--space-lg));
			margin-right: calc(-1 * var(--space-lg));
			padding-left: var(--space-lg);
			padding-right: var(--space-lg);
		}
	}

	.eyebrow {
		color: var(--ink-mute);
		font-size: 0.875rem;
		margin-bottom: 8px;
	}

	.screener h2 {
		font-size: clamp(1.4375rem, 4vw, 1.625rem);
		font-weight: 500;
		margin-bottom: 12px;
		letter-spacing: -0.005em;
	}

	.lede {
		color: var(--ink-soft);
		font-size: 0.9375rem;
		line-height: 1.55;
		margin-bottom: var(--space-lg);
		max-width: 46ch;
	}

	.cta {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		background: var(--forest);
		color: var(--paper);
		text-align: center;
		font-family: var(--font);
		font-size: 1rem;
		font-weight: 500;
		padding: 16px;
		border: 0;
		border-radius: var(--radius);
		cursor: pointer;
		text-decoration: none;
		min-height: 48px;
		transition: background 0.15s ease;
	}

	.cta:hover {
		background: var(--pine-dark);
		color: var(--paper);
	}

	.cta:focus-visible {
		outline: 3px solid var(--forest);
		outline-offset: 2px;
		color: var(--paper);
	}

	.reassure {
		color: var(--ink-faint);
		font-size: 0.8125rem;
		text-align: center;
		margin-top: 14px;
		margin-bottom: 0;
	}

	/* Featured tools */
	.featured {
		margin-bottom: var(--space-md);
	}

	.label {
		font-size: 0.875rem;
		font-weight: 500;
		color: var(--ink-mute);
		margin-bottom: var(--space-md);
	}

	.tool {
		display: block;
		text-decoration: none;
		color: inherit;
		padding: var(--space-sm) 0;
		border-bottom: 1px solid var(--border);
	}

	.tool:first-of-type {
		border-top: 1px solid var(--border);
	}

	.tool h3 {
		font-size: 1rem;
		font-weight: 500;
		margin-bottom: 4px;
		color: var(--ink);
		transition: color 0.12s ease;
	}

	.tool:hover h3,
	.tool:focus-visible h3 {
		color: var(--forest);
	}

	.tool p {
		color: var(--ink-mute);
		font-size: 0.875rem;
		line-height: 1.45;
		margin: 0;
	}

	.tool:focus-visible {
		outline: 2px solid var(--forest);
		outline-offset: 4px;
		border-radius: 2px;
	}

	/* See all */
	.seeall {
		margin-top: var(--space-md);
		padding-bottom: var(--space-xl);
	}

	.seeall a {
		color: var(--forest);
		font-size: 0.9375rem;
		font-weight: 500;
		text-decoration: none;
		border-bottom: 1px solid rgba(60, 74, 58, 0.35);
		padding-bottom: 1px;
	}

	.seeall a:hover {
		border-bottom-color: var(--forest);
	}

	@media (prefers-reduced-motion: reduce) {
		* {
			transition: none !important;
		}
	}
</style>
