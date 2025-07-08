export interface IPlan {
    id: string;
    name?: string;
    price?: string;
    period?: string;
    features?: string[];
    featured?: boolean;
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