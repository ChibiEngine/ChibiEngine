import {AbstractComponent} from "../../engine/component/Component";
import {DisplayObject} from "pixi.js";
import AbstractGameObject from "../gameobjects/AbstractGameObject";


export default abstract class DisplayObjectComponent extends DisplayObject implements AbstractComponent<"internal", AbstractGameObject>{
  readonly componentName: "internal";

  public apply(target: AbstractGameObject): void {

  }

}