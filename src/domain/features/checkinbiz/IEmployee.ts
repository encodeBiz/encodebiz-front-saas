export interface IEmployee {
    id?: string; // uid
    fullName: string;
    entityId: string;
    uid?: string;
    role: "internal" | "collaborator"; // Personal propio o externo
    phone?: string;
    email: string;
    trustedDevicesId?: string[]; // Para control en checkin
    status: "active" | "inactive" | "vacation" | "sick_leave" | "leave_of_absence" | "paternity_leave" | "maternity_leave";
    twoFA?: any,
    createdAt: Date;
    branchId: string[];// Proyecto asignado, sucursal , etc
    metadata?: any

    nationalId: string;
    jobTitle?: string
}