export function average(values: number[]): number {
    return values.reduce((acc, v) => acc += v, 0) / values.length
}

export function stdDev(values: number[]): number {
    let avg = average(values)
    return Math.sqrt(
        values.reduce(
            (acc, v) => acc += (v - avg)**2,
            0
        ) / (values.length - 1)
    )
}