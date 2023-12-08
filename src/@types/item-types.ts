interface TMain {
    name: string;
    price: number;
    mainImage: string;
    quantity: number;
    images: string[];
    description: string;
    favouritedBy: string[];
    vendor: {
        _id: string;
        name: string;
    };
    categories: {
        _id: string;
        name: string;
    }[];
    isActive: boolean;
}

export interface TItem extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TItemInput
    extends Omit<TMain, 'vendor' | 'categories' | 'mainImage'> {
    vendor: string;
    categores: string;
    mainImage: any;
}

export interface TItemArgs {
    _id: string;
    item: TItemInput;
    vendorId: string;
    catId: string;
    queryString: {
        limit: string;
        search: string;
        page: string;
    };
}
