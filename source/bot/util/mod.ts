export function mod(a: number, b: number): number {
    let out = a % b
    return out >= 0 ?
           out :
           (out + b)
}