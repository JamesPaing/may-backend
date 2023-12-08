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
exports.coordinateResolvers = void 0;
const date_scalar_1 = __importDefault(require("../../utils/scalars/date-scalar"));
const coordinate_1 = require("../../models/coordinate");
const AutoIncrement_1 = __importDefault(require("../../utils/classes/AutoIncrement"));
const APIFeatures_1 = require("../../utils/classes/APIFeatures");
exports.coordinateResolvers = {
    Query: {
        getAllCoordinates: (_, { queryString: { limit, search, page } }, { req }) => __awaiter(void 0, void 0, void 0, function* () {
            limit && (req.query.limit = limit);
            search && (req.query.search = search);
            page && (req.query.page = page);
            const withAPIFeatures = new APIFeatures_1.APIFeatures(coordinate_1.Coordinate.find(), req.query)
                ._filter()
                ._fields()
                ._paginate()
                ._sort()
                ._search();
            const coordinates = yield withAPIFeatures.query;
            return {
                results: coordinates.length,
                coordinates,
            };
        }),
        getCoordinate: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            const coordinate = yield coordinate_1.Coordinate.findById(_id);
            return coordinate;
        }),
    },
    Mutation: {
        createCoordinate: (_, { coordinate }) => __awaiter(void 0, void 0, void 0, function* () {
            const id = yield new AutoIncrement_1.default('coordinate_id').incSequence();
            const newCoordinate = yield coordinate_1.Coordinate.create(Object.assign({ id }, coordinate));
            return newCoordinate;
        }),
        updateCoordinate: (_, { _id, coordinate }) => __awaiter(void 0, void 0, void 0, function* () {
            const updatedCoordiante = yield coordinate_1.Coordinate.findByIdAndUpdate(_id, coordinate, {
                new: true,
                runValidators: true,
            });
            return updatedCoordiante;
        }),
        deleteCoordinate: (_, { _id }) => __awaiter(void 0, void 0, void 0, function* () {
            yield coordinate_1.Coordinate.findByIdAndDelete(_id);
            return null;
        }),
    },
    Date: date_scalar_1.default,
};
//# sourceMappingURL=coordinate-rsv.js.map