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

import { flows, sensors, actuators, last_sensor_reads, scripts, socket_token } from './store';

describe('flows store', () => {
    beforeEach(() => {
        flows.set({});
    });

    it('starts empty', () => {
        expect(get(flows)).toEqual({});
    });

    it('can set flows from array-like data', () => {
        const flowsData = [
            { id: 1, title: 'Flow 1', graph: '{}', enabled: true, created_at: '2026-01-01', updated_at: null },
            { id: 2, title: 'Flow 2', graph: '{}', enabled: false, created_at: '2026-01-02', updated_at: null },
        ];

        flows.set(
            flowsData.reduce((acc, flow) => {
                acc[flow.id] = flow;
                return acc;
            }, {} as any)
        );

        const result = get(flows);
        expect(Object.keys(result)).toHaveLength(2);
        expect(result[1].title).toBe('Flow 1');
        expect(result[2].enabled).toBe(false);
    });

    it('can add a flow via update', () => {
        flows.update(f => {
            f[1] = { id: 1, title: 'New Flow', graph: '{}', enabled: false, created_at: '', updated_at: null };
            return { ...f };
        });

        expect(get(flows)[1].title).toBe('New Flow');
    });

    it('can delete a flow via update', () => {
        flows.set({
            1: { id: 1, title: 'Flow 1', graph: '{}', enabled: false, created_at: '', updated_at: null },
            2: { id: 2, title: 'Flow 2', graph: '{}', enabled: false, created_at: '', updated_at: null },
        });

        flows.update(f => {
            delete f[1];
            return { ...f };
        });

        const result = get(flows);
        expect(result[1]).toBeUndefined();
        expect(result[2]).toBeDefined();
    });

    it('can toggle flow enabled state', () => {
        flows.set({
            1: { id: 1, title: 'Flow', graph: '{}', enabled: false, created_at: '', updated_at: null },
        });

        flows.update(f => {
            f[1] = { ...f[1], enabled: true };
            return { ...f };
        });

        expect(get(flows)[1].enabled).toBe(true);
    });

    it('spread creates new reference for reactivity', () => {
        flows.set({
            1: { id: 1, title: 'Flow', graph: '{}', enabled: false, created_at: '', updated_at: null },
        });

        const before = get(flows);

        flows.update(f => {
            f[1] = { ...f[1], title: 'Updated' };
            return { ...f };
        });

        const after = get(flows);
        expect(before).not.toBe(after);
        expect(after[1].title).toBe('Updated');
    });
});

describe('sensors store', () => {
    beforeEach(() => {
        sensors.set({});
    });

    it('starts empty', () => {
        expect(get(sensors)).toEqual({});
    });

    it('can populate from array', () => {
        const data = [
            { id: 1, name: 'Temp', sensor_type: 'temperature', ip_address: '127.0.0.1', port: 8685, online: true, created_at: '', updated_at: null },
        ];

        sensors.set(data.reduce((acc: any, s) => { acc[s.id] = s; return acc; }, {}));
        expect(get(sensors)[1].name).toBe('Temp');
    });
});

describe('actuators store', () => {
    beforeEach(() => {
        actuators.set({});
    });

    it('starts empty', () => {
        expect(get(actuators)).toEqual({});
    });

    it('can set and update actuator state', () => {
        actuators.set({
            1: { id: 1, name: 'Fan', ip_address: '127.0.0.1', port: 8684, state: false, online: true, pulse: false, intermittent: false, intermittent_on_ms: 1000, intermittent_off_ms: 1000, created_at: '', updated_at: null },
        });

        actuators.update(a => {
            a[1] = { ...a[1], state: true };
            return { ...a };
        });

        expect(get(actuators)[1].state).toBe(true);
    });
});

describe('scripts store', () => {
    beforeEach(() => {
        scripts.set({});
    });

    it('starts empty', () => {
        expect(get(scripts)).toEqual({});
    });
});

describe('socket_token store', () => {
    beforeEach(() => {
        socket_token.set({ token: '' });
    });

    it('has default empty token', () => {
        const val = get(socket_token);
        expect(val.token).toBe('');
        expect(val.pin).toBeUndefined();
    });

    it('can store a token', () => {
        socket_token.set({ token: 'abc123' });
        expect(get(socket_token).token).toBe('abc123');
    });

    it('can store a pin for pairing', () => {
        socket_token.set({ token: '', pin: '123456' });
        const val = get(socket_token);
        expect(val.pin).toBe('123456');
        expect(val.token).toBe('');
    });

    it('persists to localStorage', () => {
        socket_token.set({ token: 'persisted_token' });
        const stored = JSON.parse(mockStorage['socket_token'] || '{}');
        expect(stored.token).toBe('persisted_token');
    });

    it('clears pin after receiving token', () => {
        socket_token.set({ token: '', pin: '654321' });
        socket_token.set({ token: 'new_session_token' });
        const val = get(socket_token);
        expect(val.token).toBe('new_session_token');
        expect(val.pin).toBeUndefined();
    });
});
