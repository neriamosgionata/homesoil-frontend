<script lang="ts">
	import { server_settings, socket_token } from "$lib/stores/store";
	import { goto } from "$app/navigation";
	import { getContext } from "svelte";
	import type { Writable } from "svelte/store";
	import type { Websocket } from "$lib/websocket/Websocket";

	const ws: Writable<Websocket> = getContext("ws");

	let host = $state($server_settings.host || location.hostname);
	let port = $state($server_settings.port || 4000);
	let testStatus: "idle" | "testing" | "success" | "error" = $state("idle");
	let testMessage = $state("");

	const save = () => {
		server_settings.set({ host, port });
	};

	const saveAndReconnect = () => {
		save();
		$ws.close();
		setTimeout(() => {
			$ws.connect();
			$ws.getAllScripts();
		}, 300);
	};

	const testConnection = async () => {
		testStatus = "testing";
		testMessage = "";
		try {
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 5000);
			const response = await fetch(`http://${host}:${port}/socket.io/?EIO=4&transport=polling`, {
				signal: controller.signal
			});
			clearTimeout(timeout);
			if (response.ok) {
				testStatus = "success";
				testMessage = "Connection successful";
			} else {
				testStatus = "error";
				testMessage = `Server responded with ${response.status}`;
			}
		} catch (e: any) {
			testStatus = "error";
			testMessage = e.name === "AbortError" ? "Connection timed out" : "Could not reach server";
		}
	};

	const disconnect = () => {
		$ws.close();
		socket_token.set({ token: "" });
		goto("/");
	};

	const currentServer = $derived(`${$server_settings.host || location.hostname}:${$server_settings.port || 4000}`);
</script>

<div class="space-y-6 max-w-xl">
	<!-- Header -->
	<div class="flex items-center gap-3">
		<button
			class="p-2 rounded-lg transition-colors hover:bg-white/10"
			style="color: var(--text-secondary);"
			onclick={() => goto("/dashboard")}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="m15 18-6-6 6-6"/>
			</svg>
		</button>
		<h1 class="text-3xl font-bold" style="color: var(--text-primary);">Settings</h1>
	</div>

	<!-- Connection Status -->
	<div class="glass rounded-xl p-4">
		<h3 class="font-semibold mb-3" style="color: var(--text-primary);">Connection</h3>
		<div class="flex items-center gap-3">
			<div class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
			<span class="text-sm" style="color: var(--text-secondary);">
				Connected to <span class="font-mono" style="color: var(--text-primary);">{currentServer}</span>
			</span>
		</div>
	</div>

	<!-- Server Configuration -->
	<div class="glass rounded-xl p-4">
		<h3 class="font-semibold mb-3" style="color: var(--text-primary);">Server Configuration</h3>
		<div class="space-y-4">
			<div>
				<label class="text-sm font-medium mb-1 block" style="color: var(--text-secondary);">Host</label>
				<input
					type="text"
					class="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
					style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
					placeholder={location.hostname}
					bind:value={host}
				/>
				<p class="text-xs mt-1" style="color: var(--text-muted);">Leave empty to use current hostname ({location.hostname})</p>
			</div>
			<div>
				<label class="text-sm font-medium mb-1 block" style="color: var(--text-secondary);">Port</label>
				<input
					type="number"
					class="w-full px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2"
					style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
					placeholder="4000"
					bind:value={port}
				/>
			</div>

			<!-- Test Connection -->
			<div class="flex items-center gap-3">
				<button
					class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
					style="border: 1px solid var(--border-subtle); color: var(--text-secondary); opacity: {testStatus === 'testing' ? '0.5' : '1'};"
					disabled={testStatus === "testing"}
					onclick={testConnection}
				>
					{testStatus === "testing" ? "Testing..." : "Test Connection"}
				</button>
				{#if testStatus === "success"}
					<span class="text-sm font-medium" style="color: var(--status-online);">{testMessage}</span>
				{:else if testStatus === "error"}
					<span class="text-sm font-medium" style="color: var(--status-offline);">{testMessage}</span>
				{/if}
			</div>

			<!-- Actions -->
			<div class="flex items-center gap-3 pt-2 border-t" style="border-color: var(--border-subtle);">
				<button
					class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
					style="background-color: var(--accent); color: white;"
					onclick={saveAndReconnect}
				>
					Save & Reconnect
				</button>
				<button
					class="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200"
					style="background-color: var(--status-offline); color: white;"
					onclick={disconnect}
				>
					Disconnect
				</button>
			</div>
		</div>
	</div>

	<!-- About -->
	<div class="glass rounded-xl p-4">
		<h3 class="font-semibold mb-2" style="color: var(--text-primary);">About</h3>
		<p class="text-sm" style="color: var(--text-secondary);">
			HomeSoil — IoT Home Automation Platform
		</p>
		<p class="text-xs mt-1" style="color: var(--text-muted);">
			v0.0.1
		</p>
	</div>
</div>
