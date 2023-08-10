interface TMain {
    name: string;
    price: number;
    mainImage: string;
    images: string[];
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
    queryString: {
        limit: string;
        search: string;
        page: string;
    };
}
