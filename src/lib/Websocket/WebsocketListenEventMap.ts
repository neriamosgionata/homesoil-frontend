import WebsocketListenEventEnum from "../Enums/WebsocketListenEventEnum";
import type Sensor from "$lib/Models/Sensor";
import {sensor_reads as sensorReadStore, sensors as sensorStore} from "$lib/stores/store";
import type SensorRead from "$lib/Models/SensorRead";

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

    [WebsocketListenEventEnum.ALL_SENSOR_READINGS_EVENT]: ({sensor_reads}: { sensor_reads: SensorRead[] }) => {
        console.log("Received all sensor reads");
        sensorReadStore.set(
            sensor_reads.reduce((acc, sensor_read) => {
                acc[sensor_read.sensor_id] = acc[sensor_read.sensor_id] || [];
                acc[sensor_read.sensor_id].push(sensor_read);
                return acc;
            }, {} as { [p: string]: SensorRead[] })
        );
    },

    [WebsocketListenEventEnum.SENSOR_REGISTER_EVENT]: (
        {
            sensor_id,
            sensor_name,
            sensor_ip_address,
            sensor_type,
            created_at,
        }: {
            sensor_id: number,
            sensor_name: string,
            sensor_ip_address: string,
            sensor_type: string,
            created_at: string,
        }) => {
        console.log("Received sensor register event");
        sensorStore.update(sensors => {
            sensors[sensor_id] = {
                id: sensor_id,
                name: sensor_name,
                ip_address: sensor_ip_address,
                sensor_type,
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
            sensor_id,
            sensor_value,
            created_at,
        }: {
            sensor_id: number,
            sensor_value: string,
            created_at: string,
        }
    ) => {
        console.log("Received sensor read event");
        sensorReadStore.update(reads => {
            reads[sensor_id] = reads[sensor_id] || [];
            reads[sensor_id].push({
                id: reads[sensor_id].length,
                sensor_id,
                sensor_value,
                created_at,
                updated_at: null,
            });
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

    [WebsocketListenEventEnum.SENSOR_READS_EVENT]: ({sensor_reads, sensor_id}: {
        sensor_reads: SensorRead[],
        sensor_id: string
    }) => {
        console.log("Received sensor reads event");
        sensorReadStore.update(reads => {
            reads[sensor_id] = sensor_reads;
            return {...reads};
        });
    }
};

export default WebsocketListenEventMap;