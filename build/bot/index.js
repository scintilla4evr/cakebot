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
const discord_js_1 = require("discord.js");
const parser_1 = require("./commands/arguments/parser");
const logger_1 = require("./logger");
const watcher_1 = require("./watcher");
const processor_1 = require("./commands/processor");
const conversation_1 = require("./conversation");
class Bot {
    constructor(apiKey, commandPrefix) {
        this.apiKey = apiKey;
        this.commandPrefix = commandPrefix;
        this.commands = [];
        this.parser = new parser_1.ArgumentParser();
        this.logger = new logger_1.Logger();
        this.watcher = new watcher_1.MessageWatcher(this);
    }
    login() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = new discord_js_1.Client();
            this.client.on("message", (message) => __awaiter(this, void 0, void 0, function* () {
                this.logger.messageReceive(message);
                if (message.author === this.client.user)
                    return;
                if (yield conversation_1.processConversations(this, message))
                    return;
                yield processor_1.processMessage(this, message);
                yield this.watcher.process(message);
            }));
            this.client.on("messageUpdate", (oldMessage, message) => {
                this.logger.messageReceive(message);
                if (message.author === this.client.user)
                    return;
                processor_1.processMessage(this, message, true);
                this.watcher.process(message);
            });
            yield this.client.login(this.apiKey);
        });
    }
    logoff() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.destroy();
        });
    }
    addCommand(...commands) {
        commands.forEach(command => {
            let index = this.commands.findIndex(cmd => cmd.commandId === command.commandId);
            if (index >= 0)
                this.commands.splice(index, 1);
            this.commands.push(command);
        });
    }
    startConversation(channel, user, handler) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield conversation_1.startConversation(this, channel, user, handler);
        });
    }
    markChannel(channel, marker) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storage.set(["meta", "markedChannels", marker], channel.id);
        });
    }
    getMarkedChannel(marker) {
        return __awaiter(this, void 0, void 0, function* () {
            let path = ["meta", "markedChannels", marker];
            if (!(yield this.storage.exists(path)))
                return null;
            let id = yield this.storage.get(path);
            return this.client.channels.find(c => c.id === id);
        });
    }
}
exports.Bot = Bot;
//# sourceMappingURL=index.js.map