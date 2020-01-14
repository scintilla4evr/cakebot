"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const postgres_1 = require("./postgres");
const filesystem_1 = require("./filesystem");
function setupStorage() {
    switch (process.env.STORAGE_TYPE) {
        case "postgres":
            return new postgres_1.PostgresStorage(process.env.STORAGE_URL, true, process.env.STORAGE_SUBDIR);
        case "filesystem":
            return new filesystem_1.FileSystemStorage(process.env.STORAGE_URL);
        default:
            throw new Error("Unknown storage type specified in STORAGE_TYPE.");
    }
}
exports.setupStorage = setupStorage;
