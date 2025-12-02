export interface IPlan {
    id: string;
    name?: string;
    priceMonth?: string;
    priceYear?: string;
    period?: string;
    features?: string[];
    price?: string
    order: number
    highlighted: boolean
    featuredList: boolean[]
    items_es: string[]
    items_en: string[]
    description: {
        es: string,
        en: string
    }
    payPerUse:boolean
    monthlyPrice: string
    pricePerUse:string
    maxHolders: number
    customPrice?: boolean
}

export interface IPlanData {
    allowBranding: boolean
    allowCustomTemplate: boolean
    id: string
    maxHolders: number
    monthlyPrice: string
    payPerUse: boolean
    service: string
    order: number
    highlighted: boolean
    featuredList: boolean[]
      items_es: string[]
    items_en: string[]
   description: {
        es: string,
        en: string
    }
    pricePerUse:string
    customPrice?: boolean
}