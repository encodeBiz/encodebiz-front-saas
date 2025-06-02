export interface Subscription {
    id: string;
    entityId: string;
    serviceId: string;
    plan: string;
    stripeSubscriptionId: string;
    status: 'active' | 'trialing' | 'cancelled';
    startDate: string;
    endDate?: string;
    renewal: boolean;

}

