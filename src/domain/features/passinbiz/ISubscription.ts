export interface Subscription {
    entityId: string;
    serviceId: 'passinbiz'
    plan: 'freemium' | 'bronze' | 'gold' | 'enterprise';
    maxHolders: number;
    allowBranding: boolean;
    allowCustomTemplate: boolean;
    payPerUse: boolean;
    stripeSubscriptionId?: string;
    status: 'active' | 'trialing' | 'cancelled';
    startDate: string;
    endDate?: string;

}