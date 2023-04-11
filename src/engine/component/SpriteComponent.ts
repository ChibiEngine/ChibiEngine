import {AbstractComponent} from "../../engine/component/Component";
import GameObject from "../../engine/gameobjects/GameObject";

import {Sprite as PixiSprite} from "pixi.js";

export default class SpriteComponent extends PixiSprite implements AbstractComponent<"internal", GameObject>{
  readonly componentName: "internal";

  public apply(target: GameObject): void {

  }

}