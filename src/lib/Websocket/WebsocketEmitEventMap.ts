import WebsocketEmitEventEnum from "../Enums/WebsocketEmitEventEnum";

const WebsocketEmitEventMap: { [p: string]: any } = {
    [WebsocketEmitEventEnum.GET_SENSOR_READINGS_EVENT]: [""],

    [WebsocketEmitEventEnum.RENAME_SENSOR_EVENT]: [""],

    [WebsocketEmitEventEnum.TOGGLE_ACTUATOR_EVENT]: [0],
    [WebsocketEmitEventEnum.PULSE_ACTUATOR_EVENT]: [0],

    [WebsocketEmitEventEnum.RENAME_ACTUATOR_EVENT]: [""],
}

export default WebsocketEmitEventMap;