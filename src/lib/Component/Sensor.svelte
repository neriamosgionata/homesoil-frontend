<script lang="ts">
    import type Sensor from "$lib/Models/Sensor";
    import {last_sensor_reads} from "$lib/stores/store";
    import Parser from "$lib/Parser/Parser";
    import {goto} from "$app/navigation";
    import {getContext} from "svelte";
    import type {Writable} from "svelte/store";
    import type {Websocket} from "$lib/Websocket/Websocket";

    export let sensor: Sensor;
    export let index: number;

    $: parsedValue = $last_sensor_reads[sensor.id] ? Parser.parseSensorReadValue($last_sensor_reads[sensor.id].sensor_value, sensor.sensor_type) : "No data";

    const ws: Writable<Websocket> = getContext("ws");

    let isRenaming = false;
    let newName = "";

    const renameSensor = (e: MouseEvent) => {
        e.preventDefault();
        if (!(e.target instanceof SVGElement)) {
            return;
        }
        isRenaming = true;
    };

    const handleRenaming = () => {
        $ws.renameSensor(sensor.id, newName);
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
        if (!(e.target instanceof HTMLButtonElement)) {
            return;
        }
        goto(`/sensors/${sensor.id}`);
    };
</script>

<div class="flex flex-col justify-center px-3 py-3 bg-white border border-gray-300 rounded">
    <div aria-roledescription="button" role="button" tabindex={index}>

        <div class="flex flex-col justify-center py-2">
            {#if !isRenaming}
                <button
                        class="text-sm rounded text-gray-500 font-bold hover:text-blue-500 flex flex-row justify-center items-center mx-auto"
                        on:click={(e) => goToDetails(e)}
                >
                    <span class="hover:underline hover:cursor-pointer block mr-3">
                        {sensor.name}
                    </span>

                    <svg xmlns="http://www.w3.org/2000/svg"
                         width="16"
                         height="16"
                         fill="currentColor"
                         class="bi bi-pencil mx-auto"
                         viewBox="0 0 16 16"
                         on:click={(e) => renameSensor(e)}
                         role="button"
                         tabindex="0"
                         on:keydown={() => {}}
                    >
                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                    </svg>
                </button>
            {:else}
                <input type="text" class="w-10/12 px-2 py-1 text-sm text-gray-700 border border-gray-300 rounded"
                       bind:value={newName}
                       on:keydown={(e) => handleKeyDown(e)}
                />
            {/if}
        </div>

        <div class="flex flex-row justify-center py-1">
            <p class="text-xl font-semibold text-center text-gray-800 mb-2">{parsedValue}</p>

        </div>

    </div>
</div>