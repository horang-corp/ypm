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
exports.GitPackageOrder = void 0;
const isomorphic_git_1 = __importDefault(require("isomorphic-git"));
const web_1 = __importDefault(require("isomorphic-git/http/web"));
const path_1 = __importDefault(require("path"));
const source_1 = require("../source");
const package_ref_1 = require("../package_ref");
const manifest_1 = require("../manifest");
const error_1 = require("../error");
const yaml_1 = require("yaml");
class GitSource extends source_1.Source {
    get useCorsProxy() {
        return this.isBrowser;
    }
    constructor(fs, virtualEnv) {
        super();
        this.fs = fs;
        this.virtualEnv = virtualEnv;
        this.isBrowser = typeof window !== "undefined" &&
            typeof window.document !== "undefined";
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
        const tmpDirName = "tmp_" + repoName;
        return path_1.default.join(this.virtualEnv.path, tmpDirName);
    }
    downloadPackage(packageOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            const destinationPath = this.getDestinationPath(packageOrder.url);
            yield isomorphic_git_1.default.clone({
                fs: this.fs,
                corsProxy: this.useCorsProxy
                    ? "https://cors.isomorphic-git.org"
                    : undefined,
                http: web_1.default,
                dir: destinationPath,
                url: packageOrder.url,
                singleBranch: true,
                depth: 1,
            });
            try {
                const manifest = yield manifest_1.Manifest.loadFromDirectory(this.fs, destinationPath);
                if (yield this.virtualEnv.isPackageExists(manifest.name)) {
                    yield this.fs.promises.rm(path_1.default.join(this.virtualEnv.path, manifest.name), { recursive: true });
                }
                yield this.fs.promises.rename(destinationPath, path_1.default.join(this.virtualEnv.path, manifest.name));
                return new package_ref_1.PackageRef(manifest.name, packageOrder);
            }
            catch (err) {
                if (err instanceof Error && "code" in err && err.code === "ENOENT") {
                    throw new error_1.InvalidYsPackageError(`"${packageOrder.url}"은 약속 프로젝트가 아닙니다. "약속프로젝트.yaml" 파일이 없습니다.`);
                }
                throw err;
            }
        });
    }
}
exports.default = GitSource;
class GitPackageOrder extends source_1.PackageOrder {
    serializeForManifest() {
        return { git: this.url };
    }
    constructor(url) {
        super();
        this.url = url;
    }
    static deserializeFromManifest(data) {
        if (!(data instanceof yaml_1.YAMLMap)) {
            throw new Error("Invalid data format");
        }
        const url = data.get("git");
        if (typeof url !== "string") {
            throw new Error("Invalid git URL");
        }
        return new GitPackageOrder(url);
    }
}
exports.GitPackageOrder = GitPackageOrder;
