//@ts-ignore
import BUNNY_URL from "../assets/bunny.png?url";
import Scene from "../../engine/game/Scene";
import Sprite from "../../engine/gameobjects/Sprite";
import Image from "../../engine/resource/Image";
import {FixedUpdatable} from "../../engine/gameobjects/Updatable";

export default class ExampleUpdateLoop extends Scene implements FixedUpdatable {
  updateRate = 1;
  private bunny: Sprite;

  private direction: "left" | "right" = "right";

  protected async _create() {
    console.log("==== ExampleUpdateLoop ====");

    const image = new Image(BUNNY_URL);

    this.bunny = this.add(new Sprite(image)).setPosition(this.game.screen.center)
  }

  public update(): void {
    if (this.direction === "right") {
      this.bunny.x += 100;
    } else {
      this.bunny.x -= 100;
    }

    if (this.bunny.x >= this.game.screen.width) {
      this.direction = "left";
    } else if (this.bunny.x <= 0) {
      this.direction = "right";
    }
  }
}
