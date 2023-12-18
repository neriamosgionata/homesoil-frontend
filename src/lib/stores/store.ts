import {writable, type Writable} from "svelte/store";
import type Sensor from "$lib/Models/Sensor";
import type SensorRead from "$lib/Models/SensorRead";

export const sensors: Writable<{ [p: string | number]: Sensor }> = writable({}); //persistentWritable("sensors", {});
export const sensor_reads: Writable<{ [p: string | number]: SensorRead[] }> = writable({}); //persistentWritable("sensors_reads", {});