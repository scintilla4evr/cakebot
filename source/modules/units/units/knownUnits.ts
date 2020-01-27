import { kelvin, fahrenheit, celsius } from "./temperature";
import { createSIUnits, createBinarySIUnits } from "../types/siPrefixes";
import { IUnit } from "../types/unit";
import { degree, radian } from "./angle";
import { byte, bit } from "./data";

export default [
    // Temperature
    kelvin, createSIUnits(kelvin),
    fahrenheit, celsius,

    // Angle
    degree,
    radian, createSIUnits(radian),

    // Data
    byte, createBinarySIUnits(byte),
    bit, createBinarySIUnits(bit)
].flat() as IUnit[]