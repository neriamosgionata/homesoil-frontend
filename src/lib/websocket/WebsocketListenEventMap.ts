import WebsocketListenEventEnum from "$lib/enums/WebsocketListenEventEnum";
import type Sensor from "$lib/models/Sensor";
import {
  actuators as actuatorStore,
  dashboard_message,
  flows as flowStore,
  last_sensor_reads as lastSensorsReadStore,
  scripts,
  sensor_reads as sensorReadStore,
  sensor_reads_loading,
  sensors as sensorStore,
} from "$lib/stores/store";
import type SensorRead from "$lib/models/SensorRead";
import type SensorTypeEnum from "$lib/enums/SensorTypeEnum";
import type Actuator from "$lib/models/Actuator";
import type Flow from "$lib/models/Flow";
import { get } from "svelte/store";
import type Script from "$lib/models/Script";
import WebsocketEmitEventEnum from "$lib/enums/WebsocketEmitEventEnum";

const WebsocketListenEventMap: { [p: string]: (...args: any[]) => void } = {
  [WebsocketListenEventEnum.MESSAGE_SENT_EVENT]: ({ message, type }: {
    message: string,
    type: "success" | "error" | "warning" | "info"
  }) => {
    dashboard_message.set({
      message,
      type,
    });
  },

  [WebsocketListenEventEnum.ALL_SENSORS_EVENT]: ({ sensors }: { sensors: Sensor[] }) => {
    sensorStore.set(
      sensors.reduce((acc, sensor) => {
        acc[sensor.id] = sensor;
        return acc;
      }, {} as { [p: string]: Sensor })
    );
  },

  [WebsocketListenEventEnum.ALL_LAST_SENSOR_READINGS_EVENT]: ({ sensor_reads }: { sensor_reads: SensorRead[] }) => {
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
      return { ...sensors };
    });
  },

  [WebsocketListenEventEnum.SENSOR_UNREGISTER_EVENT]: ({ sensor_id }: { sensor_id: number }) => {
    sensorStore.update(sensors => {
      delete sensors[sensor_id];
      return { ...sensors };
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
      return { ...reads };
    });

    if (get(sensorReadStore).length && get(sensorReadStore)[0].sensor_id === sensor_id) {
      sensorReadStore.update(reads => {
        reads.unshift({
          id,
          sensor_id,
          sensor_value,
          created_at,
          updated_at: null,
        });
        return [...reads];
      });
    }
  },

  [WebsocketListenEventEnum.SENSOR_NAME_CHANGE_EVENT]: ({ sensor_id, sensor_name, updated_at }: {
    sensor_id: number,
    sensor_name: string,
    updated_at: string,
  }) => {
    sensorStore.update(sensors => {
      const sensor = sensors[sensor_id];
      if (sensor) {
        sensors[sensor_id] = { ...sensor, name: sensor_name, updated_at };
      }
      return { ...sensors };
    });
  },

  [WebsocketListenEventEnum.SENSOR_CHANGE_ONLINE_EVENT]: ({ sensor_id, online, updated_at }: {
    sensor_id: number,
    online: boolean,
    updated_at: string,
  }) => {
    sensorStore.update(sensors => {
      const sensor = sensors[sensor_id];
      if (sensor) {
        sensors[sensor_id] = { ...sensor, online, updated_at };
      }
      return { ...sensors };
    });
  },

  [WebsocketListenEventEnum.ALL_SENSOR_READINGS]: ({ sensor_reads }: { sensor_reads: SensorRead[] }) => {
    sensorReadStore.set(sensor_reads);
    setTimeout(() => sensor_reads_loading.set(false), 1000);
  },

  [WebsocketListenEventEnum.ALL_ACTUATORS_EVENT]: ({ actuators }: { actuators: Actuator[] }) => {
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
        intermittent: false,
        intermittent_on_ms: 1000,
        intermittent_off_ms: 1000,
        online,
        created_at,
        updated_at: null,
      };
      return { ...actuators };
    });
  },

  [WebsocketListenEventEnum.ACTUATOR_UNREGISTER_EVENT]: ({ actuator_id }: { actuator_id: number }) => {
    actuatorStore.update(actuators => {
      delete actuators[actuator_id];
      return { ...actuators };
    });
  },

  [WebsocketListenEventEnum.ACTUATOR_NAME_CHANGE_EVENT]: ({ actuator_id, actuator_name, updated_at }: {
    actuator_id: number,
    actuator_name: string,
    updated_at: string,
  }) => {
    actuatorStore.update(actuators => {
      const actuator = actuators[actuator_id];
      if (actuator) {
        actuators[actuator_id] = { ...actuator, name: actuator_name, updated_at };
      }
      return { ...actuators };
    });
  },

  [WebsocketListenEventEnum.ACTUATOR_STATE_CHANGE_EVENT]: ({ actuator_id, actuator_state, updated_at }: {
    actuator_id: number,
    actuator_state: boolean,
    updated_at: string,
  }) => {
    actuatorStore.update(actuators => {
      const actuator = actuators[actuator_id];
      if (actuator) {
        actuators[actuator_id] = { ...actuator, state: actuator_state, updated_at };
      }
      return { ...actuators };
    });
  },

  [WebsocketListenEventEnum.ACTUATOR_INTERMITTENT_CHANGE_EVENT]: ({ actuator_id, intermittent, intermittent_on_ms, intermittent_off_ms, updated_at }: {
    actuator_id: number,
    intermittent: boolean,
    intermittent_on_ms?: number,
    intermittent_off_ms?: number,
    updated_at: string,
  }) => {
    actuatorStore.update(actuators => {
      const actuator = actuators[actuator_id];
      if (actuator) {
        actuators[actuator_id] = {
          ...actuator,
          intermittent,
          ...(intermittent_on_ms !== undefined && { intermittent_on_ms }),
          ...(intermittent_off_ms !== undefined && { intermittent_off_ms }),
          updated_at,
        };
      }
      return { ...actuators };
    });
  },

  [WebsocketListenEventEnum.ACTUATOR_CHANGE_ONLINE_EVENT]: ({ actuator_id, online, updated_at }: {
    actuator_id: number,
    online: boolean,
    updated_at: string,
  }) => {
    actuatorStore.update(actuators => {
      const actuator = actuators[actuator_id];
      if (actuator) {
        actuators[actuator_id] = { ...actuator, online, updated_at };
      }
      return { ...actuators };
    });
  },

  [WebsocketListenEventEnum.ALL_SCRIPTS_EVENT]: (scripts_array: { scripts_array: Script[] }) => {
    scripts.set(scripts_array.scripts_array.reduce((acc, value) => {
      return { ...acc, [value.id]: value };
    }, {} as { [p: string]: Script }));
  },

  [WebsocketListenEventEnum.SCRIPT_SAVED_EVENT]: (script: Script) => {
    scripts.update(scripts => {
      scripts[script.id] = script;
      return { ...scripts };
    });
  },

  [WebsocketListenEventEnum.SCRIPT_DELETED_EVENT]: (script: Script) => {
    scripts.update(scripts => {
      delete scripts[script.id];
      return { ...scripts };
    });
  },

  [WebsocketListenEventEnum.SCRIPT_MODIFIED_EVENT]: (script: Script) => {
    scripts.update(scripts => {
      scripts[script.id] = script;
      return { ...scripts };
    });
  },

  [WebsocketListenEventEnum.SCRIPT_STATUS_CHANGE_EVENT]: (script: Script) => {
    scripts.update(scripts => {
      scripts[script.id] = script;
      return { ...scripts };
    });
  },

  [WebsocketListenEventEnum.SCRIPT_SCHEDULE_ADDED_EVENT]: (script: Script) => {
    scripts.update(scripts => {
      scripts[script.id] = script;
      return { ...scripts };
    });
  },

  [WebsocketListenEventEnum.SCRIPT_SCHEDULE_REMOVED_EVENT]: (script: Script) => {
    scripts.update(scripts => {
      scripts[script.id] = script;
      return { ...scripts };
    });
  },

  // FLOWS

  [WebsocketListenEventEnum.ALL_FLOWS_EVENT]: ({ flows }: { flows: Flow[] }) => {
    flowStore.set(
      flows.reduce((acc, flow) => {
        acc[flow.id] = flow;
        return acc;
      }, {} as { [p: string]: Flow })
    );
  },

  [WebsocketListenEventEnum.FLOW_SAVED_EVENT]: ({ flow }: { flow: Flow }) => {
    flowStore.update(flows => {
      flows[flow.id] = flow;
      return { ...flows };
    });
  },

  [WebsocketListenEventEnum.FLOW_MODIFIED_EVENT]: ({ flow }: { flow: Flow }) => {
    flowStore.update(flows => {
      flows[flow.id] = flow;
      return { ...flows };
    });
  },

  [WebsocketListenEventEnum.FLOW_DELETED_EVENT]: ({ flow_id }: { flow_id: number }) => {
    flowStore.update(flows => {
      delete flows[flow_id];
      return { ...flows };
    });
  },

  [WebsocketListenEventEnum.FLOW_TOGGLED_EVENT]: ({ flow }: { flow: Flow }) => {
    flowStore.update(flows => {
      flows[flow.id] = flow;
      return { ...flows };
    });
  },
};

export default WebsocketListenEventMap;
