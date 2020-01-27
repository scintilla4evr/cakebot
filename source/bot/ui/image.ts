import { Image, loadImage } from "canvas";
import { Image as GfxImage } from "../graphics/image"

export class UIImage {
    constructor(
        public image: Image
    ) {}

    static async load(
        urlOrBuffer: string | Buffer
    ) {
        return new UIImage(
            await loadImage(urlOrBuffer)
        )
    }
}

export type UIImageResolvable = UIImage | string | Buffer | GfxImage

export async function resolveUIImage(img: UIImageResolvable): Promise<UIImage> {
    if (img instanceof GfxImage) {
        return await UIImage.load(
            await img.toBuffer()
        )
    } else if (img instanceof UIImage) {
        return img
    }
    return await UIImage.load(img)
}
