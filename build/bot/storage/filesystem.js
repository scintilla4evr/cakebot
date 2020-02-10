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
const storage_1 = require("../storage");
const fs_1 = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const readFileAsync = util_1.promisify(fs_1.readFile);
const existsAsync = util_1.promisify(fs_1.exists);
const writeFileAsync = util_1.promisify(fs_1.writeFile);
const unlinkAsync = util_1.promisify(fs_1.unlink);
class FileSystemStorage {
    constructor(targetDirectory) {
        this.targetDirectory = targetDirectory;
    }
    get(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataPath = path_1.join(this.targetDirectory, storage_1.StorageUtil.stringifyPath(path, "~"));
            try {
                let data = yield readFileAsync(dataPath, "utf-8");
                return JSON.parse(data);
            }
            catch (e) {
                return null;
            }
        });
    }
    set(path, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataPath = path_1.join(this.targetDirectory, storage_1.StorageUtil.stringifyPath(path, "~"));
            yield writeFileAsync(dataPath, JSON.stringify(value), "utf-8");
        });
    }
    exists(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataPath = path_1.join(this.targetDirectory, storage_1.StorageUtil.stringifyPath(path, "~"));
            return yield existsAsync(dataPath);
        });
    }
    delete(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataPath = path_1.join(this.targetDirectory, storage_1.StorageUtil.stringifyPath(path, "~"));
            yield unlinkAsync(dataPath);
        });
    }
    list(path) {
        return __awaiter(this, void 0, void 0, function* () {
            return [];
        });
    }
}
exports.FileSystemStorage = FileSystemStorage;
//# sourceMappingURL=filesystem.js.map