import fetch from "node-fetch";
import { Color } from "../graphics/color";

function colorsToCMPalette(colors: Color[]) {
    return colors.map(
        c => {
            if (c == null) return "N"
            
            let quantized = c.quantize()
            return [quantized.r, quantized.b, quantized.b]
        }
    )
}

function CMPaletteToColors(colors: any) {
    return colors.map(
        c => new Color(c[0] / 255, c[1] / 255, c[2] / 255, 1)
    )
}

export async function getColorPalette(
    initialColors?: Color[],
    model = "default"
): Promise<Color[]> {
    let palette = initialColors ?
                  colorsToCMPalette(initialColors) :
                  ["N", "N", "N", "N", "N"]
    let request = {
        model,
        input: palette
    }

    let data = await fetch(
        "http://colormind.io/api/", {
            method: "POST",
            body: JSON.stringify(request)
        }
    )
    
    return CMPaletteToColors(
        (await data.json()).result
    )
}