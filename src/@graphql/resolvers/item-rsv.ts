import { Request } from 'express';
import { GraphQLUpload } from 'graphql-upload';
import GraphqlDate from '../../utils/scalars/date-scalar';
import { Item } from '../../models/item';
import { TItem, TItemArgs } from '../../@types/item-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';
import uploadImage from 'src/utils/uploadImage';
import deleteImage from 'src/utils/deleteImage';

export const itemResolvers = {
    Query: {
        getAllItems: async (
            _: undefined,
            { queryString: { limit, search, page } }: TItemArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const withAPIFeatures = new APIFeatures(Item.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const items = await withAPIFeatures.query;

            return {
                results: items.length,
                items,
            };
        },
        getItem: async (_: undefined, { _id }: TItemArgs) => {
            const item = await Item.findById(_id);

            return item;
        },
    },
    Mutation: {
        createItem: async (
            _: undefined,
            { item }: TItemArgs,
            { req }: { req: Request }
        ) => {
            const { mainImage }: { mainImage: any } = item;

            if (mainImage) {
                item.mainImage = await uploadImage(
                    mainImage,
                    'itm',
                    '../../public/uploads/item/',
                    req
                );
            }

            //@ts-ignore
            const id = await new AutoIncrement('item_id').incSequence();

            const newItem = await Item.create({
                id,
                ...item,
            });

            return newItem;
        },
        updateItem: async (
            _: undefined,
            { _id, item }: TItemArgs,
            { req }: { req: Request }
        ) => {
            const { mainImage } = item;

            if (mainImage && typeof mainImage !== 'string') {
                // write new image
                item.mainImage = await uploadImage(
                    mainImage,
                    'itm',
                    '../../public/uploads/item/',
                    req
                );

                // delete old image
                const p: TItem | null = await Item.findById(_id);

                deleteImage(p!.mainImage, '../../public/uploads/item/');
            }

            const updatedItem = await Item.findByIdAndUpdate(_id, item, {
                new: true,
                runValidators: true,
            });

            return updatedItem;
        },
        deleteItem: async (_: undefined, { _id }: TItemArgs) => {
            const item: TItem | null = await Item.findById(_id);

            deleteImage(item!.mainImage, '../../public/uploads/item/');

            await Item.findByIdAndDelete(_id);

            return null;
        },
    },
    Date: GraphqlDate,
    FileUpload: GraphQLUpload,
};
