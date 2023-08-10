export interface TMain {
    name: string;
    contact: string;
    email: string;
    address: string;
    role: string;
    isActive: boolean;
    wallet: {
        _id: string;
        balance: number;
    };
    currentCoordinate: {
        _id: string;
        point: string;
        type: string;
    };
    coordinates: {
        _id: string;
        point: string;
        type: string;
    }[];
}

export interface TUser extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TUserInput
    extends Omit<TMain, 'wallet' | 'currentCoordinate' | 'coordinates'> {
    password: string;
    passwordConfirmation: string;
    wallet?: string;
    currentCoordinate?: string;
    coordinates?: string[];
}

export interface TUserArgs {
    _id: string;
    user: TUserInput;
    queryString: {
        limit: string;
        search: string;
        page: string;
    };
}
