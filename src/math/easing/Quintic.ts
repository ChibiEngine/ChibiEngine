import EasingFunction from "./EasingFunction";

export class QuinticIn extends EasingFunction {
  public static readonly INSTANCE = new QuinticIn();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return t * t * t * t * t;
  }
}

export class QuinticOut extends EasingFunction {
  public static readonly INSTANCE = new QuinticOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return --t * t * t * t * t + 1;
  }
}

export class QuinticInOut extends EasingFunction {
  public static readonly INSTANCE = new QuinticInOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    if ((t *= 2) < 1) {
      return 0.5 * t * t * t * t * t;
    } else {
      return 0.5 * ((t -= 2) * t * t * t * t + 2);
    }
  }
}