<script lang="ts">
    import {Websocket} from "$lib/Websocket/Websocket";
    import {onMount, setContext} from "svelte";
    import {sensors} from "$lib/stores/store";
    import {writable} from "svelte/store";

    const ws = writable(new Websocket());
    setContext("ws", ws);

    onMount(() => {
        $ws.init();
    });

</script>


<div>
    <h1>Sensors</h1>
    <ul>
        {#each $sensors as sensor}
            <li>
                <a href="/sensors/{sensor.id}">{sensor.name}</a>
            </li>
        {/each}
    </ul>
</div>