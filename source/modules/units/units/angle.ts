import { LinearUnit, UnitQuantity } from "../types/unit";

export let degree = new LinearUnit(
    UnitQuantity.angle, 1, 0,
    "°", "degree"
)

export let radian = new LinearUnit(
    UnitQuantity.angle, Math.PI / 180, 0,
    "rad", "radian"
)