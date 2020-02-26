import { Component, Size } from "./component";
import { FontWeight, FillResolvable } from "../types";
import { CanvasRenderingContext2D } from "canvas";
import { BoxType } from "../style";

export class UnboundedTextComponent extends Component {
    public _fontFamily = "DefaultSansSerif"
    public _fontWeight: FontWeight = FontWeight.normal
    public _fontSize = 16
    public _fontStyle = "normal"
    public _lineHeight = 1

    constructor(
        public text: string
    ) {
        super()
    }

    get contentSize(): Size {
        this.setContextStyle(this.canvasContext)

        let measurement = this.canvasContext.measureText(
            this.text
        )

        return {
            width: measurement.width,
            height: (
                measurement.actualBoundingBoxDescent - measurement.actualBoundingBoxAscent
            ) * this._lineHeight
        }
    }

    setContextStyle(ctx: CanvasRenderingContext2D) {
        ctx.font = `${this._fontStyle} ${this._fontWeight} ${this._fontSize}px "${this._fontFamily}"`
        ctx.textBaseline = "top"
    }

    render(ctx: CanvasRenderingContext2D) {
        let parentOffset = this.parent?.getChildPosition(this) ?? {
            x: 0, y: 0
        }
        let boxOffset = this.style.getOffset(BoxType.containerBox)
        
        this.setContextStyle(ctx)
        this.style.drawCustom(
            ctx, this,
            (ctx, component) => {
                ctx.fillText(
                    this.text,
                    parentOffset.x + boxOffset.x,
                    parentOffset.y + boxOffset.y
                )
            }
        )

        this.renderDebug(ctx)
    }

    margin(top = 0, right = 0, bottom = 0, left = 0): this {
        return super.margin(top, right, bottom, left)
    }

    padding(top = 0, right = 0, bottom = 0, left = 0): this {
        return super.padding(top, right, bottom, left)
    }

    borderRadius(upperLeft = 0, upperRight = 0, lowerRight = 0, lowerLeft = 0): this {
        return super.borderRadius(upperLeft, upperRight, lowerRight, lowerLeft)
    }

    shadow(offsetX = 0, offsetY = 0, blur = 0, color = "transparent"): this {
        return super.shadow(offsetX, offsetY, blur, color)
    }

    fill(fill: FillResolvable): this {
        return super.fill(fill)
    }

    fontSize(size: number): this {
        this._fontSize = size
        return this
    }

    fontWeight(weight: FontWeight): this {
        this._fontWeight = weight
        return this
    }

    fontFamily(family: string): this {
        this._fontFamily = family
        return this
    }

    fontStyle(style: string): this {
        this._fontStyle = style
        return this
    }

    lineHeight(height: number): this {
        this._lineHeight = height
        return this
    }
}

export function UnboundedText(text: string): UnboundedTextComponent {
    return new UnboundedTextComponent(text)
}