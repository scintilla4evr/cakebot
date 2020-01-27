import { Color } from "../graphics/color";
import { Component } from "./components/component";
import { Fill } from "./fill";
import { SolidColorFill } from "./fill/solid";

export type ColorResolvable = string | Color

export function resolveColor(color: ColorResolvable): string {
    if (color instanceof Color) return color.toCSSString()
    return color
}

export type FillResolvable = string | Color | Fill

export function resolveFill(fill: FillResolvable): Fill {
    if (fill instanceof Fill) return fill
    return new SolidColorFill(fill)
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