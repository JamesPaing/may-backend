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
exports.itemResolvers = void 0;
const graphql_upload_1 = require("graphql-upload");
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const item_1 = require("../../models/item");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
const uploadImage_1 = __importDefault(require("../../utils/uploadImage"));
const deleteImage_1 = __importDefault(require("../../utils/deleteImage"));
exports.itemResolvers = {
    Query: {
        getAllItems: (_, { queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(item_1.Item.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const items = yield withAPIFeatures.query;
            return {
                results: items.length,
                items,
            };
        }),
        getItem: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const item = yield item_1.Item.findById(_id);
            return item;
        }),
        getItemByCategory: (_, { catId, queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(item_1.Item.find({
                categories: catId,
            }), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const items = yield withAPIFeatures.query;
            return {
                results: items.length,
                items,
            };
        }),
        getItemByVendor: (_, { vendorId, queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(item_1.Item.find({
                vendor: vendorId,
            }), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const items = yield withAPIFeatures.query;
            return {
                results: items.length,
                items,
            };
        }),
    },
    Mutation: {
        createItem: (_, { item }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { mainImage } = item;
            if (mainImage) {
                item.mainImage = yield (0, uploadImage_1.default)(mainImage, 'itm', '../../public/uploads/item/', req);
            }
            const id = yield new AutoIncrement_1.default('item_id').incSequence();
            const newItem = yield item_1.Item.create(Object.assign({ id }, item));
            return newItem;
        }),
        updateItem: (_, { _id, item }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('got here');
            const { mainImage } = item;
            if (mainImage && typeof mainImage !== 'string') {
                item.mainImage = yield (0, uploadImage_1.default)(mainImage, 'itm', '../../public/uploads/item/', req);
                const p = yield item_1.Item.findById(_id);
                (0, deleteImage_1.default)(p.mainImage, '../../public/uploads/item/');
            }
            const updatedItem = yield item_1.Item.findByIdAndUpdate(_id, item, {
                new: true,
                runValidators: true,
            });
            return updatedItem;
        }),
        deleteItem: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const item = yield item_1.Item.findById(_id);
            (0, deleteImage_1.default)(item.mainImage, '../../public/uploads/item/');
            yield item_1.Item.findByIdAndDelete(_id);
            return null;
        }),
    },
    Date: date_scalar_1.default,
    FileUpload: graphql_upload_1.GraphQLUpload,
};
//# sourceMappingURL=item-rsv.js.map