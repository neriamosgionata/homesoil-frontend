enum WebsocketListenEventEnum {
    ALL_SENSORS_EVENT = "all-sensors",
    ALL_LAST_SENSOR_READINGS_EVENT = "all-last-sensors-reads",

    SENSOR_REGISTER_EVENT = "sensor-register",
    SENSOR_UNREGISTER_EVENT = "sensor-unregister",

    SENSOR_READ_EVENT = "sensor-read",

    SENSOR_NAME_CHANGE_EVENT = "sensor-name-change",
    ALL_SENSOR_READINGS = "all-sensor-reads",
}

export default WebsocketListenEventEnum;