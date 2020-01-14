import { IArgType } from "..";
import { Message } from "discord.js";

export class NumberType implements IArgType {
    public alias = "number"

    isValid(str: string) {
        return !isNaN(+str)
    }

    parse(msg: Message, str: string): number {
        return +str
    }
}

export class StringType implements IArgType {
    public alias = "string"

    isValid(str: string) {
        return true
    }

    parse(msg: Message, str: string): string {
        return str
    }
}