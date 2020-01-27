export function lerp(x: number, a: number, b: number): number {
    return x * (b - a) + a
}

export function deepLerp<T>(x: number, a: T, b: T, target: T) {
    if (typeof a !== "object") return

    Object.keys(a).forEach(key => {
        if (typeof a[key] !== "number") return

        let av = a[key]
        let bv = b[key]

        target[key] = lerp(x, av, bv)
    })
}