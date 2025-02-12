enum WebsocketEmitEventEnum {
  GET_SENSOR_READINGS_EVENT = "get-sensor-readings",
  RENAME_SENSOR_EVENT = "rename-sensor",
  REMOVE_SENSOR_EVENT = "remove-sensor",

  TOGGLE_ACTUATOR_EVENT = "toggle-actuator",
  PULSE_ACTUATOR_EVENT = "pulse-actuator",
  RENAME_ACTUATOR_EVENT = "rename-actuator",
  REMOVE_ACTUATOR_EVENT = "remove-actuator",

  RUN_SCRIPT_EVENT = "run-script",

  GET_ALL_SCRIPTS_EVENT = "get-all-scripts",
  ADD_SCRIPT_EVENT = "add-script",
  REMOVE_SCRIPT_EVENT = "remove-script",
  MODIFY_SCRIPT_EVENT = "modify-script",
  ADD_SCRIPT_SCHEDULE_EVENT = "add-script-schedule",
  REMOVE_SCRIPT_SCHEDULE_EVENT = "remove-script-schedule",
}

export default WebsocketEmitEventEnum;
