<script lang="ts">
</script>

<svelte:head>
	<title>All tools | Finxiety</title>
	<meta
		name="description"
		content="All Finxiety tools — benefits help, tax clarity, debt, savings, and more. Free. No account."
	/>
</svelte:head>

<nav class="breadcrumb" aria-label="Breadcrumb">
	<a href="/">← Finxiety</a>
</nav>

<h1>All tools</h1>

<section class="group" aria-labelledby="group-1-title">
	<h2 id="group-1-title">If you need help right now</h2>
	<p class="group-desc">Benefits, deadlines, and decisions with a time pressure on them.</p>

	<nav aria-label="Immediate help tools">
		<a href="/tools/screener" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">What programs might help you?</span>
				<span class="tool-desc">Food, health coverage, phone, energy, school meals — see which California programs you may qualify for.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>

		<a href="/tools/recertification" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">When does your renewal come up?</span>
				<span class="tool-desc">Get a calendar reminder before your SNAP or Medicaid recertification deadline.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>

		<a href="/tools/cliff-calculator" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">Got a raise — do you actually come out ahead?</span>
				<span class="tool-desc">See what a higher income does to your benefits before you decide.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>

		<a href="/tools/document-checklist" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">What do you need to bring?</span>
				<span class="tool-desc">One de-duplicated list of documents across every program you're applying to.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>

		<a href="/tools/emergency-fund" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">How many months of runway do you actually have?</span>
				<span class="tool-desc">Check your emergency fund against your real monthly costs.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>

		<a href="/tools/myth-quiz" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">What's actually true about benefits?</span>
				<span class="tool-desc">Five things most people believe about benefits programs — and what the data shows.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>
	</nav>
</section>

<section class="group" aria-labelledby="group-2-title">
	<h2 id="group-2-title">Get a clearer picture</h2>
	<p class="group-desc">Financial math and money rules, without the jargon.</p>

	<nav aria-label="Financial clarity tools">
		<a href="/tools/tax-clarity" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">What does a deduction actually save you?</span>
				<span class="tool-desc">See the difference between a deduction, a credit, and what your refund really means.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>

		<a href="/tools/compound-interest" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">How does a small amount grow over time?</span>
				<span class="tool-desc">See the split between what you put in and what interest added — at any horizon.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>

		<a href="/tools/debt-growth" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">Is your debt growing faster than your savings?</span>
				<span class="tool-desc">Compound interest runs in both directions. See them on the same chart.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>

		<a href="/tools/work-hours" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">Where does each hour of work actually go?</span>
				<span class="tool-desc">See your pay broken down by taxes and take-home — in time, not just dollars.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>

		<a href="/tools/tip-calculator" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">What do servers in your state actually earn?</span>
				<span class="tool-desc">Split the check and see the wage context behind the tip screen.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>

		<a href="/tools/savings-commitment" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">Want to save more — what would actually make it happen?</span>
				<span class="tool-desc">Write one specific savings commitment in your own words and get a calendar reminder.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>

		<a href="/tools/myth-quiz-2" class="tool-row">
			<span class="tool-row-inner">
				<span class="tool-name">How many money rules are actually true?</span>
				<span class="tool-desc">Ten things most people believe about taxes, credit, tipping, and compound interest.</span>
			</span>
			<span class="tool-arrow" aria-hidden="true">→</span>
		</a>
	</nav>
</section>

<style>
	.breadcrumb {
		margin-bottom: var(--space-md);
		font-size: 0.875rem;
	}

	.breadcrumb a {
		color: var(--muted);
		text-decoration: none;
	}

	.breadcrumb a:hover {
		color: var(--pine);
	}

	h1 {
		margin-bottom: var(--space-lg);
	}

	.group {
		margin-bottom: var(--space-xl);
	}

	.group h2 {
		margin-bottom: var(--space-xs);
	}

	.group-desc {
		font-size: 0.9375rem;
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
		font-weight: 600;
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
</style>
