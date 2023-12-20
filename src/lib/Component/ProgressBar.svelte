<script lang="ts">
    import {fade} from "svelte/transition";
</script>

<div
        class="fixed top-0 bottom-0 z-50 bg-gray-50 dark:bg-[#343541] rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.40)] px-4 py-0 text-base md:max-w-2xl md:gap-3 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl"
        in:fade={{duration: 150, delay: 250}}
        out:fade={{duration: 150, delay: 0}}
>
    <div>
        <label for="progressbar">
            <span class="w-full block">
                <span class="h-1.5 w-full bg-green-100 dark:bg-gray-600 overflow-hidden block">
                    <span class="animate-progress w-full h-full bg-gray-900 dark:bg-gray-100 origin-left-right block"></span>
                </span>
            </span>
        </label>
    </div>
</div>