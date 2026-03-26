enum WebsocketListenEventEnum {
  MESSAGE_SENT_EVENT = "message-sent",

  //   ------------------------------------------------------

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
  ACTUATOR_INTERMITTENT_CHANGE_EVENT = "actuator-intermittent-change",

  ACTUATOR_CHANGE_ONLINE_EVENT = "actuator-change-online",


  //    ------------------------------------------------------

  ALL_SCRIPTS_EVENT = "all-scripts",

  SCRIPT_SAVED_EVENT = "script-saved",
  SCRIPT_DELETED_EVENT = "script-deleted",
  SCRIPT_MODIFIED_EVENT = "script-modified",

  SCRIPT_STATUS_CHANGE_EVENT = "script-status-change",

  SCRIPT_SCHEDULE_ADDED_EVENT = "script-schedule-added",
  SCRIPT_SCHEDULE_REMOVED_EVENT = "script-schedule-removed",

  //    ------------------------------------------------------

  ALL_FLOWS_EVENT = "all-flows",

  FLOW_SAVED_EVENT = "flow-saved",
  FLOW_MODIFIED_EVENT = "flow-modified",
  FLOW_DELETED_EVENT = "flow-deleted",
  FLOW_TOGGLED_EVENT = "flow-toggled",
}

export default WebsocketListenEventEnum;
