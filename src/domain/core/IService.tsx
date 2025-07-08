export interface IService {

    id: BizType; // o string si lo generalizas
    name: string;
    description: string;
    availablePlans: Array<PlanType>;
    activatedAt: Date
    active: boolean
    metadata: Record<string, any>

}

export type PlanType = "freemium" | "bronze" | "enterprise";

export type BizType = 'passinbiz' | 'checkinbiz';
