import { Bot } from "..";
import { User, Message, GuildChannel } from "discord.js";

export type UserStats = {
    count: number,
    channels: {
        [prop: string]: {
            count: number,
            weekdays: number[]
        }
    }
}

export async function getUserStats(
    bot: Bot, user: User
): Promise<UserStats> {
    const stats = await bot.storage.get([
        "stats", user, "data"
    ])

    if (stats) return stats as UserStats

    const defaultStats = {
        count: 0,
        channels: {}
    }
    await setUserStats(bot, user, defaultStats)

    return defaultStats
}

export async function setUserStats(
    bot: Bot, user: User, stats: UserStats
) {
    await bot.storage.set([
        "stats", user, "data"
    ], stats)
}

export async function logMessageStat(
    bot: Bot, message: Message
) {
    const channel = message.channel
    const user = message.author
    if (!(channel instanceof GuildChannel)) return

    const stats = await getUserStats(bot, user)
    const weekday = message.createdAt.getDay()

    if (channel.id in stats.channels) {
        stats.channels[channel.id].count++
        stats.channels[channel.id].weekdays[weekday]++
    } else {
        stats.channels[channel.id] = {
            count: 1,
            weekdays: Array(7).fill(0)
        }
        stats.channels[channel.id].weekdays[weekday]++
    }

    stats.count++

    await setUserStats(bot, user, stats)
}