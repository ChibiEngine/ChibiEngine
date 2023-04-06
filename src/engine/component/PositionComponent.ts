import Component from "./Component";
import AbstractGameObject from "../gameobjects/AbstractGameObject";

export default class PositionComponent extends Component<"position2", AbstractGameObject> {
  readonly name: "position2";

  // public x: number;
  // public y: number;
  //
  // constructor(x: number = 0, y: number = 0) {
  //   super();
  //   this.x = x;
  //   this.y = y;
  // }
  //
  // public set(x: number, y: number) {
  //   this.x = x;
  //   this.y = y;
  // }
  //
  // public get() {
  //   return { x: this.x, y: this.y };
  // }
}