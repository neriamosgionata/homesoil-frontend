import {io} from 'socket.io-client';
import {Socket} from "socket.io";
import WebsocketListenEventMap from "$lib/Websocket/WebsocketListenEventMap";
import WebsocketEmitEventMap from "$lib/Websocket/WebsocketEmitEventMap";
import WebsocketEmitEventEnum from "$lib/Enums/WebsocketEmitEventEnum";
// @ts-ignore
import type {EventParams} from "socket.io/dist/typed-events";
import type WebsocketListenEventEnum from "$lib/Enums/WebsocketListenEventEnum";

export class Websocket {
    private socket!: Socket<
        typeof WebsocketListenEventMap,
        typeof WebsocketEmitEventMap
    >;

    init() {
        try {
            // @ts-ignore
            this.socket = io(
                (import.meta.env.VITE_SOCKET_ENDPOINT || "http://localhost:4000/").trim(),
                {
                    upgrade: true,
                    rememberUpgrade: true,
                }
            );

            this.registerEventListeners();
        } catch (e) {
            console.error("Error while initializing SocketIO", e);
        }
    }

    close() {
        this.socket?.disconnect();
    }

    private registerEventListeners() {
        Object
            .entries(WebsocketListenEventMap)
            .forEach(([event, callback]) => {
                console.log("Registering callback for event", event);
                this.socket.on(event, callback);
            });
    }

    private emitEvent(event: WebsocketEmitEventEnum, data: EventParams<typeof WebsocketEmitEventMap, WebsocketEmitEventEnum>) {
        this.socket?.emit(event, data);
    }

    getAllSensorReadings(sensor_id: number) {
        this.emitEvent(WebsocketEmitEventEnum.GET_SENSOR_READINGS_EVENT, sensor_id);
    }

    toggleActuator(actuator_id: number) {
        this.emitEvent(WebsocketEmitEventEnum.TOGGLE_ACTUATOR_EVENT, actuator_id);
    }

    pulseActuator(actuator_id: number) {
        this.emitEvent(WebsocketEmitEventEnum.PULSE_ACTUATOR_EVENT, actuator_id);
    }

    listenToEvent(event: WebsocketListenEventEnum, callback: (...args: any[]) => void) {
        this.socket?.on(event, callback);
    }

    removeListenerFromEvent(event: WebsocketListenEventEnum, callback: (...args: any[]) => void) {
        this.socket?.off(event, callback);
    }
}