import {
    GuildMember, User,
    Guild, Channel
} from "discord.js"

export type StoragePathItem = string | number | User | GuildMember | Guild | Channel
export type StoragePath = StoragePathItem[]

export interface IStorageHandler {
    get(path: StoragePath): Promise<any>
    set(path: StoragePath, value: any): Promise<void>
    exists(path: StoragePath): Promise<boolean>
    delete(path: StoragePath): Promise<void>
}

export class StorageUtil {
    public static stringifyPath(
        path: StoragePath,
        delimiter?: string
    ): string {
        return path.map(item => {
            if (typeof item === "object" && "id" in item)
                return item.id
            return item.toString()
        }).join(delimiter ? delimiter : "/")
    }
}