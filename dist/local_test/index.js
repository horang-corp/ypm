"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = __importDefault(require("../lib"));
const fs_1 = __importDefault(require("fs"));
const ypm = new lib_1.default({
    fs: fs_1.default,
});
ypm.add({ git_url: "https://gitlab.com/FreeDOS/devel/insight.git" });
// ypm.remove({ package_name: "ts-lox" });
