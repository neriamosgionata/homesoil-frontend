import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { Websocket } from './Websocket';
import WebsocketEmitEventEnum from '$lib/enums/WebsocketEmitEventEnum';
import type Flow from '$lib/models/Flow';
import type Script from '$lib/models/Script';

// Mock localStorage for persistentWritable
const mockStorage: Record<string, string> = {};
vi.stubGlobal('localStorage', {
    getItem: (key: string) => mockStorage[key] ?? null,
    setItem: (key: string, value: string) => { mockStorage[key] = value; },
    removeItem: (key: string) => { delete mockStorage[key]; },
    clear: () => { Object.keys(mockStorage).forEach(k => delete mockStorage[k]); },
});

// Mock $app/navigation
vi.mock('$app/navigation', () => ({
    goto: vi.fn(() => Promise.resolve())
}));

// Mock socket.io-client
const mockSocket = {
    on: vi.fn(),
    emit: vi.fn(),
    disconnect: vi.fn(),
    off: vi.fn(),
};

vi.mock('socket.io-client', () => ({
    io: vi.fn(() => mockSocket)
}));

describe('Websocket', () => {
    let websocket: Websocket;

    beforeEach(() => {
        vi.clearAllMocks();
        websocket = new Websocket();
        websocket.connect();
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    describe('addFlow', () => {
        it('calls emitEvent with ADD_FLOW_EVENT and flow data', () => {
            const flow: Partial<Flow> = {
                title: 'Test Flow',
                graph: '{"nodes":[]}',
                enabled: true
            };

            websocket.addFlow(flow);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.ADD_FLOW_EVENT,
                JSON.stringify(flow)
            );
        });

        it('handles empty flow object', () => {
            const flow: Partial<Flow> = {};

            websocket.addFlow(flow);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.ADD_FLOW_EVENT,
                JSON.stringify(flow)
            );
        });
    });

    describe('modifyFlow', () => {
        it('calls emitEvent with MODIFY_FLOW_EVENT and flow data', () => {
            const flow: Flow = {
                id: 1,
                title: 'Modified Flow',
                graph: '{"nodes":[{"id":"1"}]}',
                enabled: false,
                created_at: '2026-01-01',
                updated_at: '2026-03-17'
            };

            websocket.modifyFlow(flow);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.MODIFY_FLOW_EVENT,
                JSON.stringify(flow)
            );
        });
    });

    describe('removeFlow', () => {
        it('calls emitEvent with REMOVE_FLOW_EVENT and flow id', () => {
            const flowId = 42;

            websocket.removeFlow(flowId);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.REMOVE_FLOW_EVENT,
                flowId
            );
        });

        it('handles id of 0', () => {
            websocket.removeFlow(0);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.REMOVE_FLOW_EVENT,
                0
            );
        });
    });

    describe('toggleFlow', () => {
        it('calls emitEvent with TOGGLE_FLOW_EVENT and correct data when enabling', () => {
            const flowId = 5;
            const enabled = true;

            websocket.toggleFlow(flowId, enabled);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.TOGGLE_FLOW_EVENT,
                JSON.stringify({ id: flowId, enabled })
            );
        });

        it('calls emitEvent with TOGGLE_FLOW_EVENT and correct data when disabling', () => {
            const flowId = 10;
            const enabled = false;

            websocket.toggleFlow(flowId, enabled);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.TOGGLE_FLOW_EVENT,
                JSON.stringify({ id: flowId, enabled })
            );
        });
    });

    describe('runScript', () => {
        it('calls emitEvent with RUN_SCRIPT_EVENT and script id', () => {
            const scriptId = 7;

            websocket.runScript(scriptId);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.RUN_SCRIPT_EVENT,
                scriptId
            );
        });
    });

    describe('toggleActuator', () => {
        it('calls emitEvent with TOGGLE_ACTUATOR_EVENT and actuator id', () => {
            const actuatorId = 3;

            websocket.toggleActuator(actuatorId);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.TOGGLE_ACTUATOR_EVENT,
                actuatorId
            );
        });
    });

    describe('pulseActuator', () => {
        it('calls emitEvent with PULSE_ACTUATOR_EVENT and actuator id', () => {
            const actuatorId = 8;

            websocket.pulseActuator(actuatorId);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.PULSE_ACTUATOR_EVENT,
                actuatorId
            );
        });
    });

    describe('renameSensor', () => {
        it('calls emitEvent with RENAME_SENSOR_EVENT and correct data', () => {
            const sensorId = 12;
            const name = 'Temperature Sensor 1';

            websocket.renameSensor(sensorId, name);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.RENAME_SENSOR_EVENT,
                JSON.stringify({ id: sensorId, name })
            );
        });

        it('handles empty name string', () => {
            const sensorId = 15;
            const name = '';

            websocket.renameSensor(sensorId, name);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.RENAME_SENSOR_EVENT,
                JSON.stringify({ id: sensorId, name })
            );
        });
    });

    describe('renameActuator', () => {
        it('calls emitEvent with RENAME_ACTUATOR_EVENT and correct data', () => {
            const actuatorId = 20;
            const name = 'Water Pump';

            websocket.renameActuator(actuatorId, name);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.RENAME_ACTUATOR_EVENT,
                JSON.stringify({ id: actuatorId, name })
            );
        });

        it('handles special characters in name', () => {
            const actuatorId = 25;
            const name = 'Actuator #1 (Main)';

            websocket.renameActuator(actuatorId, name);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.RENAME_ACTUATOR_EVENT,
                JSON.stringify({ id: actuatorId, name })
            );
        });
    });

    describe('removeActuator', () => {
        it('calls emitEvent with REMOVE_ACTUATOR_EVENT and correct data', () => {
            const actuatorId = 30;

            websocket.removeActuator(actuatorId);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.REMOVE_ACTUATOR_EVENT,
                JSON.stringify({ id: actuatorId })
            );
        });
    });

    describe('removeSensor', () => {
        it('calls emitEvent with REMOVE_SENSOR_EVENT and correct data', () => {
            const sensorId = 35;

            websocket.removeSensor(sensorId);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.REMOVE_SENSOR_EVENT,
                JSON.stringify({ id: sensorId })
            );
        });
    });

    describe('addScript', () => {
        it('calls emitEvent with ADD_SCRIPT_EVENT and script data', () => {
            const script: Partial<Script> = {
                title: 'New Script',
                code: 'ACTIVATE 1',
                schedule: null,
                status: 0
            };

            websocket.addScript(script);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.ADD_SCRIPT_EVENT,
                JSON.stringify(script)
            );
        });
    });

    describe('removeScript', () => {
        it('calls emitEvent with REMOVE_SCRIPT_EVENT and script id', () => {
            const scriptId = 40;

            websocket.removeScript(scriptId);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.REMOVE_SCRIPT_EVENT,
                JSON.stringify({ id: scriptId })
            );
        });
    });

    describe('modifyScript', () => {
        it('calls emitEvent with MODIFY_SCRIPT_EVENT and script data', () => {
            const script: Script = {
                id: 45,
                title: 'Updated Script',
                code: 'DEACTIVATE 1',
                schedule: '0 0 * * *',
                status: 1,
                created_at: '2026-01-01',
                updated_at: '2026-03-17'
            };

            websocket.modifyScript(script);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.MODIFY_SCRIPT_EVENT,
                JSON.stringify(script)
            );
        });
    });

    describe('addScriptSchedule', () => {
        it('calls emitEvent with ADD_SCRIPT_SCHEDULE_EVENT and script data', () => {
            const script: Partial<Script> = {
                id: 50,
                schedule: '0 12 * * *'
            };

            websocket.addScriptSchedule(script);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.ADD_SCRIPT_SCHEDULE_EVENT,
                JSON.stringify(script)
            );
        });
    });

    describe('removeScriptSchedule', () => {
        it('calls emitEvent with REMOVE_SCRIPT_SCHEDULE_EVENT and script id', () => {
            const scriptId = 55;

            websocket.removeScriptSchedule(scriptId);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.REMOVE_SCRIPT_SCHEDULE_EVENT,
                JSON.stringify({ id: scriptId })
            );
        });
    });

    describe('getAllScripts', () => {
        it('calls emitEvent with GET_ALL_SCRIPTS_EVENT', () => {
            websocket.getAllScripts();

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.GET_ALL_SCRIPTS_EVENT,
                undefined
            );
        });
    });

    describe('getAllSensorReadings', () => {
        it('calls emitEvent with GET_SENSOR_READINGS_EVENT and formatted dates', () => {
            const sensorId = 60;
            const fromDate = new Date('2026-03-01T00:00:00');
            const toDate = new Date('2026-03-17T23:59:59');

            websocket.getAllSensorReadings(sensorId, fromDate, toDate);

            expect(mockSocket.emit).toHaveBeenCalledTimes(1);
            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.GET_SENSOR_READINGS_EVENT,
                expect.stringContaining('"id":60')
            );

            const callArg = mockSocket.emit.mock.calls[0][1];
            const parsed = JSON.parse(callArg);
            expect(parsed.id).toBe(sensorId);
            expect(parsed.from_date).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
            expect(parsed.to_date).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });
    });

    describe('close', () => {
        it('calls socket disconnect method', () => {
            websocket.close();

            expect(mockSocket.disconnect).toHaveBeenCalledTimes(1);
        });

        it('handles multiple close calls safely', () => {
            websocket.close();
            websocket.close();

            expect(mockSocket.disconnect).toHaveBeenCalledTimes(2);
        });
    });

    describe('listenToEvent', () => {
        it('registers event listener on socket', () => {
            const callback = vi.fn();
            const event = 'test-event' as any;

            websocket.listenToEvent(event, callback);

            expect(mockSocket.on).toHaveBeenCalledWith(event, callback);
        });
    });

    describe('removeListenerFromEvent', () => {
        it('removes event listener from socket', () => {
            const callback = vi.fn();
            const event = 'test-event' as any;

            websocket.removeListenerFromEvent(event, callback);

            expect(mockSocket.off).toHaveBeenCalledWith(event, callback);
        });
    });

    describe('emitEvent behavior', () => {
        it('stringifies object data', () => {
            const data = { key: 'value', number: 123 };
            websocket.addFlow(data as any);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                expect.any(String),
                JSON.stringify(data)
            );
        });

        it('does not stringify Date objects', () => {
            // Date objects should not be stringified by emitEvent logic
            // This is tested indirectly through getAllSensorReadings which handles dates specially
            const sensorId = 1;
            const fromDate = new Date('2026-03-01');
            const toDate = new Date('2026-03-17');

            websocket.getAllSensorReadings(sensorId, fromDate, toDate);

            const callArg = mockSocket.emit.mock.calls[0][1];
            // The data should be stringified JSON with formatted date strings
            expect(typeof callArg).toBe('string');
            const parsed = JSON.parse(callArg);
            expect(typeof parsed.from_date).toBe('string');
        });

        it('does not stringify primitive values', () => {
            websocket.runScript(123);

            expect(mockSocket.emit).toHaveBeenCalledWith(
                WebsocketEmitEventEnum.RUN_SCRIPT_EVENT,
                123
            );
        });
    });
});
