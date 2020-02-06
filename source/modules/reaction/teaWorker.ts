import { parentPort } from "worker_threads";
import { Image, ImageWrapMethod } from "../../bot/graphics/image";
import { Color } from "../../bot/graphics/color";

type TeaInput = {
    headStrength: number,
    torsoStrength: number
}

parentPort.on("message", async (data: TeaInput) => {
    const {headStrength, torsoStrength} = data

    let img = await Image.load(
        "https://cdn.discordapp.com/attachments/548467309103022101/592465025516699694/unknown.png"
    )
    let newImg = img.clone()

    let blobs = [
        {
            x: 269, y: 121,
            radius: 200,
            strength: headStrength,
            scale: [1, 1]
        },
        {
            x: 155, y: 316,
            radius: 250,
            strength: torsoStrength,
            scale: [1, 1]
        }
    ]
    
    newImg.shade(
        (_: Image, x: number, y: number): Color => {
            let dx = 0, dy = 0

            blobs.forEach(blob => {
                let dist = Math.hypot(x - blob.x, y - blob.y)
                if (dist > blob.radius || dist == 0) return

                let lerp = dist / blob.radius
                lerp = (Math.cos(lerp * Math.PI) + 1) / 2

                dx += -((x - blob.x) / blob.radius) * lerp * blob.radius * blob.scale[0] * blob.strength
                dy += -((y - blob.y) / blob.radius) * lerp * blob.radius * blob.scale[1] * blob.strength
            })

            return img.sample(
                x + dx, y + dy,
                ImageWrapMethod.wrapSymmetric
            )
        }
    )

    parentPort.postMessage(
        await newImg.toBuffer()
    )
})