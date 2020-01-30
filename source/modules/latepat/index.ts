import { Bot } from "../../bot";
import { LatePatLinkDetector } from "./src/watcher";
import { getStreamInfo } from "../../bot/apis/youtube";
import { LatePatState } from "./src/state";
import { LatePatRoundStartCommand, LatePatRoundEndCommand, LatePatRoundCheckCommand, LatePatRoundClubCommand } from "./src/commands/dev";
import { LatePatGuessCommand } from "./src/commands/guess";
import { LatePatGuessesCommand } from "./src/commands/guesses";
import { TextChannel } from "discord.js";


export async function handler(bot: Bot) {
    let latePatState = new LatePatState(
        bot,
        await bot.getMarkedChannel("latePat.guessingChannel") as TextChannel
    )

    await latePatState.import()

    // Detect YT links
    let linkDetector = new LatePatLinkDetector(bot)
    linkDetector.on("link", async (videoId) => {
        let streamInfo = await getStreamInfo(videoId)

        if (streamInfo.liveStream) {
            await latePatState.startRound(videoId)
        }
    })

    bot.addCommand(
        new LatePatRoundStartCommand(latePatState),
        new LatePatRoundEndCommand(latePatState),
        new LatePatRoundCheckCommand(latePatState),
        new LatePatRoundClubCommand(latePatState),

        new LatePatGuessCommand(latePatState),
        new LatePatGuessesCommand(latePatState)
    )
}