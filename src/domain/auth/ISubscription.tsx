import { BizType, PlanType } from "../core/IService";

export interface ISubscription {
    entityId: string
    serviceId: BizType
    planId: PlanType;
}

export interface IUnSubscription {
    entityId: string
    serviceId: BizType
    
}
