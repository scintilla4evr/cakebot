import { Bot } from "../../bot";
import { MorseCommand } from "./commands/morse";
import { A1Z26Command } from "./commands/a1z26";
import { AtbashCommand } from "./commands/atbash";
import { Base64Command } from "./commands/base64";
import { Rot13Command, RotNCommand, RotAllCommand } from "./commands/rot";
import { FrequencyCommand } from "./commands/frequency";
import { HexCommand } from "./commands/hex";

export async function handler(bot: Bot) {
    bot.addCommand(
        new MorseCommand(),
        new A1Z26Command(),
        new AtbashCommand(),

        new Base64Command(),
        new HexCommand(),

        new Rot13Command(),
        new RotNCommand(),
        new RotAllCommand(),

        new FrequencyCommand()
    )
}