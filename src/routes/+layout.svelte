<script lang="ts">
    import {Websocket} from "$lib/Websocket/Websocket";
    import {onDestroy, onMount, setContext} from "svelte";
    import {writable} from "svelte/store";
    import {goto} from '$app/navigation';


    const ws = writable(new Websocket());

    setContext("ws", ws);

    onMount(() => {
        $ws.close();
        $ws.init();

        goto("/sensors");
    });

    onDestroy(() => {
        $ws.close();
    });
</script>

<slot/>