import {
    IStorageHandler,
    StoragePath, StorageUtil
} from "../storage"
import {
    readFile, exists, writeFile, unlink
} from "fs"
import {join} from "path"
import {promisify} from "util"

const readFileAsync = promisify(readFile)
const existsAsync = promisify(exists)
const writeFileAsync = promisify(writeFile)
const unlinkAsync = promisify(unlink)

export class FileSystemStorage implements IStorageHandler {
    constructor(
        public targetDirectory: string
    ) {}

    public async get(
        path: StoragePath
    ) {
        let dataPath = join(this.targetDirectory, StorageUtil.stringifyPath(path, "~"))
        
        try {
            let data = await readFileAsync(dataPath, "utf-8")
            return JSON.parse(data)
        } catch(e) {
            return null
        }
    }

    public async set(
        path: StoragePath,
        value: any
    ) {
        let dataPath = join(this.targetDirectory, StorageUtil.stringifyPath(path, "~"))
        await writeFileAsync(dataPath, JSON.stringify(value), "utf-8")
    }

    public async exists(
        path: StoragePath
    ) {
        let dataPath = join(this.targetDirectory, StorageUtil.stringifyPath(path, "~"))
        return await existsAsync(dataPath)
    }

    public async delete(
        path: StoragePath
    ) {
        let dataPath = join(this.targetDirectory, StorageUtil.stringifyPath(path, "~"))
        await unlinkAsync(dataPath)
    }

    public async list(
        path: StoragePath
    ) {
        return []
    }
}