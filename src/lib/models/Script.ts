export default interface Script {
    id: number;
    title: string;
    code: string;
    schedule: string | null | undefined;
    status: number;
    created_at: string;
    updated_at: string | null | undefined;
}