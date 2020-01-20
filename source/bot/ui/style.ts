import { Size, Offset, Component } from "./components/component"
import { CanvasRenderingContext2D } from "canvas"
import { Fill } from "./fill"

export type OutlineBounds = {
    left: number,
    top: number,
    right: number,
    bottom: number
}

export enum BoxType {
    contentBox, containerBox, boundaryBox
}

export type CornerOffsets = {
    upperLeft: number,
    upperRight: number,
    lowerLeft: number,
    lowerRight: number
}

export type Shadow = {
    offsetX: number,
    offsetY: number,
    blur: number,
    color: string
}

export class ComponentStyle {
    public margin: OutlineBounds = {
        left: 0, top: 0, right: 0, bottom: 0
    }
    public padding: OutlineBounds = {
        left: 0, top: 0, right: 0, bottom: 0
    }
    public borderRadius: CornerOffsets = {
        upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0
    }
    public shadows: Shadow[] = []
    public fill: Fill = new Fill()

    setShadow(shadow: Shadow, ctx: CanvasRenderingContext2D) {
        ctx.shadowBlur = shadow.blur
        ctx.shadowColor = shadow.color
        ctx.shadowOffsetX = shadow.offsetX
        ctx.shadowOffsetY = shadow.offsetY

        ctx.fillStyle = shadow.color
    }

    drawContainer(ctx: CanvasRenderingContext2D, component: Component) {
        let parentPos = component.parent?.getChildPosition(component) ?? {
            x: 0, y: 0
        }
        let boxOffset = this.getOffset(BoxType.containerBox)
        let boxSize = this.adjustSize(
            component.contentSize, BoxType.containerBox
        )

        let x = parentPos.x + boxOffset.x
        let y = parentPos.y + boxOffset.y

        ctx.beginPath()
        ctx.arc(
            x + this.borderRadius.upperLeft,
            y + this.borderRadius.upperLeft,
            this.borderRadius.upperLeft,
            Math.PI, Math.PI * 3 / 2
        )
        ctx.arc(
            x + boxSize.width - this.borderRadius.upperRight,
            y + this.borderRadius.upperRight,
            this.borderRadius.upperRight,
            Math.PI * 3 / 2, Math.PI * 2
        )
        ctx.arc(
            x + boxSize.width - this.borderRadius.lowerRight,
            y + boxSize.height - this.borderRadius.lowerRight,
            this.borderRadius.lowerRight,
            0, Math.PI / 2
        )
        ctx.arc(
            x + this.borderRadius.lowerLeft,
            y + boxSize.height - this.borderRadius.lowerLeft,
            this.borderRadius.lowerLeft,
            Math.PI / 2, Math.PI
        )

        ctx.globalCompositeOperation = "multiply"
        this.shadows.forEach(shadow => {
            this.setShadow(shadow, ctx)
            ctx.fill()
        })

        ctx.globalCompositeOperation = "source-over"
        ctx.fillStyle = this.fill.getCanvasFill(ctx, component)
        ctx.fill()
    }

    drawCustom(
        ctx: CanvasRenderingContext2D, component: Component,
        drawCallback: (ctx: CanvasRenderingContext2D, component: Component) => void
    ) {
        ctx.globalCompositeOperation = "multiply"
        this.shadows.forEach(shadow => {
            this.setShadow(shadow, ctx)
            drawCallback(ctx, component)
        })

        ctx.globalCompositeOperation = "source-over"
        ctx.fillStyle = this.fill.getCanvasFill(ctx, component)
        drawCallback(ctx, component)
    }

    adjustSize(
        size: Size, box: BoxType = BoxType.boundaryBox
    ): Size {
        let width = size.width, height = size.height

        if (box != BoxType.contentBox) {
            width += this.padding.left + this.padding.right
            height += this.padding.top + this.padding.bottom
        }
        if (box == BoxType.boundaryBox) {
            width += this.margin.left + this.margin.right
            height += this.margin.top + this.margin.bottom
        }

        return {width, height}
    }

    getOffset(box: BoxType = BoxType.boundaryBox): Offset {
        let x = 0, y = 0

        if (box == BoxType.contentBox) {
            x += this.padding.left + this.margin.left
            y += this.padding.top + this.margin.top
        }
        if (box == BoxType.containerBox) {
            x += this.margin.left
            y += this.margin.top
        }

        return {x, y}
    }
}