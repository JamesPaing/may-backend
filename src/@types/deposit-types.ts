interface TMain {
    user: {
        _id: string;
        name: string;
    };
    amount: number;
    screenShot: string;
    status: string;
    approvedBy: {
        _id: string;
        name: string;
    };
}

export interface TDeposit extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TDepositInput
    extends Omit<TMain, 'user' | 'approvedBy' | 'screenShot'> {
    user: string;
    approvedBy: string;
    screenShot: any;
}

export interface TDepositArgs {
    _id: string;
    userId: string;
    deposit: TDepositInput;
    queryString: {
        limit: string;
        search: string;
        page: string;
    };
}
