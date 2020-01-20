import { Component, Size } from "./component";
import { FontWeight, FillResolvable } from "../types";
import { CanvasRenderingContext2D } from "canvas";
import { BoxType } from "../style";

export class UnboundedTextComponent extends Component {
    public _fontFamily = "DefaultSansSerif"
    public _fontWeight: FontWeight = FontWeight.normal
    public _fontSize = 16

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
            height: measurement.actualBoundingBoxDescent - measurement.actualBoundingBoxAscent
        }
    }

    setContextStyle(ctx: CanvasRenderingContext2D) {
        ctx.font = `${this._fontWeight} ${this._fontSize}px "${this._fontFamily}"`
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
    }

    margin(top = 0, right = 0, bottom = 0, left = 0): UnboundedTextComponent {
        return super.margin(top, right, bottom, left) as UnboundedTextComponent
    }

    padding(top = 0, right = 0, bottom = 0, left = 0): UnboundedTextComponent {
        return super.padding(top, right, bottom, left) as UnboundedTextComponent
    }

    borderRadius(upperLeft = 0, upperRight = 0, lowerRight = 0, lowerLeft = 0): UnboundedTextComponent {
        return super.borderRadius(upperLeft, upperRight, lowerRight, lowerLeft) as UnboundedTextComponent
    }

    shadow(offsetX = 0, offsetY = 0, blur = 0, color = "transparent"): UnboundedTextComponent {
        return super.shadow(offsetX, offsetY, blur, color) as UnboundedTextComponent
    }

    fill(fill: FillResolvable): UnboundedTextComponent {
        return super.fill(fill) as UnboundedTextComponent
    }

    fontSize(size: number): UnboundedTextComponent {
        this._fontSize = size
        return this
    }

    fontWeight(weight: FontWeight): UnboundedTextComponent {
        this._fontWeight = weight
        return this
    }

    fontFamily(family: string): UnboundedTextComponent {
        this._fontFamily = family
        return this
    }
}

export function UnboundedText(text: string): UnboundedTextComponent {
    return new UnboundedTextComponent(text)
}