import { Command } from "../commands/commands";
import { Bot } from "..";
import { dedent } from "../util/dedent";
import { ArgumentTarget } from "../commands/arguments/parser";

function generateCommandSyntax(pattern: (ArgumentTarget | string)[]): string {
    return pattern.map(
        item => typeof item === "string" ?
                item :
                `<em class="argument" data-type="${item.type.alias}">${item.key}</em>`
    ).join(" ")
}

function generateCommandDocs(bot: Bot, command: Command): string {
    let pattern = bot.parser.processRawPattern(command.pattern)
    let args = pattern.filter(item => !(typeof item !== "string"))

    let cmdName = `${bot.commandPrefix}${command.name}`

    return dedent`
        <a name="${command.commandId}">
        <h2>${cmdName}</h2>

        <p class="description">${command.docs.description}</p>

        <h3>Syntax</h3>
        <pre>${cmdName} ${generateCommandSyntax(pattern)}</pre>

${command.docs.parameters.length ?
`
        <h3>Parameters</h3>
        <ul>
${
    command.docs.parameters.map(
        (param, i) => `
            <li>
                <a name="${command.commandId}_${param.name}"></a>
                <code>${param.name}</code> - ${param.description}
            </li>
        `
    ).join("\n")
}
        </ul>
`
: ""}

${command.docs.usage ?
    `
            <h3>Examples</h3>
    ${
        command.docs.usage.map(
            usage => `
                <p class="usage">${usage.description}</p>
                <pre class="usage">${cmdName} ${usage.syntax}</pre>
            `
        ).join("\n")
    }
    `
    : ""}
    `
}

export function generateDocs(bot: Bot): string {
    return bot.commands.filter(c => c.docs)
    .map(c => generateCommandDocs(bot, c)).join("\n\n")
}