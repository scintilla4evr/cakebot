import { CanvasRenderingContext2D } from "canvas";
import { Component, Offset } from "./components/component";
import { Color } from "../graphics/color";
import { ColorResolvable, resolveColor } from "./types";
import { BoxType } from "./style";

export class Fill {
    getCanvasFill(
        ctx: CanvasRenderingContext2D, component: Component
    ): any {
        return "transparent"
    }
}

export class SolidColorFill extends Fill {
    public cssColor: string
    constructor(
        color: ColorResolvable
    ) {
        super()

        this.cssColor = resolveColor(color)
    }

    getCanvasFill(
        ctx: CanvasRenderingContext2D, component: Component
    ): any {
        return this.cssColor
    }
}

export function SolidColor(color: ColorResolvable): SolidColorFill {
    return new SolidColorFill(color)
}

export class LinearGradientFill extends Fill {
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