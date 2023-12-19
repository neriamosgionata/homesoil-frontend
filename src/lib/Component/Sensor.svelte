<script lang="ts">
    import type Sensor from "$lib/Models/Sensor";
    import {last_sensor_reads} from "$lib/stores/store";
    import Parser from "$lib/Parser/Parser";
    import {goto} from "$app/navigation";

    export let sensor: Sensor;
    export let index: number;

    const getParsedValue = () => {
        return $last_sensor_reads[sensor.id] ? Parser.parseSensorReadValue($last_sensor_reads[sensor.id].sensor_value, sensor.sensor_type) : "No data";
    };

    const goToDetails = () => {
        goto(`/sensors/${sensor.id}`);
    };
</script>

<div class="flex flex-col justify-center px-4 py-4 bg-white border border-gray-300 rounded">
    <div aria-roledescription="button" role="button" tabindex={index} on:click={() => goToDetails()} on:keydown={() => {}}>
        <p class="text-3xl font-semibold text-center text-gray-800">{getParsedValue()}</p>
        <p class="text-lg text-center text-gray-500">{sensor.name}</p>
    </div>
</div>