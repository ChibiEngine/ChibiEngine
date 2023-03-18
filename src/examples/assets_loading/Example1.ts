//@ts-ignore
import bunnyURL from "../assets/bunny.png?url";
import Image from "../../engine/resource/Image";
import Sprite from "../../engine/gameobjects/Sprite";
import Container from "../../engine/gameobjects/Container";
import Text from "../../engine/resource/Text";
import Scene from "../../engine/game/Scene";
import Cache from "../../engine/loader/Cache";
import RenderLoopListener from "../../engine/gameobjects/RenderLoopListener";

export default class Example1 extends Scene implements RenderLoopListener {
  private container: Container;
  private text: Text;

  public async _create() {
    console.log("==== Example1 ====");

    this.onProgress.subscribe((me) => { console.log(me.bytesLoaded,"/",me.bytesTotal); });
    this.text = await this.load(new Text("/assets/paragraph.txt"));
    console.log("text:", this.text.content);
    // Create a container at the center
    this.container = this.add(new Container(this.game.screen.center));

    console.log("scene", this.container.scene);

    // Create a 5x5 grid of bunnies
    for (let i = 0; i < 25; i++) {
      this.container.add(new Sprite(
        new Image(bunnyURL),
        (i % 5) * 40,
        Math.floor(i / 5) * 40
      ));
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await this.container;

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

  public render(dt: number) {
    console.log("fps",1000/dt);
    this.container.internal.rotation -= 0.0007 * dt;
  }
}
