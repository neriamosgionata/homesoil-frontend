<script lang="ts">
    import {actuators, sensors} from "$lib/stores/store";
    import Sensor from "$lib/Component/Sensor.svelte";
    import Actuator from "$lib/Component/Actuator.svelte";

    $: sensorsArray = Object.values($sensors);
    $: actuatorsArray = Object.values($actuators);

</script>

<style>
    .grid-shadow {
        box-shadow: rgba(50, 50, 93, 0.25) 0 50px 100px -20px, rgba(0, 0, 0, 0.3) 0 30px 60px -30px;
    }
</style>

<div class="p-8 h-100 w-100">
    <div
            class="grid gap-4 grid-cols-12 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-9 bg-gray-100 rounded-lg p-2 grid-shadow min-w-[50px]"
    >
        {#each sensorsArray as sensor,i}
            <Sensor sensor={sensor} index={i}/>
        {/each}
        {#each actuatorsArray as actuator,i}
            <Actuator actuator={actuator} index={i}/>
        {/each}
    </div>
</div>