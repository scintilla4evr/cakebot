import { CanvasRenderingContext2D } from "canvas";
import { Fill, FreeformFill } from ".";
import { Component, Offset } from "../components/component";
import { resolveColor, ColorResolvable } from "../types";
import { BoxType } from "../style";

export class LinearGradientFill extends FreeformFill {
    public stops: string[]
    constructor(
        colors: ColorResolvable[],
        angle = 0
    ) {
        super()

        this.stops = colors.map(resolveColor)
    }

    getGradientCoords(component: Component): Offset[] {
        let parentPos = component.parent?.getChildPosition(component) ?? {
            x: 0, y: 0
        }
        let boxOffset = component.style.getOffset(BoxType.containerBox)
        let boxSize = component.style.adjustSize(
            component.contentSize, BoxType.containerBox
        )

        return [
            {
                x: parentPos.x + boxOffset.x,
                y: parentPos.y + boxOffset.y
            },
            {
                x: parentPos.x + boxOffset.x + boxSize.width,
                y: parentPos.y + boxOffset.y
            }
        ]
    }

    getCanvasFill(
        ctx: CanvasRenderingContext2D, component: Component
    ): any {
        let coords = this.getGradientCoords(component)
        let gradient = ctx.createLinearGradient(
            coords[0].x, coords[0].y, coords[1].x, coords[1].y
        )

        this.stops.forEach((color, i) => {
            gradient.addColorStop(
                i / (this.stops.length - 1),
                color
            )
        })

        return gradient
    }
}

export function LinearGradient(colors: ColorResolvable[], angle = 0): LinearGradientFill {
    return new LinearGradientFill(colors, angle)
}