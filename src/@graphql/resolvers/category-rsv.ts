import { Request } from 'express';
import { GraphQLUpload } from 'graphql-upload';
import GraphqlDate from '../../utils/scalars/date-scalar';
import { Category } from '../../models/category';
import { TCategory, TCategoryArgs } from '../../@types/category-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';
import uploadImage from '../../utils/uploadImage';
import deleteImage from '../../utils/deleteImage';

export const categoryResolvers = {
    Query: {
        getAllCategories: async (
            _: undefined,
            { queryString: { limit, search, page, forMarket } }: TCategoryArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            req.query.forMarket = forMarket;

            const withAPIFeatures = new APIFeatures(Category.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const categories = await withAPIFeatures.query;

            return {
                results: categories.length,
                categories,
            };
        },
        getCategory: async (_: undefined, { _id }: TCategoryArgs) => {
            const category = await Category.findById(_id);

            return category;
        },
    },
    Mutation: {
        createCategory: async (
            _: undefined,
            { category }: TCategoryArgs,
            { req }: { req: Request }
        ) => {
            const { image }: { image: any } = category;

            if (image) {
                category.image = await uploadImage(
                    image,
                    'cat',
                    '../../public/uploads/category/',
                    req
                );
            }

            //@ts-ignore
            const id = await new AutoIncrement('category_id').incSequence();

            const newCategory = await Category.create({
                id,
                ...category,
            });

            return newCategory;
        },
        updateCategory: async (
            _: undefined,
            { _id, category }: TCategoryArgs,
            { req }: { req: Request }
        ) => {
            const { image }: { image: any } = category;

            if (image && typeof image !== 'string') {
                // write new image
                category.image = await uploadImage(
                    image,
                    'cat',
                    '../../public/uploads/category/',
                    req
                );

                // delete old image
                const p: TCategory | null = await Category.findById(_id);

                deleteImage(p!.image, '../../public/uploads/category/');
            }

            const updatedCategory = await Category.findByIdAndUpdate(
                _id,
                category,
                {
                    new: true,
                    runValidators: true,
                }
            );

            return updatedCategory;
        },
        deleteCategory: async (_: undefined, { _id }: TCategoryArgs) => {
            const category: TCategory | null = await Category.findById(_id);

            deleteImage(category!.image, '../../public/uploads/category/');

            await Category.findByIdAndDelete(_id);

            return null;
        },
    },
    Date: GraphqlDate,
    FileUpload: GraphQLUpload,
};
