<script lang="ts">
	import { actuators, sensors } from "$lib/stores/store";
	import Sensor from "$lib/components/Sensor.svelte";
	import Actuator from "$lib/components/Actuator.svelte";
	import { fade } from "svelte/transition";

	let sensorsArray = $derived(Object.values($sensors));
	let actuatorsArray = $derived(Object.values($actuators));
</script>

<div class="w-4/5 h-full mx-auto">
	<p class="my-4">
		<a href="/dashboard/scripts" class="font-bold text-xl text-blue-400 hover:underline">Scripts</a>
	</p>

	<h1 class="text-2xl font-bold text-[#ff6361]">Sensors</h1>

	<div
		class="grid gap-4 grid-cols-6 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 bg-gray-100 rounded-lg p-2 grid-shadow min-w-full min-h-[204px] mt-4"
	>
		{#each sensorsArray as sensor, i}
			<div in:fade={{ duration: 250, delay: 100 + i * 100 }}>
				<Sensor {sensor} />
			</div>
		{/each}
	</div>

	<div class="h-24"></div>

	<h1 class="text-2xl font-bold text-[#ff6361]">Actuators</h1>

	<div
		class="grid gap-4 grid-cols-6 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 bg-gray-100 rounded-lg p-2 grid-shadow min-w-full min-h-[204px] mt-4"
	>
		{#each actuatorsArray as actuator, i}
			<div in:fade={{ duration: 250, delay: 200 + i * 100 }}>
				<Actuator {actuator} />
			</div>
		{/each}
	</div>
</div>

<style>
	.grid-shadow {
		box-shadow:
			rgba(50, 50, 93, 0.25) 0 50px 100px -20px,
			rgba(0, 0, 0, 0.3) 0 30px 60px -30px;
	}
</style>
