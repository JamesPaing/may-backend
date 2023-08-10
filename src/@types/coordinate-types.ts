interface TMain {
    point: string;
    type: string;
}

export interface TCoordinate extends TMain {
    id: number;
    _id: string;
    createdAt: string;
    updatedAt: string;
}

export interface TCoordinateInput extends TMain {}

export interface TCoordinateArgs {
    _id: string;
    coordinate: TCoordinateInput;
    queryString: {
        limit: string;
        search: string;
        page: string;
    };
}
