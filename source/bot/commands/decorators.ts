import {Bot} from "../index"
import {Message} from "discord.js"

export function RestrictToServers(...servers: string[]) {
    return function(target: any) {
        let original = target

        let newCtor: any = function(...args) {
            let ret = original.apply(this, args)

            let determinators = [
                ...ret.permissionDeterminators,
                function(message: Message): boolean {
                    if (!servers.includes(message.guild.id)) return false
                    return true
                }
            ]
            ret.permissionDeterminators = determinators

            return ret
        }

        newCtor.prototype = original.prototype

        return newCtor
    }
}

export function RestrictToChannels(...channels: string[]) {
    return function(target: any) {
        let original = target

        let newCtor: any = function(...args) {
            let ret = original.apply(this, args)

            let determinators = [
                ...ret.permissionDeterminators,
                function(message: Message): boolean {
                    if (!channels.includes(message.channel.id)) return false
                    return true
                }
            ]
            ret.permissionDeterminators = determinators

            return ret
        }

        newCtor.prototype = original.prototype

        return newCtor
    }
}

export function RestrictToUsers(...users: string[]) {
    return function(target: any) {
        let original = target

        let newCtor: any = function(...args) {
            let ret = original.apply(this, args)

            let determinators = [
                ...ret.permissionDeterminators,
                function(message: Message): boolean {
                    if (!users.includes(message.author.id)) return false
                    return true
                }
            ]
            ret.permissionDeterminators = determinators

            return ret
        }

        newCtor.prototype = original.prototype

        return newCtor
    }
}