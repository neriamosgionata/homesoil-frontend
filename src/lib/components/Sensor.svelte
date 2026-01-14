<script lang="ts">
    import type Sensor from "$lib/models/Sensor";
    import {last_sensor_reads} from "$lib/stores/store";
    import Parser from "$lib/parser/Parser";
    import {goto} from "$app/navigation";
    import {getContext} from "svelte";
    import type {Writable} from "svelte/store";
    import type {Websocket} from "$lib/websocket/Websocket";

    interface Props {
        sensor: Sensor;
    }

    let {sensor}: Props = $props();

    let parsedValue = $derived($last_sensor_reads[sensor.id] ? Parser.parseSensorReadValue($last_sensor_reads[sensor.id].sensor_value, sensor.sensor_type) : "No data");

    const ws: Writable<Websocket> = getContext("ws");

    let isRenaming = $state(false);
    let newName = $state("");

    const renameSensor = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        isRenaming = true;
    };

    const removeSensor = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to remove this sensor?")) {
            $ws.removeSensor(sensor.id);
        }
    };

    const handleRenaming = () => {
        $ws.renameSensor(sensor.id, newName);
        isRenaming = false;
    };

    const handleRenamingCancel = () => {
        isRenaming = false;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            handleRenaming();
        } else if (e.key === "Escape") {
            handleRenamingCancel();
        }
    };

    const goToDetails = () => {
        goto(`/dashboard/sensors/${sensor.id}`);
    };

    let newNameInput: HTMLInputElement | undefined = $state(undefined);
    $effect(() => {
        newNameInput && newNameInput.focus();
    });
</script>

<div
    class="glass card-hover flex flex-col rounded-xl cursor-pointer group"
    onclick={goToDetails}
    onkeydown={(e) => e.key === 'Enter' && goToDetails()}
    role="button"
    tabindex="0"
>
    <!-- Header with status indicator -->
    <div class="flex items-center justify-between p-4 border-b" style="border-color: var(--border-subtle);">
        <div class="flex items-center gap-2">
            <div
                class="w-2.5 h-2.5 rounded-full {sensor.online ? 'animate-pulse' : ''}"
                style="background-color: {sensor.online ? 'var(--status-online)' : 'var(--text-muted)'}; box-shadow: {sensor.online ? '0 0 8px var(--status-online)' : 'none'};"
            ></div>
            <span class="text-xs font-medium" style="color: {sensor.online ? 'var(--status-online)' : 'var(--text-muted)'};">
                {sensor.online ? "Online" : "Offline"}
            </span>
        </div>
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onclick={renameSensor}
                class="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                style="color: var(--text-secondary);"
                aria-label="Rename sensor"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
                </svg>
            </button>
            <button
                onclick={removeSensor}
                class="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                style="color: var(--status-offline);"
                aria-label="Delete sensor"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
            </button>
        </div>
    </div>

    <!-- Content -->
    <div class="p-4 flex-1 flex flex-col">
        {#if !isRenaming}
            <div class="mb-3">
                <h3 class="font-semibold text-base truncate" style="color: var(--text-primary);">
                    {sensor.name}
                </h3>
                <p class="text-xs mt-1 truncate" style="color: var(--text-muted);">
                    {sensor.ip_address}
                </p>
            </div>
        {:else}
            <div class="mb-3" onclick={(e) => e.stopPropagation()}>
                <div class="flex items-center gap-2">
                    <input
                        type="text"
                        class="flex-1 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
                        style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
                        placeholder={sensor.name}
                        bind:this={newNameInput}
                        bind:value={newName}
                        onkeydown={handleKeyDown}
                    />
                    <button
                        onclick={handleRenamingCancel}
                        class="p-2 rounded-lg hover:bg-white/10"
                        style="color: var(--text-secondary);"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18"/>
                            <path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
        {/if}

        <!-- Value display -->
        <div class="mt-auto pt-3 border-t" style="border-color: var(--border-subtle);">
            <p class="text-2xl font-bold text-center" style="color: var(--accent);">
                {parsedValue}
            </p>
        </div>
    </div>
</div>
