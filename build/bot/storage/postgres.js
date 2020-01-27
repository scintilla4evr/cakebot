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
const pg_1 = require("pg");
class PostgresStorage {
    constructor(connectionString, useSSL, tableName) {
        this.tableName = tableName;
        this.client = new pg_1.Client({
            connectionString: connectionString,
            ssl: useSSL
        });
        this.client.connect().then(() => {
            this.client.query(`CREATE TABLE IF NOT EXISTS ${tableName} (id serial PRIMARY KEY, dataPath varchar UNIQUE, contents varchar)`);
        });
    }
    get(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataPath = storage_1.StorageUtil.stringifyPath(path);
            let query = (yield this.client.query(`SELECT * FROM ${this.tableName} WHERE dataPath = $1`, [dataPath])).rows;
            if (!query.length)
                return null;
            return JSON.parse(query[0].contents);
        });
    }
    exists(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataPath = storage_1.StorageUtil.stringifyPath(path);
            let query = (yield this.client.query(`SELECT * FROM ${this.tableName} WHERE dataPath = $1`, [dataPath])).rows;
            if (!query.length)
                return false;
            return true;
        });
    }
    set(path, value) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataPath = storage_1.StorageUtil.stringifyPath(path);
            let query = yield this.client.query(`
            INSERT INTO ${this.tableName} (dataPath, contents)
            VALUES ($1, $2)
            ON CONFLICT (dataPath)
            DO UPDATE SET contents = $2
            WHERE ${this.tableName}.dataPath = $1
        `, [
                dataPath,
                JSON.stringify(value)
            ]);
        });
    }
    delete(path) {
        return __awaiter(this, void 0, void 0, function* () {
            let dataPath = storage_1.StorageUtil.stringifyPath(path);
            yield this.client.query(`DELETE FROM ${this.tableName} WHERE dataPath = $1`, [dataPath]);
        });
    }
}
exports.PostgresStorage = PostgresStorage;
//# sourceMappingURL=postgres.js.map