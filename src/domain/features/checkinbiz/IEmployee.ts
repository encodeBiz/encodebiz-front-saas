export interface IEmployee {
    id?: string; // uid
    fullName: string;
    entityId: string;
    uid?: string;
    role: "internal" | "collaborator"; // Personal propio o externo
    phone?: string;
    email: string;
    trustedDevicesId?: string[]; // Para control en checkin
    status: "active" | "inactive";
    twoFA?: any,
    createdAt: Date;
    subEntity?: string; // Proyecto asignado, sucursal , etc
    metadata?: {
        dni?: string;
        address?: string;
        position?: string;
    };
}