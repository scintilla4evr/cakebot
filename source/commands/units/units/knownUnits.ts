import { kelvin, fahrenheit, celsius } from "./temperatures";
import { createSIUnits } from "../types/siPrefixes";

export default [
    // Temperature
    kelvin, createSIUnits(kelvin),
    fahrenheit, celsius
]