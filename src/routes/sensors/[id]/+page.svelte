<script lang="ts">
    import {last_sensor_reads, sensor_reads, sensors} from "$lib/stores/store";
    import {page} from '$app/stores';
    import {getContext, onDestroy, onMount} from "svelte";
    import type {Writable} from "svelte/store";
    import type {Websocket} from "$lib/Websocket/Websocket";
    import WebsocketListenEventEnum from "$lib/Enums/WebsocketListenEventEnum";
    import type SensorRead from "$lib/Models/SensorRead";

    let id = $page.params.id;
    let ws: Writable<Websocket> = getContext('ws');

    const sensor_read_callback = (data: SensorRead) => {
        console.log('sensor read callback');
        sensor_reads.update((reads) => {
            return [data, ...reads];
        });
    }

    onMount(() => {
        sensor_reads.set([]);
        $ws.get_all_sensor_readings(parseInt(id));

        $ws.add_callback_to_event(
            WebsocketListenEventEnum.SENSOR_READ_EVENT,
            sensor_read_callback,
        );
    });

    onDestroy(() => {
        $ws.remove_callback_from_event(
            WebsocketListenEventEnum.SENSOR_READ_EVENT,
            sensor_read_callback,
        );
    });
</script>

<div>
    <p>
        <a href="/sensors">back</a>
    </p>

    <h1>Detail</h1>

    <p>id: {id}</p>

    {#if !$sensors[id]}
        <p>sensor not found</p>
    {:else}
        <p>name: {$sensors[id].name}</p>
        <p>ip address: {$sensors[id].ip_address}</p>
        <p>created at: {$sensors[id].created_at}</p>
        <p>latest reading: {$last_sensor_reads[id].sensor_value}</p>

        <hr class="my-4">

        <h2>Reads</h2>

        <table>
            <thead>
            <tr>
                <th>value</th>
                <th>read at</th>
            </tr>
            </thead>
            <tbody>
            {#each $sensor_reads as read}
                <tr>
                    <td class="mr-2">{read.sensor_value}</td>
                    <td>{read.created_at}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    {/if}

</div>