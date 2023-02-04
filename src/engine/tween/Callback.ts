import Action from "./Action";
import GameObject from "../gameobjects/GameObject";

export default class Callback extends Action<GameObject> {
  readonly targetType = GameObject;

  public constructor(private readonly callback: () => void) {
    super();
  }

  public _run(target: GameObject): void {
    this.callback();
    this.finish();
  }

  public _update(offset: number): void {
  }
}