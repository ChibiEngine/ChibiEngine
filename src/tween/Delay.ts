import Action from "./Action";
import GameObject from "../gameobjects/GameObject";

export default class Delay extends Action {
  public constructor(duration: number) {
    super();
    this.duration(duration);
  }

  public _run(target: GameObject): void {
    // Nothing to do
  }

  public _update(offset: number, target: GameObject): void {
    // Nothing to do
  }
}