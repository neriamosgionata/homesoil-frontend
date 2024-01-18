export default interface SensorRead {
    id: number;
    sensor_id: number;
    sensor_value: string;
    created_at: string;
    updated_at: string | null;
}