interface TMain {
    owner: {
        _id: string;
        name: string;
    };
    kind: string;
    balance: number;
}

export interface TWallet extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TWallentInput extends Omit<TMain, 'owner'> {
    owner: string;
}

export interface TwalletArgs {
    _id: string;
    wallet: TWallentInput;
    queryString: {
        limit: string;
        search: string;
        page: string;
    };
}
