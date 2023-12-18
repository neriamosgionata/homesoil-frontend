import WebsocketListenEventEnum from "../Enums/WebsocketListenEventEnum";
import type Sensor from "$lib/Models/Sensor";
import {
    last_sensor_reads as lastSensorsReadStore,
    sensor_reads as sensorReadStore,
    sensors as sensorStore
} from "$lib/stores/store";
import type SensorRead from "$lib/Models/SensorRead";
import type SensorTypeEnum from "$lib/Enums/SensorTypeEnum";

const WebsocketListenEventMap: { [p: string]: (...args: any[]) => void } = {
    [WebsocketListenEventEnum.ALL_SENSORS_EVENT]: ({sensors}: { sensors: Sensor[] }) => {
        console.log("Received all sensors");
        sensorStore.set(
            sensors.reduce((acc, sensor) => {
                acc[sensor.id] = sensor;
                return acc;
            }, {} as { [p: string]: Sensor })
        );
    },

    [WebsocketListenEventEnum.ALL_LAST_SENSOR_READINGS_EVENT]: ({sensor_reads}: { sensor_reads: SensorRead[] }) => {
        console.log("Received all last sensor reads");
        lastSensorsReadStore.set(
            sensor_reads.reduce((acc, read) => {
                acc[read.sensor_id] = read;
                return acc;
            }, {} as { [p: string]: SensorRead })
        );
    },

    [WebsocketListenEventEnum.SENSOR_REGISTER_EVENT]: (
        {
            sensor_id,
            sensor_name,
            sensor_ip_address,
            sensor_type,
            online,
            created_at,
        }: {
            sensor_id: number,
            sensor_name: string,
            sensor_ip_address: string,
            sensor_type: SensorTypeEnum,
            online: boolean,
            created_at: string,
        }) => {
        console.log("Received sensor register event");
        sensorStore.update(sensors => {
            sensors[sensor_id] = {
                id: sensor_id,
                name: sensor_name,
                ip_address: sensor_ip_address,
                sensor_type,
                online,
                created_at,
                updated_at: null,
            };
            return {...sensors};
        });
    },

    [WebsocketListenEventEnum.SENSOR_UNREGISTER_EVENT]: ({sensor_id}: { sensor_id: number }) => {
        console.log("Received sensor unregister event");
        sensorStore.update(sensors => {
            delete sensors[sensor_id];
            return sensors;
        });
    },

    [WebsocketListenEventEnum.SENSOR_READ_EVENT]: (
        {
            id,
            sensor_id,
            sensor_value,
            created_at,
        }: {
            id: number,
            sensor_id: number,
            sensor_value: string,
            created_at: string,
        }
    ) => {
        console.log("Received sensor read event");
        lastSensorsReadStore.update(reads => {
            reads[sensor_id] = {
                id,
                sensor_id,
                sensor_value,
                created_at,
                updated_at: null,
            };
            return {...reads};
        });
    },

    [WebsocketListenEventEnum.SENSOR_NAME_CHANGE_EVENT]: ({sensor_id, sensor_name, updated_at}: {
        sensor_id: number,
        sensor_name: string,
        updated_at: string,
    }) => {
        console.log("Received sensor name change event");
        sensorStore.update(sensors => {
            const sensor = sensors[sensor_id];
            if (sensor) {
                sensor.name = sensor_name;
                sensor.updated_at = updated_at;
                sensors[sensor_id] = sensor;
            }
            return {...sensors};
        });
    },

    [WebsocketListenEventEnum.ALL_SENSOR_READINGS]: ({sensor_reads}: { sensor_reads: SensorRead[] }) => {
        sensorReadStore.set(sensor_reads);
    },
};

export default WebsocketListenEventMap;