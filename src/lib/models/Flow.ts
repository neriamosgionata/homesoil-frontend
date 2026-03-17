export default interface Flow {
    id: number;
    title: string;
    graph: string;
    enabled: boolean;
    created_at: string;
    updated_at: string | null | undefined;
}
