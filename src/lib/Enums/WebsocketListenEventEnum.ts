enum WebsocketListenEventEnum {
    ALL_SENSORS_EVENT = "all-sensors",

    SENSOR_REGISTER_EVENT = "sensor-register",
    SENSOR_UNREGISTER_EVENT = "sensor-unregister",

    SENSOR_READ_EVENT = "sensor-read",
    SENSOR_READ_ERROR_EVENT = "sensor-read-error",

    SENSOR_NAME_CHANGE_EVENT = "sensor-name-change",
}

export default WebsocketListenEventEnum;