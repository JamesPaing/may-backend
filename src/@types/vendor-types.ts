interface TMain {
    name: string;
    address: string;
    city: string;
    township: string;
    wallet: {
        _id: string;
        balance: string;
    };
    user: {
        _id: string;
        name: string;
    };
    items: {
        _id: string;
        name: string;
    }[];
    logo: string;
    images: string[];
    isActive: boolean;
    type: string;
    location: {
        type: string;
        coordinates: number[];
    };
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
    extends Omit<TMain, 'wallet' | 'items' | 'coordinate' | 'user'> {
    password: string;
    passwordConfirmation: string;
    wallet?: string;
    items?: string[];
    coordinate?: string;
    user: string;
}

export interface TVendorArgs {
    _id: string;
    userId: string;
    distance: number;
    vendorIds: string[];
    latlng: string;
    unit: string;
    vendor: TVendorInput;
    queryString: {
        limit: string;
        search: string;
        page: string;
        type: string;
    };
}
