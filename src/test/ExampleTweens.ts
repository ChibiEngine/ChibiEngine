import bunnyURL from "./assets/bunny.png?url";
import Scene from "../engine/game/Scene";
import Sprite from "../engine/node/Sprite";
import Image from "../engine/resource/Image";
import {MoveBy} from "../engine/tween/Move";
import Easing from "../engine/math/easing/Easing";
import Sequence from "../engine/tween/Sequence";
import Callback from "../engine/tween/Callback";

export default class ExampleTweens extends Scene {
  protected async _create() {
    const sprite = await this.add(new Sprite(new Image(bunnyURL))).setPosition(this.game.screen.center);
    sprite.play(new Sequence(
            new Callback(() => {console.log("Before MoveBy1")}),
            new MoveBy(0, 200).easing(Easing.bounceOut).duration(2000),
            new Callback(() => {console.log("After MoveBy1")}),
            new Callback(() => {console.log("Before MoveBy2")}),
            new MoveBy(0, -200).easing(Easing.bounceOut).duration(2000),
            new Callback(() => {console.log("After MoveBy2")}),
            new Callback(() => {console.log("Finished")})
        ).loop(2)
    );
  }

  protected _update(delta: number): void {
  }
}
