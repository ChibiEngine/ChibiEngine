import Action from "./Action";
import GameObject from "../gameobjects/GameObject";
import {assertTypesMatch} from "../utils/Typed";

export default class Sequence extends Action<GameObject> {
  targetType = GameObject;

  private readonly actions: Action<GameObject>[] = [];
  private runningActions: Action<GameObject>[];

  private _loopCount: number = 1;
  private _currentLoop: number = 1;

  public constructor(...actions: Action<GameObject>[]) {
    super();
    this.actions = actions;
    this.runningActions = actions.slice();
  }

  public _run(target: GameObject) {
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