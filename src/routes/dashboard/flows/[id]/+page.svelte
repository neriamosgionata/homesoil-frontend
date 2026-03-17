<script lang="ts">
	import FlowEditor from '$lib/components/FlowEditor.svelte';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Websocket } from '$lib/websocket/Websocket';
	import type { Node, Edge } from '@xyflow/svelte';
	import { flows } from '$lib/stores/store';

	const ws = getContext<Writable<Websocket>>('ws');

	let flowId = $derived(Number($page.params.id));
	let flow = $derived($flows[flowId]);

	let initialized = $state(false);
	let nodes: Node[] = $state([]);
	let edges: Edge[] = $state([]);
	let title = $state('');

	$effect(() => {
		if (flow && !initialized) {
			title = flow.title;
			try {
				const graph = JSON.parse(flow.graph);
				nodes = graph.nodes || [];
				edges = graph.edges || [];
			} catch {
				nodes = [];
				edges = [];
			}
			initialized = true;
		}
	});

	function handleSave(currentNodes: Node[], currentEdges: Edge[]) {
		if (!flow) return;

		const graph = JSON.stringify({ nodes: currentNodes, edges: currentEdges });

		$ws.modifyFlow({
			...flow,
			title,
			graph,
		});
	}
</script>

{#if initialized}
	<FlowEditor bind:nodes bind:edges bind:title onsave={handleSave} />
{:else}
	<div class="flex items-center justify-center h-64">
		<p style="color: var(--text-muted);">Loading flow...</p>
	</div>
{/if}
