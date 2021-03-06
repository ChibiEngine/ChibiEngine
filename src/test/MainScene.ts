import bunnyURL from "./assets/bunny.png?url";
import Image from "../engine/resource/Image";
import Sprite from "../engine/node/Sprite";
import Node from "../engine/node/Node";
import Text from "../engine/resource/Text";
import Scene from "../engine/game/Scene";

export default class MainScene extends Scene {
  private container: Node;
  private text: Text;
  public async create() {
    this.text = await this.load(new Text("/assets/paragraph.txt"));
    this.text.onProgress.subscribe(info => console.log);
    // Create a container at the center
    this.container = this.add(new Node(this.center));

    // Create a 5x5 grid of bunnies
    for (let i = 0; i < 25; i++) {
      const bunny = new Sprite(
        new Image(bunnyURL),
        (i % 5) * 40,
        Math.floor(i / 5) * 40
      );
      this.container.add(bunny);
    }

    // Center bunny sprite in local container coordinates
    this.container.pivot(this.container.size.half);
  }

  /**
   * Parent:
   * Promise.all(children => child.ready);
   */

  public update(dt: number) {
    // rotate the container!
    // use delta to create frame-independent transform
    this.container.rotation -= 0.01 * dt;
  }
}
