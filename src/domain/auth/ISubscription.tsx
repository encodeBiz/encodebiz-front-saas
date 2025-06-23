export interface ISubscription {
    entityId: string
    serviceId: "passinbiz" | "checkinbiz"
    planId: "freemium" | "bronze" | "enterprise";
}

export interface IUnSubscription {
    entityId: string
    serviceId: "passinbiz" | "checkinbiz"
    
}
