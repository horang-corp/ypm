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
const isomorphic_git_1 = __importDefault(require("isomorphic-git"));
const web_1 = __importDefault(require("isomorphic-git/http/web"));
class GitSource {
    constructor(fs) {
        this.fs = fs;
    }
    getRemoteRepoName(url) {
        if (url.endsWith("/")) {
            url = url.slice(0, -1);
        }
        const parts = url.split("/");
        const repoName = parts[parts.length - 1];
        const index = repoName.indexOf(".git");
        if (index !== -1) {
            return repoName.slice(0, index);
        }
        return repoName;
    }
    getDestinationPath(url) {
        const repoName = this.getRemoteRepoName(url);
        return `./ys_modules/${repoName}`;
    }
    downloadPackage(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const destinationPath = this.getDestinationPath(url);
            yield isomorphic_git_1.default.clone({
                fs: this.fs,
                corsProxy: "https://cors.isomorphic-git.org",
                http: web_1.default,
                dir: destinationPath,
                url: url,
                singleBranch: true,
                depth: 1,
            });
        });
    }
}
exports.default = GitSource;
