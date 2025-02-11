<script lang="ts">
	import { scripts } from "$lib/stores/store";
	import { page } from "$app/state";
	import { getContext } from "svelte";
	import type { Websocket } from "$lib/websocket/Websocket";
	import ScriptEditor from "$lib/components/ScriptEditor.svelte";
	import type { Writable } from "svelte/store";
	import CronInput from "$lib/components/CronInput.svelte";

	let id = page.params.id;

	const ws: Writable<Websocket> = getContext("ws");

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

	const saveCode = (code: any) => {
		let s = { ...$scripts[id] };
		s.code = code.code;
		$ws.modifyScript(s);
	};

	const saveSchedule = (schedule: any) => {
		let s = { ...$scripts[id] };
		s.schedule = schedule || null;
		$ws.modifyScript(s);
	};
</script>

<div class="container">
	<div class="bg-gray-100 rounded-lg shadow-xl py-2">
		<button class="m-4 text-white font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-700">
			<a href="/dashboard">Back</a>
		</button>

		<h1 class="text-2xl text-center font-bold mb-4 text-gray-600">
			Sensor: {$scripts[id].title}
		</h1>

		<div class="m-4">
			{#if isRenaming}
				<label for="name" class="text-gray-700">Name:</label>

				<input
					type="text"
					class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2 bg-white"
					placeholder={$scripts[id].title}
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
				<span class="text-gray-700 mr-3">Name: {$scripts[id].title}</span>

				<button
					class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
					onclick={() => renameSensor()}
				>
					Rename sensor
				</button>
			{/if}
		</div>

		<div class="m-4">
			<label for="schedule" class="text-gray-700">Schedule:</label>
			<CronInput c={$scripts[id].schedule || ""} change={(e) => saveSchedule(e)} />
		</div>

		<div class="m-4">
			<ScriptEditor code={$scripts[id].code} save={saveCode} />
		</div>
	</div>
</div>
