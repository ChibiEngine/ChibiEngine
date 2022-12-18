import Action from "./Action";
import GameObject from "../gameobjects/GameObject";

export default class Delay extends Action<GameObject> {
  public constructor(duration: number) {
    super();
    this.duration(duration);
  }

  public _run(target: GameObject): void {
  }

  public _update(offset: number): void {
  }
}