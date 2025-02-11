<script lang="ts">
	import { scripts } from "$lib/stores/store";
	import { fade } from "svelte/transition";
	import { goto } from "$app/navigation";
	import ScriptComponent from "$lib/components/Script.svelte";

	let scriptsArray = $derived(Object.values($scripts));
</script>

<div class="w-4/5 h-full mx-auto">
	<h1 class="text-2xl font-bold text-[#ff6361]">Scripts</h1>

	<div
		class="grid gap-4 grid-cols-6 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-6 bg-gray-100 rounded-lg p-2 grid-shadow min-w-full min-h-[204px] mt-4"
	>
		{#each scriptsArray as script, i}
			<div in:fade={{ duration: 100, delay: 100 + i * 100 }}>
				<ScriptComponent {script} />
			</div>
		{/each}
	</div>

	<div>
		<button
			class="bg-[#ff6361] text-white rounded-lg px-4 py-2 mt-4 h-10 w-30 hover:bg-[#ff6361] hover:shadow-md flex align-middle justify-center items-center"
			onclick={() => goto("/dashboard/scripts/new")}
		>
			<span> New Script </span>
		</button>
	</div>
</div>

<style>
	.grid-shadow {
		box-shadow:
			rgba(50, 50, 93, 0.25) 0 50px 100px -20px,
			rgba(0, 0, 0, 0.3) 0 30px 60px -30px;
	}
</style>
