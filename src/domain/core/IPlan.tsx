export interface IPlan {
    id: string;
    name?: string;
    priceMonth?: string;
    priceYear?: string;
    period?: string;
    features?: string[];
    featured?: boolean;
    price?:string
}

export interface IPlanData {
    allowBranding: boolean
    allowCustomTemplate: boolean
    id: string
    maxHolders: number
    monthlyPrice: number
    payPerUse: boolean
    service: string
}