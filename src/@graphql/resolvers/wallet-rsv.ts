import { Request } from 'express';

import GraphqlDate from '../../utils/scalars/date-scalar';
import { Wallet } from '../../models/wallet';
import { TwalletArgs } from '../../@types/wallet-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';

export const walletResolvers = {
    Query: {
        getAllWallets: async (
            _: undefined,
            { queryString: { limit, search, page } }: TwalletArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const withAPIFeatures = new APIFeatures(Wallet.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const wallets = await withAPIFeatures.query;

            return {
                results: wallets.length,
                wallets,
            };
        },
        getWallet: async (_: undefined, { _id }: TwalletArgs) => {
            const wallet = await Wallet.findById(_id);

            return wallet;
        },
    },
    Mutation: {
        createWallet: async (_: undefined, { wallet }: TwalletArgs) => {
            //@ts-ignore
            const id = await new AutoIncrement('wallet_id').incSequence();

            const newWallet = await Wallet.create({
                id,
                ...wallet,
            });

            return newWallet;
        },
        updateWallet: async (_: undefined, { _id, wallet }: TwalletArgs) => {
            const updatedWallet = await Wallet.findByIdAndUpdate(_id, wallet, {
                new: true,
                runValidators: true,
            });

            return updatedWallet;
        },
        deleteWallet: async (_: undefined, { _id }: TwalletArgs) => {
            await Wallet.findByIdAndDelete(_id);

            return null;
        },
    },
    Date: GraphqlDate,
};
