import Action from "./Action";
import GameObject from "../gameobjects/GameObject";
import {ActionArrayType, UnionToIntersection} from "../utils/type_utils";

export class SequenceImpl<T extends GameObject = GameObject> extends Action<T> {

  private readonly actions: Action<any>[] = [];
  private actionsToRun: Action<any>[];

  private _loopCount: number = 1;
  private _currentLoop: number = 1;

  public constructor(...actions: Action<GameObject>[]) {
    super();
    this.actions = actions;
    this.actionsToRun = actions.slice();
  }

  public add<G extends GameObject>(action: Action<G>): Sequence<T & G> {
    this.actions.push(action);
    return this;
  }

  public _run(target: GameObject) {
    this.actionsToRun = this.actions.slice();
    this.runNextAction();
  }

  public _update(offset: number, target: GameObject) {
    // Nothing to do
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
    const action = this.actionsToRun.shift();
    if (action) {
      action.onFinish.subscribeOnce(() => {
        this.runNextAction();
      });
      this.target.play(action);
    } else if (this.isIndefinitelyLooping() || this._currentLoop < this._loopCount) {
      this._currentLoop++;
      this.actionsToRun = this.actions.slice();
      this.runNextAction();
    } else {
      this.finish();
    }
  }
}

type Sequence<T extends GameObject> = SequenceImpl<T> & Action<T>;

// @ts-ignore
const Sequence: new <T extends GameObject, A extends Array<Action<T>>> (...actions: A) => Sequence<UnionToIntersection<ActionArrayType<A>>> = SequenceImpl as any;
export default Sequence;
