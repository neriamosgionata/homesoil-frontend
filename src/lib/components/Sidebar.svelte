<script lang="ts">
	import { page } from "$app/stores";

	let collapsed = $state(false);

	const navItems = [
		{ href: "/dashboard", label: "Dashboard", icon: "home" },
		{ href: "/dashboard/flows", label: "Flows", icon: "flow" },
		{ href: "/dashboard/scripts", label: "Scripts", icon: "code" },
		{ href: "/dashboard/settings", label: "Settings", icon: "settings" }
	];

	function isActive(href: string): boolean {
		const currentPath = $page.url.pathname;
		if (href === "/dashboard") {
			return currentPath === "/dashboard";
		}
		return currentPath.startsWith(href);
	}
</script>

<aside
	class="h-full flex flex-col transition-all duration-300 ease-in-out"
	style="background-color: var(--bg-secondary); width: {collapsed ? '64px' : '240px'};"
>
	<!-- Header -->
	<div class="flex items-center justify-between p-4 border-b" style="border-color: var(--border-subtle);">
		{#if !collapsed}
			<span class="text-xl font-bold" style="color: var(--text-primary);"> HomeSoil </span>
		{/if}
		<button
			onclick={() => (collapsed = !collapsed)}
			class="p-2 rounded-lg transition-colors hover:bg-white/10"
			aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="transition-transform duration-300"
				style="transform: rotate({collapsed ? '180deg' : '0deg'});"
			>
				<path d="m15 18-6-6 6-6" />
			</svg>
		</button>
	</div>

	<!-- Navigation -->
	<nav class="flex-1 p-3 space-y-2">
		{#each navItems as item}
			{@const active = isActive(item.href)}
			<a
				href={item.href}
				class="
                    flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group {!active
					? 'hover:bg-white/20'
					: ''}
                "
				style="
                    background-color: {active ? 'var(--accent)' : 'transparent'};
                    color: {active ? 'white' : 'var(--text-secondary)'};
                "
			>
				{#if item.icon === "home"}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
						<polyline points="9 22 9 12 15 12 15 22" />
					</svg>
				{:else if item.icon === "flow"}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="5" cy="6" r="3" />
						<circle cx="19" cy="6" r="3" />
						<circle cx="12" cy="18" r="3" />
						<path d="M5 9v3a4 4 0 0 0 4 4h2" />
						<path d="M19 9v3a4 4 0 0 1-4 4h-2" />
					</svg>
				{:else if item.icon === "code"}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<polyline points="16 18 22 12 16 6" />
						<polyline points="8 6 2 12 8 18" />
					</svg>
				{:else if item.icon === "settings"}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="22"
						height="22"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
						<circle cx="12" cy="12" r="3" />
					</svg>
				{/if}
				{#if !collapsed}
					<span class="font-medium whitespace-nowrap">{item.label}</span>
				{/if}
			</a>
		{/each}
	</nav>

	<!-- Footer -->
	<div class="p-4 border-t" style="border-color: var(--border-subtle);">
		{#if !collapsed}
			<div class="flex items-center gap-3 text-sm" style="color: var(--text-muted);">
				<div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
				<span>Connected</span>
			</div>
			<div class="text-xs mt-1" style="color: var(--text-muted); opacity: 0.7;">
				{location.hostname}:{location.port}
			</div>
		{:else}
			<div class="flex justify-center">
				<div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
			</div>
		{/if}
	</div>
</aside>
