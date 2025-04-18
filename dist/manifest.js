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
exports.Manifest = void 0;
const path_1 = __importDefault(require("path"));
const package_ref_1 = require("./package_ref");
const yaml_1 = require("yaml");
const git_1 = require("./source/git");
class Manifest {
    get name() {
        return this.yamlDoc.get("이름");
    }
    get description() {
        return this.yamlDoc.get("설명");
    }
    get author() {
        return this.yamlDoc.get("만든이");
    }
    get dependencies() {
        var _a;
        (_a = this._dependencies) !== null && _a !== void 0 ? _a : (this._dependencies = this.parseDependencies());
        return this._dependencies;
    }
    constructor({ yamlDoc, }) {
        this._dependencies = null;
        this.yamlDoc = yamlDoc;
    }
    static loadFromDirectory(fs, dir) {
        return __awaiter(this, void 0, void 0, function* () {
            const manifestPath = path_1.default.join(dir, "약속프로젝트.yaml");
            const content = yield fs.promises.readFile(manifestPath);
            return Manifest.parse(content.toString());
        });
    }
    static parse(content) {
        const parsedYamlDocument = (0, yaml_1.parseDocument)(content);
        return new Manifest({
            yamlDoc: parsedYamlDocument,
        });
    }
    parseDependencies() {
        const dependenciesNode = this.yamlDoc.get("의존성");
        if (!dependenciesNode || (dependenciesNode === null || dependenciesNode === void 0 ? void 0 : dependenciesNode.items) === undefined) {
            return new Map();
        }
        const dependencies = new Map();
        for (const { key: name, value: packageOrderNode } of dependenciesNode.items) {
            let packageOrder = null;
            if (packageOrderNode instanceof yaml_1.YAMLMap) {
                if (packageOrderNode.has("git")) {
                    packageOrder = git_1.GitPackageOrder.deserializeFromManifest(packageOrderNode);
                }
            }
            const ref = new package_ref_1.PackageRef(name.value, packageOrder);
            dependencies.set(name.value, ref);
        }
        return dependencies;
    }
    save(fs, dir) {
        const newYaml = this.yamlDoc.toString();
        return fs.promises.writeFile(path_1.default.join(dir, "약속프로젝트.yaml"), newYaml);
    }
    addDependency(dependency) {
        let dependencyNode = this.yamlDoc.get("의존성");
        if (!dependencyNode) {
            dependencyNode = new yaml_1.YAMLMap();
            this.yamlDoc.set("의존성", dependencyNode);
        }
        dependencyNode.set(dependency.name, dependency.packageOrder.serializeForManifest());
        this.dependencies.set(dependency.name, dependency);
    }
    removeDependency(name) {
        const dependenciesNode = this.yamlDoc.get("의존성");
        if (!dependenciesNode) {
            return;
        }
        dependenciesNode.delete(name);
        if (dependenciesNode.items.length === 0) {
            this.yamlDoc.set("의존성", {});
        }
        this.dependencies.delete(name);
    }
}
exports.Manifest = Manifest;
