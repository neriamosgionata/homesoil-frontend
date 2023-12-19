<script lang="ts">
    import {actuators, sensors} from "$lib/stores/store";
    import Sensor from "$lib/Component/Sensor.svelte";
    import Actuator from "$lib/Component/Actuator.svelte";

    $: sensorsArray = Object.values($sensors);
    $: actuatorsArray = Object.values($actuators);

</script>


<div id="wrapper" class="max-w-screen-2xl px-3 py-3 mx-auto">
    <div class="sm:grid sm:h-32 sm:grid-flow-row sm:gap-4 sm:grid-cols-3 lg:grid-cols-9 lg:gap-4 md:grid-cols-6 md:gap-4">
        {#each sensorsArray as sensor,i}
            <Sensor sensor={sensor} index={i}/>
        {/each}
        {#each actuatorsArray as actuator,i}
            <Actuator actuator={actuator} index={i}/>
        {/each}
    </div>
</div>