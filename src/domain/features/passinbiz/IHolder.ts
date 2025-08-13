export interface Holder {
    id: string; // UUID o user.uid si está vinculado
    isLinkedToUser: boolean;
    thumbnail: any
    userId?: string;              // Si está vinculado a un user del sistema
    fullName?: string;            // Solo si es externo
    email?: string;
    phoneNumber?: string;
    failedFeedback: string;
    applePassUrl?: string;        // URL al .pkpass en Firebase Storage
    googlePassUrl?: string;       // URL firmada para Google Wallet
    passStatus: 'not_generated' | 'pending' | 'active' | 'revoked';
    type: 'credential' | 'event' | any
    generatedAt?: string;
    generatedBy?: string;         // userId del admin que lo generó
    metadata?: Record<string, any>;
    createdAt: string;
    customFields?: any

    entityId?:string
    parentId?:string
    uid?:string
}