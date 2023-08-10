import { Request } from 'express';

import GraphqlDate from '../../utils/scalars/date-scalar';
import { Coordinate } from '../../models/coordinate';
import { TCoordinateArgs } from '../../@types/coordinate-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';

export const coordinateResolvers = {
    Query: {
        getAllCoordinates: async (
            _: undefined,
            { queryString: { limit, search, page } }: TCoordinateArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const withAPIFeatures = new APIFeatures(
                Coordinate.find(),
                req.query
            )
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const coordinates = await withAPIFeatures.query;

            return {
                results: coordinates.length,
                coordinates,
            };
        },
        getCoordinate: async (_: undefined, { _id }: TCoordinateArgs) => {
            const coordinate = await Coordinate.findById(_id);

            return coordinate;
        },
    },
    Mutation: {
        createCoordinate: async (
            _: undefined,
            { coordinate }: TCoordinateArgs
        ) => {
            //@ts-ignore
            const id = await new AutoIncrement('coordinate_id').incSequence();

            const newCoordinate = await Coordinate.create({
                id,
                ...coordinate,
            });

            return newCoordinate;
        },
        updateCoordinate: async (
            _: undefined,
            { _id, coordinate }: TCoordinateArgs
        ) => {
            const updatedCoordiante = await Coordinate.findByIdAndUpdate(
                _id,
                coordinate,
                {
                    new: true,
                    runValidators: true,
                }
            );

            return updatedCoordiante;
        },
        deleteCoordiante: async (_: undefined, { _id }: TCoordinateArgs) => {
            await Coordinate.findByIdAndDelete(_id);

            return null;
        },
    },
    Date: GraphqlDate,
};
