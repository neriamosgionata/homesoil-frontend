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

<div>
	<form class="bg-blue text-center w-1/3 px-3 py-4 text-white rounded mx-auto">
		<h2 class="text-xl font-bold mb-4">Homesoil</h2>

		<div class="flex gap-2 my-3">
			<input
				type="text"
				placeholder="Server IP (e.g. 192.168.1.100)"
				class="block flex-1 text-sm py-2 px-3 rounded text-gray-700 bg-white"
				bind:value={serverHost}
			/>
			<input
				type="number"
				placeholder="Port"
				class="block w-24 text-sm py-2 px-3 rounded text-gray-700 bg-white"
				bind:value={serverPort}
			/>
		</div>

		<input
			type="password"
			placeholder="Token"
			class="block w-full mx-auto text-sm py-2 px-3 rounded my-3 text-gray-700 bg-white"
			bind:value={token}
		/>
		<button
			class="text-white font-bold py-2 px-4 rounded border block mx-auto w-full bg-blue-500 hover:bg-blue-700"
			onclick={() => login()}
		>
			Login
		</button>
	</form>
</div>
