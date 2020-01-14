export function randomInt(min = 0, max = 1): number {
    return Math.floor(
        Math.random() * (max - min + 1) + min
    )
}

export function pick<T>(array: T[]): T {
    return array[
        Math.floor(Math.random() * array.length)
    ]
}