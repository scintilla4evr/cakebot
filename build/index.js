"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = require("./bot");
const storage_1 = require("./bot/storage/storage");
const path_1 = require("path");
const canvas_1 = require("canvas");
let cake = new bot_1.Bot(process.env.DISCORD_API_KEY, process.env.CMD_PREFIX);
// Storage!
cake.storage = storage_1.setupStorage();
// Fonts
canvas_1.registerFont(path_1.join(__dirname, "../assets/fonts/sans/Inter-Regular.ttf"), {
    family: "DefaultSansSerif",
    weight: "400"
});
// Loading command modules
let commandFiles = process.env.BOT_MODULES.split(",").map(x => `commands/${x}`);
commandFiles.forEach(f => {
    let filePath = path_1.join(__dirname, f);
    Promise.resolve().then(() => require(filePath)).then(mod => {
        mod.handler(cake);
    });
});
//# sourceMappingURL=index.js.map