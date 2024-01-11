<script lang="ts">
    import {sensor_reads, sensor_reads_loading, sensors} from "$lib/stores/store";
    import {page} from '$app/stores';
    import {getContext, onDestroy, onMount} from "svelte";
    import {writable, type Writable} from "svelte/store";
    import type {Websocket} from "$lib/Websocket/Websocket";
    import moment from "moment";
    import ProgressBar from "$lib/Component/ProgressBar.svelte";
    import Parser from "$lib/Parser/Parser";
    import {fly} from "svelte/transition";

    let id = $page.params.id;

    const ws: Writable<Websocket> = getContext('ws');

    let from_date: Writable<Date> = writable(moment().subtract(5, "minutes").toDate());
    let to_date: Writable<Date> = writable(moment().toDate());

    let isRenaming = false;
    let newName = "";

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

    const newFromDate = (e: any) => {
        from_date.set(moment(e.target.value).toDate());
    };

    const newToDate = (e: any) => {
        to_date.set(moment(e.target.value).toDate());
    };

    onMount(() => {
        sensor_reads.set([]);
    });

    onDestroy(() => {
        sensor_reads.set([]);
    });

    $: {
        sensor_reads_loading.set(true);
        $ws.getAllSensorReadings(
            parseInt(id),
            $from_date,
            $to_date,
        );
    }
</script>

<div class="container">
    <div class="bg-gray-100 rounded-lg shadow-xl py-2">
        <button class="m-4 text-white font-bold py-2 px-4 rounded bg-blue-500 hover:bg-blue-700">
            <a href="/dashboard">Back</a>
        </button>

        <h1 class="text-2xl text-center font-bold mb-4 text-gray-600">Sensor: {$sensors[id].name}</h1>

        {#if $sensor_reads_loading}
            <ProgressBar/>
        {/if}

        <div class="m-4">
            <label for="from_date" class="text-gray-700">From date:</label>
            <input
                    type="datetime-local"
                    id="from_date"
                    name="from_date"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline { $sensor_reads_loading ? 'cursor-not-allowed opacity-50' : '' }"
                    on:input={(e) => newFromDate(e)}
                    disabled={$sensor_reads_loading}
            />
        </div>

        <div class="m-4">
            <label for="to_date" class="text-gray-700">To date:</label>
            <input
                    type="datetime-local"
                    id="to_date"
                    name="to_date"
                    class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline { $sensor_reads_loading ? 'cursor-not-allowed opacity-50' : '' }"
                    on:input={(e) => newToDate(e)}
                    disabled={$sensor_reads_loading}
            />
        </div>

        <div class="m-4">
            {#if isRenaming}

                <label for="name" class="text-gray-700">Name:</label>

                <input
                        type="text"
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-2"
                        placeholder={$sensors[id].name}
                        bind:value={newName}
                />

                <button
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                        on:click={() => handleRenamingCancel()}
                >
                    Cancel
                </button>

                <button
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded {!newName ? 'opacity-50 cursor-not-allowed' : ''}"
                        disabled={!newName}
                        on:click={() => handleRenaming()}
                >
                    Save
                </button>
            {:else}
                <span class="text-gray-700 mr-3">Name: {$sensors[id].name}</span>

                <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        on:click={() => renameSensor()}>
                    Rename sensor
                </button>
            {/if}
        </div>

        <div class="grid grid-cols-1 gap-4 mx-8">
            {#each $sensor_reads as read, i}
                <div
                        class="bg-white overflow-hidden shadow rounded-lg"
                        in:fly={{duration: 750, x: 250, delay: 100 + (i * 50)}}
                >
                    <div class="px-2 py-3">
                        <dl>
                            <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                                <dt class="text-sm font-medium text-gray-500">
                                    Value
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {Parser.parseSensorReadValue(read.sensor_value, $sensors[id].sensor_type)}
                                </dd>
                            </div>
                            <div class="sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
                                <dt class="text-sm font-medium text-gray-500">
                                    Date reading
                                </dt>
                                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                    {moment(read.created_at).format('DD/MM/YYYY HH:mm:ss')}
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>