<script lang="ts">
    import {last_sensor_reads, sensors} from "$lib/stores/store";
    import Parser from "$lib/Parser/Parser";
</script>

<div>
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