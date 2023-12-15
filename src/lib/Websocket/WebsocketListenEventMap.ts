import WebsocketListenEventEnum from "../Enums/WebsocketListenEventEnum";
import type Sensor from "$lib/Models/Sensor";
import {sensors as sensorStore} from "$lib/stores/store";

const WebsocketListenEventMap: { [p: string]: (...args: any[]) => void } = {
    [WebsocketListenEventEnum.ALL_SENSORS_EVENT]: ({ sensors }: {sensors: Sensor[]}) => {
        sensorStore.set(sensors);
    }
}


export default WebsocketListenEventMap;