<script lang="ts">
    import {onMount} from "svelte";
    import "react-js-cron/dist/styles.css";
    import Cron from "./ReactJSCron";
    import {sveltify} from "svelte-preprocess-react";
    import {type Writable, writable} from "svelte/store";

    interface Props {
        c: string,
        change: (v: { value: string }) => void;
    }

    let {change, c}: Props = $props();

    const cron: Writable<string> = writable("");

    const emitChange = (v: string) => {
        change({value: v});
    };

    const catchEvent = (v: string) => {
        cron.set(v);
        emitChange(v);
    };

    onMount(() => {
        cron.set(c);
        catchEvent("");
    });

    const react = sveltify({Cron});
</script>

{#if $cron}
    <div class="flex justify-between text-md dark:text-white text-black/70 mb-2">
        <div>
            <span class="">Scheduled for: <i>{$cron}</i> </span>
        </div>
        <div>
            <a class="pointer text-xs" target="_blank" href={`https://crontab.guru/#${$cron}`}>Show on crontab.guru</a>
        </div>
    </div>
{:else}
    <div class="flex justify-between text-md mb-2 text-red-400">
        <div>
            <span class="">No schedule set</span>
        </div>
    </div>
{/if}

<react.Cron
        value={$cron === undefined ? "* * * * *" : $cron}
        setValue={catchEvent}
        clearButtonAction="empty"
        clearButton={true}
        clearButtonProps={{}}
></react.Cron>
