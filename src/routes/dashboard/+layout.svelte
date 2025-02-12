<script lang="ts">
	import DashboardMessage from "$lib/components/DashboardMessage.svelte";

	interface Props {
		children?: import("svelte").Snippet;
	}

	let { children }: Props = $props();

	import { Websocket } from "$lib/websocket/Websocket";
	import { writable } from "svelte/store";
	import { onDestroy, onMount, setContext } from "svelte";

	const ws = writable(new Websocket());

	setContext("ws", ws);

	onMount(() => {
		$ws.connect();
	});

	onDestroy(() => {
		$ws.close();
	});
</script>

<DashboardMessage />

<div class="container mx-auto">
	{@render children?.()}
</div>
