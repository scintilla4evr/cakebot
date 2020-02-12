import { CanvasRenderingContext2D } from "canvas";
import { Component, Offset, Size } from "../components/component";
import { Color } from "../../graphics/color";
import { ColorResolvable, resolveColor } from "../types";
import { BoxType } from "../style";

export class Fill {
    renderFill(
        ctx: CanvasRenderingContext2D, component: Component
    ): void {}
}

export class FreeformFill extends Fill {
    getCanvasFill(
        ctx: CanvasRenderingContext2D, component: Component
    ): any {
        return "transparent"
    }

    renderFill(
        ctx: CanvasRenderingContext2D, component: Component
    ): void {
        let parentPos = component.parent?.getChildPosition(component) ?? {
            x: 0, y: 0
        }
        let boxOffset = component.style.getOffset(BoxType.containerBox)
        let boxSize = component.style.adjustSize(
            component.contentSize, BoxType.containerBox
        )

        ctx.fillStyle = this.getCanvasFill(ctx, component)
        ctx.fillRect(
            parentPos.x + boxOffset.x,
            parentPos.y + boxOffset.y,
            boxSize.width, boxSize.height
        )
    }
}