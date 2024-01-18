import WebsocketEmitEventEnum from "$lib/enums/WebsocketEmitEventEnum";

const WebsocketEmitEventMap: { [p: string]: any } = {
    [WebsocketEmitEventEnum.GET_SENSOR_READINGS_EVENT]: [""],

    [WebsocketEmitEventEnum.RENAME_SENSOR_EVENT]: [""],

    [WebsocketEmitEventEnum.TOGGLE_ACTUATOR_EVENT]: [0],
    [WebsocketEmitEventEnum.PULSE_ACTUATOR_EVENT]: [0],

    [WebsocketEmitEventEnum.RENAME_ACTUATOR_EVENT]: [""],

    [WebsocketEmitEventEnum.RUN_SCRIPT_EVENT]: [""],

    [WebsocketEmitEventEnum.ADD_SCRIPT_EVENT]: [""],
    [WebsocketEmitEventEnum.REMOVE_SCRIPT_EVENT]: [0],

    [WebsocketEmitEventEnum.MODIFY_SCRIPT_EVENT]: [""],

    [WebsocketEmitEventEnum.ADD_SCRIPT_SCHEDULE_EVENT]: [""],
    [WebsocketEmitEventEnum.REMOVE_SCRIPT_SCHEDULE_EVENT]: [""],
}

export default WebsocketEmitEventMap;