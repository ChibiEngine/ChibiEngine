import bunnyURL from "./assets/bunny.png?url";
import Scene from "../engine/game/Scene";
import Sprite from "../engine/node/Sprite";
import Image from "../engine/resource/Image";
import Move from "../engine/tween/Move";
import {BounceOut} from "../engine/math/easing/Bounce";

export default class ExampleTweens extends Scene {
  protected async _create() {
    const sprite = await this.add(new Sprite(new Image(bunnyURL))).setPosition(this.game.screen.center);
    sprite.play(Move.by(0, 200).easing(new BounceOut()).duration(2000));
  }

  protected _update(delta: number): void {
  }
}
