import { EventEmitter } from "events"
import { Command } from "./commands/commands";
import { Message } from "discord.js";

export class LogMessage {}

export class CommandInvokeLogMessage {
    constructor(
        public command: Command,
        public message: Message
    ) {}
}

export class MessageReceiveLogMessage {
    constructor(
        public message: Message
    ) {}
}

export class Logger extends EventEmitter {
    public messages: LogMessage[] = []

    log(message: LogMessage) {
        this.messages.push(message)
        this.emit("log", message)
    }

    commandInvoke(command: Command, message: Message) {
        this.log(
            new CommandInvokeLogMessage(command, message)
        )
        this.emit("commandInvoke", command, message)
    }

    messageReceive(message: Message) {
        this.log(
            new MessageReceiveLogMessage(message)
        )
        this.emit("messageReceive", message)
    }
}