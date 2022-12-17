import Action from "./Action";
import AbstractNode from "../node/AbstractNode";

export class Parallel extends Action<AbstractNode> {
  private readonly actions: Action<AbstractNode>[] = [];

  public constructor(...actions: Action<AbstractNode>[]) {
    super();
    this.actions = actions;
    this.duration(Math.max(...actions.map(action => action._duration)));
  }

  public _run(target: AbstractNode) {
    this.actions.forEach(action => {
      target.play(action);
    });
  }

  public _update(offset: number) {
  }
}
