import { CanvasRenderingContext2D } from "canvas";
import { Component } from "./components/component";
import { Color } from "../graphics/color";

export class Fill {
    getCanvasFill(
        ctx: CanvasRenderingContext2D, component: Component
    ): any {
        return "transparent"
    }
}

export class SolidFill extends Fill {
    public cssColor: string
    constructor(
        color: string | Color
    ) {
        super()

        if (color instanceof Color) {
            this.cssColor = color.toCSSString()
        } else {
            this.cssColor = color
        }
    }

    getCanvasFill(
        ctx: CanvasRenderingContext2D, component: Component
    ): any {
        return this.cssColor
    }
}