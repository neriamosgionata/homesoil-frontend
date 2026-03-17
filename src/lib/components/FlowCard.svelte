<script lang="ts">
	import type Flow from '$lib/models/Flow';
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import type { Writable } from 'svelte/store';
	import type { Websocket } from '$lib/websocket/Websocket';

	let { flow }: { flow: Flow } = $props();

	const ws = getContext<Writable<Websocket>>('ws');

	function handleToggle() {
		$ws.toggleFlow(flow.id, !flow.enabled);
	}

	function handleDelete() {
		if (confirm('Delete this flow?')) {
			$ws.removeFlow(flow.id);
		}
	}
</script>

<div
	class="glass rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
	style="border-left: 3px solid {flow.enabled ? 'var(--status-online)' : 'var(--border-subtle)'};"
>
	<div class="flex items-center justify-between mb-3">
		<button class="text-left flex-1" onclick={() => goto(`/dashboard/flows/${flow.id}`)}>
			<h3 class="font-semibold truncate" style="color: var(--text-primary);">
				{flow.title || 'Untitled Flow'}
			</h3>
		</button>
		<div class="flex items-center gap-2">
			<button
				onclick={handleToggle}
				class="relative w-10 h-5 rounded-full transition-colors duration-200"
				style="background-color: {flow.enabled ? 'var(--status-online)' : 'var(--border-subtle)'};"
				title={flow.enabled ? 'Disable' : 'Enable'}
			>
				<div
					class="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200"
					style="transform: translateX({flow.enabled ? '22px' : '2px'});"
				></div>
			</button>
			<button
				onclick={handleDelete}
				class="p-1 rounded-lg transition-colors hover:bg-red-500/20"
				style="color: var(--text-muted);"
				title="Delete flow"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<polyline points="3 6 5 6 21 6"/>
					<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
				</svg>
			</button>
		</div>
	</div>
	<div class="flex items-center gap-2 text-xs" style="color: var(--text-muted);">
		<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full" style="background: {flow.enabled ? 'rgba(76,175,80,0.15)' : 'rgba(255,255,255,0.05)'}; color: {flow.enabled ? 'var(--status-online)' : 'var(--text-muted)'};">
			<div class="w-1.5 h-1.5 rounded-full" style="background: {flow.enabled ? 'var(--status-online)' : 'var(--text-muted)'};"></div>
			{flow.enabled ? 'Active' : 'Inactive'}
		</span>
	</div>
</div>
