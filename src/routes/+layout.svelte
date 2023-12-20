<script lang="ts">
    import {Websocket} from "$lib/Websocket/Websocket";
    import {onDestroy, onMount, setContext} from "svelte";
    import {writable} from "svelte/store";

    import "../app.css";

    const ws = writable(new Websocket());

    setContext("ws", ws);

    onMount(() => {
        $ws.init();
    });

    onDestroy(() => {
        $ws.close();
    });
</script>

<div class="w-full h-full bg-blue-200">
    <slot/>
</div>