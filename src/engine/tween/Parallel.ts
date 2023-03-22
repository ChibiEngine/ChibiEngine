import Action from "./Action";
import GameObject from "../gameobjects/GameObject";

export class Parallel extends Action {
  private readonly actions: Action<GameObject>[] = [];

  public constructor(...actions: Action<GameObject>[]) {
    super();
    this.actions = actions;
    this.duration(Math.max(...actions.map(action => action._duration)));
  }

  public _run(target: GameObject) {
    this.actions.forEach(action => {
      target.play(action);
    });
  }

  public _update(offset: number) {
  }
}
