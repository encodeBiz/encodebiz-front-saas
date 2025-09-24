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
    status: 'PAID',
    createdAt: any
    entityId: string
    inviceData: {
        account_country: string
        account_name: string
        account_tax_ids: any
        amount_due: number
        amount_overpaid: number
        amount_paid: number
        amount_remaining: number
        amount_shipping: number
        application: any
        attempt_count: number
        attempted: boolean
        customer_email: string
        customer_name: string
        invoice_pdf: string
        number: string
        subtotal: number
        total: number
    }
}

