<script lang="ts">
    import type {Writable} from "svelte/store";
    import type {Websocket} from "$lib/Websocket/Websocket";
    import {getContext} from "svelte";
    import type Actuator from "$lib/Models/Actuator";

    export let actuator: Actuator;
    export let index: number;

    const ws: Writable<Websocket> = getContext("ws");

    let isRenaming = false;
    let newName = "";

    const renameActuator = (e: MouseEvent) => {
        e.preventDefault();
        isRenaming = true;
    };

    const handleRenaming = () => {
        $ws.renameActuator(actuator.id, newName);
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

    const toggle = () => {
        $ws.toggleActuator(actuator.id);
    };

    const pulse = () => {
        $ws.pulseActuator(actuator.id);
    };
</script>

<div class="flex flex-col justify-center px-3 py-3 bg-white border border-gray-300 rounded">
    <div aria-roledescription="button" role="button" tabindex={index} on:click={() => {}} on:keydown={() => {}}>
        <div class="flex flex-col justify-center py-2">
            <p class="text-sm text-center text-gray-500 font-bold py-3 hover:text-blue-500 flex flex-row justify-center items-center mx-auto">
                {#if !isRenaming}
                    <span class="hover:underline hover:cursor-pointer block mr-3">{actuator.name}</span>

                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="16"
                         height="16"
                         fill="currentColor"
                         class="bi bi-pencil mx-auto"
                         viewBox="0 0 16 16"
                         on:click={(e) => renameActuator(e)}
                         role="button"
                         tabindex="0"
                         on:keydown={() => {}}
                    >
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                {:else}
                    <input type="text" class="w-10/12 px-2 py-1 text-sm text-gray-700 border border-gray-300 rounded"
                           bind:value={newName}
                           on:keydown={(e) => handleKeyDown(e)}
                    />
                {/if}
            </p>
            <p class="text-3xl font-semibold text-center text-gray-800">
                {#if actuator.pulse}
                    <button
                            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            on:click={() => pulse()}
                    >
                    <span class="text-xs justify-center flex">
                        {#if actuator.state}
                            <svg class="animate-spin h-5 w-5 ..." viewBox="0 0 24 24">
                                ...
                            </svg>
                        {/if}
                        {actuator.state ? "Processing..." : "Pulse"}
                    </span>
                    </button>
                {:else}
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input
                                type="checkbox"
                                value=""
                                class="sr-only peer"
                                on:click={() => toggle()}
                                bind:checked={actuator.state}
                        >
                        <span class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white"></span>
                        <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{actuator.state ? "On" : "Off"}</span>
                    </label>
                {/if}
            </p>
        </div>

    </div>
</div>