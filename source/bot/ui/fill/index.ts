import { CanvasRenderingContext2D } from "canvas";
import { Component, Offset } from "../components/component";
import { Color } from "../../graphics/color";
import { ColorResolvable, resolveColor } from "../types";
import { BoxType } from "../style";

export class Fill {
    getCanvasFill(
        ctx: CanvasRenderingContext2D, component: Component
    ): any {
        return "transparent"
    }
}
