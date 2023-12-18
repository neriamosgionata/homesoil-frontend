import WebsocketEmitEventEnum from "../Enums/WebsocketEmitEventEnum";

const WebsocketEmitEventMap: { [p: string]: any } = {
    [WebsocketEmitEventEnum.GET_SENSOR_READINGS_EVENT]: 0,
}

export default WebsocketEmitEventMap;