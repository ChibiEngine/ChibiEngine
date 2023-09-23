import EasingFunction from "./EasingFunction";

export class CubicIn extends EasingFunction {
  public static readonly INSTANCE = new CubicIn();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return t * t * t;
  }
}

export class CubicOut extends EasingFunction {
  public static readonly INSTANCE = new CubicOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    return --t * t * t + 1;
  }
}

export class CubicInOut extends EasingFunction {
  public static readonly INSTANCE = new CubicInOut();

  public apply(t: number): number {
    if(t === 0 || t === 1) {
      return t;
    }
    if ((t *= 2) < 1) {
      return 0.5 * t * t * t;
    } else {
      return 0.5 * ((t -= 2) * t * t + 2);
    }
  }
}