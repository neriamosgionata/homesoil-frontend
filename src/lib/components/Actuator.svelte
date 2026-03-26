<script lang="ts">
    import type {Writable} from "svelte/store";
    import type {Websocket} from "$lib/websocket/Websocket";
    import {getContext} from "svelte";
    import type Actuator from "$lib/models/Actuator";

    interface Props {
        actuator: Actuator;
    }

    let {actuator = $bindable()}: Props = $props();

    const ws: Writable<Websocket> = getContext("ws");

    let isRenaming = $state(false);
    let newName = $state("");

    const renameActuator = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        isRenaming = true;
    };

    const removeActuator = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (confirm("Are you sure you want to remove this actuator?")) {
            $ws.removeActuator(actuator.id);
        }
    };

    const handleRenaming = () => {
        $ws.renameActuator(actuator.id, newName);
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

    const toggle = (e: MouseEvent) => {
        e.stopPropagation();
        $ws.toggleActuator(actuator.id);
    };

    const pulse = (e: MouseEvent) => {
        e.stopPropagation();
        $ws.pulseActuator(actuator.id);
    };

    let showIntermittentConfig = $state(false);
    let onMs = $state(1000);
    let offMs = $state(1000);

    const toggleIntermittent = (e: MouseEvent) => {
        e.stopPropagation();
        if (actuator.intermittent) {
            $ws.stopIntermittentActuator(actuator.id);
        } else {
            showIntermittentConfig = !showIntermittentConfig;
        }
    };

    const startIntermittent = (e: MouseEvent) => {
        e.stopPropagation();
        $ws.intermittentActuator(actuator.id, onMs, offMs);
        showIntermittentConfig = false;
    };

    let isDisabled = $derived(!actuator.online);

    let newNameInput: HTMLInputElement | undefined = $state(undefined);

    $effect(() => {
        newNameInput && newNameInput.focus();
    });
</script>

<div class="glass card-hover flex flex-col rounded-xl group">
    <!-- Header with status indicator -->
    <div class="flex items-center justify-between p-4 border-b" style="border-color: var(--border-subtle);">
        <div class="flex items-center gap-2">
            <div
                class="w-2.5 h-2.5 rounded-full {actuator.online ? 'animate-pulse' : ''}"
                style="background-color: {actuator.online ? 'var(--status-online)' : 'var(--text-muted)'}; box-shadow: {actuator.online ? '0 0 8px var(--status-online)' : 'none'};"
            ></div>
            <span class="text-xs font-medium" style="color: {actuator.online ? 'var(--status-online)' : 'var(--text-muted)'};">
                {actuator.online ? "Online" : "Offline"}
            </span>
        </div>
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
                onclick={renameActuator}
                class="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                style="color: var(--text-secondary);"
                aria-label="Rename actuator"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                    <path d="m15 5 4 4"/>
                </svg>
            </button>
            <button
                onclick={removeActuator}
                class="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                style="color: var(--status-offline);"
                aria-label="Delete actuator"
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
                    {actuator.name}
                </h3>
                <p class="text-xs mt-1 truncate" style="color: var(--text-muted);">
                    {actuator.ip_address}
                </p>
            </div>
        {:else}
            <div class="mb-3" onclick={(e) => e.stopPropagation()}>
                <div class="flex items-center gap-2">
                    <input
                        type="text"
                        class="flex-1 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
                        style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
                        placeholder={actuator.name}
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

        <!-- Control -->
        <div class="mt-auto pt-3 border-t flex justify-center" style="border-color: var(--border-subtle);">
            {#if actuator.pulse}
                <button
                    class="px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2"
                    style="
                        background-color: {isDisabled ? 'var(--text-muted)' : 'var(--accent)'};
                        color: white;
                        opacity: {isDisabled ? '0.5' : '1'};
                        cursor: {isDisabled ? 'not-allowed' : 'pointer'};
                    "
                    onclick={pulse}
                    disabled={isDisabled}
                >
                    {#if actuator.state}
                        <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Processing...
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>
                        </svg>
                        Pulse
                    {/if}
                </button>
            {:else}
                <div class="flex flex-col items-center gap-2 w-full">
                    <div class="flex items-center gap-3">
                        <label class="relative inline-flex items-center {isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}">
                            <input
                                type="checkbox"
                                class="sr-only peer"
                                onclick={toggle}
                                disabled={isDisabled}
                                checked={actuator.state}
                            >
                            <div class="w-14 h-7 rounded-full peer transition-colors duration-200"
                                 style="background-color: {actuator.state ? 'var(--accent)' : 'var(--border-subtle)'};">
                                <div class="absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200"
                                     style="transform: translateX({actuator.state ? '28px' : '0'});">
                                </div>
                            </div>
                            <span class="ml-3 text-sm font-medium" style="color: {actuator.state ? 'var(--accent)' : 'var(--text-secondary)'};">
                                {actuator.state ? "On" : "Off"}
                            </span>
                        </label>
                        <button
                            class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                            style="
                                background-color: {actuator.intermittent ? '#F59E0B' : 'var(--bg-primary)'};
                                color: {actuator.intermittent ? 'white' : 'var(--text-secondary)'};
                                border: 1px solid {actuator.intermittent ? '#F59E0B' : 'var(--border-subtle)'};
                                opacity: {isDisabled ? '0.5' : '1'};
                                cursor: {isDisabled ? 'not-allowed' : 'pointer'};
                            "
                            onclick={toggleIntermittent}
                            disabled={isDisabled}
                        >
                            {actuator.intermittent ? "Stop" : "Intermittent"}
                        </button>
                    </div>
                    {#if showIntermittentConfig}
                        <div class="flex flex-col gap-2 w-full px-2" onclick={(e) => e.stopPropagation()}>
                            <div class="flex items-center gap-2">
                                <label class="text-xs" style="color: var(--text-muted); min-width: 32px;">ON</label>
                                <input
                                    type="number"
                                    class="flex-1 px-2 py-1 text-xs rounded-md border"
                                    style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
                                    bind:value={onMs}
                                    min="100"
                                    step="100"
                                />
                                <span class="text-xs" style="color: var(--text-muted);">ms</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <label class="text-xs" style="color: var(--text-muted); min-width: 32px;">OFF</label>
                                <input
                                    type="number"
                                    class="flex-1 px-2 py-1 text-xs rounded-md border"
                                    style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
                                    bind:value={offMs}
                                    min="100"
                                    step="100"
                                />
                                <span class="text-xs" style="color: var(--text-muted);">ms</span>
                            </div>
                            <button
                                class="px-4 py-1.5 rounded-lg text-xs font-medium transition-all"
                                style="background-color: #F59E0B; color: white;"
                                onclick={startIntermittent}
                            >
                                Start Intermittent
                            </button>
                        </div>
                    {/if}
                    {#if actuator.intermittent}
                        <span class="text-xs" style="color: #F59E0B;">
                            Cycling: {actuator.intermittent_on_ms}ms on / {actuator.intermittent_off_ms}ms off
                        </span>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>
