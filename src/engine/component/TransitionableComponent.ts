import AbstractGameObject from "../gameobjects/AbstractGameObject";
import GameObject from "../gameobjects/GameObject";
import Component from "./Component";
import Event from "../event/Event";
import {VariableUpdatable} from "../gameobjects/Updatable";

export default abstract class TransitionableComponent<Name extends string, T, Target extends AbstractGameObject = GameObject> extends Component<Name, Target> implements VariableUpdatable {
  protected currentDt: number = 0;

  protected lastTime: number;
  protected updateDt: number;

  protected future: T;
  protected last: T;
  protected current: T;

  protected isNew: boolean = false;

  public readonly onChange: Event<this> = new Event();

  public abstract target: Target;

  protected constructor(current: T) {
    super();
    this.current = current;
    this.last = { ...current };

    this.lastTime = performance.now();
    this.onChange(() => {
      if(!this.isNew) {
        return;
      }
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
  }

  public disableTransition() {
    this.target.scene.removeUpdatable(this);
  }

  public set(value: T) {
    this.last = { ...this.current }
    this.current = value;
    this.onChange.trigger(this);
  }

  public interpolateDt(dt: number): T {
    this.currentDt += dt;
    const alpha = Math.min(1, this.currentDt / this.updateDt);
    this.isNew = true;
    if(alpha === 1) {
      return this.current;
    }
    return this.interpolate(alpha);
  }

  protected abstract interpolate(alpha: number): T;

  protected abstract assign(value: T): void;

  public variableUpdate(dt: number) {
    this.assign(this.interpolateDt(dt));
  }
}
