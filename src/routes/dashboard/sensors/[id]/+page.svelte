<script lang="ts">
	import { sensor_reads, sensor_reads_loading, sensors } from "$lib/stores/store";
	import { page } from "$app/state";
	import { getContext, onDestroy, onMount } from "svelte";
	import { writable, type Writable } from "svelte/store";
	import type { Websocket } from "$lib/websocket/Websocket";
	import moment from "moment";
	import ProgressBar from "$lib/components/ProgressBar.svelte";
	import SensorChart from "$lib/components/SensorChart.svelte";
	import Parser from "$lib/parser/Parser";
	import { fly } from "svelte/transition";
	import { goto } from "$app/navigation";

	let id = $derived(page.params.id!);

	const ws: Writable<Websocket> = getContext("ws");

	let from_date: Writable<Date> = writable(moment().subtract(5, "minutes").toDate());
	let to_date: Writable<Date> = writable(moment().toDate());

	let isRenaming = $state(false);
	let newName = $state("");

	const renameSensor = () => {
		isRenaming = true;
	};

	const handleRenaming = () => {
		$ws.renameSensor(parseInt(id), newName);
		isRenaming = false;
	};

	const handleRenamingCancel = () => {
		isRenaming = false;
	};

	const deleteSensor = () => {
		if (confirm("Are you sure you want to delete this sensor?")) {
			$ws.removeSensor(parseInt(id));
			goto("/dashboard");
		}
	};

	const newFromDate = (e: any) => {
		from_date.set(moment(e.target.value).toDate());
	};

	const newToDate = (e: any) => {
		to_date.set(moment(e.target.value).toDate());
	};

	const loadReadings = () => {
		sensor_reads_loading.set(true);
		$ws.getAllSensorReadings(parseInt(id), $from_date, $to_date);
	};

	onMount(() => {
		sensor_reads.set([]);
		loadReadings();
	});

	onDestroy(() => {
		sensor_reads.set([]);
	});
</script>

<div class="space-y-6">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-3">
			<button
				class="p-2 rounded-lg transition-colors hover:bg-white/10"
				style="color: var(--text-secondary);"
				onclick={() => goto("/dashboard")}
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="m15 18-6-6 6-6"/>
				</svg>
			</button>
			<div>
				<h1 class="text-3xl font-bold" style="color: var(--text-primary);">
					{$sensors[id]?.name || "Sensor"}
				</h1>
				<p class="mt-1 text-sm" style="color: var(--text-muted);">
					{$sensors[id]?.ip_address || ""}
				</p>
			</div>
		</div>
		<div class="flex items-center gap-2">
			<button
				class="px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2"
				style="background-color: var(--accent); color: white;"
				onclick={renameSensor}
			>
				Rename
			</button>
			<button
				class="px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2"
				style="background-color: var(--status-offline); color: white;"
				onclick={deleteSensor}
			>
				Delete
			</button>
		</div>
	</div>

	{#if $sensor_reads_loading}
		<ProgressBar />
	{/if}

	<!-- Rename -->
	{#if isRenaming}
		<div class="glass rounded-xl p-4">
			<label class="text-sm font-medium mb-2 block" style="color: var(--text-secondary);">New Name</label>
			<div class="flex items-center gap-2">
				<input
					type="text"
					class="flex-1 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
					style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
					placeholder={$sensors[id]?.name}
					bind:value={newName}
				/>
				<button
					class="px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200"
					style="background-color: var(--accent); color: white; opacity: {!newName ? '0.5' : '1'};"
					disabled={!newName}
					onclick={handleRenaming}
				>
					Save
				</button>
				<button
					class="px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-white/10"
					style="color: var(--text-secondary);"
					onclick={handleRenamingCancel}
				>
					Cancel
				</button>
			</div>
		</div>
	{/if}

	<!-- Date Range -->
	<div class="glass rounded-xl p-4">
		<h3 class="font-semibold mb-3" style="color: var(--text-primary);">Date Range</h3>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
			<div>
				<label class="text-sm font-medium mb-1 block" style="color: var(--text-secondary);">From</label>
				<input
					type="datetime-local"
					class="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
					style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
					oninput={newFromDate}
					disabled={$sensor_reads_loading}
				/>
			</div>
			<div>
				<label class="text-sm font-medium mb-1 block" style="color: var(--text-secondary);">To</label>
				<input
					type="datetime-local"
					class="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
					style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
					oninput={newToDate}
					disabled={$sensor_reads_loading}
				/>
			</div>
		</div>
		<button
			class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
			style="background-color: var(--accent); color: white; opacity: {$sensor_reads_loading ? '0.5' : '1'};"
			disabled={$sensor_reads_loading}
			onclick={loadReadings}
		>
			Load Readings
		</button>
	</div>

	<!-- Chart -->
	{#if $sensor_reads.length > 0}
		<div class="glass rounded-xl p-4">
			<h3 class="font-semibold mb-3" style="color: var(--text-primary);">
				Chart ({$sensor_reads.length} points)
			</h3>
			<SensorChart reads={$sensor_reads} sensorType={$sensors[id]?.sensor_type} />
		</div>
	{/if}

	<!-- Readings -->
	{#if $sensor_reads.length > 0}
		<div>
			<h3 class="font-semibold mb-3" style="color: var(--text-primary);">
				Readings ({$sensor_reads.length})
			</h3>
			<div class="grid grid-cols-1 gap-3">
				{#each $sensor_reads as read, i}
					<div
						class="glass rounded-xl p-4 flex items-center justify-between"
						in:fly={{ duration: 300, x: 100, delay: 50 + i * 30 }}
					>
						<div>
							<p class="text-lg font-bold" style="color: var(--accent);">
								{Parser.parseSensorReadValue(read.sensor_value, $sensors[id]?.sensor_type)}
							</p>
						</div>
						<p class="text-xs" style="color: var(--text-muted);">
							{moment(read.created_at).format("DD/MM/YYYY HH:mm:ss")}
						</p>
					</div>
				{/each}
			</div>
		</div>
	{:else if !$sensor_reads_loading}
		<div class="glass rounded-xl p-8 text-center">
			<p class="font-medium" style="color: var(--text-secondary);">No readings in this range</p>
		</div>
	{/if}
</div>
