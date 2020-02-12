import { CanvasRenderingContext2D, createCanvas } from "canvas";
import { Fill } from ".";
import { Component, Size, Offset } from "../components/component";
import { resolveColor, ColorResolvable } from "../types";
import { UIImage, UIImageResolvable, resolveUIImage } from "../image";
import { BoxType } from "../style";

export enum ImageSize {
    stretch, cover
}

export enum ImageAttachment {
    component, canvas
}

export class ImageFill extends Fill {
    constructor(
        public image: UIImage,
        public size: ImageSize = ImageSize.cover,
        public attachment: ImageAttachment = ImageAttachment.component
    ) {
        super()
    }

    adjustImageSize(target: Size): Size {
        let w = this.image.image.width
        let h = this.image.image.height
        let aspectRatio = w / h

        if (this.size == ImageSize.stretch) return target
        else if (this.size == ImageSize.cover) {
            if (aspectRatio > 1) {
                w = target.height * aspectRatio
                h = target.height
            } else {
                w = target.width
                h = target.width / aspectRatio
            }
        }

        return {
            width: w, height: h
        }
    }
    
    renderFill(
        ctx: CanvasRenderingContext2D, component: Component
    ): void {
        let imagePos: Offset, imageSize: Size

        if (this.attachment == ImageAttachment.component) {
            let parentPos = component.parent?.getChildPosition(component) ?? {
                x: 0, y: 0
            }
            let boxOffset = component.style.getOffset(BoxType.containerBox)
            let boxSize = component.style.adjustSize(
                component.contentSize, BoxType.containerBox
            )

            imageSize = this.adjustImageSize(boxSize)

            imagePos = {
                x: parentPos.x + boxOffset.x + (boxSize.width - imageSize.width) / 2,
                y: parentPos.y + boxOffset.y + (boxSize.height - imageSize.height) / 2
            }
        } else if (this.attachment == ImageAttachment.canvas) {
            imageSize = this.adjustImageSize({
                width: ctx.canvas.width,
                height: ctx.canvas.height
            })

            imagePos = {
                x: (ctx.canvas.width - imageSize.width) / 2,
                y: (ctx.canvas.height - imageSize.height) / 2
            }
        }

        ctx.drawImage(
            this.image.image,
            imagePos.x, imagePos.y,
            imageSize.width, imageSize.height
        )
    }
}
