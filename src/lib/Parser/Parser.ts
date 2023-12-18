import SensorTypeEnum from "$lib/Enums/SensorTypeEnum";

export default class Parser {
    static parseSensorReadValue(value: string, type: SensorTypeEnum): string {
        value = parseFloat(value).toFixed(2);

        switch (type) {
            case SensorTypeEnum.SENSOR_TYPE_TEMPERATURE:
                value += " °C";
                break;
            case SensorTypeEnum.SENSOR_TYPE_HUMIDITY:
                value += " %";
                break;
            case SensorTypeEnum.SENSOR_TYPE_PRESSURE:
                value += " hPa";
                break;
            case SensorTypeEnum.SENSOR_TYPE_WIND_SPEED:
                value += " km/h";
                break;
            case SensorTypeEnum.SENSOR_TYPE_WIND_DIRECTION:
                value += " °";
                break;
            case SensorTypeEnum.SENSOR_TYPE_RAIN:
                value += " mm";
                break;
            case SensorTypeEnum.SENSOR_TYPE_UV:
                value += " UV";
                break;
            case SensorTypeEnum.SENSOR_TYPE_SOLAR_RADIATION:
                value += " W/m²";
                break;

            default:
                break;
        }

        return value;
    }
}