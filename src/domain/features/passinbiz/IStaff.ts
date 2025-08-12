export interface IStaff {
    id: string;
    fullName?: string;
    email?: string;
    entityId?: string;
    allowedTypes: Array<string>;
    role: "root" | "validator_event" | "validator_credential"
}