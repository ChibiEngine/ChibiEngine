import BUNNIES_ATLAS_URL from "./assets/bunnies.png?url";
import Scene from "../engine/game/Scene";
import Sprite from "../engine/node/Sprite";
import Image from "../engine/resource/Image";
import Cache from "../engine/loader/Cache";

export default class ExampleAtlas extends Scene {
  public async _create() {
    const image = new Image(BUNNIES_ATLAS_URL);

    this.add(new Sprite(image.part(0, 0, 26, 37)))
        .setPosition(this.game.screen.center.addX(-13))

    this.add(new Sprite(image.part(26, 0, 26, 37)))
        .setPosition(this.game.screen.center.addX(13));

    console.log(Cache.resources)
  }
}
