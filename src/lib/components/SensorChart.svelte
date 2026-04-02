<script lang="ts">
	import type SensorRead from "$lib/models/SensorRead";
	import type SensorTypeEnum from "$lib/enums/SensorTypeEnum";
	import Parser from "$lib/parser/Parser";
	import moment from "moment";

	interface Props {
		reads: SensorRead[];
		sensorType: SensorTypeEnum;
	}

	let { reads, sensorType }: Props = $props();

	const WIDTH = 700;
	const HEIGHT = 280;
	const PADDING = { top: 20, right: 20, bottom: 40, left: 60 };

	let chartW = $derived(WIDTH - PADDING.left - PADDING.right);
	let chartH = $derived(HEIGHT - PADDING.top - PADDING.bottom);

	let values = $derived(reads.map((r) => parseFloat(r.sensor_value)).filter((v) => !isNaN(v)));
	let minVal = $derived(values.length ? Math.min(...values) : 0);
	let maxVal = $derived(values.length ? Math.max(...values) : 1);
	let range = $derived(maxVal - minVal || 1);

	let points = $derived(
		values.map((v, i) => ({
			x: PADDING.left + (i / Math.max(values.length - 1, 1)) * chartW,
			y: PADDING.top + chartH - ((v - minVal) / range) * chartH
		}))
	);

	let pathD = $derived(
		points.length > 1
			? "M " + points.map((p) => `${p.x},${p.y}`).join(" L ")
			: ""
	);

	let areaD = $derived(
		points.length > 1
			? pathD +
				` L ${points[points.length - 1].x},${PADDING.top + chartH}` +
				` L ${points[0].x},${PADDING.top + chartH} Z`
			: ""
	);

	let yTicks = $derived(
		Array.from({ length: 5 }, (_, i) => {
			const val_ = minVal + (range * i) / 4;
			return {
				y: PADDING.top + chartH - (i / 4) * chartH,
				label: val_.toFixed(1)
			};
		})
	);

	let xTicks = $derived(
		reads.length > 1
			? Array.from({ length: Math.min(5, reads.length) }, (_, i) => {
					const idx = Math.round((i / (Math.min(5, reads.length) - 1)) * (reads.length - 1));
					return {
						x: PADDING.left + (idx / Math.max(reads.length - 1, 1)) * chartW,
						label: moment(reads[idx].created_at).format("HH:mm")
					};
				})
			: []
	);

	let hoveredIndex: number | null = $state(null);
</script>

{#if values.length >= 2}
	<svg
		viewBox="0 0 {WIDTH} {HEIGHT}"
		class="w-full"
		style="max-height: 280px;"
		onmouseleave={() => (hoveredIndex = null)}
	>
		<!-- Grid lines -->
		{#each yTicks as tick}
			<line
				x1={PADDING.left}
				y1={tick.y}
				x2={PADDING.left + chartW}
				y2={tick.y}
				stroke="var(--border-subtle)"
				stroke-width="0.5"
				stroke-dasharray="4"
			/>
			<text
				x={PADDING.left - 8}
				y={tick.y + 4}
				text-anchor="end"
				fill="var(--text-muted)"
				font-size="10"
			>
				{tick.label}
			</text>
		{/each}

		<!-- X axis labels -->
		{#each xTicks as tick}
			<text
				x={tick.x}
				y={PADDING.top + chartH + 20}
				text-anchor="middle"
				fill="var(--text-muted)"
				font-size="10"
			>
				{tick.label}
			</text>
		{/each}

		<!-- Area fill -->
		<path d={areaD} fill="var(--accent)" opacity="0.1" />

		<!-- Line -->
		<path d={pathD} fill="none" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" />

		<!-- Data points (interactive) -->
		{#each points as point, i}
			<circle
				cx={point.x}
				cy={point.y}
				r={hoveredIndex === i ? 5 : 2.5}
				fill="var(--accent)"
				stroke="var(--bg-primary)"
				stroke-width="1.5"
				onmouseenter={() => (hoveredIndex = i)}
				style="cursor: pointer;"
			/>
		{/each}

		<!-- Tooltip -->
		{#if hoveredIndex !== null && reads[hoveredIndex]}
			{@const px = points[hoveredIndex].x}
			{@const py = points[hoveredIndex].y}
			<rect
				x={px - 55}
				y={py - 38}
				width="110"
				height="30"
				rx="4"
				fill="var(--bg-secondary)"
				stroke="var(--border-subtle)"
			/>
			<text x={px} y={py - 25} text-anchor="middle" fill="var(--accent)" font-size="11" font-weight="bold">
				{Parser.parseSensorReadValue(reads[hoveredIndex].sensor_value, sensorType)}
			</text>
			<text x={px} y={py - 13} text-anchor="middle" fill="var(--text-muted)" font-size="9">
				{moment(reads[hoveredIndex].created_at).format("DD/MM HH:mm:ss")}
			</text>
		{/if}
	</svg>
{:else if values.length === 1}
	<div class="glass rounded-xl p-6 text-center">
		<p class="text-lg font-bold" style="color: var(--accent);">
			{Parser.parseSensorReadValue(reads[0].sensor_value, sensorType)}
		</p>
		<p class="text-xs mt-1" style="color: var(--text-muted);">
			{moment(reads[0].created_at).format("DD/MM/YYYY HH:mm:ss")}
		</p>
		<p class="text-xs mt-2" style="color: var(--text-muted);">Need at least 2 readings for a chart</p>
	</div>
{/if}
