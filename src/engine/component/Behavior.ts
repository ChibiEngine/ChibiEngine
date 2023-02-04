import GameObject from "../gameobjects/GameObject";
import Component from "./Component";
import {Class} from "../utils/Typed";
import Updatable from "../gameobjects/Updatable";

export default abstract class Behavior<T extends GameObject> extends Component<T> implements Updatable {
  public abstract readonly targetType: Class<T>;

  abstract update(dt: number): void;
}