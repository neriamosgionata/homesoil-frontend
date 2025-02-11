<script lang="ts">
	import type Script from "$lib/models/Script";
	import type { Writable } from "svelte/store";
	import type { Websocket } from "$lib/websocket/Websocket";
	import { getContext, onMount } from "svelte";
	import ScriptEditor from "$lib/components/ScriptEditor.svelte";
	import CronInput from "$lib/components/CronInput.svelte";

	const ws: Writable<Websocket> = getContext("ws");

	let disabled = $state(false);

	let new_script = $state({
		title: "",
		code: "",
		schedule: "",
		status: 0,
		created_at: new Date().toISOString(),
		updated_at: null
	} as Partial<Script>);

	const save = async () => {
		if (disabled) {
			alert("Please fill in all fields");
			return;
		}

		$ws.addScript(new_script);
	};

	let titleError = $state(false);
	let codeError = $state(false);

	onMount(() => {
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

<div class="container">
	<div class="bg-gray-100 rounded-lg shadow-xl py-2 text-black">
		<div class="py-2">
			<div class="p-4">
				<p>
					<a href="/dashboard/scripts" class="font-bold text-xl text-blue-400 hover:underline"
						>Back to Scripts</a
					>
				</p>
			</div>
		</div>

		<div class="py-2">
			<div class="p-4">
				<h1 class="font-extrabold text-xl">New Script</h1>
			</div>
		</div>
		<div class="grid grid-cols-1">
			<div class="p-4">
				<label for="title" class="font-bold my-2 p-1 block">
					Title <span class="text-red-500">*</span>
				</label>

				{#if titleError}
					<p class="text-red-500 my-2 p-1">Title is required</p>
				{/if}
				<input type="text" class="p-1 bg-white" bind:value={new_script.title} id="title" placeholder="Title" />
			</div>
			<div class="p-4">
				<label for="code" class="font-bold my-2 p-1">
					Code <span class="text-red-500">*</span>
				</label>
				{#if codeError}
					<p class="text-red-500 my-2 p-1">Code is required</p>
				{/if}
				<ScriptEditor
					code=""
					save={(e) => {
						new_script.code = e.code;
					}}
					editing={(e) => {
						disabled = disabled || e.isEditing;
					}}
				/>
			</div>
			<div class="p-4">
				<label for="schedule" class="font-bold my-2 p-1"> Schedule </label>
				<CronInput
					c={""}
					change={(e) => {
						new_script.schedule = e.value || null;
					}}
				/>
			</div>
			<div class="p-4">
				<button
					type="button"
					class="bg-[#ff6361] text-white rounded-lg px-4 py-2 mt-4 h-10 w-30 hover:bg-[#ff6361] hover:shadow-md flex align-middle justify-center items-center"
					onclick={save}
				>
					<span> Save </span>
				</button>
			</div>
		</div>
	</div>
</div>
