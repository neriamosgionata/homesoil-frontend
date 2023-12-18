<script lang="ts">
    import {sensor_reads, sensors} from "$lib/stores/store";
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
            reads.push(data);
            return reads;
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
    <h1>Detail</h1>

    <p>id: {id}</p>

    {#if !$sensors[id]}
        <p>sensor not found</p>
    {:else}
        <p>name: {$sensors[id].name}</p>
        <p>ip address: {$sensors[id].ip_address}</p>
        <p>created at: {$sensors[id].created_at}</p>

        <hr class="my-4">

        <h2>Reads</h2>

        <table>
            <thead>
            <tr>
                <th>id</th>
                <th>sensor_id</th>
                <th>value</th>
                <th>created_at</th>
            </tr>
            </thead>
            <tbody>
            {#each $sensor_reads as read}
                <tr>
                    <td>{read.id}</td>
                    <td>{read.sensor_id}</td>
                    <td>{read.sensor_value}</td>
                    <td>{read.created_at}</td>
                </tr>
            {/each}
            </tbody>
        </table>
    {/if}

    <p>
        <a href="/sensors">back</a>
    </p>

</div>