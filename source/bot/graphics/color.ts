export class Color {
    constructor(
        public r: number,
        public g: number,
        public b: number,
        public a: number
    ) {}

    static fromJimpStruct(
        col: {
            r: number, g: number, b: number, a: number
        }
    ): Color {
        return new Color(
            col.r / 255, col.g / 255, col.b / 255, col.a / 255
        )
    }

    toJimpStruct(): {
        r: number, g: number, b: number, a: number
    } {
        return {
            r: Math.round(
                Math.max(Math.min(this.r, 1), 0) * 255
            ),
            g: Math.round(
                Math.max(Math.min(this.g, 1), 0) * 255
            ),
            b: Math.round(
                Math.max(Math.min(this.b, 1), 0) * 255
            ),
            a: Math.round(
                Math.max(Math.min(this.a, 1), 0) * 255
            )
        }
    }
}