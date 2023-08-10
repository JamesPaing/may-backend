import { Request } from 'express';

import GraphqlDate from '../../utils/scalars/date-scalar';
import { User } from '../../models/user';
import { TUserArgs } from '../../@types/user-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';

export const userResolvers = {
    Query: {
        getAllUsers: async (
            _: undefined,
            { queryString: { limit, search, page } }: TUserArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const withAPIFeatures = new APIFeatures(User.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const users = await withAPIFeatures.query;

            return {
                results: users.length,
                users,
            };
        },
        getUser: async (_: undefined, { _id }: TUserArgs) => {
            const user = await User.findById(_id);

            return user;
        },
    },
    Mutation: {
        createUser: async (_: undefined, { user }: TUserArgs) => {
            //@ts-ignore
            const id = await new AutoIncrement('user_id').incSequence();

            const newUser = await User.create({
                id,
                ...user,
            });

            return newUser;
        },
        updateUser: async (_: undefined, { _id, user }: TUserArgs) => {
            const updatedUser = await User.findByIdAndUpdate(_id, user, {
                new: true,
                runValidators: true,
            });

            return updatedUser;
        },
        deleteUser: async (_: undefined, { _id }: TUserArgs) => {
            await User.findByIdAndDelete(_id);

            return null;
        },
    },
    Date: GraphqlDate,
};
