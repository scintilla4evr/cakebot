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

    clone(): Image {
        return new Image(
            this._image.clone()
        )
    }

    shade(...shaders: Shader[]) {
        this._image.scan(
            0, 0, this.width, this.height,
            (x, y) => {
                shaders.forEach(shader => {
                    let color = shader(
                        this, x, y
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
        x /= this.width
        y /= this.height

        switch (wrap) {
            case ImageWrapMethod.extendEdges:
                return {
                    x: Math.min(Math.max(x, 0), 1) * this.width,
                    y: Math.min(Math.max(y, 0), 1) * this.height
                }
            case ImageWrapMethod.wrapSymmetric:
                return {
                    x: 2 * Math.abs(x / 2 - Math.floor(x / 2 + 0.5)) * this.width,
                    y: 2 * Math.abs(y / 2 - Math.floor(y / 2 + 0.5)) * this.height
                }
            default:
                x = x % 1
                y = y % 1

                return {
                    x: ((x < 0) ? (x + 1) : x) * this.width,
                    y: ((y < 0) ? (y + 1) : y) * this.height
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
            default:
                x = Math.max(
                    Math.min(
                        Math.round(x),
                        this.width - 1
                    ),
                    0
                )
                y = Math.max(
                    Math.min(
                        Math.round(y),
                        this.height - 1
                    ),
                    0
                )

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