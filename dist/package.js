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
exports.Package = void 0;
const error_1 = require("./error");
const manifest_1 = require("./manifest");
class Package {
    constructor({ dir, manifest, }) {
        this.dir = dir;
        this.manifest = manifest;
    }
    static load(_a) {
        return __awaiter(this, arguments, void 0, function* ({ fs, dir, }) {
            try {
                const manifest = yield manifest_1.Manifest.loadFromDirectory(fs, dir);
                return new Package({ dir, manifest });
            }
            catch (err) {
                if (err instanceof Error && "code" in err && err.code === "ENOENT") {
                    throw new error_1.InvalidYsPackageError(`약속 프로젝트가 아닙니다. "${dir}"에 "약속프로젝트.yaml" 파일이 없습니다.
					조언 : "${dir}"에 "약속프로젝트.yaml" 파일을 추가해보세요.
					`);
                }
                throw err;
            }
        });
    }
}
exports.Package = Package;
