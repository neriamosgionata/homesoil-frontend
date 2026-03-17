<script lang="ts">
	import { Handle, Position, useSvelteFlow } from '@xyflow/svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let { data = $bindable(), id }: { data: any; id: string } = $props();
	const { deleteElements } = useSvelteFlow();
	const nodeDataStore = getContext<Writable<Record<string, Record<string, any>>>>('nodeDataStore');

	const operators = ['AND', 'OR', 'NOT'];
	let isNot = $derived((data.operator ?? 'AND') === 'NOT');

	function updateData(updates: Record<string, any>) {
		data = { ...data, ...updates };
		nodeDataStore.update(s => ({ ...s, [id]: { ...s[id], ...updates } }));
	}
</script>

<div class="node-card logic-node">
	<div class="node-header">
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<rect x="2" y="6" width="20" height="12" rx="2"/>
			<path d="M12 12h.01"/>
		</svg>
		<span>Logic Gate</span>
		<button class="node-delete-btn" onclick={() => deleteElements({ nodes: [{ id }] })} title="Delete node">
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
		</button>
	</div>
	<div class="node-body">
		<select
			value={data.operator ?? 'AND'}
			onchange={(e) => updateData({ operator: (e.target as HTMLSelectElement).value })}
			class="node-select"
		>
			{#each operators as op}
				<option value={op}>{op}</option>
			{/each}
		</select>
	</div>
	<span class="handle-label" style="top: {isNot ? '68%' : '50%'}; left: 10px;">A</span>
	{#if !isNot}
		<span class="handle-label" style="top: 88%; left: 10px;">B</span>
	{/if}
	<Handle type="target" position={Position.Left} id="a" style="top: {isNot ? '68%' : '50%'};" class="handle-target" />
	{#if !isNot}
		<Handle type="target" position={Position.Left} id="b" style="top: 88%;" class="handle-target" />
	{/if}
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
		color: #ef4444;
		background: rgba(239, 68, 68, 0.15);
	}
	.logic-node .node-header {
		background: rgba(251, 191, 36, 0.15);
		border-radius: 11px 11px 0 0;
		color: #fbbf24;
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
