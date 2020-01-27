import { LinearUnit, UnitQuantity } from "../types/unit";

export let byte = new LinearUnit(
    UnitQuantity.data, 1, 0,
    "B", "byte"
)

export let bit = new LinearUnit(
    UnitQuantity.data, 1 / 8, 0,
    "b", "bit"
)