interface TMain {
    name: string;
    address: string;
    city: string;
    township: string;
    wallet: {
        _id: string;
        balance: string;
    };
    items: {
        _id: string;
        name: string;
    }[];
    logo: string;
    images: string[];
    isActive: boolean;
    type: string;
    coordinate: {
        _id: string;
        point: string;
        type: string;
    };
}

export interface TVendor extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TVendorInput
    extends Omit<TMain, 'wallet' | 'items' | 'coordinate'> {
    password: string;
    passwordConfirmation: string;
    wallet?: string;
    items?: string[];
    coordinate?: string;
}

export interface TVendorArgs {
    _id: string;
    vendor: TVendorInput;
    queryString: {
        limit: string;
        search: string;
        page: string;
    };
}
