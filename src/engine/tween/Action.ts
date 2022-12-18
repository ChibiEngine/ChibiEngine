import Behavior from "../behavior/Behavior";
import GameObject from "../gameobjects/GameObject";
import EasingFunction from "../math/easing/EasingFunction";
import Easing from "../math/easing/Easing";
import Event from "../event/Event";

export default abstract class Action extends Behavior {
  protected target: GameObject;

  protected _elapsed = 0;
  public _duration = 1000;
  protected _easing: EasingFunction = Easing.linear;

  public onFinish: Event<null> = new Event();

  public duration(duration: number) {
    this._duration = duration;
    return this;
  }

  public easing(easing: EasingFunction) {
    this._easing = easing;
    return this;
  }

  public stop() {

  }

  public pause() {

  }

  public run(target: T) {
    this.target = target;
    this._run(target);
  }

  public update(dt: number) {
    this._elapsed += dt;
    const offset = this._easing.apply(Math.min(this._elapsed / this._duration, 1));
    this._update(offset);
    if(this._elapsed >= this._duration) {
      this.finish();
    }
  }

  protected finish() {
    this._elapsed = 0;
    this.target.removeBehavior(this);
    this.onFinish.trigger(null);
  }

  public abstract _run(target: T): void;
  public abstract _update(offset: number): void;
}
