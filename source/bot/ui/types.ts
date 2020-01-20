import { Color } from "../graphics/color";
import { Fill, SolidFill } from "./fill";
import { Component } from "./components/component";

export type FillResolvable = string | Color | Fill

export function resolveFill(fill: FillResolvable): Fill {
    if (fill instanceof Fill) return fill
    return new SolidFill(fill)
}

export type ComponentListResolvable = Component | Component[]

export function resolveComponentList(list: ComponentListResolvable): Component[] {
    if (list instanceof Component) {
        return [list]
    }
    return list
}

export enum FontWeight {
    ultralight = 100,
    thin = 200,
    light = 300,
    semilight = 350,
    normal = 400,
    medium = 500,
    semibold = 600,
    bold = 700,
    heavy = 800,
    black = 900
}