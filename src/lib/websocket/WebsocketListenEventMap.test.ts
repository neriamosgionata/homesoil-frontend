import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

// Mock localStorage for persistentWritable
const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => { mockStorage[key] = value; },
    removeItem: (key: string) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
});

import WebsocketListenEventMap from './WebsocketListenEventMap';
import WebsocketListenEventEnum from '$lib/enums/WebsocketListenEventEnum';
import { flows, sensors, actuators, last_sensor_reads, scripts, dashboard_message } from '$lib/stores/store';

describe('WebsocketListenEventMap - Flows', () => {
    beforeEach(() => {
        flows.set({});
    });

    it('ALL_FLOWS_EVENT sets flows from array', () => {
        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.ALL_FLOWS_EVENT];

        handler({
            flows: [
                { id: 1, title: 'Flow A', graph: '{}', enabled: true, created_at: '2026-01-01', updated_at: null },
                { id: 2, title: 'Flow B', graph: '{}', enabled: false, created_at: '2026-01-02', updated_at: null },
            ],
        });

        const result = get(flows);
        expect(Object.keys(result)).toHaveLength(2);
        expect(result[1].title).toBe('Flow A');
        expect(result[2].enabled).toBe(false);
    });

    it('ALL_FLOWS_EVENT with empty array clears flows', () => {
        flows.set({ 1: { id: 1, title: 'Old', graph: '{}', enabled: false, created_at: '', updated_at: null } });

        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.ALL_FLOWS_EVENT];
        handler({ flows: [] });

        expect(get(flows)).toEqual({});
    });

    it('FLOW_SAVED_EVENT adds new flow', () => {
        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.FLOW_SAVED_EVENT];

        handler({
            flow: { id: 5, title: 'New Flow', graph: '{}', enabled: false, created_at: '2026-03-17', updated_at: null },
        });

        expect(get(flows)[5].title).toBe('New Flow');
    });

    it('FLOW_MODIFIED_EVENT updates existing flow', () => {
        flows.set({
            1: { id: 1, title: 'Original', graph: '{}', enabled: false, created_at: '', updated_at: null },
        });

        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.FLOW_MODIFIED_EVENT];
        handler({
            flow: { id: 1, title: 'Modified', graph: '{"nodes":[]}', enabled: true, created_at: '', updated_at: '2026-03-17' },
        });

        const result = get(flows)[1];
        expect(result.title).toBe('Modified');
        expect(result.enabled).toBe(true);
        expect(result.graph).toBe('{"nodes":[]}');
    });

    it('FLOW_DELETED_EVENT removes flow by id', () => {
        flows.set({
            1: { id: 1, title: 'Keep', graph: '{}', enabled: false, created_at: '', updated_at: null },
            2: { id: 2, title: 'Delete Me', graph: '{}', enabled: false, created_at: '', updated_at: null },
        });

        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.FLOW_DELETED_EVENT];
        handler({ flow_id: 2 });

        const result = get(flows);
        expect(result[1]).toBeDefined();
        expect(result[2]).toBeUndefined();
    });

    it('FLOW_DELETED_EVENT with nonexistent id is safe', () => {
        flows.set({
            1: { id: 1, title: 'Keep', graph: '{}', enabled: false, created_at: '', updated_at: null },
        });

        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.FLOW_DELETED_EVENT];
        handler({ flow_id: 999 });

        expect(Object.keys(get(flows))).toHaveLength(1);
    });

    it('FLOW_TOGGLED_EVENT updates flow', () => {
        flows.set({
            1: { id: 1, title: 'Flow', graph: '{}', enabled: false, created_at: '', updated_at: null },
        });

        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.FLOW_TOGGLED_EVENT];
        handler({
            flow: { id: 1, title: 'Flow', graph: '{}', enabled: true, created_at: '', updated_at: '2026-03-17' },
        });

        expect(get(flows)[1].enabled).toBe(true);
    });
});

describe('WebsocketListenEventMap - Sensors', () => {
    beforeEach(() => {
        sensors.set({});
        last_sensor_reads.set({});
    });

    it('ALL_SENSORS_EVENT populates sensor store', () => {
        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.ALL_SENSORS_EVENT];

        handler({
            sensors: [
                { id: 1, name: 'Temp', sensor_type: 'temperature', ip_address: '127.0.0.1', port: 8685, online: true, created_at: '', updated_at: null },
                { id: 2, name: 'Humidity', sensor_type: 'humidity', ip_address: '127.0.0.1', port: 8686, online: false, created_at: '', updated_at: null },
            ],
        });

        const result = get(sensors);
        expect(Object.keys(result)).toHaveLength(2);
        expect(result[1].sensor_type).toBe('temperature');
    });

    it('SENSOR_REGISTER_EVENT adds new sensor', () => {
        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.SENSOR_REGISTER_EVENT];

        handler({
            sensor_id: 10,
            sensor_name: 'New Sensor',
            sensor_ip_address: '192.168.1.100',
            sensor_port: 8700,
            sensor_type: 'pressure',
            online: true,
            created_at: '2026-03-17',
        });

        expect(get(sensors)[10].name).toBe('New Sensor');
        expect(get(sensors)[10].sensor_type).toBe('pressure');
    });

    it('SENSOR_UNREGISTER_EVENT removes sensor', () => {
        sensors.set({
            1: { id: 1, name: 'S1', sensor_type: 'temperature', ip_address: '', port: 0, online: true, created_at: '', updated_at: null },
        });

        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.SENSOR_UNREGISTER_EVENT];
        handler({ sensor_id: 1 });

        expect(get(sensors)[1]).toBeUndefined();
    });

    it('SENSOR_NAME_CHANGE_EVENT updates sensor name', () => {
        sensors.set({
            1: { id: 1, name: 'Old Name', sensor_type: 'temperature', ip_address: '', port: 0, online: true, created_at: '', updated_at: null },
        });

        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.SENSOR_NAME_CHANGE_EVENT];
        handler({ sensor_id: 1, sensor_name: 'New Name', updated_at: '2026-03-17' });

        expect(get(sensors)[1].name).toBe('New Name');
    });

    it('SENSOR_CHANGE_ONLINE_EVENT updates online status', () => {
        sensors.set({
            1: { id: 1, name: 'S1', sensor_type: 'temperature', ip_address: '', port: 0, online: true, created_at: '', updated_at: null },
        });

        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.SENSOR_CHANGE_ONLINE_EVENT];
        handler({ sensor_id: 1, online: false, updated_at: '2026-03-17' });

        expect(get(sensors)[1].online).toBe(false);
    });

    it('SENSOR_READ_EVENT updates last sensor reads', () => {
        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.SENSOR_READ_EVENT];

        handler({
            id: 100,
            sensor_id: 1,
            sensor_value: '25.5',
            created_at: '2026-03-17T10:00:00',
        });

        expect(get(last_sensor_reads)[1].sensor_value).toBe('25.5');
    });
});

describe('WebsocketListenEventMap - Actuators', () => {
    beforeEach(() => {
        actuators.set({});
    });

    it('ALL_ACTUATORS_EVENT populates actuator store', () => {
        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.ALL_ACTUATORS_EVENT];

        handler({
            actuators: [
                { id: 1, name: 'Fan', ip_address: '127.0.0.1', port: 8684, state: false, online: true, pulse: false, intermittent: false, intermittent_on_ms: 1000, intermittent_off_ms: 1000, created_at: '', updated_at: null },
            ],
        });

        expect(get(actuators)[1].name).toBe('Fan');
    });

    it('ACTUATOR_STATE_CHANGE_EVENT updates state', () => {
        actuators.set({
            1: { id: 1, name: 'Fan', ip_address: '', port: 0, state: false, online: true, pulse: false, intermittent: false, intermittent_on_ms: 1000, intermittent_off_ms: 1000, created_at: '', updated_at: null },
        });

        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.ACTUATOR_STATE_CHANGE_EVENT];
        handler({ actuator_id: 1, actuator_state: true, updated_at: '2026-03-17' });

        expect(get(actuators)[1].state).toBe(true);
    });

    it('ACTUATOR_CHANGE_ONLINE_EVENT updates online status', () => {
        actuators.set({
            1: { id: 1, name: 'Fan', ip_address: '', port: 0, state: false, online: true, pulse: false, intermittent: false, intermittent_on_ms: 1000, intermittent_off_ms: 1000, created_at: '', updated_at: null },
        });

        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.ACTUATOR_CHANGE_ONLINE_EVENT];
        handler({ actuator_id: 1, online: false, updated_at: '2026-03-17' });

        expect(get(actuators)[1].online).toBe(false);
    });

    it('ACTUATOR_REGISTER_EVENT adds new actuator', () => {
        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.ACTUATOR_REGISTER_EVENT];

        handler({
            actuator_id: 5,
            actuator_name: 'Pump',
            actuator_ip_address: '192.168.1.50',
            actuator_port: 8700,
            actuator_state: false,
            actuator_pulse: true,
            online: true,
            created_at: '2026-03-17',
        });

        const act = get(actuators)[5];
        expect(act.name).toBe('Pump');
        expect(act.pulse).toBe(true);
    });

    it('ACTUATOR_UNREGISTER_EVENT removes actuator', () => {
        actuators.set({
            1: { id: 1, name: 'Fan', ip_address: '', port: 0, state: false, online: true, pulse: false, intermittent: false, intermittent_on_ms: 1000, intermittent_off_ms: 1000, created_at: '', updated_at: null },
        });

        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.ACTUATOR_UNREGISTER_EVENT];
        handler({ actuator_id: 1 });

        expect(get(actuators)[1]).toBeUndefined();
    });
});

describe('WebsocketListenEventMap - Scripts', () => {
    beforeEach(() => {
        scripts.set({});
    });

    it('ALL_SCRIPTS_EVENT populates scripts store', () => {
        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.ALL_SCRIPTS_EVENT];

        handler({
            scripts_array: [
                { id: 1, title: 'Script 1', code: 'ACTIVATE 1', schedule: null, status: 0, created_at: '', updated_at: null },
            ],
        });

        expect(get(scripts)[1].title).toBe('Script 1');
    });

    it('SCRIPT_SAVED_EVENT adds script', () => {
        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.SCRIPT_SAVED_EVENT];

        handler({ script: { id: 3, title: 'New Script', code: '', schedule: null, status: 0, created_at: '', updated_at: null } });

        expect(get(scripts)[3].title).toBe('New Script');
    });

    it('SCRIPT_DELETED_EVENT removes script', () => {
        scripts.set({
            1: { id: 1, title: 'S1', code: '', schedule: null, status: 0, created_at: '', updated_at: null },
        });

        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.SCRIPT_DELETED_EVENT];
        handler({ script: { id: 1, title: 'S1', code: '', schedule: null, status: 0, created_at: '', updated_at: null } });

        expect(get(scripts)[1]).toBeUndefined();
    });
});

describe('WebsocketListenEventMap - Messages', () => {
    it('MESSAGE_SENT_EVENT sets dashboard message', () => {
        const handler = WebsocketListenEventMap[WebsocketListenEventEnum.MESSAGE_SENT_EVENT];

        handler({ message: 'Test error', type: 'error' });

        const msg = get(dashboard_message);
        expect(msg?.message).toBe('Test error');
        expect(msg?.type).toBe('error');
    });
});
