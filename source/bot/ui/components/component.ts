import { CanvasRenderingContext2D } from "canvas";
import { ComponentStyle, BoxType } from "../style";
import { Fill } from "../fill";
import { FillResolvable, resolveFill } from "../types";

export type Size = {
    width: number
    height: number
}

export type Offset = {
    x: number,
    y: number
}

export class Component {
    public parent: Component = null
    
    public style = new ComponentStyle()

    public canvasContext: CanvasRenderingContext2D
    
    get contentSize(): Size {
        return {
            width: 0, height: 0
        }
    }
    
    get size(): Size {
        return this.style.adjustSize(
            this.contentSize, BoxType.boundaryBox
        )
    }

    propagateContext() {}

    render(context: CanvasRenderingContext2D) {}

    getChildPosition(child: Component): Offset {
        let parentPos = this.parent?.getChildPosition(this) ?? {
            x: 0, y: 0
        }
        let contentOffset = this.style.getOffset(BoxType.contentBox)

        return {
            x: parentPos.x + contentOffset.x,
            y: parentPos.y + contentOffset.y
        }
    }

    margin(top = 0, right = 0, bottom = 0, left = 0): this {
        this.style.margin = {top, right, bottom, left}
        return this
    }

    padding(top = 0, right = 0, bottom = 0, left = 0): this {
        this.style.padding = {top, right, bottom, left}
        return this
    }

    borderRadius(upperLeft = 0, upperRight = 0, lowerRight = 0, lowerLeft = 0): this {
        this.style.borderRadius = {
            upperLeft, upperRight, lowerRight, lowerLeft
        }
        return this
    }

    shadow(offsetX = 0, offsetY = 0, blur = 0, color = "transparent"): this {
        this.style.shadows.push({
            offsetX, offsetY, blur, color
        })
        return this
    }

    fill(fill: FillResolvable): this {
        this.style.fill = resolveFill(fill)
        return this
    }
}