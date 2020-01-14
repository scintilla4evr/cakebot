import { IUnit, UnitQuantity } from "./unit"

export type SIPrefix = {
    name: string
    symbol: string
    exponent: number
}

export let prefixes: SIPrefix[] = [
    { name: "yotta",    symbol: "Y",    exponent: 24 },
    { name: "zetta",    symbol: "Z",    exponent: 21 },
    { name: "exa",      symbol: "E",    exponent: 18 },
    { name: "peta",     symbol: "P",    exponent: 15 },
    { name: "tera",     symbol: "T",    exponent: 12 },
    { name: "giga",     symbol: "G",    exponent: 9 },
    { name: "mega",     symbol: "M",    exponent: 6 },
    { name: "kilo",     symbol: "k",    exponent: 3 },
    { name: "hecto",    symbol: "h",    exponent: 2 },
    { name: "deca",     symbol: "da",   exponent: 1 },
    { name: "deci",     symbol: "d",    exponent: -1 },
    { name: "centi",    symbol: "c",    exponent: -2 },
    { name: "milli",    symbol: "m",    exponent: -3 },
    { name: "micro",    symbol: "μ",    exponent: -6 },
    { name: "nano",     symbol: "n",    exponent: -9 },
    { name: "pico",     symbol: "p",    exponent: -12 },
    { name: "femto",    symbol: "f",    exponent: -15 },
    { name: "atto",     symbol: "a",    exponent: -18 },
    { name: "zepto",    symbol: "z",    exponent: -21 },
    { name: "yocto",    symbol: "y",    exponent: -24 }
]

export class SIUnit implements IUnit {
    public quantity: UnitQuantity
    public symbol: string
    public name: string

    constructor(
        public unit: IUnit,
        public prefix: SIPrefix
    ) {
        this.quantity = unit.quantity
        this.symbol = `${prefix.symbol}${unit.symbol}`
        this.name = `${prefix.name}${unit.name}`
    }

    get siMultiplier() {
        return 10 ** this.prefix.exponent
    }

    convertToUnit(base: number) {
        return this.unit.convertToUnit(base) * this.siMultiplier
    }

    convertFromUnit(unit: number) {
        return this.unit.convertFromUnit(unit / this.siMultiplier)
    }
}

export function createSIUnits(unit: IUnit): SIUnit[] {
    return prefixes.map(
        prefix => new SIUnit(unit, prefix)
    )
}