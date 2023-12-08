interface TMain {
    transferrer: {
        _id: string;
        name: string;
    };
    amount: number;
    status: string;
    receiver: {
        _id: string;
        name: string;
    };
}

export interface TTransfer extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TTransferInput
    extends Omit<TMain, 'transferrer' | 'receiver'> {
    transferrer: string;
    receiver: string;
}

export interface TTransferArgs {
    _id: string;
    userId: string;
    transfer: TTransferInput;
    queryString: {
        limit: string;
        search: string;
        page: string;
    };
}
