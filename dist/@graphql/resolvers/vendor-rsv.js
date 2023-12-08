"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vendorResolvers = void 0;
const graphql_upload_1 = require("graphql-upload");
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const vendor_1 = require("../../models/vendor");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
const uploadImage_1 = __importDefault(require("../../utils/uploadImage"));
const deleteImage_1 = __importDefault(require("../../utils/deleteImage"));
const user_1 = require("../../models/user");
const mongoose_1 = __importDefault(require("mongoose"));
const ObjectId = mongoose_1.default.Types.ObjectId;
exports.vendorResolvers = {
    Query: {
        getAllVendors: (_, { queryString: { limit, search, page, type } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            req.query.type = type;
            const withAPIFeatures = new APIFeatures_1.APIFeatures(vendor_1.Vendor.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const vendors = yield withAPIFeatures.query;
            return {
                results: vendors.length,
                vendors,
            };
        }),
        getVendor: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const vendor = yield vendor_1.Vendor.findById(_id);
            return vendor;
        }),
        getMyVendors: (_, { userId }) => __awaiter(void 0, void 0, void 0, function* () {
            const vendors = yield vendor_1.Vendor.find({
                user: userId,
            });
            return {
                results: vendors.length,
                vendors,
            };
        }),
        getVendorsWithin: (_, { distance, latlng, unit }) => __awaiter(void 0, void 0, void 0, function* () {
            const [lat, lng] = latlng.split(',');
            const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
            if (!lat || !lng) {
                throw new Error('Please provide lat and lng in this format lat,lng.');
            }
            const vendors = yield vendor_1.Vendor.find({
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
        }),
        getDistances: (_, { latlng, unit, vendorIds }) => __awaiter(void 0, void 0, void 0, function* () {
            const [lat, lng] = latlng.split(',');
            const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
            if (!lat || !lng) {
                throw new Error('Please provide lat and lng in this format lat,lng.');
            }
            const ids = vendorIds.map(function (id) {
                return new ObjectId(id);
            });
            const distances = yield vendor_1.Vendor.aggregate([
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
        }),
    },
    Mutation: {
        createVendor: (_, { vendor }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { logo } = vendor;
            if (logo) {
                vendor.logo = yield (0, uploadImage_1.default)(logo, 'vd', '../../public/uploads/vendor/', req);
            }
            const id = yield new AutoIncrement_1.default('vendor_id').incSequence();
            const newVendor = yield vendor_1.Vendor.create(Object.assign({ id }, vendor));
            yield user_1.User.findByIdAndUpdate(vendor.user, {
                $addToSet: { vendors: newVendor._id },
            });
            return newVendor;
        }),
        updateVendor: (_, { _id, vendor }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { logo } = vendor;
            if (logo && typeof logo !== 'string') {
                vendor.logo = yield (0, uploadImage_1.default)(logo, 'vd', '../../public/uploads/vendor/', req);
                const p = yield vendor_1.Vendor.findById(_id);
                (0, deleteImage_1.default)(p.logo, '../../public/uploads/vendor/');
            }
            const updatedVendor = yield vendor_1.Vendor.findByIdAndUpdate(_id, vendor, {
                new: true,
                runValidators: true,
            });
            return updatedVendor;
        }),
        deleteVendor: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const vendor = yield vendor_1.Vendor.findById(_id);
            (0, deleteImage_1.default)(vendor.logo, '../../public/uploads/vendor/');
            yield vendor_1.Vendor.findByIdAndDelete(_id);
            return null;
        }),
    },
    Date: date_scalar_1.default,
    FileUpload: graphql_upload_1.GraphQLUpload,
};
//# sourceMappingURL=vendor-rsv.js.map