<script lang="ts">
	import { Handle, Position, useSvelteFlow } from '@xyflow/svelte';
	import { sensors, last_sensor_reads } from '$lib/stores/store';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	let { data = $bindable(), id }: { data: any; id: string } = $props();
	const { deleteElements } = useSvelteFlow();
	const nodeDataStore = getContext<Writable<Record<string, Record<string, any>>>>('nodeDataStore');

	let sensorList = $derived(Object.values($sensors));
	let selectedSensor = $derived($sensors[data.sensor_id]);
	let lastRead = $derived($last_sensor_reads[data.sensor_id]);

	function updateData(updates: Record<string, any>) {
		data = { ...data, ...updates };
		nodeDataStore.update(s => ({ ...s, [id]: { ...s[id], ...updates } }));
	}
</script>

<div class="node-card sensor-node">
	<div class="node-header">
		<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
		</svg>
		<span>Sensor Input</span>
		<button class="node-delete-btn" onclick={() => deleteElements({ nodes: [{ id }] })} title="Delete node">
			<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
		</button>
	</div>
	<div class="node-body">
		<select
			value={data.sensor_id ?? ''}
			onchange={(e) => updateData({ sensor_id: Number((e.target as HTMLSelectElement).value) })}
			class="node-select"
		>
			<option value="">Select sensor...</option>
			{#each sensorList as sensor}
				<option value={sensor.id}>{sensor.name || `Sensor #${sensor.id}`} ({sensor.sensor_type})</option>
			{/each}
		</select>
		{#if selectedSensor}
			<div class="node-live">
				<div class="live-row">
					<span class="live-label">{selectedSensor.sensor_type}</span>
					<span class="live-status" class:online={selectedSensor.online} class:offline={!selectedSensor.online}>
						{selectedSensor.online ? 'online' : 'offline'}
					</span>
				</div>
				{#if lastRead}
					<div class="live-value">{lastRead.sensor_value}</div>
				{:else}
					<div class="live-value dim">no reading</div>
				{/if}
			</div>
		{/if}
	</div>
	<Handle type="source" position={Position.Right} id="value" class="handle-source" />
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
		color: var(--text-primary, #fff);
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
	.sensor-node .node-header {
		background: rgba(34, 197, 94, 0.15);
		border-radius: 11px 11px 0 0;
		color: #22c55e;
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
	.live-label {
		font-size: 10px;
		color: var(--text-muted, #888);
		text-transform: capitalize;
	}
	.live-status {
		font-size: 9px;
		font-weight: 600;
		padding: 1px 5px;
		border-radius: 4px;
	}
	.live-status.online {
		color: #22c55e;
		background: rgba(34, 197, 94, 0.15);
	}
	.live-status.offline {
		color: #ef4444;
		background: rgba(239, 68, 68, 0.15);
	}
	.live-value {
		font-size: 16px;
		font-weight: 700;
		color: #22c55e;
		margin-top: 2px;
		font-variant-numeric: tabular-nums;
	}
	.live-value.dim {
		font-size: 10px;
		font-weight: 400;
		color: var(--text-muted, #666);
	}
</style>
