import { io } from 'socket.io-client';
import type { Socket } from "socket.io";
import WebsocketListenEventMap from "$lib/websocket/WebsocketListenEventMap";
import WebsocketEmitEventMap from "$lib/websocket/WebsocketEmitEventMap";
import WebsocketEmitEventEnum from "$lib/enums/WebsocketEmitEventEnum";
import type WebsocketListenEventEnum from "$lib/enums/WebsocketListenEventEnum";

import moment from "moment";
import { socket_token } from "$lib/stores/store";
import { get } from 'svelte/store';
import type Script from "$lib/models/Script";
import type Flow from "$lib/models/Flow";
import { goto } from "$app/navigation";

export class Websocket {
  private socket!: Socket<
    typeof WebsocketListenEventMap,
    typeof WebsocketEmitEventMap
  >;

  connect() {
    const serverUrl = `${location.hostname}:4000`;

    const storedAuth = get(socket_token);
    const auth: { token?: string; pin?: string } = {};
    if (storedAuth.token) {
      auth.token = storedAuth.token;
    } else if (storedAuth.pin) {
      auth.pin = storedAuth.pin;
    }

    this.socket = io(
      serverUrl.trim(),
      {
        transports: ["websocket", "polling"],
        upgrade: true,
        rememberUpgrade: true,
        auth,
      }
    ) as unknown as Socket<typeof WebsocketListenEventMap, typeof WebsocketEmitEventMap>;

    this.socket.on("session_token", ({ token }: { token: string }) => {
      socket_token.set({ token });
      console.log("Session token received and stored");
    });

    this.socket.on("disconnect", () => {
      console.log("Disconnected from websocket server");

      goto("/")
        .then(() => {
        })
        .catch(() => {
        });
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

  private emitEvent(event: WebsocketEmitEventEnum, data?: any) {
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

  getAllScripts() {
    this.emitEvent(WebsocketEmitEventEnum.GET_ALL_SCRIPTS_EVENT);
  }

  toggleActuator(actuator_id: number) {
    this.emitEvent(WebsocketEmitEventEnum.TOGGLE_ACTUATOR_EVENT, actuator_id);
  }

  pulseActuator(actuator_id: number) {
    this.emitEvent(WebsocketEmitEventEnum.PULSE_ACTUATOR_EVENT, actuator_id);
  }

  intermittentActuator(actuator_id: number, on_ms: number, off_ms: number) {
    this.emitEvent(WebsocketEmitEventEnum.INTERMITTENT_ACTUATOR_EVENT, { actuator_id, on_ms, off_ms });
  }

  stopIntermittentActuator(actuator_id: number) {
    this.emitEvent(WebsocketEmitEventEnum.STOP_INTERMITTENT_ACTUATOR_EVENT, actuator_id);
  }

  renameActuator(actuator_id: number, name: string) {
    this.emitEvent(WebsocketEmitEventEnum.RENAME_ACTUATOR_EVENT, { id: actuator_id, name });
  }

  renameSensor(sensor_id: number, name: string) {
    this.emitEvent(WebsocketEmitEventEnum.RENAME_SENSOR_EVENT, { id: sensor_id, name });
  }

  removeActuator(actuator_id: number) {
    this.emitEvent(WebsocketEmitEventEnum.REMOVE_ACTUATOR_EVENT, { id: actuator_id });
  }

  removeSensor(sensor_id: number) {
    this.emitEvent(WebsocketEmitEventEnum.REMOVE_SENSOR_EVENT, { id: sensor_id });
  }

  addScript(script: Partial<Script>) {
    this.emitEvent(WebsocketEmitEventEnum.ADD_SCRIPT_EVENT, script);
  }

  removeScript(script_id: number) {
    this.emitEvent(WebsocketEmitEventEnum.REMOVE_SCRIPT_EVENT, { id: script_id });
  }

  modifyScript(script: Script) {
    this.emitEvent(WebsocketEmitEventEnum.MODIFY_SCRIPT_EVENT, script);
  }

  addScriptSchedule(script: Partial<Script>) {
    this.emitEvent(WebsocketEmitEventEnum.ADD_SCRIPT_SCHEDULE_EVENT, script);
  }

  removeScriptSchedule(script_id: number) {
    this.emitEvent(WebsocketEmitEventEnum.REMOVE_SCRIPT_SCHEDULE_EVENT, { id: script_id });
  }

  runScript(script_id: number) {
    this.emitEvent(WebsocketEmitEventEnum.RUN_SCRIPT_EVENT, script_id);
  }

  addFlow(flow: Partial<Flow>) {
    this.emitEvent(WebsocketEmitEventEnum.ADD_FLOW_EVENT, flow);
  }

  modifyFlow(flow: Flow) {
    this.emitEvent(WebsocketEmitEventEnum.MODIFY_FLOW_EVENT, flow);
  }

  removeFlow(flow_id: number) {
    this.emitEvent(WebsocketEmitEventEnum.REMOVE_FLOW_EVENT, flow_id);
  }

  toggleFlow(flow_id: number, enabled: boolean) {
    this.emitEvent(WebsocketEmitEventEnum.TOGGLE_FLOW_EVENT, { id: flow_id, enabled });
  }
}
