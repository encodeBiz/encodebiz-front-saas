import { ISucursal } from "./ISucursal";

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
    createdAt: any;
    metadata?: any | {

        address?: {
            street: string,
            city: string,
            country: string,
            postalCode: string,
            timeZone: string,
            geo: {
                lat: number
                lng: number
            }
        },
    }
    enableRemoteWork?: boolean;
    nationalId: string;
    jobTitle?: string
    branchId: Array<any>

    price: 0,
    responsibility: string,
    job: string


    //by form transform
    address?: {
        street: string,
        city: string,
        country: string,
        postalCode: string,
        timeZone: string,
        geo: {
            lat: number
            lng: number
        }
    },

       totalItems?: number
}

// Consistency first: keys y niveles canonizados
export type ResponsibilityKey = 'owner' | 'manager' | 'supervisor' | 'worker';

export enum ResponsibilityLevel {
    Worker = 1,
    Supervisor = 2,
    Manager = 3,
    Owner = 4,
}

export interface Job {
    id?: string,
    job: string,
    price: number
}

// Ámbito explícito para evitar ambigüedades
export type ResponsibilityScope =
    | { scope: 'entity'; entityId: string }                                  // aplica a toda la entidad
    | { scope: 'branch'; entityId: string; branchId: string };                // aplica a un branch

// Documento base, normalizado para Firestore
export interface EmployeeEntityResponsibility {
    employeeId: string;                     // ref a employees/{id}
    responsibility: ResponsibilityKey;      // 'owner' | 'manager' | 'supervisor' | 'worker'
    level: ResponsibilityLevel;             // 1..4 conforme a ResponsibilityKey
    scope: ResponsibilityScope;             // entity o branch
    job: Job;
    assignedBy?: string;                  // uid o employeeId del asignador
    assignedAt?: any;                     // ISO string
    active: number;                        // soft-enable/disable
    id?: string,

    branch?: ISucursal

    totalItems?: number

    employee?:IEmployee

    open?:boolean

    metadata: any
}