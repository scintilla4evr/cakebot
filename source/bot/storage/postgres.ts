import {
    IStorageHandler,
    StoragePath, StorageUtil
} from "../storage"
import {Client} from "pg"

export class PostgresStorage implements IStorageHandler {
    public client: Client

    constructor(
        connectionString: string,
        useSSL: boolean,
        public tableName: string
    ) {
        this.client = new Client({
            connectionString: connectionString,
            ssl: useSSL
        })
        this.client.connect().then(() => {
            this.client.query(
                `CREATE TABLE IF NOT EXISTS ${tableName} (id serial PRIMARY KEY, dataPath varchar UNIQUE, contents varchar)`
            )
        })
    }

    public async get(
        path: StoragePath
    ) {
        let dataPath = StorageUtil.stringifyPath(path)
        let query = (await this.client.query(
            `SELECT * FROM ${this.tableName} WHERE dataPath = $1`,
            [dataPath]
        )).rows
        
        if (!query.length) return null

        return JSON.parse(query[0].contents)
    }

    public async exists(
        path: StoragePath
    ) {
        let dataPath = StorageUtil.stringifyPath(path)
        let query = (await this.client.query(
            `SELECT * FROM ${this.tableName} WHERE dataPath = $1`,
            [dataPath]
        )).rows
        
        if (!query.length) return false
        return true
    }

    public async set(
        path: StoragePath,
        value: any
    ) {
        let dataPath = StorageUtil.stringifyPath(path)
        let query = await this.client.query(`
            INSERT INTO ${this.tableName} (dataPath, contents)
            VALUES ($1, $2)
            ON CONFLICT (dataPath)
            DO UPDATE SET contents = $2
            WHERE ${this.tableName}.dataPath = $1
        `, [
            dataPath,
            JSON.stringify(value)
        ])
    }

    public async delete(
        path: StoragePath
    ) {
        let dataPath = StorageUtil.stringifyPath(path)
        await this.client.query(`DELETE FROM ${this.tableName} WHERE dataPath = $1`, [dataPath])
    }
}