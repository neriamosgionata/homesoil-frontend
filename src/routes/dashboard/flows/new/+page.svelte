<script lang="ts">
	import FlowEditor from '$lib/components/FlowEditor.svelte';
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import type { Writable } from 'svelte/store';
	import type { Websocket } from '$lib/websocket/Websocket';
	import type { Node, Edge } from '@xyflow/svelte';
	import { flows } from '$lib/stores/store';
	import WebsocketListenEventEnum from '$lib/enums/WebsocketListenEventEnum';
	import type Flow from '$lib/models/Flow';

	const ws = getContext<Writable<Websocket>>('ws');

	let nodes: Node[] = $state([]);
	let edges: Edge[] = $state([]);
	let title = $state('New Flow');

	function handleSave(currentNodes: Node[], currentEdges: Edge[]) {
		const graph = JSON.stringify({ nodes: currentNodes, edges: currentEdges });

		const callback = ({ flow }: { flow: Flow }) => {
			$ws.removeListenerFromEvent(WebsocketListenEventEnum.FLOW_SAVED_EVENT, callback);
			goto(`/dashboard/flows/${flow.id}`);
		};

		$ws.listenToEvent(WebsocketListenEventEnum.FLOW_SAVED_EVENT, callback);

		$ws.addFlow({
			title,
			graph,
			enabled: false,
		});
	}
</script>

<FlowEditor bind:nodes bind:edges bind:title onsave={handleSave} />
