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
		if (!(e.target instanceof SVGElement)) {
			return;
		}
		isRenaming = true;
	};

	const removeScript = (e: MouseEvent) => {
		e.preventDefault();
		if (!(e.target instanceof SVGElement)) {
			return;
		}
		if (confirm("Are you sure you want to delete this script?")) {
			$ws.removeScript(script.id);
		}
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

	const goToDetails = (e: MouseEvent) => {
		e.preventDefault();
		goto(`/dashboard/scripts/${script.id}`);
	};

	let newNameInput: HTMLInputElement | undefined = $state(undefined);
	$effect(() => {
		newNameInput && newNameInput.focus();
	});
</script>

<div class="flex flex-col p-1 bg-white border border-gray-300 rounded-xl m-2 z-10 shadow-xl">
	<div class="flex flex-col justify-center pb-2 px-2">
		{#if !isRenaming}
			<div class="flex flex-col justify-center items-center py-2">
				<button onclick={(e) => goToDetails(e)}>
					<p
						class="text-sm text-center text-gray-500 font-bold hover:text-blue-500 flex flex-row justify-center items-center"
					>
						<span class="hover:underline hover:cursor-pointer block mr-3">
							{script.title}
						</span>
					</p>
				</button>
				<div class="grid grid-cols-2 gap-2 text-sm text-center text-gray-500 font-bold mt-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-pencil"
						viewBox="0 0 16 16"
						role="button"
						tabindex="0"
						onclick={(e) => renameScript(e)}
						onkeydown={() => {}}
					>
						<path
							d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"
						/>
					</svg>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-trash"
						viewBox="0 0 16 16"
						role="button"
						tabindex="0"
						onclick={(e) => removeScript(e)}
						onkeydown={() => {}}
					>
						<path
							d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"
						/>
						<path
							fill-rule="evenodd"
							d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
						/>
					</svg>
				</div>
			</div>
		{:else}
			<div class="flex flex-row justify-center items-center py-2 text-gray-700">
				<input
					type="text"
					class="w-10/12 p-2 text-sm border border-gray-300 rounded mx-auto bg-white"
					tabindex="0"
					bind:this={newNameInput}
					bind:value={newName}
					onkeydown={(e) => handleKeyDown(e)}
				/>
				<svg
					width="15"
					height="15"
					viewBox="0 0 15 15"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					onclick={() => handleRenamingCancel()}
					onkeydown={() => {}}
					role="button"
					tabindex="0"
				>
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
						fill="currentColor"
					/>
				</svg>
			</div>
		{/if}
	</div>

	<hr class="border-gray-300 mt-1" />

	<div class="flex flex-row justify-center py-2 mt-2">
		<p class="text-sm font-semibold text-center text-gray-800">
			Schedule: {script.schedule ? script.schedule : "Not scheduled"}
		</p>
	</div>
</div>

