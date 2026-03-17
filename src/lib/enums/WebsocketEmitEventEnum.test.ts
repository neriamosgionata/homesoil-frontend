import { describe, it, expect } from 'vitest';
import WebsocketEmitEventEnum from './WebsocketEmitEventEnum';

describe('WebsocketEmitEventEnum', () => {
    it('has all flow events', () => {
        expect(WebsocketEmitEventEnum.ADD_FLOW_EVENT).toBe('add-flow');
        expect(WebsocketEmitEventEnum.MODIFY_FLOW_EVENT).toBe('modify-flow');
        expect(WebsocketEmitEventEnum.REMOVE_FLOW_EVENT).toBe('remove-flow');
        expect(WebsocketEmitEventEnum.TOGGLE_FLOW_EVENT).toBe('toggle-flow');
    });

    it('has all sensor events', () => {
        expect(WebsocketEmitEventEnum.GET_SENSOR_READINGS_EVENT).toBe('get-sensor-readings');
        expect(WebsocketEmitEventEnum.RENAME_SENSOR_EVENT).toBe('rename-sensor');
        expect(WebsocketEmitEventEnum.REMOVE_SENSOR_EVENT).toBe('remove-sensor');
    });

    it('has all actuator events', () => {
        expect(WebsocketEmitEventEnum.TOGGLE_ACTUATOR_EVENT).toBe('toggle-actuator');
        expect(WebsocketEmitEventEnum.PULSE_ACTUATOR_EVENT).toBe('pulse-actuator');
        expect(WebsocketEmitEventEnum.RENAME_ACTUATOR_EVENT).toBe('rename-actuator');
        expect(WebsocketEmitEventEnum.REMOVE_ACTUATOR_EVENT).toBe('remove-actuator');
    });

    it('has all script events', () => {
        expect(WebsocketEmitEventEnum.RUN_SCRIPT_EVENT).toBe('run-script');
        expect(WebsocketEmitEventEnum.ADD_SCRIPT_EVENT).toBe('add-script');
        expect(WebsocketEmitEventEnum.REMOVE_SCRIPT_EVENT).toBe('remove-script');
        expect(WebsocketEmitEventEnum.MODIFY_SCRIPT_EVENT).toBe('modify-script');
        expect(WebsocketEmitEventEnum.ADD_SCRIPT_SCHEDULE_EVENT).toBe('add-script-schedule');
        expect(WebsocketEmitEventEnum.REMOVE_SCRIPT_SCHEDULE_EVENT).toBe('remove-script-schedule');
    });

    it('all event values are unique', () => {
        const values = Object.values(WebsocketEmitEventEnum);
        const unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });
});
