import Behavior from "../behavior/Behavior";
import AbstractNode from "../node/AbstractNode";
import EasingFunction from "../math/easing/EasingFunction";
import Easing from "../math/easing/Easing";
import Event from "../event/Event";

export default abstract class Action<T extends AbstractNode> extends Behavior<T> {
  protected target: T;

  protected _elapsed = 0;
  public _duration = 1000;
  protected loopCount = 0;
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

  /**
   -1 = forever
   **/
  public loop(count: number = -1) {
    this.loopCount = count;
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
    this.target.removeBehavior(this);
    this.onFinish.trigger(null);
  }

  public abstract _run(target: T): void;
  public abstract _update(offset: number): void;
}
