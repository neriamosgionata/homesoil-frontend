import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';

vi.mock('secure-ls', () => {
    return {
        default: class {
            get() { return null; }
            set() {}
        }
    };
});

import { flows, sensors, actuators, last_sensor_reads, scripts } from './store';

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
        expect(before).not.toBe(after); // Different reference
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
            1: { id: 1, name: 'Fan', ip_address: '127.0.0.1', port: 8684, state: false, online: true, pulse: false, created_at: '', updated_at: null },
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
