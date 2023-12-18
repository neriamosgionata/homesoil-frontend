import {writable, type Writable} from "svelte/store";
import type Sensor from "$lib/Models/Sensor";
import type SensorRead from "$lib/Models/SensorRead";

export const sensors: Writable<{ [p: string | number]: Sensor }> = writable({});
export const last_sensor_reads: Writable<{ [p: string | number]: SensorRead }> = writable({});
export const sensor_reads: Writable<SensorRead[]> = writable([]);