//@ts-ignore
import bunnyURL from "../assets/bunny.png?url";
import Scene from "../../engine/game/Scene";
import Enemy from "./Enemy";
import Sprite from "../../engine/gameobjects/Sprite";
import Damageable from "./Damageable";
import Image from "../../engine/resource/Image";

/*
  * This example shows how to use components.
  * Components are a way to add functionality to GameObjects that can be reused in other GameObjects.
  * TODO : This example is intended to evolve, particularly to incorporate Mixin principles to simplify the use of components.
 */
export default class ExampleComponents extends Scene {
  protected async _create() {
    console.log("==== ExampleComponents ====");

    const enemy = this.add(new Enemy(100, 100));
    enemy.health = 10;
    console.log(enemy.health, "PV");
    enemy.damage(3);
    console.log(enemy.damageable.health, "PV");
    enemy.damageable.health = 20;
    enemy.damageable.damage(5);
    console.log(enemy.damageable.health, "PV");
    console.log(enemy.health, "PV");

    const enemy2 = this.add(new Sprite(new Image(bunnyURL), 0,0)).addComponent(new Damageable());
    enemy2.damageable.health = 20;
    // TODO : sucre syntaxique pour virer ce .damageable -> Mixin
  }
}
