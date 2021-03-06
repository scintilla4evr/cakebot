import { Bot } from "../../bot";
import { LatePatLinkDetector } from "./src/watcher";
import { getStreamInfo } from "../../bot/apis/youtube";
import { LatePatState } from "./src/state";
import { LatePatRoundEndCommand, LatePatRoundCheckCommand, LatePatRoundClubCommand } from "./src/commands/dev";
import { LatePatGuessCommand } from "./src/commands/guess";
import { LatePatGuessesCommand } from "./src/commands/guesses";
import { TextChannel } from "discord.js";
import { LatePatBoardCommand } from "./src/commands/lateboard";


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
            await latePatState.startRound(streamInfo.video)
        }
    })

    bot.addCommand(
        new LatePatRoundEndCommand(latePatState),
        new LatePatRoundCheckCommand(latePatState),
        new LatePatRoundClubCommand(latePatState),

        new LatePatGuessCommand(latePatState),
        new LatePatGuessesCommand(latePatState),

        new LatePatBoardCommand(latePatState)
    )
}