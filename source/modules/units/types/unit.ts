export enum UnitQuantity {
    currency, volume, length, mass,
    temperature, energy, area,
    speed, time, power, data,
    pressure, angle
}

export interface IUnit {
    quantity: UnitQuantity
    
    symbol: string
    name: string

    convertToUnit: (value: number) => number
    convertFromUnit: (value: number) => number
}

export class LinearUnit implements IUnit {
    constructor(
        public quantity: UnitQuantity,
        public factor: number, public bias: number,
        public symbol: string,
        public name: string
    ) {}

    convertToUnit(base: number) {
        return base * this.factor + this.bias
    }

    convertFromUnit(unit: number) {
        return (unit - this.bias) / this.factor
    }
}