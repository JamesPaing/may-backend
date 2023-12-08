"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
exports.default = (image, filePath) => {
    const fileToDelete = `${__dirname}/${filePath}${image.split('/')[4]}`;
    if (fs_1.default.existsSync(fileToDelete)) {
        fs_1.default.unlink(fileToDelete, (err) => {
            if (err)
                throw err;
        });
    }
};
//# sourceMappingURL=deleteImage.js.map