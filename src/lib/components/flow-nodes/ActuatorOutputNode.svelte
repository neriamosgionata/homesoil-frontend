<script lang="ts">
	import { Handle, Position, useSvelteFlow } from '@xyflow/svelte';
	import { actuators } from '$lib/stores/store';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let { data = $bindable(), id }: { data: any; id: string } = $props();
	const { deleteElements } = useSvelteFlow();
	const nodeDataStore = getContext<Writable<Record<string, Record<string, any>>>>('nodeDataStore');

	let actuatorList = $derived(Object.values($actuators));
	let selectedActuator = $derived($actuators[data.actuator_id]);

	function updateData(updates: Record<string, any>) {
		data = { ...data, ...updates };
		nodeDataStore.update(s => ({ ...s, [id]: { ...s[id], ...updates } }));
	}
</script>

<div class="node-card actuator-node">
	<div class="node-header">
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/>
			<line x1="12" y1="2" x2="12" y2="12"/>
		</svg>
		<span>Actuator Output</span>
		<button class="node-delete-btn" onclick={() => deleteElements({ nodes: [{ id }] })} title="Delete node">
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
		</button>
	</div>
	<div class="node-body">
		<select
			value={data.actuator_id ?? ''}
			onchange={(e) => updateData({ actuator_id: Number((e.target as HTMLSelectElement).value) })}
			class="node-select"
		>
			<option value="">Select actuator...</option>
			{#each actuatorList as actuator}
				<option value={actuator.id}>{actuator.name || `Actuator #${actuator.id}`}</option>
			{/each}
		</select>
		{#if selectedActuator}
			<div class="node-live">
				<div class="live-row">
					<span class="live-state" class:on={selectedActuator.state} class:off={!selectedActuator.state}>
						{selectedActuator.state ? 'ON' : 'OFF'}
					</span>
					<span class="live-status" class:online={selectedActuator.online} class:offline={!selectedActuator.online}>
						{selectedActuator.online ? 'online' : 'offline'}
					</span>
				</div>
			</div>
		{/if}
		<label class="node-checkbox">
			<input
				type="checkbox"
				checked={data.pulse ?? false}
				onchange={(e) => updateData({ pulse: (e.target as HTMLInputElement).checked })}
			/>
			<span>Pulse mode</span>
		</label>
	</div>
	<Handle type="target" position={Position.Left} id="trigger" class="handle-target" />
</div>

<style>
	.node-card {
		background: var(--bg-secondary, #1e1e2e);
		border: 1px solid var(--border-subtle, #333);
		border-radius: 12px;
		min-width: 180px;
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
		color: #F44336;
		background: rgba(244, 67, 54, 0.15);
	}
	.actuator-node .node-header {
		background: rgba(244, 67, 54, 0.15);
		border-radius: 11px 11px 0 0;
		color: #F44336;
	}
	.node-body {
		padding: 8px 12px;
	}
	.node-select {
		width: 100%;
		padding: 4px 6px;
		border-radius: 6px;
		border: 1px solid var(--border-subtle, #444);
		background: var(--bg-primary, #111);
		color: var(--text-primary, #fff);
		font-size: 11px;
	}
	.node-live {
		margin-top: 6px;
		padding: 6px 8px;
		background: rgba(0, 0, 0, 0.2);
		border-radius: 6px;
	}
	.live-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.live-state {
		font-size: 14px;
		font-weight: 700;
	}
	.live-state.on {
		color: #4CAF50;
	}
	.live-state.off {
		color: var(--text-muted, #666);
	}
	.live-status {
		font-size: 9px;
		font-weight: 600;
		padding: 1px 5px;
		border-radius: 4px;
	}
	.live-status.online {
		color: #4CAF50;
		background: rgba(76, 175, 80, 0.15);
	}
	.live-status.offline {
		color: #F44336;
		background: rgba(244, 67, 54, 0.15);
	}
	.node-checkbox {
		display: flex;
		align-items: center;
		gap: 6px;
		margin-top: 6px;
		font-size: 11px;
		color: var(--text-secondary, #aaa);
		cursor: pointer;
	}
	.node-checkbox input {
		accent-color: #F44336;
	}
</style>
