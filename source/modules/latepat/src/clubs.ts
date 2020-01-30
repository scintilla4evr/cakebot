import { Bot } from "../../../bot";
import { LatePatGuess } from "./late";
import { Rectangle } from "../../../bot/ui/components/rectangle";
import { renderComponent } from "../../../bot/ui";
import { Flex, FlexJustification, FlexAlignment, FlexDirection } from "../../../bot/ui/components/flex";
import { UnboundedText } from "../../../bot/ui/components/unboundedText";
import { FontWeight } from "../../../bot/ui/types";
import { resolveUIImage } from "../../../bot/ui/image";
import { ImageFill } from "../../../bot/ui/fill/image";
import { Color } from "../../../bot/graphics/color";
import { LinearGradient } from "../../../bot/ui/fill/linearGradient";

export class LatePatClub {
    constructor(
        public guess: number,
        public name: string,

        public accentColor1: Color,
        public accentColor2: Color,
        public accentColor3: Color,
    ) {}

    get json() {
        return {
            guess: this.guess,
            name: this.name,

            colors: {
                accent1: this.accentColor1.toJimpStruct(),
                accent2: this.accentColor2.toJimpStruct(),
                accent3: this.accentColor3.toJimpStruct(),
            }
        }
    }

    async renderCard(guesses: LatePatGuess[]): Promise<Buffer> {
        let clubGuesses = guesses.filter(g => g.guess == this.guess)
        let guessAvatars = await Promise.all(
            clubGuesses.map(
                async g => await resolveUIImage(g.user.avatarURL)
            )
        )

        let clubCard = Rectangle(288, 200, [
            Flex(
                288 - 16, 64,
                [
                    UnboundedText(this.name)
                        .fill("#fff")
                        .fontWeight(FontWeight.bold)
                        .fontSize(20),
                    UnboundedText(this.guess.toString())
                        .fill("#fff")
                        .fontSize(16),
                ]
            )
                .fill(
                    LinearGradient(
                        [this.accentColor1, this.accentColor2, this.accentColor3]
                    )
                )
                .margin(8, 8, 8, 8)
                .borderRadius(32, 32, 32, 32)
                .flexJustification(FlexJustification.center)
                .flexAlignment(FlexAlignment.center)
                .flexDirection(FlexDirection.column),
            Flex(
                288 - 8, 40,
                guessAvatars.map(
                    img => Rectangle(32, 32, [])
                        .fill(new ImageFill(img))
                        .margin(4, 4, 4, 4)
                        .borderRadius(16, 16, 16, 16)
                )
            )
                .padding(4, 4, 4, 4)
                .flexJustification(FlexJustification.center)
        ])
            .padding(8, 8, 8, 8)
            .borderRadius(16, 16, 16, 16)
            .fill("#080808")
            .contractSize()

        return renderComponent(clubCard)
    }

    static fromJson(json: {
        guess: number,
        name: string,

        colors: {
            accent1: {r: number, g: number, b: number, a: number},
            accent2: {r: number, g: number, b: number, a: number},
            accent3: {r: number, g: number, b: number, a: number}
        }
    }): LatePatClub {
        return new LatePatClub(
            json.guess, json.name,
            Color.fromJimpStruct(json.colors.accent1),
            Color.fromJimpStruct(json.colors.accent2),
            Color.fromJimpStruct(json.colors.accent3),
        )
    }

    static async getClub(bot: Bot, guess: number): Promise<LatePatClub> {
        if (!(await bot.storage.exists([
            "latePat", "clubs", guess
        ]))) return null

        return LatePatClub.fromJson(
            await bot.storage.get([
                "latePat", "clubs", guess
            ])
        )
    }

    static async addClub(bot: Bot, club: LatePatClub) {
        await bot.storage.set(
            ["latePat", "clubs", club.guess],
            club.json
        )
    }
}