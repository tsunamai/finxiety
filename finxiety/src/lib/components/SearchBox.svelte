<script lang="ts">
	import { ArrowRight } from '@lucide/svelte';

	interface Props {
		query?: string;
		onSearch: (query: string) => void;
	}

	let { query = $bindable(''), onSearch }: Props = $props();

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		const trimmed = query.trim();
		if (trimmed.length >= 3) {
			onSearch(trimmed);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			const trimmed = query.trim();
			if (trimmed.length >= 3) {
				onSearch(trimmed);
			}
		}
	}
</script>

<form class="search-form" onsubmit={handleSubmit}>
	<label for="query-input" class="sr-only">Describe your financial situation</label>
	<textarea
		id="query-input"
		class="search-input"
		placeholder="e.g. I got a raise — will I lose my benefits?"
		rows="2"
		bind:value={query}
		onkeydown={handleKeydown}
	></textarea>
	<button type="submit" class="search-btn" aria-label="Search">
		<ArrowRight size={20} />
	</button>
</form>

<style>
	.search-form {
		position: relative;
		width: 100%;
	}

	.search-input {
		width: 100%;
		resize: none;
		font-family: var(--font);
		font-size: 1.0625rem;
		line-height: 1.5;
		color: var(--ink);
		background: var(--paper-elevated);
		border: 2px solid var(--border);
		border-radius: 16px;
		padding: 16px 60px 16px 20px;
		outline: none;
		transition: border-color 0.15s ease;
	}

	.search-input::placeholder {
		color: var(--ink-faint);
	}

	.search-input:focus {
		border-color: var(--forest);
	}

	.search-btn {
		position: absolute;
		right: 10px;
		top: 50%;
		transform: translateY(-50%);
		width: 40px;
		height: 40px;
		background: var(--forest);
		color: var(--paper);
		border: 0;
		border-radius: 10px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: background 0.15s ease;
		flex-shrink: 0;
	}

	.search-btn:hover {
		background: var(--pine-dark);
	}

	.search-btn:focus-visible {
		outline: 3px solid var(--forest);
		outline-offset: 2px;
	}

	@media (prefers-reduced-motion: reduce) {
		.search-input,
		.search-btn {
			transition: none;
		}
	}
</style>
