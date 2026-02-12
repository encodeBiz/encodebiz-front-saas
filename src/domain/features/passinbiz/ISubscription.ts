import { BizType, PlanType } from "@/domain/core/IService";

export interface Subscription {
    entityId: string;
    serviceId: BizType
    plan: PlanType;
    maxHolders: number;
    allowBranding: boolean;
    allowCustomTemplate: boolean;
    payPerUse: boolean;
    stripeSubscriptionId?: string;
    status: StatusType;
    startDate: string;
    endDate?: string;
    cancel_at?: Date
}

export type StatusType = 'active' | 'trialing' | 'cancelled';
