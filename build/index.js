"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
const storage_1 = require("./bot/storage/storage");
const path_1 = require("path");
let cake = new bot_1.Bot(process.env.DISCORD_API_KEY, process.env.CMD_PREFIX);
cake.storage = storage_1.setupStorage();
let commandFiles = process.env.BOT_MODULES.split(",").map(x => `commands/${x}`);
commandFiles.forEach(f => {
    let filePath = path_1.join(__dirname, f);
    Promise.resolve().then(() => require(filePath)).then(mod => {
        mod.handler(cake);
    });
});
