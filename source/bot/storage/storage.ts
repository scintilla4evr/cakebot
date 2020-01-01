import { IStorageHandler } from "../storage";
import { PostgresStorage } from "./postgres";
import { FileSystemStorage } from "./filesystem";

export function setupStorage(): IStorageHandler {
    switch (process.env.STORAGE_TYPE) {
        case "postgres":
            return new PostgresStorage(
                process.env.STORAGE_URL, true, process.env.STORAGE_SUBDIR
            )
        case "filesystem":
            return new FileSystemStorage(
                process.env.STORAGE_URL
            )
        default:
            throw new Error("Unknown storage type specified in STORAGE_TYPE.")
    }
}