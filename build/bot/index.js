"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const commands_1 = require("./commands/commands");
const parser_1 = require("./commands/arguments/parser");
class Bot {
    constructor(apiKey, commandPrefix) {
        this.commandPrefix = commandPrefix;
        this.commands = [];
        this.parser = new parser_1.ArgumentParser();
        this.client = new discord_js_1.Client();
        this.client.login(apiKey);
        this.client.on("message", (message) => {
            if (message.author === this.client.user)
                return;
            commands_1.processMessage(this, message);
        });
    }
    addCommand(...commands) {
        this.commands.push(...commands);
    }
}
exports.Bot = Bot;
//# sourceMappingURL=index.js.map