import { deepLerp } from "../bot/util/lerp";
import { Color } from "../bot/graphics/color";

let out = new Color(0, 0, 0, 0)

deepLerp(
    0.5,
    new Color(1, 0, 0, 1),
    new Color(0, 0, 1, 1),
    out
)

console.log(out)