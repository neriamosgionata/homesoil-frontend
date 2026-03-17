<script lang="ts">
	import { Handle, Position, useSvelteFlow } from '@xyflow/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let { data = $bindable(), id }: { data: any; id: string } = $props();
	const { deleteElements } = useSvelteFlow();
	const nodeDataStore = getContext<Writable<Record<string, Record<string, any>>>>('nodeDataStore');

	function updateData(updates: Record<string, any>) {
		data = { ...data, ...updates };
		nodeDataStore.update(s => ({ ...s, [id]: { ...s[id], ...updates } }));
	}
</script>

<div class="node-card constant-node">
	<div class="node-header">
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="12" cy="12" r="10"/>
			<path d="M12 8v8"/>
		</svg>
		<span>Constant</span>
		<button class="node-delete-btn" onclick={() => deleteElements({ nodes: [{ id }] })} title="Delete node">
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
		</button>
	</div>
	<div class="node-body">
		<input
			type="number"
			value={data.value ?? 0}
			oninput={(e) => updateData({ value: Number((e.target as HTMLInputElement).value) })}
			class="node-input"
			step="any"
		/>
	</div>
	<Handle type="source" position={Position.Right} id="output" class="handle-source" />
</div>

<style>
	.node-card {
		background: var(--bg-secondary, #1e1e2e);
		border: 1px solid var(--border-subtle, #333);
		border-radius: 12px;
		min-width: 140px;
		font-size: 12px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
		color: #ef4444;
		background: rgba(239, 68, 68, 0.15);
	}
	.constant-node .node-header {
		background: rgba(59, 130, 246, 0.15);
		border-radius: 11px 11px 0 0;
		color: #3b82f6;
	}
	.node-body {
		padding: 8px 12px;
	}
	.node-input {
		width: 100%;
		padding: 4px 6px;
		border-radius: 6px;
		border: 1px solid var(--border-subtle, #444);
		background: var(--bg-primary, #111);
		color: var(--text-primary, #fff);
		font-size: 13px;
		text-align: center;
	}
</style>
