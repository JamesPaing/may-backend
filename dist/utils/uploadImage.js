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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.default = (image, filePrefix, filePath, req) => __awaiter(void 0, void 0, void 0, function* () {
    const { createReadStream } = yield image;
    const newFileName = `${filePrefix}-${Date.now()}.png`;
    const pathName = path_1.default.join(__dirname, `${filePath}${newFileName}`);
    const stream = createReadStream();
    yield stream.pipe(fs_1.default.createWriteStream(pathName));
    return `${req.protocol}://${req.get('host')}/uploads/${filePath.split('/')[4]}/${newFileName}`;
});
//# sourceMappingURL=uploadImage.js.map