<script lang="ts">
	import "../app.css";

	interface Props {
		children?: import("svelte").Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="w-full h-full flex flex-col bg-[#003f5c]">
	<div class="p-8">
		{@render children?.()}
	</div>
</div>
