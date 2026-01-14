<script lang="ts">
	import "../app.css";

	interface Props {
		children?: import("svelte").Snippet;
	}

	let { children }: Props = $props();
</script>

<main class="w-full h-full" style="background-color: var(--bg-primary);">
	{@render children?.()}
</main>
