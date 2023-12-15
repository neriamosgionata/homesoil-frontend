import {type Writable, writable} from "svelte/store";
import type Sensor from "$lib/Models/Sensor";
import type SensorRead from "$lib/Models/SensorRead";
import {persistentWritable} from "$lib/stores/persistant";

export const sensors: Writable<Sensor[]> = persistentWritable("sensors", []);
export const sensor_reads: Writable<SensorRead[]> = persistentWritable("sensors_reads", []);