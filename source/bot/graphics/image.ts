import * as jimp from "jimp"
import Jimp = require("jimp");
import { promisify } from "util";
import { Shader } from "./shader";
import { Color } from "./color";
import { deepLerp } from "../util/lerp";

export enum ImageWrapMethod {
    extendEdges, wrap, wrapSymmetric
}

export enum ImageInterpolationMethod {
    nearestNeighbor, bilinear
}

export class Image {
    constructor(
        private _image: Jimp
    ) {}

    static async create(
        width: number, height: number
    ): Promise<Image> {
        return new Image(
            await jimp.read(width, height)
        )
    }

    static async load(
        url: string
    ): Promise<Image> {
        return new Image(
            await jimp.read(url)
        )
    }

    get width() {
        return this._image.getWidth()
    }

    get height() {
        return this._image.getHeight()
    }

    async toBuffer(): Promise<Buffer> {
        return await this._image.getBufferAsync(jimp.MIME_PNG)
    }

    shade(...shaders: Shader[]) {
        this._image.scan(
            0, 0, this.width, this.height,
            (x, y) => {
                shaders.forEach(shader => {
                    let color = shader(
                        this, x / this.width, y / this.height
                    )
                    let jColor = color.toJimpStruct()
    
                    this._image.setPixelColor(
                        jimp.rgbaToInt(
                            jColor.r, jColor.g, jColor.b, jColor.a, (err, v) => {}
                        ), x, y
                    )
                })
            }
        )
    }

    wrap(x: number, y: number, wrap: ImageWrapMethod = ImageWrapMethod.extendEdges) {
        switch (wrap) {
            case ImageWrapMethod.extendEdges:
                return {
                    x: Math.min(Math.max(x, 0), 1),
                    y: Math.min(Math.max(y, 0), 1)
                }
            case ImageWrapMethod.wrapSymmetric:
                return {
                    x: 2 * Math.abs(x / 2 - Math.floor(x / 2 + 0.5)),
                    y: 2 * Math.abs(y / 2 - Math.floor(y / 2 + 0.5))
                }
            default:
                x = x % 1
                y = y % 1

                return {
                    x: (x < 0) ? (x + 1) : x,
                    y: (y < 0) ? (y + 1) : y
                }
        }
    }

    sample(
        fX: number, fY: number,
        wrap: ImageWrapMethod = ImageWrapMethod.extendEdges,
        method: ImageInterpolationMethod = ImageInterpolationMethod.nearestNeighbor
    ): Color {
        let {x, y} = this.wrap(fX, fY, wrap)

        switch (method) {
            case ImageInterpolationMethod.bilinear:
                let aX = x * this.width, aY = y * this.width

                let xMin = Math.floor(aX), xMax = Math.ceil(aX)
                let xLerp = aX - xMin

                let yMin = Math.floor(aY), yMax = Math.ceil(aY)
                let yLerp = aY - yMin

                let ul = jimp.intToRGBA(this._image.getPixelColor(xMin, yMin))
                let ur = jimp.intToRGBA(this._image.getPixelColor(xMax, yMin))
                let ll = jimp.intToRGBA(this._image.getPixelColor(xMin, yMax))
                let lr = jimp.intToRGBA(this._image.getPixelColor(xMax, yMax))

                let u = {}, l = {}
                deepLerp(xLerp, ul, ur, u)
                deepLerp(xLerp, ll, lr, l)

                let out = {r: 0, g: 0, b: 0, a: 0}
                deepLerp(yLerp, u, l, out)

                return Color.fromJimpStruct(out)
            default:
                x = Math.floor(x * this.width)
                y = Math.floor(y * this.height)

                return Color.fromJimpStruct(
                    jimp.intToRGBA(
                        this._image.getPixelColor(
                            x, y
                        )
                    )
                )

        }        
    }
}