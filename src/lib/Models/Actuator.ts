export default interface Actuator {
    id: number;
    name: string;
    ip_address: string;
    port: number;
    online: boolean;
    state: boolean;
    pulse: boolean;
    created_at: string;
    updated_at: string | null;
}