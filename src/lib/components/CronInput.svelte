<script lang="ts">
	import { onMount } from "svelte";

	interface Props {
		c: string;
		change: (v: { value: string }) => void;
	}

	let { change, c }: Props = $props();

	type Period = "minute" | "hour" | "day" | "week" | "month" | "year";

	const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	let period: Period = $state("day");
	let minute = $state(0);
	let hour = $state(0);
	let dayOfMonth = $state(1);
	let month = $state(1);
	let dayOfWeek = $state(1);

	function parseCron(expr: string) {
		if (!expr || !expr.trim()) return;
		const parts = expr.trim().split(/\s+/);
		if (parts.length !== 5) return;

		const [minP, hourP, domP, monP, dowP] = parts;

		if (minP === "*" && hourP === "*") {
			period = "minute";
		} else if (hourP === "*" && domP === "*" && monP === "*" && dowP === "*") {
			period = "hour";
			minute = minP === "*" ? 0 : parseInt(minP) || 0;
		} else if (dowP !== "*" && domP === "*" && monP === "*") {
			period = "week";
			minute = minP === "*" ? 0 : parseInt(minP) || 0;
			hour = hourP === "*" ? 0 : parseInt(hourP) || 0;
			dayOfWeek = parseInt(dowP) || 0;
		} else if (monP !== "*" && domP !== "*") {
			period = "year";
			minute = minP === "*" ? 0 : parseInt(minP) || 0;
			hour = hourP === "*" ? 0 : parseInt(hourP) || 0;
			dayOfMonth = parseInt(domP) || 1;
			month = parseInt(monP) || 1;
		} else if (domP !== "*" && monP === "*") {
			period = "month";
			minute = minP === "*" ? 0 : parseInt(minP) || 0;
			hour = hourP === "*" ? 0 : parseInt(hourP) || 0;
			dayOfMonth = parseInt(domP) || 1;
		} else {
			period = "day";
			minute = minP === "*" ? 0 : parseInt(minP) || 0;
			hour = hourP === "*" ? 0 : parseInt(hourP) || 0;
		}
	}

	function buildCron(): string {
		switch (period) {
			case "minute":
				return "* * * * *";
			case "hour":
				return `${minute} * * * *`;
			case "day":
				return `${minute} ${hour} * * *`;
			case "week":
				return `${minute} ${hour} * * ${dayOfWeek}`;
			case "month":
				return `${minute} ${hour} ${dayOfMonth} * *`;
			case "year":
				return `${minute} ${hour} ${dayOfMonth} ${month} *`;
			default:
				return "* * * * *";
		}
	}

	let cronValue = $derived(buildCron());

	$effect(() => {
		// Access cronValue to trigger on every change
		const val = cronValue;
		change({ value: val });
	});

	function clear() {
		period = "day";
		minute = 0;
		hour = 0;
		dayOfMonth = 1;
		month = 1;
		dayOfWeek = 1;
		change({ value: "" });
	}

	onMount(() => {
		parseCron(c);
	});

	const pad = (n: number) => n.toString().padStart(2, "0");
</script>

<div class="space-y-3">
	<!-- Period selector -->
	<div class="flex flex-wrap items-center gap-2">
		<span class="text-sm" style="color: var(--text-secondary);">Every</span>
		<select
			class="px-2 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2"
			style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
			bind:value={period}
		>
			<option value="minute">minute</option>
			<option value="hour">hour</option>
			<option value="day">day</option>
			<option value="week">week</option>
			<option value="month">month</option>
			<option value="year">year</option>
		</select>
	</div>

	<!-- Conditional fields -->
	<div class="flex flex-wrap items-center gap-2">
		{#if period === "year"}
			<span class="text-sm" style="color: var(--text-secondary);">in</span>
			<select
				class="px-2 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2"
				style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
				bind:value={month}
			>
				{#each MONTHS as m, i}
					<option value={i + 1}>{m}</option>
				{/each}
			</select>
		{/if}

		{#if period === "month" || period === "year"}
			<span class="text-sm" style="color: var(--text-secondary);">on day</span>
			<select
				class="px-2 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2"
				style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
				bind:value={dayOfMonth}
			>
				{#each Array.from({ length: 31 }, (_, i) => i + 1) as d}
					<option value={d}>{d}</option>
				{/each}
			</select>
		{/if}

		{#if period === "week"}
			<span class="text-sm" style="color: var(--text-secondary);">on</span>
			<select
				class="px-2 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2"
				style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
				bind:value={dayOfWeek}
			>
				{#each DAYS_OF_WEEK as d, i}
					<option value={i}>{d}</option>
				{/each}
			</select>
		{/if}

		{#if period !== "minute" && period !== "hour"}
			<span class="text-sm" style="color: var(--text-secondary);">at</span>
			<select
				class="px-2 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2"
				style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
				bind:value={hour}
			>
				{#each Array.from({ length: 24 }, (_, i) => i) as h}
					<option value={h}>{pad(h)}</option>
				{/each}
			</select>
			<span class="text-sm" style="color: var(--text-secondary);">:</span>
		{/if}

		{#if period !== "minute"}
			<select
				class="px-2 py-1.5 text-sm rounded-lg border focus:outline-none focus:ring-2"
				style="background-color: var(--bg-primary); border-color: var(--border-subtle); color: var(--text-primary);"
				bind:value={minute}
			>
				{#each Array.from({ length: 60 }, (_, i) => i) as m}
					<option value={m}>{pad(m)}</option>
				{/each}
			</select>
			{#if period === "hour"}
				<span class="text-sm" style="color: var(--text-secondary);">minutes past</span>
			{/if}
		{/if}
	</div>

	<!-- Result & clear -->
	<div class="flex items-center justify-between">
		<code class="text-xs px-2 py-1 rounded" style="background-color: var(--bg-primary); color: var(--accent);">
			{cronValue}
		</code>
		<button
			class="px-2 py-1 text-xs rounded-lg transition-colors hover:bg-white/10"
			style="color: var(--text-muted);"
			onclick={clear}
			type="button"
		>
			Clear
		</button>
	</div>
</div>
