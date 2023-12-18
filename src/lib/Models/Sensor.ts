import type SensorTypeEnum from "$lib/Enums/SensorTypeEnum";

export default interface Sensor {
    id: number;
    name: string;
    sensor_type: SensorTypeEnum;
    ip_address: string;
    online: boolean;
    created_at: string;
    updated_at: string | null;
}