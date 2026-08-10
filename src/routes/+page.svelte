<script lang="ts">
	import { socket_token } from "$lib/stores/store";
	import { goto } from "$app/navigation";
	import { get } from "svelte/store";

	let pin = $state("");

	const hasToken = $derived(get(socket_token).token !== "");

	const loginWithPin = () => {
		if (!pin) return;
		socket_token.set({ token: "", pin });
		setTimeout(() => goto("/dashboard"), 100);
	};

	const loginWithToken = () => {
		setTimeout(() => goto("/dashboard"), 100);
	};
</script>

<div class="min-h-screen flex items-center justify-center" style="background-color: var(--bg-primary);">
	<form class="glass rounded-xl p-8 w-full max-w-sm" onsubmit={(e) => { e.preventDefault(); hasToken ? loginWithToken() : loginWithPin(); }}>
		<div class="text-center mb-6">
			<h2 class="text-2xl font-bold" style="color: var(--text-primary);">HomeSoil</h2>
			<p class="text-sm mt-1" style="color: var(--text-muted);">
				{hasToken ? "Reconnect to your dashboard" : "Enter the PIN shown on your server"}
			</p>
		</div>

		{#if !hasToken}
			<input
				type="text"
				placeholder="Pairing PIN"
				class="block w-full text-sm py-2.5 px-3 rounded-lg border focus:outline-none focus:ring-2 mb-5 text-center tracking-widest"
				style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
				maxlength="8"
				bind:value={pin}
			/>
		{/if}

		<button
			type="submit"
			class="w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200"
			style="background-color: var(--accent); color: white;"
		>
			{hasToken ? "Connect" : "Pair"}
		</button>

		{#if hasToken}
			<button
				type="button"
				class="w-full py-2 px-4 rounded-lg font-medium text-xs transition-all duration-200 mt-2"
				style="color: var(--text-muted);"
				onclick={() => { socket_token.set({ token: "" }); }}
			>
				Pair with new PIN
			</button>
		{/if}
	</form>
</div>
