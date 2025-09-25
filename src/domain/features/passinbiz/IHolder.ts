export interface Holder {
    id?: string;
    isLinkedToUser: boolean;
    userId?: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    entityId: string;
    type: "event" | "credential" | ""
    parentId?: string, // Id de evento u otra funcionalidad futura
    applePassUrl?: string;
    googlePassUrl?: string;
    isValidated?: boolean;
    lastValidatedAt?: Date;
    passStatus: "not_generated" | "pending" | "active" | "revoked" | "failed" | "pending-pay" | "archived";
    status?: "pending" | "made";
    paymentStatus: "paid" | "unpaid" | "free" // Este estado es para controlar el pago por uso o por unidad que se cobra a final de mes.
    payPerUse?: boolean;
    generatedAt?: string;
    generatedBy?: string;
    thumbnail?: string;
    metadata?: any;
    failedFeedback?: any;
    customFields?: any;
 
    createdAt: Date;
}

export interface Trace {
    id?: string;
    ref?: string;
    passFlow?: "ENTERING" | "EXITING";
    holderId: string;
    entityId: string;
    companyName: string;
    productId: string;
    location?: { lat: number; lng: number };
    userAgent?: string;
    result: "valid" | "revoked" | "expired" | "not_found" | "failed";
    createdAt: Date;
}