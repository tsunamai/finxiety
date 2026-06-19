<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<svelte:head>
	<title>Finxiety — Free financial tools, one step at a time</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
</svelte:head>

<a href="#main-content" class="skip-link">Skip to main content</a>

<header class="site-header">
	<a href="/" class="wordmark">Finxiety</a>
</header>

<main id="main-content">
	{@render children()}
</main>

<footer class="site-footer">
	<p>Free. Always. &nbsp;·&nbsp; More tools coming soon.</p>
</footer>
