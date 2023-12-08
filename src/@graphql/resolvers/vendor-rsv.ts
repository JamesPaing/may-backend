import { Request } from 'express';
import { GraphQLUpload } from 'graphql-upload';
import GraphqlDate from '../../utils/scalars/date-scalar';
import { Vendor } from '../../models/vendor';
import { TVendor, TVendorArgs } from '../../@types/vendor-types';
import AutoIncrement from '../../utils/classes/AutoIncrement';
import { APIFeatures } from '../../utils/classes/APIFeatures';
import uploadImage from '../../utils/uploadImage';
import deleteImage from '../../utils/deleteImage';
import { User } from '../../models/user';
import mongoose from 'mongoose';

const ObjectId = mongoose.Types.ObjectId;

export const vendorResolvers = {
    Query: {
        getAllVendors: async (
            _: undefined,
            { queryString: { limit, search, page, type } }: TVendorArgs,
            { req }: { req: Request }
        ) => {
            // add limit filed to req query object
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            req.query.type = type;

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
        getMyVendors: async (_: undefined, { userId }: TVendorArgs) => {
            const vendors = await Vendor.find({
                user: userId,
            });

            return {
                results: vendors.length,
                vendors,
            };
        },
        getVendorsWithin: async (
            _: undefined,
            { distance, latlng, unit }: TVendorArgs
        ) => {
            const [lat, lng] = latlng.split(',');

            const radius =
                unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

            if (!lat || !lng) {
                throw new Error(
                    'Please provide lat and lng in this format lat,lng.'
                );
            }

            const vendors = await Vendor.find({
                location: {
                    $geoWithin: {
                        $centerSphere: [[lng, lat], radius],
                    },
                },
            });

            return {
                results: vendors.length,
                vendors,
            };
        },
        getDistances: async (
            _: undefined,
            { latlng, unit, vendorIds }: TVendorArgs
        ) => {
            const [lat, lng] = latlng.split(',');

            const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

            if (!lat || !lng) {
                throw new Error(
                    'Please provide lat and lng in this format lat,lng.'
                );
            }

            // const shopArray = shops.split(',');

            const ids = vendorIds.map(function (id) {
                return new ObjectId(id);
            });

            const distances = await Vendor.aggregate([
                {
                    $geoNear: {
                        near: {
                            type: 'Point',
                            coordinates: [Number(lng), Number(lat)],
                        },
                        distanceField: 'distance',
                        distanceMultiplier: multiplier,
                    },
                },
                {
                    $match: {
                        _id: {
                            $in: ids,
                        },
                    },
                },
                {
                    $project: {
                        distance: 1,
                        name: 1,
                    },
                },
            ]);

            return distances;
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

            // update user
            await User.findByIdAndUpdate(vendor.user, {
                $addToSet: { vendors: newVendor._id },
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
