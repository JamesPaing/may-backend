"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const graphql_upload_1 = require("graphql-upload");
const app = (0, express_1.default)();
app.use(express_1.default.static('public/'));
app.use((0, graphql_upload_1.graphqlUploadExpress)());
exports.default = app;
//# sourceMappingURL=app.js.map