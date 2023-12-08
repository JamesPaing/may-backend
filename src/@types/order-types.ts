interface TMain {
    ref: string;
    user: {
        _id: string;
        name: string;
    };
    address: string;
    location: {
        type: string;
        coordinates: number[];
    };
    orderItems: {
        _id: string;
        item: {
            _id: string;
            name: string;
        };
        quantity: number;
    }[];
    payments: {
        _id: string;
        amount: string;
    }[];
    total: number;
    subTotoal: number;
    screenShot: string;
    note: string;
    status: string;
}

export interface TOrder extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TOrderInput
    extends Omit<TMain, 'user' | 'orderItems' | 'payments' | 'screenShot'> {
    user: string;
    orderItems: string[];
    payments: string[];
    screenShot: any;
}

export interface TOrderArgs {
    _id: string;
    userId: string;
    vendorId: string;
    order: TOrderInput;
    queryString: {
        limit: string;
        search: string;
        searchField: string;
        page: string;
    };
}
