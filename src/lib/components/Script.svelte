<script lang="ts">
	import { goto } from "$app/navigation";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import type { Websocket } from "$lib/websocket/Websocket";
	import type Script from "$lib/models/Script";

	interface Props {
		script: Script;
	}

	let { script }: Props = $props();

	const ws: Writable<Websocket> = getContext("ws");

	let isRenaming = $state(false);
	let newName = $state("");

	const renameScript = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		isRenaming = true;
	};

	const removeScript = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (confirm("Are you sure you want to delete this script?")) {
			$ws.removeScript(script.id);
		}
	};

	const runScript = (e: MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		$ws.runScript(script.id);
	};

	const handleRenaming = () => {
		let s = { ...script };
		s.title = newName;
		$ws.modifyScript(s);
		isRenaming = false;
	};

	const handleRenamingCancel = () => {
		isRenaming = false;
	};

	const handleKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
			handleRenaming();
		} else if (e.key === "Escape") {
			handleRenamingCancel();
		}
	};

	const goToDetails = () => {
		goto(`/dashboard/scripts/${script.id}`);
	};

	let newNameInput: HTMLInputElement | undefined = $state(undefined);
	$effect(() => {
		newNameInput && newNameInput.focus();
	});

	let statusColor = $derived(
		script.status === 1 ? 'var(--status-online)' :
		script.status === 0 ? 'var(--text-muted)' : 'var(--status-offline)'
	);

	let statusText = $derived(
		script.status === 1 ? 'Running' :
		script.status === 0 ? 'Stopped' : 'Error'
	);
</script>

<div
	class="glass card-hover flex flex-col rounded-xl cursor-pointer group"
	onclick={goToDetails}
	onkeydown={(e) => e.key === 'Enter' && goToDetails()}
	role="button"
	tabindex="0"
>
	<!-- Header with status -->
	<div class="flex items-center justify-between p-4 border-b" style="border-color: var(--border-subtle);">
		<div class="flex items-center gap-2">
			<div
				class="w-2.5 h-2.5 rounded-full {script.status === 1 ? 'animate-pulse' : ''}"
				style="background-color: {statusColor}; box-shadow: {script.status === 1 ? '0 0 8px ' + statusColor : 'none'};"
			></div>
			<span class="text-xs font-medium" style="color: {statusColor};">
				{statusText}
			</span>
		</div>
		<div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
			<button
				onclick={runScript}
				class="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
				style="color: var(--accent);"
				aria-label="Run script"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polygon points="5 3 19 12 5 21 5 3"/>
				</svg>
			</button>
			<button
				onclick={renameScript}
				class="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
				style="color: var(--text-secondary);"
				aria-label="Rename script"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
					<path d="m15 5 4 4"/>
				</svg>
			</button>
			<button
				onclick={removeScript}
				class="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
				style="color: var(--status-offline);"
				aria-label="Delete script"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M3 6h18"/>
					<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
					<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
				</svg>
			</button>
		</div>
	</div>

	<!-- Content -->
	<div class="p-4 flex-1 flex flex-col">
		{#if !isRenaming}
			<div class="mb-3">
				<h3 class="font-semibold text-base truncate" style="color: var(--text-primary);">
					{script.title}
				</h3>
			</div>
		{:else}
			<div class="mb-3" onclick={(e) => e.stopPropagation()}>
				<div class="flex items-center gap-2">
					<input
						type="text"
						class="flex-1 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
						style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
						placeholder={script.title}
						bind:this={newNameInput}
						bind:value={newName}
						onkeydown={handleKeyDown}
					/>
					<button
						onclick={handleRenamingCancel}
						class="p-2 rounded-lg hover:bg-white/10"
						style="color: var(--text-secondary);"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M18 6 6 18"/>
							<path d="m6 6 12 12"/>
						</svg>
					</button>
				</div>
			</div>
		{/if}

		<!-- Schedule info -->
		<div class="mt-auto pt-3 border-t" style="border-color: var(--border-subtle);">
			<div class="flex items-center gap-2">
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted);">
					<circle cx="12" cy="12" r="10"/>
					<polyline points="12 6 12 12 16 14"/>
				</svg>
				<span class="text-sm" style="color: {script.schedule ? 'var(--text-secondary)' : 'var(--text-muted)'};">
					{script.schedule ? script.schedule : "Not scheduled"}
				</span>
			</div>
		</div>
	</div>
</div>
