//@ts-ignore
import bunnyURL from "../assets/bunny.png?url";
import Image from "../../engine/resource/Image";
import Sprite from "../../engine/gameobjects/Sprite";
import Scene from "../../engine/game/Scene";
import {FixedUpdatable} from "../../engine/gameobjects/Updatable";
import Keyboard from "../../engine/keyboard/Keyboard";

export default class ExampleKeyboard extends Scene implements FixedUpdatable {
  updateRate = 10;
  private bunny: Sprite;

  public async _create() {
    console.log("==== ExampleKeyboard ====");

    this.bunny = this.add(new Sprite(new Image(bunnyURL)));
  }

  update(): void {
    if (Keyboard.isKeyDown("ArrowUp")) {
      this.bunny.position.y -= 50;
    }
    if (Keyboard.isKeyDown("ArrowDown")) {
      this.bunny.position.y += 50;
    }
    if (Keyboard.isKeyDown("ArrowLeft")) {
      this.bunny.position.x -= 50;
    }
    if (Keyboard.isKeyDown("ArrowRight")) {
      this.bunny.position.x += 50;
    }
  }

}
