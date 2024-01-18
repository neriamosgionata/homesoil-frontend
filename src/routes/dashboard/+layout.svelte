<script lang="ts">
    import {Websocket} from "$lib/websocket/Websocket";
    import {onDestroy, onMount, setContext} from "svelte";
    import {writable} from "svelte/store";
    import DashboardMessage from "$lib/components/DashboardMessage.svelte";

    const ws = writable(new Websocket());

    setContext("ws", ws);

    onMount(() => {
        $ws.connect();
    });

    onDestroy(() => {
        $ws.close();
    });
</script>

<DashboardMessage/>

<slot/>