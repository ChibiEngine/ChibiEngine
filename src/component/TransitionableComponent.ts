import AbstractGameObject from "../gameobjects/AbstractGameObject";
import GameObject from "../gameobjects/GameObject";
import Component from "./Component";
import Event from "../event/Event";
import {VariableUpdatable} from "../gameobjects/Updatable";

export default abstract class TransitionableComponent<Name extends string, T, Target extends AbstractGameObject = GameObject> extends Component<Name, Target> implements VariableUpdatable {
  public dontAddToUpdateList = true;
  protected currentDt: number = 0;

  protected lastTime: number;
  protected updateDt: number;

  /**
   * Interpolation source
   * @protected
   */
  protected previous: T;
  /**
   * Interpolation target
   * @protected
   */
  protected next: T;
  protected value: T;

  public transitionEnabled: boolean = false;

  public exactValue: T;

  public readonly onChange: Event<this> = new Event();

  // Disabled for now, don't know the overhead of this
  // public readonly onExactValueChange: Event<T> = new Event();

  public abstract target: Target;

  protected constructor(current: T) {
    super();

    this.value = current;
    this.previous = { ...current };
    this.next = { ...current };

    this.lastTime = performance.now();

    this.onChange(() => {
      this.currentDt = 0;
      this.lastTime = performance.now();
    });
  }

  public setTransition(millis: number) {
    /* TODO: automatically deduce interval from parent update rate?
       It supposes that the parent updates the component position in its update method
     */
    this.updateDt = millis;
    if(!this.target) {
      return;
    }
    if(this.updateDt) {
      this.enableTransition();
    } else {
      this.disableTransition();
    }
  }

  protected enableTransition() {
    this.target.scene.addUpdatable(this);
    this.transitionEnabled = true;
  }

  public disableTransition() {
    this.target.scene.removeUpdatable(this);
    this.transitionEnabled = false;
  }

  public set(value: T) {
    this.value = value;
    this.onChange.trigger(this);
    if(!this.transitionEnabled) {
      // TODO : assign here ?
      this.exactValue = value;
    }
  }

  public interpolateDt(dt: number): T {
    if(this.currentDt === 0) {
      this.previous = { ...this.next };
      this.next = { ...this.value };
    }
    this.currentDt += dt;
    const alpha = Math.min(1, this.currentDt / this.updateDt);
    if(alpha === 1) {
      return this.next;
    }
    return this.interpolate(alpha);
  }

  protected abstract interpolate(alpha: number): T;

  protected abstract assign(value: T): void;

  public variableUpdate(dt: number) {
    const val = this.interpolateDt(dt);
    this.assign(val);
    this.exactValue = val;
    // this.onExactValueChange.trigger(val);
  }
}
