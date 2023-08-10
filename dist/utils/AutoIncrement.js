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
Object.defineProperty(exports, "__esModule", { value: true });
const counter_1 = require("../models/counter");
class AutoIncrement {
    constructor(name) {
        this.name = name;
    }
    incSequence() {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield counter_1.Counter.findOneAndUpdate({ id: this.name }, { $inc: { seq: 1 } }, {
                new: true,
                upsert: true,
            });
            return doc.seq;
        });
    }
    decSequence() {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield counter_1.Counter.findOneAndUpdate({ id: this.name }, { $inc: { seq: -1 } }, {
                new: true,
                upsert: true,
            });
            return doc.seq;
        });
    }
    static getCode(name) {
        return __awaiter(this, void 0, void 0, function* () {
            let code = '';
            const counter = yield counter_1.Counter.findOne({
                id: name,
            });
            if (!counter) {
                code = `${name.charAt(0).toUpperCase()}000001`;
                return code;
            }
            const currentCount = counter.seq;
            const currentCountNum = Number(currentCount);
            const newCount = currentCountNum + 1;
            switch (newCount.toString().length) {
                case 1:
                    code = `${name.charAt(0).toUpperCase()}00000${newCount}`;
                    break;
                case 2:
                    code = `${name.charAt(0).toUpperCase()}0000${newCount}`;
                    break;
                case 3:
                    code = `${name.charAt(0).toUpperCase()}000${newCount}`;
                    break;
                case 4:
                    code = `${name.charAt(0).toUpperCase()}00${newCount}`;
                    break;
                case 5:
                    code = `${name.charAt(0).toUpperCase()}0${newCount}`;
                    break;
                case 6:
                    code = `${name.charAt(0).toUpperCase()}${newCount}`;
                    break;
                default:
                    break;
            }
            return code;
        });
    }
}
exports.default = AutoIncrement;
//# sourceMappingURL=AutoIncrement.js.map