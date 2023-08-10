import { Request } from 'express';
import { GraphQLUpload } from 'graphql-upload';
import GraphqlDate from '../../utils/scalars/date-scalar';
import { Vendor } from '../../models/vendor';
import { TVendor, TVendorArgs } from '../../@types/vendor-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';
import uploadImage from 'src/utils/uploadImage';
import deleteImage from 'src/utils/deleteImage';

export const vendorResolvers = {
    Query: {
        getAllVendors: async (
            _: undefined,
            { queryString: { limit, search, page } }: TVendorArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);

            const withAPIFeatures = new APIFeatures(Vendor.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();

            const vendors = await withAPIFeatures.query;

            return {
                results: vendors.length,
                vendors,
            };
        },
        getVendor: async (_: undefined, { _id }: TVendorArgs) => {
            const vendor = await Vendor.findById(_id);

            return vendor;
        },
    },
    Mutation: {
        createVendor: async (
            _: undefined,
            { vendor }: TVendorArgs,
            { req }: { req: Request }
        ) => {
            const { logo } = vendor;

            if (logo) {
                vendor.logo = await uploadImage(
                    logo,
                    'vd',
                    '../../public/uploads/vendor/',
                    req
                );
            }

            //@ts-ignore
            const id = await new AutoIncrement('vendor_id').incSequence();

            const newVendor = await Vendor.create({
                id,
                ...vendor,
            });

            return newVendor;
        },
        updateVendor: async (
            _: undefined,
            { _id, vendor }: TVendorArgs,
            { req }: { req: Request }
        ) => {
            const { logo } = vendor;

            if (logo && typeof logo !== 'string') {
                // write new image
                vendor.logo = await uploadImage(
                    logo,
                    'vd',
                    '../../public/uploads/vendor/',
                    req
                );

                // delete old image
                const p: TVendor | null = await Vendor.findById(_id);

                deleteImage(p!.logo, '../../public/uploads/vendor/');
            }

            const updatedVendor = await Vendor.findByIdAndUpdate(_id, vendor, {
                new: true,
                runValidators: true,
            });

            return updatedVendor;
        },
        deleteVendor: async (_: undefined, { _id }: TVendorArgs) => {
            const vendor: TVendor | null = await Vendor.findById(_id);

            deleteImage(vendor!.logo, '../../public/uploads/vendor/');

            await Vendor.findByIdAndDelete(_id);

            return null;
        },
    },
    Date: GraphqlDate,
    FileUpload: GraphQLUpload,
};
