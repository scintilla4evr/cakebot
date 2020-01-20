import { Component } from "./components/component"
import { createCanvas } from "canvas"

export function renderComponent(component: Component): Buffer {
    let bounds = component.size
    let canvas = createCanvas(
        component.size.width, component.size.height
    )

    let ctx = canvas.getContext("2d")

    component.canvasContext = ctx
    component.propagateContext()
    
    component.render(ctx)

    return canvas.toBuffer("image/png")
}