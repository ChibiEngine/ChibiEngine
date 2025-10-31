import Action from "./Action";
import GameObject from "../gameobjects/GameObject";
import {ActionArrayType, UnionToIntersection} from "../utils/Types";

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

  public async _run(target: GameObject) {
    let index: number = 0;
    while(this._currentLoop <= this._loopCount || this.isIndefinitelyLooping()) {
      const action = this.actions[index++];
      if(action) {
        this.target.play(action);
        await action.onFinish.nextValuePromise();
      } else {
        index = 0;
        this._currentLoop++;
      }
    }
    this.finish();
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
}

type Sequence<T extends GameObject> = SequenceImpl<T> & Action<T>;

// @ts-ignore
const Sequence: new <T extends GameObject, A extends Array<Action<T>>> (...actions: A) => Sequence<UnionToIntersection<ActionArrayType<A>>> = SequenceImpl as any;
export default Sequence;
