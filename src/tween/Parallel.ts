import Action from "./Action";
import GameObject from "../gameobjects/GameObject";
import {ActionArrayType, UnionToIntersection} from "../utils/type_utils";
import {SequenceImpl} from "./Sequence";

export class ParallelImpl<T extends GameObject> extends Action {
  private readonly actions: Action<any>[] = [];

  public constructor(...actions: Action<any>[]) {
    super();
    this.actions = actions;
    this.duration(Math.max(...actions.map(action => action._duration)));
  }

  public add<G extends GameObject>(action: Action<G>): Parallel<T & G> {
    this.actions.push(action);
    return this;
  }

  public _run(target: GameObject) {
    this.actions.forEach(action => {
      target.play(action);
    });
  }

  public _update(offset: number, target: GameObject) {
  }
}

type Parallel<T extends GameObject> = ParallelImpl<T> & Action<T>;

// @ts-ignore
const Parallel: new <T extends GameObject, A extends Array<Action<T>>> (...actions: A) => Parallel<UnionToIntersection<ActionArrayType<A>>> = SequenceImpl as any;
export default Parallel;
