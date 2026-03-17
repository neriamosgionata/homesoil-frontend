<script lang="ts">
	import { socket_token, server_config } from "$lib/stores/store";
	import { goto } from "$app/navigation";
	import { get } from "svelte/store";

	let token = $state("");
	let serverHost = $state(get(server_config).host || "");
	let serverPort = $state(get(server_config).port || 4000);

	const login = () => {
		if (!token) {
			return;
		}

		server_config.set({ host: serverHost, port: serverPort });
		socket_token.set({ token });
		setTimeout(() => goto("/dashboard"), 100);
	};
</script>

<div class="min-h-screen flex items-center justify-center" style="background-color: var(--bg-primary);">
	<form class="glass rounded-xl p-8 w-full max-w-sm" onsubmit={(e) => { e.preventDefault(); login(); }}>
		<div class="text-center mb-6">
			<h2 class="text-2xl font-bold" style="color: var(--text-primary);">HomeSoil</h2>
			<p class="text-sm mt-1" style="color: var(--text-muted);">Sign in to your dashboard</p>
		</div>

		<div class="flex gap-2 mb-4">
			<input
				type="text"
				placeholder="Server IP"
				class="flex-1 text-sm py-2.5 px-3 rounded-lg border focus:outline-none focus:ring-2"
				style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
				bind:value={serverHost}
			/>
			<input
				type="number"
				placeholder="Port"
				class="w-24 text-sm py-2.5 px-3 rounded-lg border focus:outline-none focus:ring-2"
				style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
				bind:value={serverPort}
			/>
		</div>

		<input
			type="password"
			placeholder="Token"
			class="block w-full text-sm py-2.5 px-3 rounded-lg border focus:outline-none focus:ring-2 mb-5"
			style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
			bind:value={token}
		/>
		<button
			type="submit"
			class="w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200"
			style="background-color: var(--accent); color: white;"
		>
			Login
		</button>
	</form>
</div>
