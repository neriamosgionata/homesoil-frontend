import {io} from 'socket.io-client';
import type {Socket} from "socket.io";
import WebsocketListenEventMap from "$lib/Websocket/WebsocketListenEventMap";
import WebsocketEmitEventMap from "$lib/Websocket/WebsocketEmitEventMap";
import WebsocketEmitEventEnum from "$lib/Enums/WebsocketEmitEventEnum";
// @ts-ignore
import type {EventParams} from "socket.io/dist/typed-events";
import type WebsocketListenEventEnum from "$lib/Enums/WebsocketListenEventEnum";

import moment from "moment";
import {socket_token} from "$lib/stores/store";
import {get} from 'svelte/store';
import {goto} from "$app/navigation";

export class Websocket {
    private socket!: Socket<
        typeof WebsocketListenEventMap,
        typeof WebsocketEmitEventMap
    >;

    connect() {
        // @ts-ignore
        this.socket = io(
            (location.hostname + ":4000").trim(),
            {
                transports: ["websocket", "polling"],
                upgrade: true,
                rememberUpgrade: true,
                auth: {
                    token: get(socket_token).token
                }
            }
        );

        this.socket.on("disconnect", () => {
            console.log("Disconnected from websocket server");

            goto("/");
        });

        this.registerEventListeners();
    }

    close() {
        this.socket?.disconnect();
    }

    private registerEventListeners() {
        Object
            .entries(WebsocketListenEventMap)
            .forEach(([event, callback]) => {
                this.socket.on(event, callback);
            });
    }

    private emitEvent(event: WebsocketEmitEventEnum, data: EventParams<typeof WebsocketEmitEventMap, WebsocketEmitEventEnum>) {
        this.socket.emit(event, typeof data === "object" && !(data instanceof Date) ? JSON.stringify(data) : data);
    }

    listenToEvent(event: WebsocketListenEventEnum, callback: (...args: any[]) => void) {
        this.socket.on(event, callback);
    }

    removeListenerFromEvent(event: WebsocketListenEventEnum, callback: (...args: any[]) => void) {
        this.socket.off(event, callback);
    }

    getAllSensorReadings(sensor_id: number, from_date: Date, to_date: Date) {
        this.emitEvent(
            WebsocketEmitEventEnum.GET_SENSOR_READINGS_EVENT,
            JSON.stringify({
                id: sensor_id,
                from_date: moment(from_date).format("YYYY-MM-DD HH:mm:ss"),
                to_date: moment(to_date).format("YYYY-MM-DD HH:mm:ss")
            })
        );
    }

    toggleActuator(actuator_id: number) {
        this.emitEvent(WebsocketEmitEventEnum.TOGGLE_ACTUATOR_EVENT, actuator_id);
    }

    pulseActuator(actuator_id: number) {
        this.emitEvent(WebsocketEmitEventEnum.PULSE_ACTUATOR_EVENT, actuator_id);
    }

    renameActuator(actuator_id: number, name: string) {
        this.emitEvent(WebsocketEmitEventEnum.RENAME_ACTUATOR_EVENT, {id: actuator_id, name});
    }

    renameSensor(sensor_id: number, name: string) {
        this.emitEvent(WebsocketEmitEventEnum.RENAME_SENSOR_EVENT, {id: sensor_id, name});
    }
}