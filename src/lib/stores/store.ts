import {writable, type Writable} from "svelte/store";
import type Sensor from "$lib/models/Sensor";
import type SensorRead from "$lib/models/SensorRead";
import type Actuator from "$lib/models/Actuator";
import {persistentWritable} from "$lib/stores/persistant";
import type Script from "$lib/models/Script";
import type DashboardMessage from "$lib/models/DashboardMessage";

export const dashboard_message: Writable<DashboardMessage | null> = writable(null);
export const sensors: Writable<{ [p: string | number]: Sensor }> = writable({});
export const last_sensor_reads: Writable<{ [p: string | number]: SensorRead }> = writable({});
export const scripts: Writable<{ [p: string | number]: Script }> = writable({});
export const sensor_reads: Writable<SensorRead[]> = writable([]);
export const actuators: Writable<{ [p: string | number]: Actuator }> = writable({});
export const sensor_reads_loading: Writable<boolean> = writable(false);
export const socket_token: Writable<{ token: string }> = persistentWritable<{ token: string }>("socket_token", {token: ""});
export const server_config: Writable<{ host: string; port: number }> = persistentWritable<{ host: string; port: number }>("server_config", { host: "", port: 4000 });