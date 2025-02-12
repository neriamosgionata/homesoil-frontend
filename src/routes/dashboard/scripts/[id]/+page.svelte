<script lang="ts">
	import { scripts } from "$lib/stores/store";
	import { page } from "$app/state";
	import { getContext } from "svelte";
	import type { Websocket } from "$lib/websocket/Websocket";
	import ScriptEditor from "$lib/components/ScriptEditor.svelte";
	import type { Writable } from "svelte/store";
	import CronInput from "$lib/components/CronInput.svelte";
	import type Script from "$lib/models/Script";

	let id = page.params.id;

	let currentScript: Script | null = $derived($scripts[id]);

	const ws: Writable<Websocket> = getContext("ws");

	let isRenaming = $state(false);
	let scheduleChange = $state(false);
	let newName = $state("");
	let newSchedule = $state("");

	const renameSensor = () => {
		isRenaming = true;
	};

	const handleRenaming = () => {
		$ws.renameSensor(parseInt(id), newName);
		isRenaming = false;
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
</script>

{#if currentScript}
	<div class="bg-gray-100 rounded-lg shadow-xl py-2">
		<button class="m-4 text-white font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-700">
			<a href="/dashboard/scripts">Back</a>
		</button>

		<h1 class="text-2xl text-center font-bold mb-4 text-gray-600">
			Sensor: {currentScript.title}
		</h1>

		<div class="m-4 text-gray-700">
			{#if isRenaming}
				<label for="name" class="text-gray-700">Name:</label>

				<input
					type="text"
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2 bg-white"
					placeholder={currentScript.title}
					bind:value={newName}
				/>

				<button
					class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					onclick={() => handleRenamingCancel()}
				>
					Cancel
				</button>

				<button
					class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded {!newName
						? 'opacity-50 cursor-not-allowed'
						: ''}"
					disabled={!newName}
					onclick={() => handleRenaming()}
				>
					Save
				</button>
			{:else}
				<span class="text-gray-700 mr-3">Name: {currentScript.title}</span>

				<button
					class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
					onclick={() => renameSensor()}
				>
					Rename
				</button>
			{/if}
		</div>

		<div class="m-4 text-gray-700">
			{#if scheduleChange}
				<CronInput c={currentScript.schedule || ""} change={(e) => saveNewSchedule(e)} />

				<button
					class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
					onclick={() => handleScheduleChangeCancel()}
				>
					Cancel
				</button>

				<button
					class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded {!newSchedule
						? 'opacity-50 cursor-not-allowed'
						: ''}"
					disabled={!newSchedule}
					onclick={() => handleScheduleChange()}
				>
					Save
				</button>
			{:else}
				<span class="text-gray-700 mr-3">Schedule: {currentScript.schedule}</span>

				<button
					class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
					onclick={() => changeSchedule()}
				>
					Change
				</button>
			{/if}
		</div>

		<div class="m-4 text-gray-700">
			<ScriptEditor code={currentScript.code} saving={(e) => saveCode(e)} />
		</div>
	</div>
{/if}
