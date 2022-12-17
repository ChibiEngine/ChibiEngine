import Action from "./Action";
import AbstractNode from "../node/AbstractNode";

export default class Sequence extends Action<AbstractNode> {
  private readonly actions: Action<AbstractNode>[] = [];
  private runningActions: Action<AbstractNode>[];

  public constructor(...actions: Action<AbstractNode>[]) {
    super();
    this.actions = actions;
    this.runningActions = actions.slice();
  }

  public _run(target: AbstractNode) {
    this.runNextAction();
  }

  public _update(offset: number) {
  }

  public runNextAction() {
    const action = this.runningActions.shift();
    if (!action) {
      this.finish();
      return;
    }
    action.onFinish.subscribe(() => {
      this.runNextAction();
    });
    this.target.play(action);
  }
}