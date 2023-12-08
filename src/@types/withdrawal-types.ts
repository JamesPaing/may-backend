interface TMain {
    user: {
        _id: string;
        name: string;
    };
    amount: number;
    status: string;
    bankAccount: string;
    approvedBy: {
        _id: string;
        name: string;
    };
}

export interface TWithdrawal extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TWithdrawalInput extends Omit<TMain, 'user' | 'approvedBy'> {
    user: string;
    approvedBy: string;
}

export interface TWithdrawalArgs {
    _id: string;
    userId: string;
    withdrawal: TWithdrawalInput;
    queryString: {
        limit: string;
        search: string;
        page: string;
    };
}
