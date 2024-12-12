export interface Subscription {
    subscriptionId: number;
    userId: number;
    subscriptionType: string;
    startDate: Date;
    endDate: Date;
    price: number;
    isDeleted: boolean;
}

export interface SubscriptionForPost {
    userId: number;
    subscriptionType: string;
    startDate: Date;
    endDate: Date;
    price: number;
    isDeleted: boolean;
}

export interface SubscriptionForDisplay {
    title: string;
    type: string;
    duration: number;
    price: number;
    description: string;
}