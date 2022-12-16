import Behavior from "../behavior/Behavior";
import AbstractNode from "../node/AbstractNode";
import EasingFunction, {Easing} from "../math/easing/EasingFunction";

export default abstract class Action<T extends AbstractNode> extends Behavior<T> {
  protected target: T;

  protected _elapsed = 0;
  protected _duration = 1000;
  protected loopCount = 0;
  protected _easing: EasingFunction = new Easing.Linear();

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
      this.target.removeBehavior(this);
    }
  }

  public abstract _run(target: T): void;
  public abstract _update(offset: number): void;
}
