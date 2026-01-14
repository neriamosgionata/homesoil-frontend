<script lang="ts">
	import { scripts } from "$lib/stores/store";
	import { fade } from "svelte/transition";
	import { goto } from "$app/navigation";
	import ScriptComponent from "$lib/components/Script.svelte";

	let scriptsArray = $derived(Object.values($scripts));
</script>

<div class="space-y-10">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-bold" style="color: var(--text-primary);">Scripts</h1>
			<p class="mt-1" style="color: var(--text-secondary);">Automate your devices with custom scripts</p>
		</div>
		<button
			class="px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2"
			style="background-color: var(--accent); color: white;"
			onclick={() => goto("/dashboard/scripts/new")}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M12 5v14"/>
				<path d="M5 12h14"/>
			</svg>
			New Script
		</button>
	</div>

	<!-- Scripts Section -->
	<section>
		<div class="flex items-center gap-3 mb-4">
			<div class="p-2 rounded-lg" style="background-color: var(--accent); opacity: 0.9;">
				<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="16 18 22 12 16 6"/>
					<polyline points="8 6 2 12 8 18"/>
				</svg>
			</div>
			<div>
				<h2 class="text-xl font-semibold" style="color: var(--text-primary);">All Scripts</h2>
				<p class="text-sm" style="color: var(--text-muted);">{scriptsArray.length} script{scriptsArray.length !== 1 ? 's' : ''}</p>
			</div>
		</div>

		{#if scriptsArray.length > 0}
			<div class="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{#each scriptsArray as script, i}
					<div in:fade={{ duration: 200, delay: 50 + i * 50 }}>
						<ScriptComponent {script} />
					</div>
				{/each}
			</div>
		{:else}
			<div class="glass rounded-xl p-8 text-center">
				<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-4" style="color: var(--text-muted);">
					<polyline points="16 18 22 12 16 6"/>
					<polyline points="8 6 2 12 8 18"/>
				</svg>
				<p class="font-medium" style="color: var(--text-secondary);">No scripts yet</p>
				<p class="text-sm mt-1" style="color: var(--text-muted);">Create your first script to automate your devices</p>
				<button
					class="mt-4 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
					style="background-color: var(--accent); color: white;"
					onclick={() => goto("/dashboard/scripts/new")}
				>
					Create Script
				</button>
			</div>
		{/if}
	</section>
</div>
