<script lang="ts">
    import {Websocket} from "$lib/Websocket/Websocket";
    import {onDestroy, onMount, setContext} from "svelte";
    import {writable} from "svelte/store";

    const ws = writable(new Websocket());

    setContext("ws", ws);

    onMount(() => {
        $ws.connect();
    });

    onDestroy(() => {
        $ws.close();
    });
</script>

<slot/>