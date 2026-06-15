<script lang="ts">
</script>

<svelte:head>
	<title>Finxiety — Financial tools for the rest of us</title>
	<meta name="description" content="Free financial tools built for people navigating financial systems without a guide. No account. No catch. No jargon." />
</svelte:head>

<section class="hero">
	<h1>Financial tools<br />for the rest of us.</h1>
	<p class="tagline">Free. Clear. No account required.</p>
	<p class="mission">
		Finxiety builds financial clarity tools for people navigating complex systems without a guide.
		The math works the same for everyone. So does the access.
	</p>
</section>

<hr class="divider" />

<section class="tools">
	<h2>Available now</h2>

	<a href="/tools/emergency-fund" class="tool-card">
		<div class="tool-card-content">
			<h3>Emergency Fund Checker</h3>
			<p>Find out how many months of runway you actually have.</p>
		</div>
		<span class="tool-arrow" aria-hidden="true">→</span>
	</a>

	<a href="/tools/myth-quiz" class="tool-card">
		<div class="tool-card-content">
			<h3>Benefits Myth-Check Quiz</h3>
			<p>Five things most people believe about benefits programs and what the data actually shows.</p>
		</div>
		<span class="tool-arrow" aria-hidden="true">→</span>
	</a>

	<a href="/tools/screener" class="tool-card">
		<div class="tool-card-content">
			<h3>Benefits Screener</h3>
			<p>Check which California programs you may qualify for: CalFresh, Medi-Cal, WIC, Lifeline, HEAP, school meals, and CalEITC.</p>
		</div>
		<span class="tool-arrow" aria-hidden="true">→</span>
	</a>
</section>

<section class="coming-soon">
	<h2>Coming soon</h2>
	<ul>
		<li>Benefits Cliff Calculator: understand what happens to your benefits if your income rises</li>
		<li>Earnings Calculator: know exactly what you're earning after deductions</li>
	</ul>
</section>

<style>
	.hero {
		padding-bottom: var(--space-lg);
	}

	.tagline {
		margin-top: var(--space-sm);
		font-size: 1.0625rem;
		font-weight: 600;
		color: var(--terracotta);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.mission {
		margin-top: var(--space-md);
		font-size: 1rem;
		color: var(--muted);
		max-width: 52ch;
	}

	.tools {
		margin-bottom: var(--space-lg);
	}

	.tools h2,
	.coming-soon h2 {
		margin-bottom: var(--space-md);
	}

	.tool-card {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		background: white;
		border: 2px solid var(--border);
		border-radius: var(--radius);
		padding: var(--space-md);
		text-decoration: none;
		color: inherit;
		transition: border-color 0.15s, box-shadow 0.15s;
	}

	.tool-card:hover {
		border-color: var(--terracotta);
		box-shadow: 0 2px 8px rgba(193, 103, 76, 0.12);
		color: inherit;
	}

	.tool-card:focus-visible {
		outline: 3px solid var(--terracotta);
		outline-offset: 2px;
	}

	.tool-card-content {
		flex: 1;
	}

	.tool-card-content h3 {
		margin-bottom: var(--space-xs);
	}

	.tool-card-content p {
		font-size: 0.9375rem;
		color: var(--muted);
		line-height: 1.55;
	}

	.tool-arrow {
		font-size: 1.25rem;
		color: var(--terracotta);
		flex-shrink: 0;
	}

	.coming-soon {
		margin-top: var(--space-lg);
	}

	.coming-soon ul {
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.coming-soon li {
		padding: var(--space-sm) var(--space-md);
		background: var(--surface);
		border-radius: var(--radius);
		font-size: 0.9375rem;
		color: var(--muted);
		border-left: 3px solid var(--border);
	}
</style>
