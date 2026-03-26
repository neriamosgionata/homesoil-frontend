export default interface Actuator {
    id: number;
    name: string;
    ip_address: string;
    port: number;
    online: boolean;
    state: boolean;
    pulse: boolean;
    intermittent: boolean;
    intermittent_on_ms: number;
    intermittent_off_ms: number;
    created_at: string;
    updated_at: string | null;
}