<script lang="ts">
    import {actuators, last_sensor_reads, sensors} from "$lib/stores/store";
    import type Actuator from "$lib/Models/Actuator";
    import {getContext} from "svelte";
    import type {Writable} from "svelte/store";
    import type {Websocket} from "$lib/Websocket/Websocket";
    import Parser from "$lib/Parser/Parser";

    const ws: Writable<Websocket> = getContext("ws");

    const toggle = async (actuator: Actuator) => {
        $ws.toggleActuator(actuator.id);
    };
</script>

<div class="mb-4">
    <h1>Sensors</h1>
    <table>
        <tr>
            <th>Name</th>
            <th>Last value</th>
        </tr>
        {#each Object.values($sensors) as sensor}
            <tr>
                <td>
                    <a href="/sensors/{sensor.id}">{sensor.name} ({sensor.ip_address})</a>
                </td>
                <td>
                    {$last_sensor_reads[sensor.id] ? Parser.parseSensorReadValue($last_sensor_reads[sensor.id].sensor_value, sensor.sensor_type) : "No data"}
                </td>
            </tr>
        {/each}
    </table>
</div>

<div class="mb-4">
    <h1>Actuators</h1>
    <table>
        <tr>
            <th>Name</th>
            <th>State</th>
            <th>&nbsp;-&nbsp;</th>
        </tr>
        {#each Object.values($actuators) as actuator}
            <tr>
                <td>
                    <p>{actuator.name} ({actuator.ip_address})</p>
                </td>
                <td>
                    {#if actuator.state}
                        On
                    {:else}
                        Off
                    {/if}
                </td>
                <td>
                    <button on:click={() => toggle(actuator)}>Toggle</button>
                </td>
            </tr>
        {/each}
    </table>
</div>