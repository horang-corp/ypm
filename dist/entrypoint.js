"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.VirtualEnvironment = exports.SourceRegistry = exports.Entrypoint = void 0;
const path_1 = __importDefault(require("path"));
const package_1 = require("./package");
const git_1 = __importStar(require("./source/git"));
class Entrypoint {
    constructor({ dir, fs, rootPackage }) {
        this.workingDir = dir;
        this.fs = fs;
        this.rootPackage = rootPackage;
        this.virtualEnv = new VirtualEnvironment({
            fs,
            workingDir: this.workingDir,
        });
        this.sources = new SourceRegistry({
            git: new git_1.default(fs, this.virtualEnv),
        });
    }
    static load(_a) {
        return __awaiter(this, arguments, void 0, function* ({ dir, fs }) {
            const rootPackage = yield package_1.Package.load({ fs, dir });
            return new Entrypoint({ dir, fs, rootPackage });
        });
    }
    getSourceFromPackageOrder(packageOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            if (packageOrder instanceof git_1.GitPackageOrder) {
                return this.sources.git;
            }
            throw new Error(`지원하지 않는 소스입니다. ${packageOrder}`);
        });
    }
    add(_a) {
        return __awaiter(this, arguments, void 0, function* ({ git_url, }) {
            let packageRef;
            yield this.virtualEnv.prepare();
            if (git_url) {
                const packageOrder = new git_1.GitPackageOrder(git_url);
                const source = yield this.getSourceFromPackageOrder(packageOrder);
                packageRef = yield source.downloadPackage(packageOrder);
            }
            else {
                throw new Error("No source specified");
            }
            const manifest = this.rootPackage.manifest;
            manifest.addDependency(packageRef);
            yield manifest.save(this.fs, this.workingDir);
        });
    }
    remove(_a) {
        return __awaiter(this, arguments, void 0, function* ({ package_name, }) {
            const manifest = this.rootPackage.manifest;
            manifest.removeDependency(package_name);
            yield manifest.save(this.fs, this.workingDir);
            yield this.sync();
        });
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const dependency of this.rootPackage.manifest.dependencies.values()) {
                if (yield this.virtualEnv.isPackageExists(dependency.name)) {
                    continue;
                }
                const source = yield this.getSourceFromPackageOrder(dependency.packageOrder);
                yield source.downloadPackage(dependency.packageOrder);
            }
            yield this.virtualEnv.prune(Array.from(this.rootPackage.manifest.dependencies.keys()));
        });
    }
}
exports.Entrypoint = Entrypoint;
class SourceRegistry {
    constructor({ git }) {
        this.git = git;
    }
    get(name) {
        switch (name) {
            case "git":
                return this.git;
            default:
                throw new Error(`Source not found: ${name}`);
        }
    }
}
exports.SourceRegistry = SourceRegistry;
class VirtualEnvironment {
    constructor({ fs, workingDir, envName = "의존성", }) {
        this.fs = fs;
        this.path = path_1.default.join(workingDir, envName);
    }
    prepare() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.fs.promises.mkdir(this.path);
                yield this.fs.promises.writeFile(path_1.default.join(this.path, ".gitignore"), "*");
            }
            catch (err) {
                return;
            }
        });
    }
    isPackageExists(packageName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.fs.promises.stat(path_1.default.join(this.path, packageName));
                return true;
            }
            catch (err) {
                if (err instanceof Error && "code" in err && err.code === "ENOENT") {
                    return false;
                }
                throw err;
            }
        });
    }
    listPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const directories = (yield this.fs.promises.readdir(this.path)).filter((dir) => dir !== ".gitignore");
                return directories;
            }
            catch (err) {
                if (err instanceof Error && "code" in err && err.code === "ENOENT") {
                    return [];
                }
                throw err;
            }
        });
    }
    prune(packageNames) {
        return __awaiter(this, void 0, void 0, function* () {
            const packages = yield this.listPackages();
            for (const packageName of packages) {
                if (!packageNames.includes(packageName)) {
                    yield this.fs.promises.rm(path_1.default.join(this.path, packageName), { recursive: true });
                }
            }
        });
    }
}
exports.VirtualEnvironment = VirtualEnvironment;
