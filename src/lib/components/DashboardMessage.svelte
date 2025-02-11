<script lang="ts">
    import {dashboard_message} from "$lib/stores/store";
    import {fade, fly} from "svelte/transition";

    const closeMessage = () => {
        dashboard_message.set(null);
    };
</script>

{#if $dashboard_message}
    <div
            class="fixed inset-y-0 left-1/2 right-1/2 z-50"
            in:fade={{duration: 450}}
            out:fly={{y: "-15%", duration: 750}}
    >
        <div class="bg-white rounded-lg shadow-lg p-4 m-6 min-h-[100px] min-w-[400px] flex items-center justify-center gap-4">
            {#if $dashboard_message.type === "success"}
                <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 13l4 4L19 7"/>
                </svg>
            {:else if $dashboard_message.type === "error"}
                <svg class="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"/>
                </svg>
            {:else if $dashboard_message.type === "warning"}
                <svg class="w-16 h-16 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
            {:else if $dashboard_message.type === "info"}
                <svg class="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
            {:else}
                <svg class="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
            {/if}

            <p class="text-gray-700 text-base m-0 p-0">{$dashboard_message.message}</p>

            <button class="bg-red-500 text-white font-bold rounded-full py-2 px-4"
                    onclick={() => closeMessage()}>
                Close
            </button>

        </div>
    </div>
{/if}