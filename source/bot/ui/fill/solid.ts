import { CanvasRenderingContext2D } from "canvas";
import { Fill, FreeformFill } from ".";
import { Component } from "../components/component";
import { resolveColor, ColorResolvable } from "../types";

export class SolidColorFill extends FreeformFill {
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