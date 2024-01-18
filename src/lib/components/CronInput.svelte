<script lang="ts">
    import {createEventDispatcher, onMount} from "svelte";
    import 'react-js-cron/dist/styles.css'
    import Cron from "react-js-cron";
    import {used} from "svelte-preprocess-react";

    export let cron: string | null | undefined = null;

    const dispatcher = createEventDispatcher<{
        change: {
            value: string | null | undefined
        }
    }>();

    const emitChange = (v: string | null | undefined) => {
        dispatcher("change", {
            value: v
        });
    }

    const catchEvent = (v: string | null | undefined) => {
        cron = v;
        emitChange(v);
    }

    onMount(() => {
        catchEvent(undefined);
    })

    used(Cron);

</script>

<react:Cron
        value={cron}
        setValue={catchEvent}
        clearButtonAction="empty"
        clearButton={true}
        clearButtonProps={{}}
        className="text-black/70 font-light"
        id="cronInput"
/>

{#if cron}
    <div class="flex justify-between text-md dark:text-white text-black/70 mt-2">
        <div>
            <span class="">Scheduled for: <i>{cron}</i> </span>
        </div>
        <div>
            <a class="pointer text-xs" target='_blank'
               href={`https://crontab.guru/#${cron}`}>Show on crontab.guru</a>
        </div>
    </div>
{/if}