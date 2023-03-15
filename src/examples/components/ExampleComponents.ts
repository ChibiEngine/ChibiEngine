//@ts-ignore
import bunnyURL from "../assets/bunny.png?url";
import Scene from "../../engine/game/Scene";
import Enemy from "./Enemy";

/*
  * This example shows how to use components.
  * Components are a way to add functionality to GameObjects that can be reused in other GameObjects.
  * TODO : This example is intended to evolve, particularly to incorporate Mixin principles to simplify the use of components.
 */
export default class ExampleComponents extends Scene {
  protected async _create() {
    console.log("==== ExampleComponents ====");

    const enemy = this.add(new Enemy(100, 100));
    console.log(enemy.health, "PV");
    enemy.damage(3);
    console.log(enemy.damageable.health, "PV");
    enemy.damageable.health = 20;
    enemy.damageable.damage(5);
    console.log(enemy.damageable.health, "PV");
    console.log(enemy.health, "PV");
    // TODO : sucre syntaxique pour virer ce .damageable -> Mixin
  }

  protected _update(delta: number): void {
  }
}
