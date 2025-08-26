export interface IService {

    id: BizType; // o string si lo generalizas
    name: string;
    description: string;
    about: string;
    availablePlans: Array<PlanType>;
    activatedAt: Date
    active: boolean
    metadata: Record<string, any>
    featuredList: Array<string>
    image?: string

    isBillingActive: boolean

}

export type PlanType = "freemium" | "bronze" | "enterprise";

export type BizType = 'passinbiz' | 'checkinbiz';
