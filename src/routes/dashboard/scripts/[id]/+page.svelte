<script lang="ts">
	import { scripts } from "$lib/stores/store";
	import { page } from "$app/state";
	import { getContext } from "svelte";
	import type { Websocket } from "$lib/websocket/Websocket";
	import ScriptEditor from "$lib/components/ScriptEditor.svelte";
	import type { Writable } from "svelte/store";
	import CronInput from "$lib/components/CronInput.svelte";
	import type Script from "$lib/models/Script";
	import { goto } from "$app/navigation";

	let id = $derived(page.params.id!);

	let currentScript: Script | null = $derived($scripts[id]);

	const ws: Writable<Websocket> = getContext("ws");

	let isRenaming = $state(false);
	let scheduleChange = $state(false);
	let newName = $state("");
	let newSchedule = $state("");

	const renameScript = () => {
		isRenaming = true;
	};

	const handleRenaming = () => {
		let s = { ...(currentScript as Script) };
		s.title = newName;
		$ws.modifyScript(s);
		isRenaming = false;
		newName = "";
	};

	const handleRenamingCancel = () => {
		isRenaming = false;
		newName = "";
	};

	const changeSchedule = () => {
		scheduleChange = true;
	};

	const handleScheduleChange = () => {
		let s = { ...(currentScript as Script) };
		s.schedule = newSchedule || null;
		$ws.modifyScript(s);
		scheduleChange = false;
		newSchedule = "";
	};

	const handleScheduleChangeCancel = () => {
		scheduleChange = false;
		newSchedule = "";
	};

	const saveCode = (code: any) => {
		let s = { ...(currentScript as Script) };
		s.code = code.code;
		$ws.modifyScript(s);
	};

	const saveNewSchedule = (schedule: any) => {
		newSchedule = schedule.value;
	};

	const runScript = () => {
		$ws.runScript(parseInt(id));
	};

	const deleteScript = () => {
		if (confirm("Are you sure you want to delete this script?")) {
			$ws.removeScript(parseInt(id));
			goto("/dashboard/scripts");
		}
	};
</script>

{#if currentScript}
	<div class="space-y-6">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-3">
				<button
					class="p-2 rounded-lg transition-colors hover:bg-white/10"
					style="color: var(--text-secondary);"
					onclick={() => goto("/dashboard/scripts")}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="m15 18-6-6 6-6"/>
					</svg>
				</button>
				<div>
					<h1 class="text-3xl font-bold" style="color: var(--text-primary);">{currentScript.title}</h1>
					<p class="mt-1 text-sm" style="color: var(--text-muted);">Script Editor</p>
				</div>
			</div>
			<div class="flex items-center gap-2">
				<button
					class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2"
					style="background-color: var(--accent); color: white;"
					onclick={runScript}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polygon points="5 3 19 12 5 21 5 3"/>
					</svg>
					Run
				</button>
				<button
					class="px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200"
					style="background-color: var(--status-offline); color: white;"
					onclick={deleteScript}
				>
					Delete
				</button>
			</div>
		</div>

		<!-- Rename Section -->
		<div class="glass rounded-xl p-4">
			<h3 class="font-semibold mb-3" style="color: var(--text-primary);">Name</h3>
			{#if isRenaming}
				<div class="flex items-center gap-2">
					<input
						type="text"
						class="flex-1 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
						style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
						placeholder={currentScript.title}
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
			{:else}
				<div class="flex items-center justify-between">
					<span style="color: var(--text-secondary);">{currentScript.title}</span>
					<button
						class="px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-white/10"
						style="color: var(--text-secondary);"
						onclick={renameScript}
					>
						Rename
					</button>
				</div>
			{/if}
		</div>

		<!-- Schedule Section -->
		<div class="glass rounded-xl p-4">
			<h3 class="font-semibold mb-3" style="color: var(--text-primary);">Schedule</h3>
			{#if scheduleChange}
				<CronInput c={currentScript.schedule || ""} change={(e) => saveNewSchedule(e)} />
				<div class="flex items-center gap-2 mt-3">
					<button
						class="px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200"
						style="background-color: var(--accent); color: white; opacity: {!newSchedule ? '0.5' : '1'};"
						disabled={!newSchedule}
						onclick={handleScheduleChange}
					>
						Save
					</button>
					<button
						class="px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-white/10"
						style="color: var(--text-secondary);"
						onclick={handleScheduleChangeCancel}
					>
						Cancel
					</button>
				</div>
			{:else}
				<div class="flex items-center justify-between">
					<span style="color: {currentScript.schedule ? 'var(--text-secondary)' : 'var(--text-muted)'};">
						{currentScript.schedule || "No schedule set"}
					</span>
					<button
						class="px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-white/10"
						style="color: var(--text-secondary);"
						onclick={changeSchedule}
					>
						Change
					</button>
				</div>
			{/if}
		</div>

		<!-- Code Editor -->
		<div class="glass rounded-xl p-4">
			<h3 class="font-semibold mb-3" style="color: var(--text-primary);">Code</h3>
			<ScriptEditor code={currentScript.code} saving={(e) => saveCode(e)} />
		</div>
	</div>
{/if}
