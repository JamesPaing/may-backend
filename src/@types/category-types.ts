interface TMain {
    name: string;
    forMarket: boolean;
    count: number;
    image: string;
    isActive: boolean;
}

export interface TCategory extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TCategoryInput extends Omit<TMain, 'image'> {
    image: any;
}

export interface TCategoryArgs {
    _id: string;
    category: TCategoryInput;
    queryString: {
        limit: string;
        search: string;
        page: string;
        forMarket: string;
    };
}
