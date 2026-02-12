import { BizType } from "../../core/IService";

export interface ISubscription {
    entityId: string
    serviceId: BizType
    planId: string;
}

export interface IUnSubscription {
    entityId: string
    serviceId: BizType
}

export interface IEntitySuscription {
    createdAt: Date
    entityId: string
    plan: string
    serviceId: string
    startDate: Date
    status: string
}

export interface StripeInvoice {
    id: string;
    status: string,
    createdAt: any
    entityId: string
    paymentData: any
}

