enum WebsocketListenEventEnum {
    ALL_SENSORS_EVENT = "all-sensors",
    ALL_SENSOR_READINGS_EVENT = "all-sensors-reads",

    SENSOR_REGISTER_EVENT = "sensor-register",
    SENSOR_UNREGISTER_EVENT = "sensor-unregister",

    SENSOR_READ_EVENT = "sensor-read",

    SENSOR_READS_EVENT = "sensor-reads",

    SENSOR_NAME_CHANGE_EVENT = "sensor-name-change",
}

export default WebsocketListenEventEnum;