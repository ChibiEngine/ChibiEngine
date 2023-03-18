import GameObject from "../gameobjects/GameObject";
import Component from "./Component";
import {Class} from "../utils/Typed";
import UpdateLoopListener from "../gameobjects/UpdateLoopListener";

export default abstract class Behavior<T extends GameObject> extends Component<T> implements UpdateLoopListener {
  public abstract readonly targetType: Class<T>;

  public abstract updateRate: number;

  abstract update(): void;
}