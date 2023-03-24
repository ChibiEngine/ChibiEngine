//@ts-ignore
import BUNNY_URL from "../assets/bunny.png?url";
import Scene from "../../engine/game/Scene";
import Sprite from "../../engine/gameobjects/Sprite";
import Image from "../../engine/resource/Image";
import {VariableUpdatable} from "../../engine/gameobjects/Updatable";

export default class ExampleReactivePositioning extends Scene implements VariableUpdatable {
  private bunny1: Sprite;
  private bunny2: Sprite;

  private direction: "left" | "right" = "right";

  protected async _create() {
    console.log("==== ExampleUpdateLoop ====");

    const image = new Image(BUNNY_URL);

    this.bunny1 = this.add(new Sprite(image)).setPosition(this.game.screen.center)
    this.bunny2 = this.add(new Sprite(image));
    this.bunny1.position.onChange(pos => {
      this.bunny2.position.set(pos.x, pos.y + Math.sin(pos.x/100)*60);
    });
  }

  public render(delta: number): void {
    if (this.direction === "right") {
      this.bunny1.x += 0.2 * delta;
    } else {
      this.bunny1.x -= 0.2 * delta;
    }

    if (this.bunny1.x >= this.game.screen.width) {
      this.direction = "left";
    } else if (this.bunny1.x <= 0) {
      this.direction = "right";
    }
  }
}
