import EasingFunction from "./EasingFunction";

export class QuadraticIn implements EasingFunction {
  public static readonly INSTANCE = new QuadraticIn();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return t * t;
  }
}

export class QuadraticOut implements EasingFunction {
  public static readonly INSTANCE = new QuadraticOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return t * (2 - t);
  }
}

export class QuadraticInOut implements EasingFunction {
  public static readonly INSTANCE = new QuadraticInOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    if ((t *= 2) < 1) {
      return 0.5 * t * t;
    } else {
      return -0.5 * (--t * (t - 2) - 1);
    }
  }
}