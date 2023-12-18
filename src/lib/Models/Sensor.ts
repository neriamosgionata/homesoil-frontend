export default interface Sensor {
    id: number;
    name: string;
    sensor_type: string;
    ip_address: string;
    created_at: string;
    updated_at: string | null;
}