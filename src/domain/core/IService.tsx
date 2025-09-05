export interface IService {

    id: BizType; // o string si lo generalizas
    name: string;
    status: 'cooming_soon' | 'active';
    description: {
        es: string
        en: string
    };
    about: {
        es: string
        en: string
    };
    steps: {
        es: Array<{ title: string, description: string }>
        en: Array<{ title: string, description: string }>
    };
    target: {
        es: Array<{ title: string, description: string }>
        en: Array<{ title: string, description: string }>
    };
    availablePlans: Array<PlanType>;
    activatedAt: Date
    active: boolean
    metadata: Record<string, any>
    featuredList: {
        es: Array<string>,
        en: Array<string>,
    }
    image?: string

    isBillingActive: boolean

}

export type PlanType = "freemium" | "bronze" | "enterprise";

export type BizType = 'passinbiz' | 'checkinbiz';
