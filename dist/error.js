"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidYsPackageError = void 0;
class InvalidYsPackageError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidYsPackage";
    }
}
exports.InvalidYsPackageError = InvalidYsPackageError;
