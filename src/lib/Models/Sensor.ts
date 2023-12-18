import type SensorTypeEnum from "$lib/Enums/SensorTypeEnum";

export default interface Sensor {
    id: number;
    name: string;
    sensor_type: SensorTypeEnum;
    ip_address: string;
    created_at: string;
    updated_at: string | null;
}