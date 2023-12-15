import {io} from 'socket.io-client';
import {Socket} from "socket.io";
import WebsocketListenEventMap from "$lib/Websocket/WebsocketListenEventMap";
import WebsocketEmitEventMap from "$lib/Websocket/WebsocketEmitEventMap";
import WebsocketEmitEventEnum from "$lib/Enums/WebsocketEmitEventEnum";
// @ts-ignore
import type {EventParams} from "socket.io/dist/typed-events";

export class Websocket {
    private socket!: Socket<
        typeof WebsocketListenEventMap,
        typeof WebsocketEmitEventMap
    >;

    init() {
        try {
            // @ts-ignore
            this.socket = io(
                (import.meta.env.VITE_SOCKET_ENDPOINT || "http://localhost:4000/").trim()
            );
            this.register_callbacks();
        } catch (e) {
            console.error("Error while initializing SocketIO", e);
        }
    }

    private register_callbacks() {
        Object
            .entries(WebsocketListenEventMap)
            .forEach(([event, callback]) => {
                this.socket.on(event, callback);
            });
    }

    private emit_event(event: WebsocketEmitEventEnum, data?: EventParams<typeof WebsocketEmitEventMap, WebsocketEmitEventEnum>) {
        this.socket.emit(event, data);
    }

    public get_sensors() {
        this.emit_event(WebsocketEmitEventEnum.GET_SENSORS_EVENT);
    }

    public get_sensor_data(sensor_id: number) {
        this.emit_event(WebsocketEmitEventEnum.GET_SENSOR_DATA_EVENT, sensor_id);
    }

}