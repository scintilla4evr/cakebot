import { LinearUnit, UnitQuantity } from "../types/unit"

export let kelvin = new LinearUnit(
    UnitQuantity.temperature, 1, 0,
    "K", "kelvin"
)

export let celsius = new LinearUnit(
    UnitQuantity.temperature, 1, -273.15,
    "°C", "Celsius"
)

export let fahrenheit = new LinearUnit(
    UnitQuantity.temperature, 9/5, -459.67,
    "°F", "Fahrenheit"
)