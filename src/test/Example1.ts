import bunnyURL from "./assets/bunny.png?url";
import Image from "../engine/resource/Image";
import Sprite from "../engine/node/Sprite";
import Node from "../engine/node/Node";
import Text from "../engine/resource/Text";
import Scene from "../engine/game/Scene";

export default class Example1 extends Scene {
  private container: Node;
  private text: Text;

  public async create() {
    this.text = await this.load(new Text("/assets/paragraph.txt")).loaded;
    console.log("text:", this.text.content);
    // Create a container at the center
    this.container = this.add(new Node(this.game.screen.center));

    // Create a 5x5 grid of bunnies
    for (let i = 0; i < 25; i++) {
      const bunny = new Sprite(
        new Image(bunnyURL),
        (i % 5) * 40,
        Math.floor(i / 5) * 40
      );
      this.container.add(bunny);
    }

    await this.container.loaded;

    this.container.internal.pivot.x = this.container.internal.width / 2;
    this.container.internal.pivot.y = this.container.internal.height / 2;

    // Center bunny sprite in local container coordinates
    // TODO
    // this.container.pivot(this.container.size.half);
    console.log(this.loadableChildren);
    console.log(this.game.loader.resources);
  }

  /**
   * Parent:
   * Promise.all(children => child.ready);
   */

  public update(dt: number) {
    // rotate the container!
    // use delta to create frame-independent transform
    // TODO
    // this.container.rotation -= 0.01 * dt;
  }
}
