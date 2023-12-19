import WebsocketListenEventEnum from "../Enums/WebsocketListenEventEnum";
import type Sensor from "$lib/Models/Sensor";
import {
    actuators as actuatorStore,
    last_sensor_reads as lastSensorsReadStore,
    sensor_reads as sensorReadStore,
    sensors as sensorStore,
} from "$lib/stores/store";
import type SensorRead from "$lib/Models/SensorRead";
import type SensorTypeEnum from "$lib/Enums/SensorTypeEnum";
import type Actuator from "$lib/Models/Actuator";

const WebsocketListenEventMap: { [p: string]: (...args: any[]) => void } = {
    [WebsocketListenEventEnum.ALL_SENSORS_EVENT]: ({sensors}: { sensors: Sensor[] }) => {
        sensorStore.set(
            sensors.reduce((acc, sensor) => {
                acc[sensor.id] = sensor;
                return acc;
            }, {} as { [p: string]: Sensor })
        );
    },

    [WebsocketListenEventEnum.ALL_LAST_SENSOR_READINGS_EVENT]: ({sensor_reads}: { sensor_reads: SensorRead[] }) => {
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
            sensor_port,
            sensor_type,
            online,
            created_at,
        }: {
            sensor_id: number,
            sensor_name: string,
            sensor_ip_address: string,
            sensor_port: number,
            sensor_type: SensorTypeEnum,
            online: boolean,
            created_at: string,
        }) => {
        sensorStore.update(sensors => {
            sensors[sensor_id] = {
                id: sensor_id,
                name: sensor_name,
                ip_address: sensor_ip_address,
                port: sensor_port,
                sensor_type,
                online,
                created_at,
                updated_at: null,
            };
            return {...sensors};
        });
    },

    [WebsocketListenEventEnum.SENSOR_UNREGISTER_EVENT]: ({sensor_id}: { sensor_id: number }) => {
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

    [WebsocketListenEventEnum.SENSOR_CHANGE_ONLINE_EVENT]: ({sensor_id, online, updated_at}: {
        sensor_id: number,
        online: boolean,
        updated_at: string,
    }) => {
        sensorStore.update(sensors => {
            const sensor = sensors[sensor_id];
            if (sensor) {
                sensor.online = online;
                sensor.updated_at = updated_at;
                sensors[sensor_id] = sensor;
            }
            return {...sensors};
        });
    },

    [WebsocketListenEventEnum.ALL_SENSOR_READINGS]: ({sensor_reads}: { sensor_reads: SensorRead[] }) => {
        sensorReadStore.set(sensor_reads);
    },

    [WebsocketListenEventEnum.ALL_ACTUATORS_EVENT]: ({actuators}: { actuators: Actuator[] }) => {
        actuatorStore.set(
            actuators.reduce((acc, actuator) => {
                acc[actuator.id] = actuator;
                return acc;
            }, {} as { [p: string]: Actuator })
        );
    },

    [WebsocketListenEventEnum.ACTUATOR_REGISTER_EVENT]: (
        {
            actuator_id,
            actuator_name,
            actuator_ip_address,
            actuator_port,
            actuator_state,
            actuator_pulse,
            online,
            created_at,
        }: {
            actuator_id: number,
            actuator_name: string,
            actuator_ip_address: string,
            actuator_port: number,
            actuator_state: boolean,
            actuator_pulse: boolean,
            online: boolean,
            created_at: string,
        }) => {
        actuatorStore.update(actuators => {
            actuators[actuator_id] = {
                id: actuator_id,
                name: actuator_name,
                ip_address: actuator_ip_address,
                port: actuator_port,
                state: actuator_state,
                pulse: actuator_pulse,
                online,
                created_at,
                updated_at: null,
            };
            return {...actuators};
        });
    },

    [WebsocketListenEventEnum.ACTUATOR_UNREGISTER_EVENT]: ({actuator_id}: { actuator_id: number }) => {
        actuatorStore.update(actuators => {
            delete actuators[actuator_id];
            return actuators;
        });
    },

    [WebsocketListenEventEnum.ACTUATOR_NAME_CHANGE_EVENT]: ({actuator_id, actuator_name, updated_at}: {
        actuator_id: number,
        actuator_name: string,
        updated_at: string,
    }) => {
        actuatorStore.update(actuators => {
            const actuator = actuators[actuator_id];
            if (actuator) {
                actuator.name = actuator_name;
                actuator.updated_at = updated_at;
                actuators[actuator_id] = actuator;
            }
            return {...actuators};
        });
    },

    [WebsocketListenEventEnum.ACTUATOR_STATE_CHANGE_EVENT]: ({actuator_id, actuator_state, updated_at}: {
        actuator_id: number,
        actuator_state: boolean,
        updated_at: string,
    }) => {
        actuatorStore.update(actuators => {
            const actuator = actuators[actuator_id];
            if (actuator) {
                actuator.state = actuator_state;
                actuator.updated_at = updated_at;
                actuators[actuator_id] = actuator;
            }
            return {...actuators};
        });
    },

    [WebsocketListenEventEnum.ACTUATOR_CHANGE_ONLINE_EVENT]: ({actuator_id, online, updated_at}: {
        actuator_id: number,
        online: boolean,
        updated_at: string,
    }) => {
        actuatorStore.update(actuators => {
            const actuator = actuators[actuator_id];
            if (actuator) {
                actuator.online = online;
                actuator.updated_at = updated_at;
                actuators[actuator_id] = actuator;
            }
            return {...actuators};
        });
    },
};

export default WebsocketListenEventMap;