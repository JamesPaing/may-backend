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
exports.categoryResolvers = void 0;
const graphql_upload_1 = require("graphql-upload");
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const category_1 = require("../../models/category");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
const uploadImage_1 = __importDefault(require("../../utils/uploadImage"));
const deleteImage_1 = __importDefault(require("../../utils/deleteImage"));
exports.categoryResolvers = {
    Query: {
        getAllCategories: (_, { queryString: { limit, search, page, forMarket } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            req.query.forMarket = forMarket;
            const withAPIFeatures = new APIFeatures_1.APIFeatures(category_1.Category.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const categories = yield withAPIFeatures.query;
            return {
                results: categories.length,
                categories,
            };
        }),
        getCategory: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const category = yield category_1.Category.findById(_id);
            return category;
        }),
    },
    Mutation: {
        createCategory: (_, { category }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { image } = category;
            if (image) {
                category.image = yield (0, uploadImage_1.default)(image, 'cat', '../../public/uploads/category/', req);
            }
            const id = yield new AutoIncrement_1.default('category_id').incSequence();
            const newCategory = yield category_1.Category.create(Object.assign({ id }, category));
            return newCategory;
        }),
        updateCategory: (_, { _id, category }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            const { image } = category;
            if (image && typeof image !== 'string') {
                category.image = yield (0, uploadImage_1.default)(image, 'cat', '../../public/uploads/category/', req);
                const p = yield category_1.Category.findById(_id);
                (0, deleteImage_1.default)(p.image, '../../public/uploads/category/');
            }
            const updatedCategory = yield category_1.Category.findByIdAndUpdate(_id, category, {
                new: true,
                runValidators: true,
            });
            return updatedCategory;
        }),
        deleteCategory: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const category = yield category_1.Category.findById(_id);
            (0, deleteImage_1.default)(category.image, '../../public/uploads/category/');
            yield category_1.Category.findByIdAndDelete(_id);
            return null;
        }),
    },
    Date: date_scalar_1.default,
    FileUpload: graphql_upload_1.GraphQLUpload,
};
//# sourceMappingURL=category-rsv.js.map