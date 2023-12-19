enum WebsocketListenEventEnum {
    ALL_SENSORS_EVENT = "all-sensors",
    ALL_LAST_SENSOR_READINGS_EVENT = "all-last-sensors-reads",

    SENSOR_REGISTER_EVENT = "sensor-register",
    SENSOR_UNREGISTER_EVENT = "sensor-unregister",
    SENSOR_NAME_CHANGE_EVENT = "sensor-name-change",

    SENSOR_READ_EVENT = "sensor-read",
    ALL_SENSOR_READINGS = "all-sensor-reads",

    SENSOR_CHANGE_ONLINE_EVENT = "sensor-change-online",

//    ------------------------------------------------------

    ALL_ACTUATORS_EVENT = "all-actuators",

    ACTUATOR_REGISTER_EVENT = "actuator-register",
    ACTUATOR_UNREGISTER_EVENT = "actuator-unregister",

    ACTUATOR_NAME_CHANGE_EVENT = "actuator-name-change",
    ACTUATOR_STATE_CHANGE_EVENT = "actuator-state-change",

    ACTUATOR_CHANGE_ONLINE_EVENT = "actuator-change-online",
}

export default WebsocketListenEventEnum;