import { Request } from 'express';

import GraphqlDate from '../../utils/scalars/date-scalar';
import { User } from '../../models/user';
import { Item } from '../../models/item';
import { TUser, TUserArgs } from '../../@types/user-types';
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
        getAllFavouriteItems: async (_: undefined, { _id }: TUserArgs) => {
            const user: TUser | null = await User.findById(_id);

            const formattedItems = user?.favourites.map((favourite) => ({
                _id: favourite._id,
                name: favourite.name,
                vendor: favourite.vendor,
                price: favourite.price,
                mainImage: favourite.mainImage,
            }));

            return formattedItems;
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
        addFavouriteItem: async (_: undefined, { _id, itemId }: TUserArgs) => {
            // update the user
            await User.findByIdAndUpdate(
                _id,
                {
                    $addToSet: { favourites: itemId },
                },
                {
                    runValidators: true,
                }
            );

            // update the item
            const updatedItem = await Item.findByIdAndUpdate(
                itemId,
                {
                    $addToSet: { favouritedBy: _id },
                },
                {
                    runValidators: true,
                    new: true,
                }
            );

            return updatedItem;
        },
        removeFavouriteItem: async (
            _: undefined,
            { _id, itemId }: TUserArgs
        ) => {
            // update the user
            await User.findByIdAndUpdate(
                _id,
                {
                    $pull: { favourites: itemId },
                },
                {
                    runValidators: true,
                }
            );

            // update the item
            const updatedItem = await Item.findByIdAndUpdate(
                itemId,
                {
                    $pull: { favouritedBy: _id },
                },
                {
                    runValidators: true,
                    new: true,
                }
            );

            return updatedItem;
        },
        deleteUser: async (_: undefined, { _id }: TUserArgs) => {
            await User.findByIdAndDelete(_id);

            return null;
        },
    },
    Date: GraphqlDate,
};
