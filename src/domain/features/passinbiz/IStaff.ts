export interface IStaff {
    id: string;
    fullName?: string;
    email?: string;
    entityId?: string;
    allowedTypes:  Array<'credential' | 'event'>;
    role: "root" | "validator_event" | "validator_credential"

    eventList?: Array<string>
}