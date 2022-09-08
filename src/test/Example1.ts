import bunnyURL from "./assets/bunny.png?url";
import Image from "../engine/resource/Image";
import Sprite from "../engine/node/Sprite";
import Node from "../engine/node/Node";
import Text from "../engine/resource/Text";
import Scene from "../engine/game/Scene";
import Cache from "../engine/loader/Cache";

export default class Example1 extends Scene {
  private container: Node;
  private text: Text;

  public async _create() {
    this.onProgress.subscribe((me) => { console.log(me.bytesLoaded,"/",me.bytesTotal); });
    this.text = await this.load(new Text("/assets/paragraph.txt")).loaded;
    console.log("text:", this.text.content);
    // Create a container at the center
    this.container = this.add(new Node(this.game.screen.center));

    // Create a 5x5 grid of bunnies
    for (let i = 0; i < 25; i++) {
      this.container.add(new Sprite(
        new Image(bunnyURL),
        (i % 5) * 40,
        Math.floor(i / 5) * 40
      ));
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    await this.container.loaded;

    this.container.internal.pivot.x = this.container.internal.width / 2;
    this.container.internal.pivot.y = this.container.internal.height / 2;

    // Center bunny sprite in local container coordinates
    // TODO
    // this.container.pivot(this.container.size.half);
    console.log("blobs", this.blobs);
    console.log("dependants", this.dependants);
    console.log("dependencies", this.dependencies);
    console.log("cache", Cache.resources);
    // console.log(this.game.loader.resources);

    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("3 seconds later");
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
