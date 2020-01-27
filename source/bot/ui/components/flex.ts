import { Component, Offset, Size } from "./component";
import { ComponentListResolvable, resolveComponentList } from "../types";
import { BoxType } from "../style";
import { CanvasRenderingContext2D } from "canvas";
import { RectangleComponent } from "./rectangle";

export enum FlexDirection {
    row, column
}

export enum FlexJustification {
    flexStart, flexEnd, center, spaceAround, spaceEvenly, spaceBetween
}

export enum FlexAlignment {
    flexStart, flexEnd, center
}

export class FlexComponent extends RectangleComponent {
    public _flexDirection: FlexDirection = FlexDirection.row
    public _flexJustification: FlexJustification = FlexJustification.flexStart
    public _flexAlignment: FlexAlignment = FlexAlignment.flexStart

    constructor(
        public width: number,
        public height: number,

        childrenList: ComponentListResolvable
    ) {
        super(width, height, childrenList)
    }

    calculateOffsets(): Offset[] {
        let xOffset = 0, yOffset = 0

        let sizes = this.children.map(c => c.size)
        let childrenWidth = sizes.reduce((acc, size) => acc += size.width, 0)
        let childrenHeight = sizes.reduce((acc, size) => acc += size.height, 0)

        let space = 0

        if (this._flexDirection == FlexDirection.column)
            space = this.height - childrenHeight
        else
            space = this.width - childrenWidth

        return this.children.map((child, i) => {
            let x = xOffset, y = yOffset
            let size = sizes[i]

            if (this._flexDirection == FlexDirection.column) {
                if (this._flexAlignment == FlexAlignment.flexEnd) {
                    x += this.width - size.width
                } else if (this._flexAlignment == FlexAlignment.center) {
                    x += (this.width - size.width) / 2
                }

                if (this._flexJustification == FlexJustification.flexEnd) {
                    y += space
                } else if (this._flexJustification == FlexJustification.center) {
                    y += space / 2
                } else if (this._flexJustification == FlexJustification.spaceEvenly) {
                    y += (i + 1) * space / (this.children.length + 1)
                } else if (this._flexJustification == FlexJustification.spaceAround) {
                    y += (2 * i + 1) * space / (2 * this.children.length)
                } else if (this._flexJustification == FlexJustification.spaceBetween) {
                    y += i * space / (this.children.length - 1)
                }

                yOffset += size.height
            } else {
                if (this._flexAlignment == FlexAlignment.flexEnd) {
                    y += this.height - size.height
                } else if (this._flexAlignment == FlexAlignment.center) {
                    y += (this.height - size.height) / 2
                }

                if (this._flexJustification == FlexJustification.flexEnd) {
                    x += space
                } else if (this._flexJustification == FlexJustification.center) {
                    x += space / 2
                } else if (this._flexJustification == FlexJustification.spaceEvenly) {
                    x += (i + 1) * space / (this.children.length + 1)
                } else if (this._flexJustification == FlexJustification.spaceAround) {
                    x += (2 * i + 1) * space / (2 * this.children.length)
                } else if (this._flexJustification == FlexJustification.spaceBetween) {
                    x += i * space / (this.children.length - 1)
                }

                xOffset += size.width
            }

            return {x, y}
        })
    }

    flexDirection(direction: FlexDirection): this {
        this._flexDirection = direction
        return this
    }

    flexJustification(justification: FlexJustification): this {
        this._flexJustification = justification
        return this
    }

    flexAlignment(alignment: FlexAlignment): this {
        this._flexAlignment = alignment
        return this
    }
}

export function Flex(
    width: number, height: number,
    children: Component[]
): FlexComponent {
    return new FlexComponent(
        width, height, children
    )
}