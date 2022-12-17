import Action from "./Action";
import AbstractNode from "../node/AbstractNode";

export default class Sequence extends Action<AbstractNode> {
  private readonly actions: Action<AbstractNode>[] = [];
  private runningActions: Action<AbstractNode>[];

  private _loopCount: number = 1;
  private _currentLoop: number = 1;

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

  /**
   -1 = forever
   **/
  public loop(count: number = -1) {
    this._loopCount = count;
    return this;
  }

  public loopIndefinitely() {
    this.loop(-1);
    return this;
  }

  public isIndefinitelyLooping(): boolean {
    return this._loopCount === -1;
  }


  public runNextAction() {
    const action = this.runningActions.shift();
    if (action) {
      action.onFinish.subscribeOnce(() => {
        this.runNextAction();
      });
      this.target.play(action);
    } else {
      if(this.isIndefinitelyLooping() || this._currentLoop < this._loopCount) {
        this._currentLoop++;
        this.runningActions = this.actions.slice();
        this.runNextAction();
      }else {
        this.finish();
      }
    }
  }
}