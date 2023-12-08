"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coordinate = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const coordinateSchema = new mongoose_1.default.Schema({
    id: Number,
    point: String,
    type: {
        type: String,
        enum: ['user', 'shop'],
    },
});
exports.Coordinate = mongoose_1.default.model('Coordinate', coordinateSchema);
//# sourceMappingURL=coordinate.js.map