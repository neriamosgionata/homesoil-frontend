<script lang="ts">
    import type {Writable} from "svelte/store";
    import type {Websocket} from "$lib/Websocket/Websocket";
    import {getContext} from "svelte";
    import type Actuator from "$lib/Models/Actuator";

    export let actuator: Actuator;
    export let index: number;

    const ws: Writable<Websocket> = getContext("ws");

    const toggle = () => {
        $ws.toggleActuator(actuator.id);
    };
</script>

<div class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded">
    <div aria-roledescription="button" role="button" tabindex={index} on:click={() => {}} on:keydown={() => {}}>
        <p class="text-lg text-center text-gray-500">{actuator.name}</p>
        <p class="text-3xl font-semibold text-center text-gray-800">
            <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" class="sr-only peer" on:click={() => toggle()} bind:checked={actuator.state}>
                <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white"></div>
                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{actuator.state ? "On" : "Off"}</span>
            </label>
        </p>
    </div>
</div>