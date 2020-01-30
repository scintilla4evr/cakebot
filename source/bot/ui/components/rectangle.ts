import { CanvasRenderingContext2D } from "canvas";
import { Component, Size, Offset } from "./component";
import { BoxType } from "../style";
import { ComponentListResolvable, resolveComponentList } from "../types";

export class RectangleComponent extends Component {
    public childrenOffsets: Offset[]
    public children: Component[]

    constructor(
        public width: number,
        public height: number,

        childrenList: ComponentListResolvable
    ) {
        super()
        
        this.children = resolveComponentList(childrenList)
        this.children.forEach(child => child.parent = this)
    }

    get contentSize(): Size {
        return {
            width: this.width, height: this.height
        }
    }

    propagateContext() {
        this.children.forEach(child => {
            child.canvasContext = this.canvasContext
            child.propagateContext()
        })

        this.childrenOffsets = this.calculateOffsets()
    }

    calculateOffsets(): Offset[] {
        let yOffset = 0

        return this.children.map(child => {
            let y = yOffset
            yOffset += child.size.height

            return {x: 0, y}
        })
    }

    render(ctx: CanvasRenderingContext2D) {
        let parentOffset = this.parent?.getChildPosition(this) ?? {
            x: 0, y: 0
        }

        let boxOffset = this.style.getOffset(BoxType.containerBox)
        let boxSize = this.style.adjustSize(
            this.contentSize, BoxType.containerBox
        )

        this.style.drawContainer(ctx, this)

        this.children.forEach(child => {
            child.render(ctx)
        })
    }

    getChildPosition(child: Component): Offset {
        let childOffset = this.childrenOffsets[
            this.children.indexOf(child)
        ]
        let parentPos = this.parent?.getChildPosition(this) ?? {
            x: 0, y: 0
        }
        let contentOffset = this.style.getOffset(BoxType.contentBox)

        return {
            x: childOffset.x + parentPos.x + contentOffset.y,
            y: childOffset.y + parentPos.y + contentOffset.y
        }
    }

    contractSize(): this {
        this.height = this.children.reduce((acc, c) => acc += c.size.height, 0)
        return this
    }
}

export function Rectangle(
    width: number, height: number,
    children: Component[]
): RectangleComponent {
    return new RectangleComponent(
        width, height, children
    )
}