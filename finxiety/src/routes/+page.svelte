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

	<a href="/tools/screener" class="tool-card tool-card--hero">
		<div class="tool-card-content">
			<h3>Benefits Screener</h3>
			<p>See which California programs you may be able to get help from: food, health coverage, phone, energy, school meals, and more. A few questions. No account. Nothing saved.</p>
		</div>
		<span class="tool-arrow" aria-hidden="true">→</span>
	</a>

	<p class="more-tools-label">More tools</p>

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

	<a href="/tools/tip-calculator" class="tool-card">
		<div class="tool-card-content">
			<h3>Tip Calculator</h3>
			<p>Split the check and see the actual math. Plus the wage context where you are: what servers in your state actually earn before tips.</p>
		</div>
		<span class="tool-arrow" aria-hidden="true">→</span>
	</a>

	<a href="/tools/document-checklist" class="tool-card">
		<div class="tool-card-content">
			<h3>Document Checklist</h3>
			<p>Applying to more than one program? Get one list of what to bring, de-duplicated across all the programs you pick.</p>
		</div>
		<span class="tool-arrow" aria-hidden="true">→</span>
	</a>

	<a href="/tools/recertification" class="tool-card">
		<div class="tool-card-content">
			<h3>Recertification Deadline Tracker</h3>
			<p>See when your SNAP or Medicaid benefits come up for renewal, and download calendar reminders so the date doesn't slip by.</p>
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

	.tool-card--hero {
		background: var(--surface);
		border-color: var(--terracotta);
		box-shadow: 0 2px 8px rgba(193, 103, 76, 0.1);
	}

	.tool-card--hero h3 {
		font-size: 1.125rem;
	}

	.tool-card--hero:hover {
		box-shadow: 0 4px 16px rgba(193, 103, 76, 0.2);
	}

	.more-tools-label {
		font-size: 0.8125rem;
		font-weight: 600;
		color: var(--muted);
		text-transform: uppercase;
		letter-spacing: 0.08em;
		margin-top: var(--space-sm);
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
