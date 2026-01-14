<script lang="ts">
	import DashboardMessage from "$lib/components/DashboardMessage.svelte";
	import Sidebar from "$lib/components/Sidebar.svelte";

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
		$ws.getAllScripts();
	});

	onDestroy(() => {
		$ws.close();
	});
</script>

<DashboardMessage />

<div class="flex h-full">
	<Sidebar />
	<div class="flex-1 overflow-auto p-8">
		{@render children?.()}
	</div>
</div>
