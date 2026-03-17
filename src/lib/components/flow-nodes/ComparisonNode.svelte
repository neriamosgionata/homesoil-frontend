<script lang="ts">
	import { Handle, Position, useSvelteFlow } from '@xyflow/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let { data = $bindable(), id }: { data: any; id: string } = $props();
	const { deleteElements } = useSvelteFlow();
	const nodeDataStore = getContext<Writable<Record<string, Record<string, any>>>>('nodeDataStore');

	const operators = ['>', '<', '>=', '<=', '==', '!='];

	function updateData(updates: Record<string, any>) {
		data = { ...data, ...updates };
		nodeDataStore.update(s => ({ ...s, [id]: { ...s[id], ...updates } }));
	}
</script>

<div class="node-card comparison-node">
	<div class="node-header">
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<line x1="18" y1="20" x2="18" y2="10"/>
			<line x1="12" y1="20" x2="12" y2="4"/>
			<line x1="6" y1="20" x2="6" y2="14"/>
		</svg>
		<span>Comparison</span>
		<button class="node-delete-btn" onclick={() => deleteElements({ nodes: [{ id }] })} title="Delete node">
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
		</button>
	</div>
	<div class="node-body">
		<select
			value={data.operator ?? '>'}
			onchange={(e) => updateData({ operator: (e.target as HTMLSelectElement).value })}
			class="node-select"
		>
			{#each operators as op}
				<option value={op}>{op}</option>
			{/each}
		</select>
	</div>
	<span class="handle-label" style="top: 50%; left: 10px;">A</span>
	<span class="handle-label" style="top: 88%; left: 10px;">B</span>
	<Handle type="target" position={Position.Left} id="a" style="top: 50%;" class="handle-target" />
	<Handle type="target" position={Position.Left} id="b" style="top: 88%;" class="handle-target" />
	<Handle type="source" position={Position.Right} id="output" style="top: 68%;" class="handle-source" />
</div>

<style>
	.node-card {
		background: var(--bg-secondary, #1e1e2e);
		border: 1px solid var(--border-subtle, #333);
		border-radius: 12px;
		min-width: 150px;
		font-size: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
		position: relative;
	}
	.node-header {
		display: flex;
		align-items: center;
		gap: 6px;
		padding: 8px 12px;
		font-weight: 600;
		border-bottom: 1px solid var(--border-subtle, #333);
	}
	.node-delete-btn {
		margin-left: auto;
		background: none;
		border: none;
		color: var(--text-muted, #888);
		cursor: pointer;
		padding: 2px;
		border-radius: 4px;
		display: flex;
		align-items: center;
		line-height: 1;
		opacity: 0.5;
		transition: all 0.15s;
	}
	.node-delete-btn:hover {
		opacity: 1;
		color: #F44336;
		background: rgba(244, 67, 54, 0.15);
	}
	.comparison-node .node-header {
		background: rgba(156, 39, 176, 0.15);
		border-radius: 11px 11px 0 0;
		color: #9C27B0;
	}
	.node-body {
		padding: 24px 32px 28px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.node-select {
		width: 100%;
		padding: 4px 6px;
		border-radius: 6px;
		border: 1px solid var(--border-subtle, #444);
		background: var(--bg-primary, #111);
		color: var(--text-primary, #fff);
		font-size: 13px;
		text-align: center;
	}
	.handle-label {
		position: absolute;
		font-size: 10px;
		color: var(--text-muted, #888);
		font-weight: 600;
		transform: translateY(-50%);
		pointer-events: none;
	}
</style>
