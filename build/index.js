"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bot_1 = require("./bot");
var path_1 = require("path");
var storage_1 = require("./bot/storage/storage");
var cake = new bot_1.Bot(process.env.DISCORD_API_KEY, process.env.CMD_PREFIX);
cake.storage = storage_1.setupStorage();
var commandFiles = process.env.BOT_MODULES.split(",").map(function (x) { return "commands/" + x; });
commandFiles.forEach(function (f) {
    var filePath = path_1.join(__dirname, f);
    Promise.resolve().then(function () { return require(filePath); }).then(function (mod) {
        mod.handler(cake);
    });
});
