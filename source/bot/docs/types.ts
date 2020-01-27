export enum DocsCommandArgType {
    number, string, user
}

export type DocsCommandParameter = {
    name: string,
    description: string,
    type: DocsCommandArgType
}

export type DocsCommandUsage = {
    syntax: string,
    description: string
}

export type DocsCommand = {
    description: string,

    parameters: DocsCommandParameter[],

    usage?: DocsCommandUsage[]
}