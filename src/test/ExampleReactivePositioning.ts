import BUNNY_URL from "./assets/bunny.png?url";
import Scene from "../engine/game/Scene";
import Sprite from "../engine/gameobjects/Sprite";
import Image from "../engine/resource/Image";

export default class ExampleReactivePositioning extends Scene {
  private bunny1: Sprite;
  private bunny2: Sprite;

  private direction: "left" | "right" = "right";

  public async _create() {
    const image = new Image(BUNNY_URL);

    this.bunny1 = this.add(new Sprite(image)).setPosition(this.game.screen.center)
    this.bunny2 = this.add(new Sprite(image)).setPosition(this.bunny1.position.then(pos => pos.addY(Math.sin(pos.x/100)*60)));
  }

  protected _update(delta: number): void {
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
