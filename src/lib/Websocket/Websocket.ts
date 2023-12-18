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

    close() {
        this.socket?.disconnect();
    }

    private register_callbacks() {
        Object
            .entries(WebsocketListenEventMap)
            .forEach(([event, callback]) => {
                console.log("Registering callback for event", event);
                this.socket.on(event, callback);
            });
    }

    private emit_event(event: WebsocketEmitEventEnum, data?: EventParams<typeof WebsocketEmitEventMap, WebsocketEmitEventEnum>) {
        this.socket.emit(event, data);
    }
}