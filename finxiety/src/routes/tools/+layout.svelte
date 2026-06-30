<script lang="ts">
	import { dev } from '$app/environment';
	import ComingSoon from '$lib/components/ComingSoon.svelte';

	let { children } = $props();
</script>

{#if dev}
	{@render children()}
{:else}
	<ComingSoon />
{/if}
