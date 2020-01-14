export enum ErrorType {
    parserUnknownTypeAlias,
    parserInvalidCommandSyntax
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