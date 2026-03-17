import { describe, it, expect } from 'vitest';
import WebsocketListenEventEnum from './WebsocketListenEventEnum';

describe('WebsocketListenEventEnum', () => {
    it('has all flow events', () => {
        expect(WebsocketListenEventEnum.ALL_FLOWS_EVENT).toBe('all-flows');
        expect(WebsocketListenEventEnum.FLOW_SAVED_EVENT).toBe('flow-saved');
        expect(WebsocketListenEventEnum.FLOW_MODIFIED_EVENT).toBe('flow-modified');
        expect(WebsocketListenEventEnum.FLOW_DELETED_EVENT).toBe('flow-deleted');
        expect(WebsocketListenEventEnum.FLOW_TOGGLED_EVENT).toBe('flow-toggled');
    });

    it('has all sensor events', () => {
        expect(WebsocketListenEventEnum.ALL_SENSORS_EVENT).toBe('all-sensors');
        expect(WebsocketListenEventEnum.SENSOR_REGISTER_EVENT).toBe('sensor-register');
        expect(WebsocketListenEventEnum.SENSOR_UNREGISTER_EVENT).toBe('sensor-unregister');
        expect(WebsocketListenEventEnum.SENSOR_READ_EVENT).toBe('sensor-read');
        expect(WebsocketListenEventEnum.SENSOR_NAME_CHANGE_EVENT).toBe('sensor-name-change');
        expect(WebsocketListenEventEnum.SENSOR_CHANGE_ONLINE_EVENT).toBe('sensor-change-online');
    });

    it('has all actuator events', () => {
        expect(WebsocketListenEventEnum.ALL_ACTUATORS_EVENT).toBe('all-actuators');
        expect(WebsocketListenEventEnum.ACTUATOR_REGISTER_EVENT).toBe('actuator-register');
        expect(WebsocketListenEventEnum.ACTUATOR_UNREGISTER_EVENT).toBe('actuator-unregister');
        expect(WebsocketListenEventEnum.ACTUATOR_NAME_CHANGE_EVENT).toBe('actuator-name-change');
        expect(WebsocketListenEventEnum.ACTUATOR_STATE_CHANGE_EVENT).toBe('actuator-state-change');
        expect(WebsocketListenEventEnum.ACTUATOR_CHANGE_ONLINE_EVENT).toBe('actuator-change-online');
    });

    it('has all script events', () => {
        expect(WebsocketListenEventEnum.ALL_SCRIPTS_EVENT).toBe('all-scripts');
        expect(WebsocketListenEventEnum.SCRIPT_SAVED_EVENT).toBe('script-saved');
        expect(WebsocketListenEventEnum.SCRIPT_DELETED_EVENT).toBe('script-deleted');
        expect(WebsocketListenEventEnum.SCRIPT_MODIFIED_EVENT).toBe('script-modified');
        expect(WebsocketListenEventEnum.SCRIPT_STATUS_CHANGE_EVENT).toBe('script-status-change');
        expect(WebsocketListenEventEnum.SCRIPT_SCHEDULE_ADDED_EVENT).toBe('script-schedule-added');
        expect(WebsocketListenEventEnum.SCRIPT_SCHEDULE_REMOVED_EVENT).toBe('script-schedule-removed');
    });

    it('all event values are unique', () => {
        const values = Object.values(WebsocketListenEventEnum);
        const unique = new Set(values);
        expect(unique.size).toBe(values.length);
    });

    it('listen and emit events do not collide', () => {
        const listenValues = Object.values(WebsocketListenEventEnum);
        // Spot-check some known emit events
        expect(listenValues).not.toContain('add-flow');
        expect(listenValues).not.toContain('toggle-actuator');
        expect(listenValues).not.toContain('run-script');
    });
});
