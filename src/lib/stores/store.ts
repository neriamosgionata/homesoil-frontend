import {writable, type Writable} from "svelte/store";
import type Sensor from "$lib/Models/Sensor";
import type SensorRead from "$lib/Models/SensorRead";
import type Actuator from "$lib/Models/Actuator";
import {persistentWritable} from "$lib/stores/persistant";

export const sensors: Writable<{ [p: string | number]: Sensor }> = writable({});
export const last_sensor_reads: Writable<{ [p: string | number]: SensorRead }> = writable({});
export const sensor_reads: Writable<SensorRead[]> = writable([]);
export const actuators: Writable<{ [p: string | number]: Actuator }> = writable({});
export const sensor_reads_loading: Writable<boolean> = writable(false);
export const socket_token: Writable<{token: string}> = persistentWritable<{token: string}>("socket_token", {token: ""});