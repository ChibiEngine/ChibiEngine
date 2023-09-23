import EasingFunction from "./EasingFunction";

export class QuarticIn extends EasingFunction {
  public static readonly INSTANCE = new QuarticIn();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return t * t * t * t;
  }
}

export class QuarticOut extends EasingFunction {
  public static readonly INSTANCE = new QuarticOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return 1 - (--t * t * t * t);
  }
}

export class QuarticInOut extends EasingFunction {
  public static readonly INSTANCE = new QuarticInOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    if ((t *= 2) < 1) {
      return 0.5 * t * t * t * t;
    } else {
      return -0.5 * ((t -= 2) * t * t * t - 2);
    }
  }
}