//@ts-ignore
import BUNNY_URL from "../assets/bunny.png?url";
import Scene from "../../engine/game/Scene";
import Sprite from "../../engine/gameobjects/Sprite";
import Image from "../../engine/resource/Image";
import {FixedUpdatable} from "../../engine/gameobjects/Updatable";

export default class ExampleTransition extends Scene implements FixedUpdatable {
  updateRate = 1;

  private bunny: Sprite;

  private directionX = 1;
  private directionY = 1;

  protected async _create() {
    console.log("==== ExampleTransition ====");

    const image = new Image(BUNNY_URL);

    this.bunny = this.add(new Sprite(image, 0, 0));
    this.bunny.position.setTransition(1000);
  }

  public update(): void {
    this.bunny.x += 100 * this.directionX;
    this.bunny.y += 100 * this.directionY;

    if(this.bunny.x >= this.game.screen.width || this.bunny.x <= 0) {
      this.directionX *= -1;
    }

    if(this.bunny.y >= this.game.screen.height || this.bunny.y <= 0) {
      this.directionY *= -1;
    }
  }
}
