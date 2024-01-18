export default interface DashboardMessage {
    message: string;
    type: "success" | "error" | "warning" | "info";
}