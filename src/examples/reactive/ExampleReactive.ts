//@ts-ignore
import BUNNY_URL from "../assets/bunny.png?url";
import Scene from "../../engine/game/Scene";
import Sprite from "../../engine/gameobjects/Sprite";
import Image from "../../engine/resource/Image";

import signalify from "../../../../signal/src/Signal";
import Position from "../../engine/geom/position/Position";

export default class ExampleReactive extends Scene {
  private bunny1: Sprite;
  private bunny2: Sprite;

  private direction: "left" | "right" = "right";

  protected async _create() {
    console.log("==== ExampleUpdateLoop ====");

    const image = new Image(BUNNY_URL);

    this.bunny1 = this.add(new Sprite(image)).setPosition(this.game.screen.center)
    this.bunny2 = this.add(new Sprite(image));
    let time = performance.now();
    signalify(this.bunny1);
    console.log("signalify took", performance.now() - time, "ms");
    // observe(() => {
    //   const { x, y } = this.bunny1.position;
    //   this.bunny2.position.set(x, y + Math.sin(x/100)*60);
    // });
    time = performance.now();
    for(let i = 0; i < 60*1000; i++) {
      this.bunny1.position.set(i, i);
    }
    console.log("set took", (performance.now() - time)/(1000/60)*100, "% of a frame");

    const pos1 = new Position(0, 0);

    time = performance.now();
    for(let i = 0; i < 60*1000; i++) {
      pos1.set(i, i);
    }
    console.log("set took", (performance.now() - time)/(1000/60)*100, "% of a frame");

    const pos2 = signalify(new Position(0, 0));

    time = performance.now();
    for(let i = 0; i < 60*1000; i++) {
      pos2.set(i, i);
    }
    console.log("set took", (performance.now() - time)/(1000/60)*100, "% of a frame");
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
