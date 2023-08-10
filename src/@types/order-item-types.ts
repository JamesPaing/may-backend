interface TMain {
    item: {
        _id: string;
        name: string;
    };
    quantity: number;
}

export interface TOrderItem extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TOrderItemInput extends Omit<TMain, 'item'> {
    item: string;
}

export interface TOrderItemArgs {
    _id: string;
    orderItem: TOrderItemInput;
    queryString: {
        limit: string;
        search: string;
        page: string;
    };
}
