import { BizType, PlanType } from "../core/IService";

export interface ISubscription {
    entityId: string
    serviceId: BizType
    planId: string;
}

export interface IUnSubscription {
    entityId: string
    serviceId: BizType
    
}
