import AbstractGameObject from "../gameobjects/AbstractGameObject";
import GameObject from "../gameobjects/GameObject";
import {Component} from "./Component";
import {ChibiEvent} from "../event/ChibiEvent";
import {VariableUpdatable} from "../gameobjects/Updatable";

export default abstract class TransitionableComponent<Name extends string, T, Target extends AbstractGameObject = GameObject> extends Component<Name, Target> implements VariableUpdatable {
  /**
   * Transitionable Components add themselves to update list only when transition is enabled
   */
  public dontAddToUpdateList = true;
  protected elapsed: number = 0;

  protected transitionMillis: number;

  /**
   * Interpoalte from
   * @protected
   */
  protected from: T;
  protected current: T;
  /**
   * Interpolate to
   * @protected
   */
  protected to: T;

  public readonly onChange = new ChibiEvent<[T]>();

  // Disabled for now, don't know the overhead of this
  // public readonly onExactValueChange: Event<T> = new ChibiEvent();

  public abstract target: Target;

  protected constructor(current: T) {
    super();

    this.from = current;
    this.current = current;
    this.to = current;

    this.assign = this.assign.bind(this);
  }

  public setTransition(millis: number) {
    this.dontAddToUpdateList = millis === 0;
    this.transitionMillis = millis;
    if(!this.target) {
      return;
    }
    if(this.transitionMillis) {
      this.enableTransition();
    } else {
      this.disableTransition();
    }
  }

  /**
   * Set transition rate in Hz
   * @param rate rate in Hz
   */
  public setTransitionRate(rate: number) {
    this.setTransition(1000 / rate);
  }

  public get transitionEnabled() {
    return this.transitionMillis > 0;
  }

  protected enableTransition() {
    if(!this.target.scene) return;
    this.target.scene.addUpdatable(this);
  }

  public disableTransition() {
    if(!this.target.scene) return;
    this.target.scene.removeUpdatable(this);
  }

  public set(value: T) {
    if(!this.transitionEnabled) {
      this.current = value;
      try {
        this.assign(value);
      }catch (_) { }
    } else {
      this.from = this.current;
      this.to = value;
      this.elapsed = 0;
    }
    this.onChange.trigger(value);
  }

  public interpolateDt(dt: number): T {
    this.elapsed += dt;
    const alpha = Math.min(1, this.elapsed / this.transitionMillis);

    if(alpha === 1) {
      return this.to;
    }

    return this.interpolate(this.from, this.to, alpha);
  }

  protected abstract interpolate(from: T, to: T, alpha: number): T;

  protected abstract assign(value: T): void;

  public variableUpdate(dt: number) {
    const val = this.interpolateDt(dt);
    this.assign(val);
    this.current = val;
  }
}
