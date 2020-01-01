"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var discord_js_1 = require("discord.js");
var commands_1 = require("./commands");
var Bot = /** @class */ (function () {
    function Bot(apiKey, commandPrefix) {
        var _this = this;
        this.commandPrefix = commandPrefix;
        this.commands = [];
        this.client = new discord_js_1.Client();
        this.client.login(apiKey);
        this.client.on("message", function (message) {
            if (message.author === _this.client.user)
                return;
            commands_1.MessageContent.processMessage(_this, message);
        });
    }
    Bot.prototype.addCommand = function (command) {
        this.commands.push(command);
    };
    return Bot;
}());
exports.Bot = Bot;
