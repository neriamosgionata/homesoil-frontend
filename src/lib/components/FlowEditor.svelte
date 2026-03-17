<script lang="ts">
	import { SvelteFlow, Controls, Background, MiniMap, type Node, type Edge, type NodeTypes, type OnDelete } from '@xyflow/svelte';
	import '@xyflow/svelte/dist/style.css';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	import SensorInputNode from '$lib/components/flow-nodes/SensorInputNode.svelte';
	import ActuatorOutputNode from '$lib/components/flow-nodes/ActuatorOutputNode.svelte';
	import ComparisonNode from '$lib/components/flow-nodes/ComparisonNode.svelte';
	import LogicGateNode from '$lib/components/flow-nodes/LogicGateNode.svelte';
	import ConstantNode from '$lib/components/flow-nodes/ConstantNode.svelte';

	let {
		nodes = $bindable<Node[]>([]),
		edges = $bindable<Edge[]>([]),
		title = $bindable(''),
		onsave,
	}: {
		nodes: Node[];
		edges: Edge[];
		title: string;
		onsave: (nodes: Node[], edges: Edge[]) => void;
	} = $props();

	// Shared store for node data updates from custom node components
	const nodeDataStore = writable<Record<string, Record<string, any>>>({});
	setContext('nodeDataStore', nodeDataStore);

	// Initialize the store with existing node data (once)
	{
		const initial: Record<string, Record<string, any>> = {};
		for (const node of nodes) {
			initial[node.id] = { ...node.data };
		}
		nodeDataStore.set(initial);
	}

	const nodeTypes: NodeTypes = {
		sensor_input: SensorInputNode as any,
		actuator_output: ActuatorOutputNode as any,
		comparison: ComparisonNode as any,
		logic_gate: LogicGateNode as any,
		constant: ConstantNode as any,
	};

	const nodeTemplates = [
		{ type: 'sensor_input', label: 'Sensor Input', color: '#4CAF50' },
		{ type: 'actuator_output', label: 'Actuator Output', color: '#F44336' },
		{ type: 'comparison', label: 'Comparison', color: '#9C27B0' },
		{ type: 'logic_gate', label: 'Logic Gate', color: '#FFC107' },
		{ type: 'constant', label: 'Constant', color: '#2196F3' },
	];

	let nodeIdCounter = $state(1);

	function addNode(type: string) {
		const id = `${type}_${Date.now()}_${nodeIdCounter++}`;
		const data = getDefaultData(type);
		const newNode: Node = {
			id,
			type,
			position: { x: 250 + Math.random() * 200, y: 100 + Math.random() * 200 },
			data,
		};
		nodes = [...nodes, newNode];
		nodeDataStore.update(s => ({ ...s, [id]: { ...data } }));
	}

	const ondelete: OnDelete = ({ nodes: deletedNodes, edges: deletedEdges }) => {
		const deletedNodeIds = new Set(deletedNodes.map((n) => n.id));
		const deletedEdgeIds = new Set(deletedEdges.map((e) => e.id));
		nodes = nodes.filter((n) => !deletedNodeIds.has(n.id));
		edges = edges.filter((e) => !deletedEdgeIds.has(e.id) && !deletedNodeIds.has(e.source) && !deletedNodeIds.has(e.target));
		nodeDataStore.update(s => {
			const next = { ...s };
			for (const id of deletedNodeIds) delete next[id];
			return next;
		});
	};

	function handleSave() {
		const dataSnapshot = $nodeDataStore;
		const savedNodes = nodes.map(n => ({
			id: n.id,
			type: n.type,
			position: n.position,
			data: dataSnapshot[n.id] ?? n.data,
		}));
		onsave(savedNodes, edges);
	}

	function getDefaultData(type: string): Record<string, any> {
		switch (type) {
			case 'sensor_input': return { sensor_id: null };
			case 'actuator_output': return { actuator_id: null, pulse: false };
			case 'comparison': return { operator: '>' };
			case 'logic_gate': return { operator: 'AND' };
			case 'constant': return { value: 0 };
			default: return {};
		}
	}
</script>

<div class="flow-editor-container">
	<!-- Toolbar -->
	<div class="flow-toolbar">
		<div class="flex items-center gap-3 flex-1">
			<input
				type="text"
				bind:value={title}
				placeholder="Flow name..."
				class="flow-title-input"
			/>
		</div>
		<div class="flex items-center gap-2">
			{#each nodeTemplates as tmpl}
				<button
					class="node-add-btn"
					style="border-color: {tmpl.color}; color: {tmpl.color};"
					onclick={() => addNode(tmpl.type)}
					title="Add {tmpl.label}"
				>
					+ {tmpl.label}
				</button>
			{/each}
		</div>
		<button class="save-btn" onclick={handleSave}>
			Save
		</button>
	</div>

	<!-- Canvas -->
	<div class="flow-canvas">
		<SvelteFlow
			bind:nodes
			bind:edges
			{nodeTypes}
			fitView
			deleteKey={["Backspace", "Delete"]}
			{ondelete}
			colorMode="dark"
		>
			<Controls />
			<Background />
			<MiniMap />
		</SvelteFlow>
	</div>
</div>

<style>
	.flow-editor-container {
		display: flex;
		flex-direction: column;
		height: calc(100vh - 64px);
		margin: -2rem;
	}
	.flow-toolbar {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 12px 16px;
		background: var(--bg-secondary, #1e1e2e);
		border-bottom: 1px solid var(--border-subtle, #333);
		flex-wrap: wrap;
	}
	.flow-title-input {
		padding: 6px 12px;
		border-radius: 8px;
		border: 1px solid var(--border-subtle, #444);
		background: var(--bg-primary, #111);
		color: var(--text-primary, #fff);
		font-size: 14px;
		font-weight: 600;
		min-width: 200px;
	}
	.node-add-btn {
		padding: 4px 10px;
		border-radius: 6px;
		border: 1px solid;
		background: transparent;
		font-size: 11px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.15s;
		white-space: nowrap;
	}
	.node-add-btn:hover {
		background: rgba(255, 255, 255, 0.05);
	}
	.save-btn {
		padding: 6px 20px;
		border-radius: 8px;
		background: var(--accent, #6366f1);
		color: white;
		font-weight: 600;
		font-size: 13px;
		border: none;
		cursor: pointer;
		transition: opacity 0.15s;
	}
	.save-btn:hover {
		opacity: 0.9;
	}
	.flow-canvas {
		flex: 1;
		position: relative;
	}

	:global(.svelte-flow) {
		background: var(--bg-primary, #0a0a0f) !important;
	}
	:global(.svelte-flow__edge-path) {
		stroke: #6366f1 !important;
		stroke-width: 2 !important;
	}
	:global(.svelte-flow__handle) {
		width: 10px !important;
		height: 10px !important;
		border: 2px solid #6366f1 !important;
		background: var(--bg-primary, #111) !important;
	}
	:global(.svelte-flow__handle:hover) {
		background: #6366f1 !important;
	}
</style>
