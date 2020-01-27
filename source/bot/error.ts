export enum ErrorType {
    parserUnknownTypeAlias,
    parserInvalidCommandSyntax,

    commandAccessDenied
}

export class BotError extends Error {
    constructor(
        public type: ErrorType,
        message: string,
        public details = {}
    ) {
        super(message)
    }
}