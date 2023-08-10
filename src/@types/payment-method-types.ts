interface TMain {
    name: string;
    type: string;
    extra: string;
}

export interface TPaymentMethod extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TPaymentMethodInput extends TMain {}

export interface TPaymentMethodArgs {
    _id: string;
    paymentMethod: TPaymentMethodInput;
    queryString: {
        limit: string;
        search: string;
        page: string;
    };
}
