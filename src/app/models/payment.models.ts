export interface Payment {
    PaymentId: number;
    UserId: number;
    SubscriptionId: number;
    Amount: number;
    PaymentDate: Date;
    PaymentMethod: string;
}

export interface PaymentForPost {
    UserId: number;
    SubscriptionId: number;
    Amount: number;
    PaymentDate: Date;
    PaymentMethod: string;
}

export interface PaymentForDisplay {
    paymentMethod: string;
    displayName: string;
}