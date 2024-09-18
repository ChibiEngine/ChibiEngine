import GameObject from "../gameobjects/GameObject";
import Component from "./Component";
import {Class} from "../utils/Types";
import {FixedUpdatable} from "../gameobjects/Updatable";

export default abstract class Behavior<Name extends string, T extends GameObject = GameObject> extends Component<Name, T> implements FixedUpdatable {
  public abstract readonly targetType: Class<T>;

  abstract update(): void;
}