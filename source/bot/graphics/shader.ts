import { Image } from "./image";
import { Color } from "./color";
import { lerp } from "../../util/lerp";

export type Shader = (
    image: Image,
    x: number, y: number
) => Color

export function fxGrayscale(mix: number): Shader {
    mix = Math.min(Math.max(mix, 0), 1)

    return (image: Image, x: number, y: number) => {
        let color = image.sample(x, y)

        let gray = 0.3 * color.r + 0.6 * color.g + 0.1 * color.b
        color.r = lerp(mix, color.r, gray)
        color.g = lerp(mix, color.g, gray)
        color.b = lerp(mix, color.b, gray)

        return color
    }
}