<script lang="ts">
    import {sensor_reads, sensors} from "$lib/stores/store";
    import {page} from '$app/stores';
    import {getContext, onDestroy, onMount} from "svelte";
    import type {Writable} from "svelte/store";
    import type {Websocket} from "$lib/Websocket/Websocket";
    import WebsocketListenEventEnum from "$lib/Enums/WebsocketListenEventEnum";
    import type SensorRead from "$lib/Models/SensorRead";
    import Parser from "$lib/Parser/Parser.js";
    import moment from "moment";

    let id = $page.params.id;

    const ws: Writable<Websocket> = getContext('ws');

    const sensor_read_callback = (data: SensorRead) => {
        sensor_reads.update((reads) => {
            return [data, ...reads];
        });
    };

    onMount(() => {
        sensor_reads.set([]);

        $ws.getAllSensorReadings(parseInt(id));

        $ws.listenToEvent(
            WebsocketListenEventEnum.SENSOR_READ_EVENT,
            sensor_read_callback,
        );
    });

    onDestroy(() => {
        $ws.removeListenerFromEvent(
            WebsocketListenEventEnum.SENSOR_READ_EVENT,
            sensor_read_callback,
        );
    });
</script>

<div class="p-4">
    <h1 class="text-3xl font-bold text-gray-600">Sensor ID: {id}</h1>

    <div class="m-4">
        <a href="/" class="text-blue-500 hover:text-blue-700">Back to home</a>
    </div>

    <div class="grid grid-cols-1 gap-4 mx-8">
        {#each $sensor_reads as read}
            <div class="bg-white overflow-hidden shadow rounded-lg">
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