<script lang="ts">
	interface Props {
		onChip: (query: string) => void;
	}

	let { onChip }: Props = $props();

	const chips = [
		"I got a raise and I'm not sure if I'll lose my benefits",
		'I need to find out what assistance programs I qualify for',
		'I want to understand my paycheck or taxes',
	];
</script>

<div class="chips" role="group" aria-label="Try one of these">
	{#each chips as chip}
		<button type="button" class="chip" onclick={() => onChip(chip)}>
			{chip}
		</button>
	{/each}
</div>

<style>
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
		margin-top: 12px;
	}

	.chip {
		font-family: var(--font);
		font-size: 0.8125rem;
		color: var(--ink-soft);
		background: transparent;
		border: 1px solid var(--border);
		border-radius: 100px;
		padding: 6px 14px;
		cursor: pointer;
		text-align: left;
		line-height: 1.4;
		transition: border-color 0.12s ease, color 0.12s ease;
	}

	.chip:hover {
		border-color: var(--forest);
		color: var(--forest);
	}

	.chip:focus-visible {
		outline: 2px solid var(--forest);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.chip {
			transition: none;
		}
	}
</style>
