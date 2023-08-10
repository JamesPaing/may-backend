interface TMain {
    payment: {
        _id: string;
        name: string;
    };
    amount: number;
}

export interface TPayment extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TPaymentInput extends TMain {}

export interface TPaymentArgs {
    _id: string;
    payment: TPaymentInput;
    queryString: {
        limit: string;
        search: string;
        page: string;
    };
}
