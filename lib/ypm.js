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
const git_1 = __importDefault(require("./source/git"));
// This is Package Manager for YS
class Ypm {
    constructor({ fs, }) {
        this.fs = fs;
    }
    add(_a) {
        return __awaiter(this, arguments, void 0, function* ({ git_url, }) {
            let source;
            if (git_url) {
                source = new git_1.default(this.fs);
            }
            else {
                throw new Error("No source specified");
            }
            yield source.downloadPackage(git_url);
        });
    }
}
exports.default = Ypm;
