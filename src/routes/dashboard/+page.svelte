<script lang="ts">
	import { actuators, sensors } from "$lib/stores/store";
	import Sensor from "$lib/components/Sensor.svelte";
	import Actuator from "$lib/components/Actuator.svelte";
	import { fade } from "svelte/transition";

	let sensorsArray = $derived(Object.values($sensors));
	let actuatorsArray = $derived(Object.values($actuators));
</script>

<div class="space-y-10">
	<!-- Header -->
	<div>
		<h1 class="text-3xl font-bold" style="color: var(--text-primary);">Dashboard</h1>
		<p class="mt-1" style="color: var(--text-secondary);">Monitor and control your devices</p>
	</div>

	<!-- Sensors Section -->
	<section>
		<div class="flex items-center gap-3 mb-4">
			<div class="p-2 rounded-lg" style="background-color: var(--accent); opacity: 0.9;">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M12 2v4" />
					<path d="m6.8 14-3.5 2" />
					<path d="m20.7 16-3.5-2" />
					<path d="M6.8 10 3.3 8" />
					<path d="m20.7 8-3.5 2" />
					<circle cx="12" cy="12" r="6" />
				</svg>
			</div>
			<div>
				<h2 class="text-xl font-semibold" style="color: var(--text-primary);">Sensors</h2>
				<p class="text-sm" style="color: var(--text-muted);">
					{sensorsArray.length} device{sensorsArray.length !== 1 ? "s" : ""}
				</p>
			</div>
		</div>

		{#if sensorsArray.length > 0}
			<div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each sensorsArray as sensor, i}
					<div in:fade={{ duration: 200, delay: 50 + i * 50 }}>
						<Sensor {sensor} />
					</div>
				{/each}
			</div>
		{:else}
			<div class="glass rounded-xl p-8 text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="mx-auto mb-4"
					style="color: var(--text-muted);"
				>
					<path d="M12 2v4" />
					<path d="m6.8 14-3.5 2" />
					<path d="m20.7 16-3.5-2" />
					<path d="M6.8 10 3.3 8" />
					<path d="m20.7 8-3.5 2" />
					<circle cx="12" cy="12" r="6" />
				</svg>
				<p class="font-medium" style="color: var(--text-secondary);">No sensors connected</p>
				<p class="text-sm mt-1" style="color: var(--text-muted);">Sensors will appear here when they connect</p>
			</div>
		{/if}
	</section>

	<!-- Actuators Section -->
	<section>
		<div class="flex items-center gap-3 mb-4">
			<div class="p-2 rounded-lg" style="background-color: var(--status-online); opacity: 0.9;">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="white"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M12 2v10" />
					<path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
				</svg>
			</div>
			<div>
				<h2 class="text-xl font-semibold" style="color: var(--text-primary);">Actuators</h2>
				<p class="text-sm" style="color: var(--text-muted);">
					{actuatorsArray.length} device{actuatorsArray.length !== 1 ? "s" : ""}
				</p>
			</div>
		</div>

		{#if actuatorsArray.length > 0}
			<div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each actuatorsArray as actuator, i}
					<div in:fade={{ duration: 200, delay: 100 + i * 50 }}>
						<Actuator {actuator} />
					</div>
				{/each}
			</div>
		{:else}
			<div class="glass rounded-xl p-8 text-center">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="mx-auto mb-4"
					style="color: var(--text-muted);"
				>
					<path d="M12 2v10" />
					<path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
				</svg>
				<p class="font-medium" style="color: var(--text-secondary);">No actuators connected</p>
				<p class="text-sm mt-1" style="color: var(--text-muted);">
					Actuators will appear here when they connect
				</p>
			</div>
		{/if}
	</section>
</div>
