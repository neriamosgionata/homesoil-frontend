<script lang="ts">
	import type Script from "$lib/models/Script";
	import type { Writable } from "svelte/store";
	import type { Websocket } from "$lib/websocket/Websocket";
	import { getContext } from "svelte";
	import ScriptEditor from "$lib/components/ScriptEditor.svelte";
	import CronInput from "$lib/components/CronInput.svelte";
	import { goto } from "$app/navigation";

	const ws: Writable<Websocket> = getContext("ws");

	let disabled = $state(false);

	let new_script = $state({
		title: "",
		code: "",
		schedule: "",
		status: 0,
		created_at: new Date().toISOString().replaceAll("Z", ""),
		updated_at: null
	} as Partial<Script>);

	const save = async () => {
		if (disabled) return;
		$ws.addScript(new_script);
		goto("/dashboard/scripts");
	};

	let titleError = $state(false);
	let codeError = $state(false);

	$effect(() => {
		titleError = false;
		codeError = false;
		disabled = false;

		if (!new_script.title) {
			disabled = true;
			titleError = true;
		}

		if (!new_script.code || new_script.code?.replace(" ", "") === "RUN\nSTOP") {
			disabled = true;
			codeError = true;
		}
	});
</script>

<div class="space-y-6">
	<!-- Header -->
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
			<h1 class="text-3xl font-bold" style="color: var(--text-primary);">New Script</h1>
			<p class="mt-1 text-sm" style="color: var(--text-muted);">Create a new automation script</p>
		</div>
	</div>

	<!-- Title -->
	<div class="glass rounded-xl p-4">
		<label class="text-sm font-medium mb-2 block" style="color: var(--text-secondary);">
			Title <span style="color: var(--status-offline);">*</span>
		</label>
		{#if titleError && new_script.title !== undefined}
			<p class="text-xs mb-2" style="color: var(--status-offline);">Title is required</p>
		{/if}
		<input
			type="text"
			class="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
			style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
			bind:value={new_script.title}
			placeholder="Script name"
		/>
	</div>

	<!-- Code -->
	<div class="glass rounded-xl p-4">
		<label class="text-sm font-medium mb-2 block" style="color: var(--text-secondary);">
			Code <span style="color: var(--status-offline);">*</span>
		</label>
		{#if codeError}
			<p class="text-xs mb-2" style="color: var(--status-offline);">Code is required</p>
		{/if}
		<ScriptEditor
			saving={(e) => {
				new_script.code = e.code;
			}}
			editing={(e) => {
				disabled = disabled || e.isEditing;
			}}
		/>
	</div>

	<!-- Schedule -->
	<div class="glass rounded-xl p-4">
		<label class="text-sm font-medium mb-2 block" style="color: var(--text-secondary);">Schedule (optional)</label>
		<CronInput
			c={""}
			change={(e) => {
				new_script.schedule = e.value || null;
			}}
		/>
	</div>

	<!-- Save -->
	<button
		type="button"
		class="px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200"
		style="background-color: var(--accent); color: white; opacity: {disabled ? '0.5' : '1'};"
		disabled={disabled}
		onclick={save}
	>
		Save Script
	</button>
</div>
